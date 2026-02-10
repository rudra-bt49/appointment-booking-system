import prisma from "../config/prisma";
import { CreateAppointmentRequest } from "../types/appointment.types";
import { AppointmentStatus, PaymentStatus, Prisma } from "@prisma/client";
import {
  PatientAppointmentResponse,
  DoctorAppointmentResponse,
} from "../types/appointment.types";

import { sendMail } from "../utils/smtp/sendMail";
import {
  approvedAppointmentTemplate,
  rejectedAppointmentTemplate,
  requestedAppointmentTemplate,
} from "../utils/smtp/emailTemplates";

/*getting today's date*/
const todayUTC = new Date();
todayUTC.setUTCHours(0, 0, 0, 0);

/**
 * ✅ FORMATTERS
 * Force UTC so time is displayed EXACTLY as stored in DB
 * (no IST / local timezone conversion)
 */
const formatDate = (date: Date) =>
  date.toLocaleDateString("en-IN", { timeZone: "UTC" });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-IN", {
    timeZone: "UTC",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

export const appointmentService = {
  async createAppointment(userId: number, payload: CreateAppointmentRequest) {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    if (!patient) {
      throw new Error("Patient profile not found");
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: payload.doctorId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // ✅ CRITICAL FIX: Lock the time slot row first
        // This prevents concurrent requests from proceeding
        const timeSlot = await tx.$queryRaw<Array<{
          id: number;
          availabilityId: number;
          startTime: Date;
          endTime: Date;
          isAvailable: boolean;
        }>>`
        SELECT * FROM "TimeSlot"
        WHERE id = ${payload.timeSlotId}
        FOR UPDATE
      `;

        if (!timeSlot || timeSlot.length === 0) {
          throw new Error("Time slot not found");
        }

        const lockedSlot = timeSlot[0];

        // Now check availability AFTER acquiring the lock
        if (!lockedSlot.isAvailable) {
          throw new Error("This time slot is no longer available");
        }

        // Create the appointment
        const appointment = await tx.appointment.create({
          data: {
            doctorId: payload.doctorId,
            patientId: patient.id,
            timeSlotId: payload.timeSlotId,
            notes: payload.notes,
            reportUrl: payload.reportUrl ?? null,
            status: AppointmentStatus.REQUESTED,
          },
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    fullName: true,
                    email: true,
                  },
                },
              },
            },
            timeSlot: true,
          },
        });

        // Mark slot as unavailable
        await tx.timeSlot.update({
          where: { id: payload.timeSlotId },
          data: { isAvailable: false },
        });

        return appointment;
      });

      // ✅ EMAIL → DOCTOR (REQUESTED)
      await sendMail({
        to: doctor.user.email,
        subject: "New Appointment Request",
        html: requestedAppointmentTemplate({
          doctorName: doctor.user.fullName,
          patientName: patient.user.fullName,
          date: formatDate(result.timeSlot.startTime),
          startTime: formatTime(result.timeSlot.startTime),
          endTime: formatTime(result.timeSlot.endTime),
        }),
      });

      return result;
    } catch (error: any) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new Error("Already requested appointment");
      }
      throw error;
    }
  },
  async getAppointmentsByPatientUserId(
    userId: number
  ): Promise<PatientAppointmentResponse[]> {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patientProfile) {
      throw new Error("Patient profile not found");
    }

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: {
          include: {
            user: { select: { fullName: true } },
          },
        },
        timeSlot: {
          include: { availability: true },
        },
      },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      notes: appointment.notes,
      reportUrl: appointment.reportUrl,
      status: appointment.status,
      doctor: {
        fullName: appointment.doctor.user.fullName,
        specialization: appointment.doctor.specialization,
        fees: appointment.doctor.fees,
      },
      schedule: {
        date: appointment.timeSlot.availability.date,
        startTime: appointment.timeSlot.startTime,
        endTime: appointment.timeSlot.endTime,
      },
    }));
  },

  async getAppointmentsByDoctorUserId(
    userId: number
  ): Promise<DoctorAppointmentResponse[]> {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctorProfile.id },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          include: {
            user: {
              select: {
                fullName: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        timeSlot: {
          include: {
            availability: {
              select: { date: true },
            },
          },
        },
      },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      status: appointment.status,
      notes: appointment.notes,
      reportUrl: appointment.reportUrl,
      patient: {
        fullName: appointment.patient.user.fullName,
        phone: appointment.patient.user.phone,
      },
      schedule: {
        date: appointment.timeSlot.availability.date,
        startTime: appointment.timeSlot.startTime,
        endTime: appointment.timeSlot.endTime,
      },
    }));
  },

  async updateAppointmentStatus(
    doctorUserId: number,
    appointmentId: number,
    status: AppointmentStatus
  ) {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId: doctorUserId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        timeSlot: true,
        patient: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!appointment) {
      throw new Error("Appointment not found");
    }

    if (appointment.doctorId !== doctorProfile.id) {
      throw new Error("Unauthorized to update this appointment");
    }

    if (appointment.status !== AppointmentStatus.REQUESTED) {
      throw new Error("Appointment already processed");
    }

    return await prisma.$transaction(async (tx) => {
      const updatedAppointment = await tx.appointment.update({
        where: { id: appointmentId },
        data: { status },
      });

      if (status === AppointmentStatus.REJECTED) {
        await tx.timeSlot.update({
          where: { id: appointment.timeSlotId },
          data: { isAvailable: true },
        });

        // ✅ EMAIL → PATIENT (REJECTED)
        await sendMail({
          to: appointment.patient.user.email,
          subject: "Appointment Rejected",
          html: rejectedAppointmentTemplate({
            doctorName: appointment.doctor.user.fullName,
            patientName: appointment.patient.user.fullName,
            date: formatDate(appointment.timeSlot.startTime),
          }),
        });
      }

      if (status === AppointmentStatus.APPROVED) {
        const doctor = await tx.doctorProfile.findUnique({
          where: { id: appointment.doctorId },
        });

        if (!doctor) {
          throw new Error("Doctor profile not found for payment");
        }

        const paymentExpiry = new Date(Date.now() + 30 * 60 * 1000);

        await tx.payment.create({
          data: {
            appointmentId: appointment.id,
            amount: doctor.fees,
            currency: "INR",
            status: PaymentStatus.PENDING,
            paymentExpiry,
          },
        });

        // ✅ EMAIL → PATIENT (APPROVED)
        await sendMail({
          to: appointment.patient.user.email,
          subject: "Appointment Approved",
          html: approvedAppointmentTemplate({
            doctorName: appointment.doctor.user.fullName,
            patientName: appointment.patient.user.fullName,
            date: formatDate(appointment.timeSlot.startTime),
            startTime: formatTime(appointment.timeSlot.startTime),
            endTime: formatTime(appointment.timeSlot.endTime),
            amount: doctor.fees,
          }),
        });
      }

      return updatedAppointment;
    });
  },
  async getPatientAppointmentHistory(
    userId: number
  ): Promise<PatientAppointmentResponse[]> {
    const patientProfile = await prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patientProfile) {
      throw new Error("Patient profile not found");
    }

    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientProfile.id,
        OR: [
          {
            status: {
              in: [
                AppointmentStatus.CANCELLED,
                AppointmentStatus.REJECTED,
                AppointmentStatus.COMPLETED
              ],
            },
          },
          {
            timeSlot: {
              availability: {
                date: {
                  lt: todayUTC,
                },
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        doctor: {
          include: {
            user: { select: { fullName: true } },
          },
        },
        timeSlot: {
          include: {
            availability: true,
          },
        },
      },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      notes: appointment.notes,
      reportUrl: appointment.reportUrl,
      status: appointment.status,
      doctor: {
        fullName: appointment.doctor.user.fullName,
        specialization: appointment.doctor.specialization,
        fees: appointment.doctor.fees,
      },
      schedule: {
        date: appointment.timeSlot.availability.date,
        startTime: appointment.timeSlot.startTime,
        endTime: appointment.timeSlot.endTime,
      },
    }));
  },
  async getDoctorAppointmentHistory(
    userId: number
  ): Promise<DoctorAppointmentResponse[]> {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctorProfile) {
      throw new Error("Doctor profile not found");
    }

    const todayUTC = new Date();
    todayUTC.setUTCHours(0, 0, 0, 0);

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctorProfile.id,
        OR: [
          {
            status: {
              in: [
                AppointmentStatus.CANCELLED,
                AppointmentStatus.REJECTED,
                AppointmentStatus.COMPLETED
              ],
            },
          },
          {
            timeSlot: {
              availability: {
                date: {
                  lt: todayUTC,
                },
              },
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          include: {
            user: {
              select: {
                fullName: true,
                phone: true,
              },
            },
          },
        },
        timeSlot: {
          include: {
            availability: true,
          },
        },
      },
    });

    return appointments.map((appointment) => ({
      id: appointment.id,
      status: appointment.status,
      notes: appointment.notes,
      reportUrl: appointment.reportUrl,
      patient: {
        fullName: appointment.patient.user.fullName,
        phone: appointment.patient.user.phone,
      },
      schedule: {
        date: appointment.timeSlot.availability.date,
        startTime: appointment.timeSlot.startTime,
        endTime: appointment.timeSlot.endTime,
      },
    }));
  }
};
