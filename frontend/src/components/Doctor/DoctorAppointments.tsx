"use client";
import Link from "next/link";
import { DoctorAppointment } from "@/types/doctorAppointment.types";
import {
  Calendar,
  Clock,
  User,
  FileText,
  ExternalLink,
  Phone,
  Check,
  X,
} from "lucide-react";

interface DoctorAppointmentProps {
  appointments: DoctorAppointment[];
}

export default function DoctorAppointments({
  appointments,
}: DoctorAppointmentProps) {
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-gray-100 p-6">
          <Calendar className="h-12 w-12 text-gray-400" />
        </div>
        <p className="text-center text-lg font-medium text-gray-500">
          No appointments found
        </p>
        <p className="mt-2 text-center text-sm text-gray-400">
          Your appointments will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
        >
          {/* Header */}
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 p-3">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="mb-1 text-xl font-semibold text-gray-900">
                  {appointment.patient.fullName}
                </h2>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  <p className="text-sm font-medium">
                    {appointment.patient.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>
            <span
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide ${
                appointment.status &&
                (() => {
                  const statusLower = appointment.status.toLowerCase();
                  if (
                    statusLower.includes("confirmed") ||
                    statusLower.includes("scheduled")
                  ) {
                    return "bg-green-50 text-green-700 border-green-200";
                  }
                  if (statusLower.includes("pending")) {
                    return "bg-yellow-50 text-yellow-700 border-yellow-200";
                  }
                  if (statusLower.includes("completed")) {
                    return "bg-blue-50 text-blue-700 border-blue-200";
                  }
                  if (statusLower.includes("cancelled")) {
                    return "bg-red-50 text-red-700 border-red-200";
                  }
                  return "bg-gray-50 text-gray-700 border-gray-200";
                })()
              }`}
            >
              {appointment.status}
            </span>
          </div>

          {/* Details */}
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Date */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Date
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(appointment.schedule.date).toDateString()}
                </p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="rounded-lg bg-white p-2 shadow-sm">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-gray-500">
                  Time
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {new Date(appointment.schedule.startTime).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}{" "}
                  -{" "}
                  {new Date(appointment.schedule.endTime).toLocaleTimeString(
                    [],
                    { hour: "2-digit", minute: "2-digit" }
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-amber-900">
                    Notes
                  </p>
                  <p className="text-sm text-amber-800">{appointment.notes}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons and Report */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Approve Button */}
            <button className="group inline-flex items-center gap-2 rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-green-700">
              <Check className="h-4 w-4" />
              <span>Approve</span>
            </button>

            {/* Reject Button */}
            <button className="group inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-red-700">
              <X className="h-4 w-4" />
              <span>Reject</span>
            </button>

            {/* Report Link */}
            {appointment.reportUrl && (
              <Link
                href={appointment.reportUrl}
                target="_blank"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4" />
                <span>View Report</span>
                <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}