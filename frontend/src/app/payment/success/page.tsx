"use client";

import Swal from "sweetalert2";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import API_ROUTES from "@/config/routes";

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "Payment Successful 🎉",
      text: "Your appointment payment was completed successfully.",
      icon: "success",
      confirmButtonText: "Go to Home",
    }).then(() => {
      router.push(API_ROUTES.HOME);
    });
  }, [router]);

  return null;
}
