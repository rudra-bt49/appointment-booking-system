"use client";

import { useAuth } from "@/context/auth.context";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  console.log("AppShell user:", user);

  const role = user?.data?.role;

  /* ---------------- DOCTOR LAYOUT ---------------- */
  if (role === "DOCTOR") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
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
