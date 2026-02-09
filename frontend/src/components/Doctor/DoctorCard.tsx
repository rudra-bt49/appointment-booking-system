// DoctorCard.tsx
"use client";
import React from "react";
import { IDoctor } from "@/types/doctor.types";
import Link from "next/link";
import ExperienceIcon from "@/components/ui/ExperienceIcon";
import FeeIcon from "@/components/ui/FeeIcon";

export default function DoctorCard({ doctor }: { doctor: IDoctor }) {
  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-400/30">
      <div>
        {/* Header: Avatar & Title Info */}
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-inner">
            {doctor.fullName.charAt(0)}
          </div>

          {/* Name, Specialization & Status */}
          <div className="flex-1 min-w-0">
            <h2 className="truncate text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {doctor.fullName}
            </h2>
            <p className="truncate text-sm font-medium text-blue-600/80">
              {doctor.specialization}
            </p>
            <div className="mt-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  doctor.isAvailable
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                    : "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                    doctor.isAvailable ? "bg-emerald-600" : "bg-rose-600"
                  }`}
                />
                {doctor.isAvailable ? "Available" : "Away"}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <ExperienceIcon />
            </div>
            <span>
              <span className="font-semibold text-slate-900">
                {doctor.experience} Years
              </span>{" "}
              Experience
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm text-slate-600">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
              <FeeIcon />
            </div>
            <span>
              Consultation Fee:{" "}
              <span className="font-semibold text-slate-900">
                ₹{doctor.fees}
              </span>
            </span>
          </div>
        </div>

        {/* Bio */}
        {doctor.bio && (
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="line-clamp-2 text-xs leading-relaxed text-slate-500 italic">
              {doctor.bio}
            </p>
          </div>
        )}
      </div>

      <Link href={`/doctor/${doctor.id}`}>
        <button className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-600 active:scale-95">
          View Profile
        </button>
      </Link>
    </div>
  );
}