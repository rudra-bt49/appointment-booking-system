"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import API_ROUTES from "@/config/routes";

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    router.push(API_ROUTES.AUTH.LOGIN);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-blue-600 p-2 text-white"
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-blue-50 border-r border-blue-100
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <div className="flex h-16 items-center px-6 border-b border-blue-100">
          <span className="text-lg font-bold text-blue-600">
            Doctor Panel
          </span>
        </div>

        <nav className="flex flex-col gap-2 p-4 text-sm">
          <Link
            href="/doctor/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-100 transition"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link
            href="/doctor/appointments"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-100 transition"
          >
            <CalendarDays size={18} />
            Appointments
          </Link>

          <Link
            href="/doctor/time-slots"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-100 transition"
          >
            <Clock size={18} />
            Manage Time Slot
          </Link>

          <Link
            href={API_ROUTES.PROFILE}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 hover:bg-blue-100 transition"
          >
            <User size={18} />
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-100 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
