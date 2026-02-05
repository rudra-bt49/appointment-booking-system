// import prisma from "../config/prisma";
// import {
//     CreateAvailabilityPayload,
//     CreateTimeSlotsPayload,
// } from "../types/availability.types";

// export const availabilityService = {
//     // ===============================
//     // CREATE AVAILABILITY (DATE ONLY)
//     // ===============================
//     async createAvailability(
//         userId: number,
//         payload: CreateAvailabilityPayload
//     ) {
//         const doctor = await prisma.doctorProfile.findUnique({
//             where: { userId },
//         });

//         if (!doctor) {
//             throw new Error("Doctor profile not found");
//         }

//         const [y, m, d] = payload.date.split("-").map(Number);

//         if (!y || !m || !d) {
//             throw new Error("Invalid date format");
//         }

//         const availabilityDate = new Date(Date.UTC(y, m - 1, d));

//         const now = new Date();
//         const todayUTC = new Date(
//             Date.UTC(
//                 now.getUTCFullYear(),
//                 now.getUTCMonth(),
//                 now.getUTCDate()
//             )
//         );

//         if (availabilityDate <= todayUTC) {
//             throw new Error("Availability date must be in the future");
//         }

//         return prisma.doctorAvailability.create({
//             data: {
//                 doctorId: doctor.id,
//                 date: availabilityDate,
//             },
//         });
//     },

//     // ===============================
//     // CREATE TIME SLOTS (DATE SAFE)
//     // ===============================
//     async createTimeSlots(
//         userId: number,
//         availabilityId: number,
//         payload: CreateTimeSlotsPayload
//     ) {
//         const availability = await prisma.doctorAvailability.findUnique({
//             where: { id: availabilityId },
//             include: {
//                 doctor: true,
//             },
//         });

//         if (!availability) {
//             throw new Error("Availability not found");
//         }

//         if (availability.doctor.userId !== userId) {
//             throw new Error("Unauthorized");
//         }

//         const baseDate = availability.date;
//         const year = baseDate.getUTCFullYear();
//         const month = baseDate.getUTCMonth();
//         const day = baseDate.getUTCDate();

//         const slotsToCreate: {
//             availabilityId: number;
//             startTime: Date;
//             endTime: Date;
//         }[] = [];

//         for (const slot of payload.slots) {
//             const [sh, sm, ss = "0"] = slot.startTime.split(":");
//             const [eh, em, es = "0"] = slot.endTime.split(":");

//             const startTime = new Date(
//                 Date.UTC(year, month, day, Number(sh), Number(sm), Number(ss))
//             );

//             const endTime = new Date(
//                 Date.UTC(year, month, day, Number(eh), Number(em), Number(es))
//             );

//             if (
//                 isNaN(startTime.getTime()) ||
//                 isNaN(endTime.getTime())
//             ) {
//                 throw new Error("Invalid time format");
//             }

//             if (startTime >= endTime) {
//                 throw new Error("Start time must be before end time");
//             }

//             // ✅ FIX: DB-level overlap check scoped to SAME availability only
//             const overlap = await prisma.timeSlot.findFirst({
//                 where: {
//                     availabilityId,
//                     startTime: { lt: endTime },
//                     endTime: { gt: startTime },
//                 },
//             });

//             if (overlap) {
//                 throw new Error("Time slot overlaps with existing slot");
//             }

//             slotsToCreate.push({
//                 availabilityId,
//                 startTime,
//                 endTime,
//             });
//         }

//         return prisma.timeSlot.createMany({
//             data: slotsToCreate,
//         });
//     },

//     // ===============================
//     // GET DOCTOR AVAILABILITY
//     // ===============================
//     async getDoctorAvailability(userId: number) {
//         const doctor = await prisma.doctorProfile.findUnique({
//             where: { userId },
//             include: {
//                 availabilities: {
//                     orderBy: { date: "asc" },
//                     include: {
//                         timeSlots: {
//                             orderBy: { startTime: "asc" },
//                         },
//                     },
//                 },
//             },
//         });

//         if (!doctor) {
//             throw new Error("Doctor profile not found");
//         }

//         return doctor.availabilities;
//     },

//     // ===============================
//     // DELETE TIME SLOT
//     // ===============================
//     async deleteTimeSlot(userId: number, slotId: number) {
//         const slot = await prisma.timeSlot.findUnique({
//             where: { id: slotId },
//             include: {
//                 availability: {
//                     include: { doctor: true },
//                 },
//             },
//         });

//         if (!slot) {
//             throw new Error("Slot not found");
//         }

//         if (slot.isBooked) {
//             throw new Error("Slot already booked");
//         }

//         if (slot.availability.doctor.userId !== userId) {
//             throw new Error("Unauthorized");
//         }

//         await prisma.timeSlot.delete({
//             where: { id: slotId },
//         });
//     },

//     // ===============================
//     // GET TIME SLOTS BY DOCTOR & DATE
//     // ===============================
//     async getSlotsByDoctorAndDate(payload: {
//         doctorId: number;
//         date: string;
//     }) {
//         const { doctorId, date } = payload;

//         const [y, m, d] = date.split("-").map(Number);

//         if (!y || !m || !d) {
//             throw new Error("Invalid date format");
//         }

//         const availabilityDate = new Date(Date.UTC(y, m - 1, d));

//         const availability = await prisma.doctorAvailability.findFirst({
//             where: {
//                 doctorId,
//                 date: availabilityDate,
//             },
//         });

//         if (!availability) {
//             return [];
//         }

//         const slots = await prisma.timeSlot.findMany({
//             where: {
//                 availabilityId: availability.id,
//             },
//             orderBy: {
//                 startTime: "asc",
//             },
//             select: {
//                 id: true,
//                 startTime: true,
//                 endTime: true,
//                 isBooked: true,
//             },
//         });

//         return {
//             slots,
//             availabilityId: availability.id,
//         };
//     },
// };








import prisma from "../config/prisma";
import { CreateAvailabilityPayload } from "../types/availability.types";

export const availabilityService = {
  // ===============================
  // CREATE AVAILABILITY + AUTO SLOTS
  // ===============================
  async createAvailability(userId: number, payload: CreateAvailabilityPayload) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new Error("Doctor profile not found");
    }

    const [y, m, d] = payload.date.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Invalid date format");
    }

    const baseDate = new Date(Date.UTC(y, m - 1, d));

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

    const availability = await prisma.doctorAvailability.create({
      data: {
        doctorId: doctor.id,
        date: baseDate,
        startDuration,
        endDuration,
      },
    });

    // 🔹 Auto-create 30 min slots
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

  // ===============================
  // GET MY AVAILABILITY
  // ===============================
  async getDoctorAvailability(userId: number) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      include: {
        availabilities: {
          orderBy: { date: "asc" },
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

  // ===============================
  // DELETE TIME SLOT
  // ===============================
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

  // ===============================
  // GET SLOTS BY DOCTOR & DATE
  // ===============================
  async getSlotsByDoctorAndDate(payload: {
    doctorId: number;
    date: string;
  }) {
    const [y, m, d] = payload.date.split("-").map(Number);
    if (!y || !m || !d) {
      throw new Error("Invalid date format");
    }

    const availabilityDate = new Date(Date.UTC(y, m - 1, d));

    const availability = await prisma.doctorAvailability.findFirst({
      where: {
        doctorId: payload.doctorId,
        date: availabilityDate,
      },
    });

    if (!availability) return [];

    return {
      availabilityId: availability.id,
      slots: await prisma.timeSlot.findMany({
        where: { availabilityId: availability.id },
        orderBy: { startTime: "asc" },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          isAvailable: true,
        },
      }),
    };
  },
};
