import prisma from "../config/prisma";
import { CreateAvailabilityPayload } from "../types/availability.types";

export const availabilityService = {

  async createAvailability(userId: number, payload: CreateAvailabilityPayload) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new Error("Doctor profile not found");
    }

    // ----------------------------
    // Parse date
    // ----------------------------
    const [y, m, d] = payload.date.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Invalid date format");
    }

    const baseDate = new Date(Date.UTC(y, m - 1, d));

    // ----------------------------
    // Parse time
    // ----------------------------
    const [sh, sm, ss = "0"] = payload.startDuration.split(":");
    const [eh, em, es = "0"] = payload.endDuration.split(":");

    const startDuration = new Date(
      Date.UTC(y, m - 1, d, Number(sh), Number(sm), Number(ss))
    );
    const endDuration = new Date(
      Date.UTC(y, m - 1, d, Number(eh), Number(em), Number(es))
    );

    if (startDuration >= endDuration) {
      throw new Error("Start duration must be before end duration");
    }

    // ----------------------------
    // 🔒 Overlap check
    // ----------------------------
    const conflictingAvailability = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId: doctor.id,
        date: baseDate,
        AND: [
          { startDuration: { lt: endDuration } },
          { endDuration: { gt: startDuration } },
        ],
      },
    });

    if (conflictingAvailability) {
      throw new Error("Availability time overlaps with existing availability");
    }

    // ----------------------------
    // Create availability
    // ----------------------------
    const availability = await prisma.doctorAvailability.create({
      data: {
        doctorId: doctor.id,
        date: baseDate,
        startDuration,
        endDuration,
      },
    });

    // ----------------------------
    // Auto-create 30 min slots
    // ----------------------------
    const slots = [];
    let cursor = new Date(startDuration);

    while (cursor < endDuration) {
      const next = new Date(cursor.getTime() + 30 * 60 * 1000);
      if (next > endDuration) break;

      slots.push({
        availabilityId: availability.id,
        startTime: cursor,
        endTime: next,
        isAvailable: true,
      });

      cursor = next;
    }

    await prisma.timeSlot.createMany({ data: slots });

    return availability;
  },

  async getDoctorAvailability(userId: number) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        availabilities: {
          orderBy: [
            { date: "asc" },
            { startDuration: "asc" },
          ],
          include: {
            timeSlots: {
              orderBy: { startTime: "asc" },
            },
          },
        },
      },
    });

    if (!doctor) {
      throw new Error("Doctor profile not found");
    }

    return doctor.availabilities;
  },

  async deleteTimeSlot(userId: number, slotId: number) {
    const slot = await prisma.timeSlot.findUnique({
      where: { id: slotId },
      include: {
        availability: {
          include: { doctor: true },
        },
      },
    });

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (!slot.isAvailable) {
      throw new Error("Slot already booked");
    }

    if (slot.availability.doctor.userId !== userId) {
      throw new Error("Unauthorized");
    }

    await prisma.timeSlot.delete({
      where: { id: slotId },
    });
  },

  async getSlotsByDoctorAndDate(payload: {
    doctorId: number;
    date: string;
  }) {
    const [y, m, d] = payload.date.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Invalid date format");
    }

    const availabilityDate = new Date(Date.UTC(y, m - 1, d));

    const availabilities = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: payload.doctorId,
        date: availabilityDate,
      },
      orderBy: { startDuration: "asc" },
      include: {
        timeSlots: {
          orderBy: { startTime: "asc" },
          select: {
            id: true,
            startTime: true,
            endTime: true,
            isAvailable: true,
          },
        },
      },
    });

    return availabilities;
  },
  async getAvailableDates(payload: { doctorId: number }) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const availabilities = await prisma.doctorAvailability.findMany({
      where: {
        doctorId: payload.doctorId,
        date: { gte: today },
      },
      select: { date: true },
      orderBy: { date: "asc" },
    });

    return Array.from(
      new Set(
        availabilities.map(a =>
          a.date.toISOString().split("T")[0]
        )
      )
    );
  },
};
