"use client";

import Swal from "sweetalert2";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentCancelPage() {
  const router = useRouter();

  useEffect(() => {
    Swal.fire({
      title: "Payment Cancelled ❌",
      text: "You cancelled the payment. You can retry if the payment window is still valid.",
      icon: "error",
      confirmButtonText: "Go to Home",
    }).then(() => {
      router.push("/");
    });
  }, [router]);

  return null;
}
