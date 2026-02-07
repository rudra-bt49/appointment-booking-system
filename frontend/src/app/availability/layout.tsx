"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function AvailabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requiredRole="DOCTOR">{children}</ProtectedRoute>;
}
