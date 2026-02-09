"use client";

import { useState } from "react";
import axiosInstance from "@/config/axios";
import Swal from "sweetalert2";
import { DollarSign } from "lucide-react";
import API_ROUTES from "@/config/routes";

interface PaymentButtonProps {
  appointmentId: string;
  fees: number;
}

interface PaymentExpiryResponse {
  success: boolean;
  message: string;
  data: {
    expired: boolean;
  };
}

interface StripeSessionResponse {
  success: boolean;
  data: {
    sessionUrl: string;
  };
}

export default function PaymentButton({
  appointmentId,
}: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      const expiryRes = await axiosInstance.post<PaymentExpiryResponse>(
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
        setIsLoading(false);
        return;
      }

      const stripeRes = await axiosInstance.post<StripeSessionResponse>(
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
      setIsLoading(false);
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
      disabled={isLoading}
      className="group inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <div className="h-4 w-4">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
          </div>
          <span>Processing...</span>
        </>
      ) : (
        <>
          <DollarSign className="h-4 w-4" />
          <span>Proceed to Payment</span>
        </>
      )}
    </button>
  );
}
