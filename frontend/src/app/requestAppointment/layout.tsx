"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function RequestAppointmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
