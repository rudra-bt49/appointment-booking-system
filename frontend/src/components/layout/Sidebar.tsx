"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
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

const navItems = [
  {
    label: "Dashboard",
    href: "/doctor/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Appointments",
    href: "/doctor/appointments",
    icon: CalendarDays,
  },
  {
    label: "Manage Time Slot",
    href: "/availability",
    icon: Clock,
  },
  {
    label: "Profile",
    href: API_ROUTES.PROFILE,
    icon: User,
  },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("doctorProfileId");
    localStorage.removeItem("doctorAvailabilityId");
    localStorage.removeItem("doctorSlotIds");
    localStorage.removeItem("selectedDate");

    router.push(API_ROUTES.AUTH.LOGIN);
  };

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 rounded-lg bg-blue-600 p-2 text-white shadow"
      >
        <Menu size={20} />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 border-r border-blue-100 bg-blue-50
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Header */}
        <div className="flex h-16 items-center border-b border-blue-100 px-6">
          <span className="text-lg font-bold text-blue-600">
            Doctor Panel
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 p-4 text-sm">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-700 hover:bg-blue-100"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2 text-red-600 transition hover:bg-red-100"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
