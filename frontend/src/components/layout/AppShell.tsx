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

  /* ================= AUTH PAGE DETECTION ================= */

  const isAuthPage =
    pathname.startsWith(API_ROUTES.AUTH.LOGIN) ||
    pathname.startsWith(API_ROUTES.AUTH.REGISTER) ||
    pathname.startsWith(API_ROUTES.AUTH.FORGOT_PASSWORD) ||
    pathname.startsWith(API_ROUTES.AUTH.RESET_PASSWORD);

  /* 🔒 redirect doctor from home */
  const shouldRedirectDoctorFromHome =
    role === "DOCTOR" && pathname === API_ROUTES.HOME;

  useEffect(() => {
    if (shouldRedirectDoctorFromHome) {
      router.replace(API_ROUTES.SIDEBAR.DASHBOARD);
    }
  }, [shouldRedirectDoctorFromHome, router]);

  if (shouldRedirectDoctorFromHome) {
    return null;
  }

  /* ================= AUTH LAYOUT (NO NAVBAR / FOOTER) ================= */

  if (isAuthPage) {
    return <>{children}</>;
  }

  /* ================= DOCTOR LAYOUT ================= */

  if (role === "DOCTOR") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">{children}</main>
      </div>
    );
  }

  /* ================= PATIENT / PUBLIC LAYOUT ================= */

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
