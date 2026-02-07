import stripe from "../config/stripe";
import prisma from "../config/prisma";
import { PaymentStatus, AppointmentStatus } from "@prisma/client";

export const stripeService = {
  async createCheckoutSession(
    appointmentId: number,
    userId: number
  ) {
    const payment = await prisma.payment.findUnique({
      where: { appointmentId },
      include: { appointment: true },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new Error("Payment already completed");
    }

    const now = new Date();
    if (now > payment.paymentExpiry) {
      throw new Error("Payment window expired");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: payment.currency.toLowerCase(),
            unit_amount: payment.amount * 100, // INR → paise
            product_data: {
              name: "Doctor Appointment",
            },
          },
          quantity: 1,
        },
      ],
      success_url: process.env.FRONTEND_SUCCESS_URL as string,
      cancel_url: process.env.FRONTEND_CANCEL_URL as string,
      metadata: {
        appointmentId: String(appointmentId),
        userId: String(userId),
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PENDING,
        stripeSessionId: session.id,
      },
    });

    return {
      sessionId: session.id,
      sessionUrl: session.url,
    };
  },

  async handleWebhook(event: any) {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const appointmentId = Number(session.metadata.appointmentId);

        await prisma.$transaction([
          prisma.payment.update({
            where: { appointmentId },
            data: {
              status: PaymentStatus.SUCCESS,
              stripePaymentId: session.payment_intent as string,
            },
          }),
          prisma.appointment.update({
            where: { id: appointmentId },
            data: {
              status: AppointmentStatus.SCHEDULED,
            },
          }),
        ]);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const appointmentId = Number(session.metadata.appointmentId);

        await prisma.payment.update({
          where: { appointmentId },
          data: { status: PaymentStatus.FAILED },
        });

        break;
      }
    }
  },
};
