import prisma from "../config/prisma";
import { PaymentStatus, AppointmentStatus } from "@prisma/client";

export const paymentService = {
  async checkAndHandleExpiry(appointmentId: number) {
    const payment = await prisma.payment.findUnique({
      where: { appointmentId },
      include: { appointment: true },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    const now = new Date();

    // Already completed or failed → no action
    if (
      payment.status === PaymentStatus.SUCCESS ||
      payment.status === PaymentStatus.FAILED
    ) {
      return {
        expired: false,
        message: "Payment already processed",
        paymentStatus: payment.status,
      };
    }

    // Expired payment
    if (now > payment.paymentExpiry) {
      const timeSlotId = payment.appointment.timeSlotId;

      await prisma.$transaction([
        // 1️⃣ Mark payment failed
        prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.FAILED,
          },
        }),

        // 2️⃣ Cancel appointment
        prisma.appointment.update({
          where: { id: appointmentId },
          data: {
            status: AppointmentStatus.CANCELLED,
          },
        }),

        // 3️⃣ Free the time slot
        prisma.timeSlot.update({
          where: { id: timeSlotId },
          data: {
            isAvailable: true,
          },
        }),
      ]);

      return {
        expired: true,
        message: "Payment expired. Appointment cancelled and slot released.",
      };
    }

    // Still valid
    return {
      expired: false,
      message: "Payment is still valid",
      expiresAt: payment.paymentExpiry,
    };
  },
};
