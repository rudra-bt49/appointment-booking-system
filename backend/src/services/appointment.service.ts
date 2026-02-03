import prisma from "../config/prisma";
import { CreateAppointmentRequest } from "../types/appointment.types";
import { AppointmentStatus } from "@prisma/client";
import { PatientAppointmentResponse } from "../types/appointment.types";

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

    if (timeSlot.appointment?.status == AppointmentStatus.APPROVED) {
      throw new Error("Time slot already has an appointment");
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: payload.doctorId,
        patientId: patient.id,
        timeSlotId: payload.timeSlotId,
        notes: payload.notes,
        reportUrl: payload.reportUrl ?? null,
        status: "REQUESTED",
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

    return appointment;
  },

  //get appointments of patient
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
};

