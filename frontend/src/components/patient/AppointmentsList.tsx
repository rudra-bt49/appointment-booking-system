"use client";
import { useState, useMemo, useEffect } from "react";
import {
  IPatientAppointment,
} from "@/types/patientAppointment.types";
import {
  Calendar,
  Clock,
  User,
  DollarSign,
  FileText,
  ExternalLink,
  Stethoscope,
} from "lucide-react";
import BackButton from "../common/BackButton";
import PaymentButton from "../Payment/PaymentButton";
import { getPatientHistoryAppointments } from "@/services/appointment.service";

interface AppointmentsListProps {
  appointments: IPatientAppointment[];
}

type TabType =
  | "REQUESTED"
  | "APPROVED"
  | "SCHEDULED"
  | "HISTORY";

export default function AppointmentsList({
  appointments,
}: AppointmentsListProps) {
  // ✅ Default tab changed to SCHEDULED
  const [activeTab, setActiveTab] = useState<TabType>("SCHEDULED");
  const [historyAppointments, setHistoryAppointments] = useState<IPatientAppointment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Fetch history appointments when History tab is active
  useEffect(() => {
    if (activeTab === "HISTORY") {
      const fetchHistoryAppointments = async () => {
        try {
          setHistoryLoading(true);
          setHistoryError(null);
          const response = await getPatientHistoryAppointments();
          setHistoryAppointments(response.data || []);
        } catch (error) {
          console.error("Failed to fetch history appointments:", error);
          setHistoryError("Failed to load history appointments");
          setHistoryAppointments([]);
        } finally {
          setHistoryLoading(false);
        }
      };

      fetchHistoryAppointments();
    }
  }, [activeTab]);

  // Categorize appointments by status
  const categorizedAppointments = useMemo(() => {
    const categories: Record<TabType, IPatientAppointment[]> = {
      REQUESTED: [],
      APPROVED: [],
      SCHEDULED: [],
      HISTORY: [],
    };

    appointments.forEach((appointment) => {
      const statusLower = appointment.status.toLowerCase();

      if (
        statusLower.includes("requested") ||
        statusLower.includes("pending")
      ) {
        categories.REQUESTED.push(appointment);
      } else if (statusLower.includes("approved")) {
        categories.APPROVED.push(appointment);
      } else if (
        statusLower.includes("scheduled") ||
        statusLower.includes("confirmed")
      ) {
        categories.SCHEDULED.push(appointment);
      }
    });

    return categories;
  }, [appointments]);

  const currentAppointments = activeTab === "HISTORY" ? historyAppointments : categorizedAppointments[activeTab];

  const tabs: TabType[] = [
    "REQUESTED",
    "APPROVED",
    "SCHEDULED",
    "HISTORY",
  ];

  return (
    <div>
      {/* Back Button */}
      <BackButton />

      {/* Tabs */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const count = tab === "HISTORY" ? historyAppointments.length : categorizedAppointments[tab].length;
            const isActive = activeTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {count}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading State for History */}
      {activeTab === "HISTORY" && historyLoading && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 animated-spin rounded-full bg-blue-100 p-6">
            <Calendar className="h-12 w-12 text-blue-400 animate-pulse" />
          </div>
          <p className="text-center text-lg font-medium text-gray-500">
            Loading history appointments...
          </p>
        </div>
      )}

      {/* Error State for History */}
      {activeTab === "HISTORY" && historyError && (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-red-100 p-6">
            <Calendar className="h-12 w-12 text-red-400" />
          </div>
          <p className="text-center text-lg font-medium text-red-600">
            {historyError}
          </p>
        </div>
      )}

      {/* Appointments List */}
      {!historyLoading && !historyError && currentAppointments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="mb-4 rounded-full bg-gray-100 p-6">
            <Calendar className="h-12 w-12 text-gray-400" />
          </div>
          <p className="text-center text-lg font-medium text-gray-500">
            No {activeTab.toLowerCase()} appointments found
          </p>
          <p className="mt-2 text-center text-sm text-gray-400">
            Your {activeTab.toLowerCase()} appointments will appear here
          </p>
        </div>
      ) : !historyLoading && currentAppointments.length > 0 && (
        <div className="space-y-4">
          {currentAppointments.map((appointment) => (
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
                      {appointment.doctor.fullName}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Stethoscope className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        {appointment.doctor.specialization}
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
                        statusLower.includes("scheduled") ||
                        statusLower.includes("approved")
                      ) {
                        return "bg-green-50 text-green-700 border-green-200";
                      }
                      if (
                        statusLower.includes("pending") ||
                        statusLower.includes("requested")
                      ) {
                        return "bg-yellow-50 text-yellow-700 border-yellow-200";
                      }
                      if (statusLower.includes("completed")) {
                        return "bg-blue-50 text-blue-700 border-blue-200";
                      }
                      if (
                        statusLower.includes("cancelled") ||
                        statusLower.includes("rejected")
                      ) {
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
                      {appointment.schedule.date.slice(0, 10)}
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
                      {appointment.schedule.startTime.slice(11, 16)} -{" "}
                      {appointment.schedule.endTime.slice(11, 16)}
                    </p>
                  </div>
                </div>

                {/* Fees */}
                <div className="flex items-center gap-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase text-gray-500">
                      Consultation Fee
                    </p>
                    <p className="text-sm font-bold text-green-700">
                      ₹{appointment.doctor.fees}
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
                      <p className="text-sm text-amber-800">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {/* Payment Button - Only for APPROVED appointments */}
                {activeTab === "APPROVED" && (
                  <PaymentButton
                    appointmentId={String(appointment.id)}
                    fees={appointment.doctor.fees}
                  />
                )}

                {/* Report */}
                {appointment.reportUrl && (
                  <a
                    href={appointment.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-colors duration-200 hover:bg-blue-700"
                  >
                    <FileText className="h-4 w-4" />
                    <span>View Report</span>
                    <ExternalLink className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
