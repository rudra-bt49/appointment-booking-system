"use client";

import { useAuth } from "@/context/auth.context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import API_ROUTES from "@/config/routes";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const role = user?.data?.role;

  const pathname = usePathname();
  const router = useRouter();

  const shouldRedirectDoctorFromHome =
    role === "DOCTOR" && pathname === API_ROUTES.HOME;

  // 🔒 redirect
  useEffect(() => {
    if (shouldRedirectDoctorFromHome) {
      router.replace(API_ROUTES.SIDEBAR.DASHBOARD);
    }
  }, [shouldRedirectDoctorFromHome, router]);

  // 🚫 PREVENT FIRST PAINT → NO FLICKER
  if (shouldRedirectDoctorFromHome) {
    return null;
  }

  /* ---------------- DOCTOR LAYOUT ---------------- */
  if (role === "DOCTOR") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    );
  }

  /* ---------------- PATIENT / PUBLIC LAYOUT ---------------- */
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
