"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function DoctorError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <ShieldAlert className="h-7 w-7 text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Access Denied
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          You must be logged in to view doctors.
          <br />
          Please login to continue.
        </p>

        {/* Action */}
        <Link
          href="/auth/login"
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
