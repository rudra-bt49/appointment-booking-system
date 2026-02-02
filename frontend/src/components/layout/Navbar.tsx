"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { useAuth } from "@/context/auth.context";
import { User } from "lucide-react";
import API_ROUTES from "@/config/routes";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      logout();
      localStorage.removeItem("user");
      localStorage.removeItem("doctorProfileId");
      localStorage.removeItem("doctorAvailabilityId");
      localStorage.removeItem("doctorSlotIds");

      Swal.fire({
        icon: "success",
        title: "Logged out",
        text: "You have been logged out successfully",
        timer: 1200,
        showConfirmButton: false,
      });

      setTimeout(() => {
        router.push(API_ROUTES.AUTH.LOGIN);
      }, 1200);
    }
  };

  return (
    <header className="w-full bg-blue-50 border-b border-blue-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href={API_ROUTES.HOME}
            className="text-xl font-bold text-blue-600"
          >
            DocPulse
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-6">
            {!user ? (
              <>
                <Link
                  href={API_ROUTES.AUTH.LOGIN}
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>

                <Link
                  href={API_ROUTES.AUTH.REGISTER}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* Profile Icon */}
                <Link
                  href={API_ROUTES.PROFILE}
                  className="p-2 rounded-full hover:bg-blue-100 transition"
                  title="Profile"
                >
                  <User size={20} className="text-gray-700" />
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
