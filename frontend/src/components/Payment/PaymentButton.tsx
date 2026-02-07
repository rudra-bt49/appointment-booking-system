"use client";

import axiosInstance from "@/config/axios";
import Swal from "sweetalert2";
import { DollarSign } from "lucide-react";
import API_ROUTES from "@/config/routes";

interface PaymentButtonProps {
  appointmentId: string;
  fees: number;
}

export default function PaymentButton({
  appointmentId
}: PaymentButtonProps) {
  const handlePayment = async () => {
    try {
      const expiryRes = await axiosInstance.post(
        API_ROUTES.PAYMENT.CHECK_EXPIRY,
        {
          appointmentId,
        }
      );

      if (expiryRes.data.data.expired) {
        await Swal.fire({
          icon: "error",
          title: "Payment Expired",
          text: "Payment window expired. Appointment has been cancelled.",
        });
        return;
      }

      const stripeRes = await axiosInstance.post(
        "/stripe/create-checkout-session",
        {
          appointmentId,
        }
      );

      const sessionUrl = stripeRes.data.data.sessionUrl;

      if (!sessionUrl) {
        throw new Error("Stripe session URL not found");
      }

      window.location.href = sessionUrl;
    } catch {
      await Swal.fire({
        icon: "error",
        title: "Payment Failed",
        text: "Something went wrong while initiating payment.",
      });
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="group inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-green-700"
    >
      <DollarSign className="h-4 w-4" />
      <span>Proceed to Payment</span>
    </button>
  );
}
