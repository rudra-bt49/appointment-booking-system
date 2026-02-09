"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function dashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute requiredRole="DOCTOR">{children}</ProtectedRoute>;
}
