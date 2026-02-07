"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function PatientAppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
