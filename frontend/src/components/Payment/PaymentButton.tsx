"use client";
import { DollarSign } from "lucide-react";

interface PaymentButtonProps {
  appointmentId: string;
  fees: number;
}

export default function PaymentButton({ appointmentId, fees }: PaymentButtonProps) {
  const handlePayment = () => {
    // Add your payment logic here
    console.log(`Processing payment for appointment ${appointmentId}, amount: ₹${fees}`);
    // You can redirect to payment page or open payment modal
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