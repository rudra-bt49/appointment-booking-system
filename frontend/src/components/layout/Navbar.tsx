"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth.context";
import { User } from "lucide-react";
import API_ROUTES from "@/config/routes";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    router.push(API_ROUTES.AUTH.LOGIN);
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
