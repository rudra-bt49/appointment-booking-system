import prisma from "../config/prisma";
import { CreateAppointmentRequest } from "../types/appointment.types";
import { AppointmentStatus, Prisma } from "@prisma/client";
import { PatientAppointmentResponse } from "../types/appointment.types";
import { DoctorAppointmentResponse } from "../types/appointment.types";


export const appointmentService = {
  async createAppointment(
    userId: number,
    payload: CreateAppointmentRequest
  ) {
    const patient = await prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new Error("Patient profile not found");
    }

    const doctor = await prisma.doctorProfile.findUnique({
      where: { id: payload.doctorId },
    });

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const timeSlot = await prisma.timeSlot.findUnique({
      where: { id: payload.timeSlotId },
      include: { appointment: true },
    });

    if (!timeSlot) {
      throw new Error("Time slot not found");
    }

    // ✅ Slot availability check
    if (!timeSlot.isAvailable) {
      throw new Error("Already requested appointment");
    }

    try {
      // ✅ Transaction: create appointment + block slot
      const result = await prisma.$transaction(async (tx) => {
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

        await tx.timeSlot.update({
          where: { id: payload.timeSlotId },
          data: {
            isAvailable: false,
          },
        });

        return appointment;
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
      where: {
        patientId: patientProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                fullName: true,
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
      where: {
        doctorId: doctorProfile.id,
      },
      orderBy: {
        createdAt: "desc",
      },
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
            availability: {
              select: {
                date: true,
              },
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
};
