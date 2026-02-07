"use client";

import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "../components/Loader/Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "DOCTOR" | "PATIENT" | "ADMIN";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      router.replace("/auth/login");
      return;
    }

    // Check if user has required role
    if (requiredRole && user?.data?.role !== requiredRole) {
      router.replace("/");
      return;
    }
  }, [isAuthenticated, user, requiredRole, router]);

  // Show loader while checking authentication (isAuthenticated is undefined until hydrated)
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
}
