import prisma from "../config/prisma";
import { AppointmentStatus, PaymentStatus } from "@prisma/client";

/* ---------------- DATE RANGE HELPER ---------------- */
const getDateRange = (type: "today" | "week" | "month") => {
  const now = new Date();
  const start = new Date();

  if (type === "today") {
    start.setHours(0, 0, 0, 0);
  }

  if (type === "week") {
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
  }

  if (type === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
};

export const doctorAnalyticsService = {
  /* ---------------- GET DOCTOR ID ---------------- */
  async getDoctorIdByUserId(userId: number) {
    const doctor = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!doctor) throw new Error("Doctor profile not found");
    return doctor.id;
  },

  /* ---------------- PATIENT LISTING (UNCHANGED) ---------------- */
  async getPatients(doctorId: number) {
    const appointments = await prisma.appointment.findMany({
      where: { doctorId },
      distinct: ["patientId"],
      include: {
        patient: { include: { user: true } },
      },
    });

    return appointments.map((appt) => ({
      patientId: appt.patient.id,
      userId: appt.patient.user.id,
      fullName: appt.patient.user.fullName,
      email: appt.patient.user.email,
      phone: appt.patient.user.phone,
      gender: appt.patient.gender,
      dateOfBirth: appt.patient.dateOfBirth,
    }));
  },

  /* ---------------- REVENUE (ALL TIME) ---------------- */
  async getRevenueByDate(doctorId: number) {
    return this.getRevenueByRange(doctorId);
  },

  async getRevenueByRange(
    doctorId: number,
    range?: "today" | "week" | "month"
  ) {
    const dateFilter = range ? getDateRange(range) : null;

    const payments = await prisma.payment.findMany({
      where: {
        status: PaymentStatus.SUCCESS,
        ...(dateFilter && {
          updatedAt: { gte: dateFilter.start, lte: dateFilter.end },
        }),
        appointment: {
          doctorId,
          status: {
            in: [AppointmentStatus.COMPLETED, AppointmentStatus.SCHEDULED],
          },
        },
      },
      select: { amount: true, updatedAt: true },
    });

    const map: Record<string, number> = {};

    payments.forEach((p) => {
      const date = p.updatedAt.toISOString().split("T")[0];
      map[date] = (map[date] || 0) + p.amount;
    });

    return Object.entries(map).map(([date, totalRevenue]) => ({
      date,
      totalRevenue,
    }));
  },

  /* ---------------- APPOINTMENT STATUS ---------------- */
  async getAppointmentStatusCount(doctorId: number) {
    return this.getAppointmentStatusByRange(doctorId);
  },

  async getAppointmentStatusByRange(
    doctorId: number,
    range?: "today" | "week" | "month"
  ) {
    const dateFilter = range ? getDateRange(range) : null;

    const result = await prisma.appointment.groupBy({
      by: ["status"],
      where: {
        doctorId,
        ...(dateFilter && {
          updatedAt: { gte: dateFilter.start, lte: dateFilter.end },
        }),
      },
      _count: { status: true },
    });

    return result.map((r) => ({
      status: r.status,
      count: r._count.status,
    }));
  },

  /* ---------------- TIME SLOT USAGE ---------------- */
  async getTimeSlotUsage(doctorId: number) {
    return this.getTimeSlotUsageByRange(doctorId);
  },

  async getTimeSlotUsageByRange(
    doctorId: number,
    range?: "today" | "week" | "month"
  ) {
    const dateFilter = range ? getDateRange(range) : null;

    const grouped = await prisma.appointment.groupBy({
      by: ["timeSlotId"],
      where: {
        doctorId,
        ...(dateFilter && {
          createdAt: { gte: dateFilter.start, lte: dateFilter.end },
        }),
      },
      _count: { timeSlotId: true },
    });

    const slotIds = grouped.map((g) => g.timeSlotId);

    const slots = await prisma.timeSlot.findMany({
      where: { id: { in: slotIds } },
    });

    return grouped.map((g) => {
      const slot = slots.find((s) => s.id === g.timeSlotId)!;
      return {
        timeSlotId: slot.id,
        startTime: slot.startTime,
        endTime: slot.endTime,
        count: g._count.timeSlotId,
      };
    });
  },
};
