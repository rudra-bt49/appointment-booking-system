"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function DoctorAppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requiredRole="DOCTOR">{children}</ProtectedRoute>;
}
