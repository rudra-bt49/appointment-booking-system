"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DoctorAppointment } from "@/types/doctorAppointment.types";
import { updateAppointmentStatus, getDoctorHistoryAppointments } from "@/services/appointment.service";
import UpdateAppointmentStatusLoader from "@/components/Loader/updateAppointmentStatusLoader";
import {
  Calendar,
  Clock,
  User,
  FileText,
  ExternalLink,
  Phone,
  Check,
  X,
  Loader2,
} from "lucide-react";
interface DoctorAppointmentProps {
  appointments: DoctorAppointment[];
}
type AppointmentStatus =
  | "REQUESTED"
  | "APPROVED"
  | "SCHEDULED"
  | "HISTORY";
const TABS: AppointmentStatus[] = [
  "REQUESTED",
  "APPROVED",
  "SCHEDULED",
  "HISTORY"
];
const EmptyState = ({ status }: { status: AppointmentStatus }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="mb-4 rounded-full bg-gray-100 p-6">
      <Calendar className="h-12 w-12 text-gray-400" />
    </div>
    <p className="text-center text-lg font-medium text-gray-500">
      No {status.toLowerCase()} appointments
    </p>
    <p className="mt-2 text-center text-sm text-gray-400">
      {`Appointments with status "{status}" will appear here`}
    </p>
  </div>
);
export default function DoctorAppointments({
  appointments: initialAppointments,
}: DoctorAppointmentProps) {
  const [activeTab, setActiveTab] =
    useState<AppointmentStatus>("REQUESTED");
  const [appointments, setAppointments] = useState(initialAppointments);
  const [loadingAppointmentId, setLoadingAppointmentId] =
    useState<number | null>(null);
  const [processingStatus, setProcessingStatus] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [historyAppointments, setHistoryAppointments] = useState<DoctorAppointment[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  // Fetch history appointments when History tab is active
  useEffect(() => {
    if (activeTab === "HISTORY") {
      const fetchHistoryAppointments = async () => {
        try {
          setHistoryLoading(true);
          setHistoryError(null);
          const response = await getDoctorHistoryAppointments();
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
  const filterAppointmentsByStatus = (status: AppointmentStatus) => {
    if (status === "HISTORY") {
      return historyAppointments;
    }
    return (
      appointments?.filter(
        (appointment) => appointment.status === status
      ) || []
    );
  };
  const handleStatusUpdate = async (
    appointmentId: number,
    status: "APPROVED" | "REJECTED"
  ) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      setLoadingAppointmentId(appointmentId);
      setProcessingStatus(status);
      // Optimistic UI update - update local state immediately
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );
      // Make API call
      await updateAppointmentStatus({
        appointmentId,
        status,
      });
      // Show success message
      setSuccessMessage(
        `Appointment ${status.toLowerCase()} successfully!`
      );
      // Auto-switch to the new tab after a short delay
      setTimeout(() => {
        if (status === "APPROVED") {
          setActiveTab("APPROVED");
        }
        setSuccessMessage(null);
      }, 1500);
    } catch (error) {
      // Revert optimistic update on error
      setAppointments(initialAppointments);
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const err = error as {
          response?: { data?: { message?: string } };
        };
        setErrorMessage(
          err.response?.data?.message || "Failed to update appointment status"
        );
      } else {
        setErrorMessage("Failed to update appointment status");
      }
    } finally {
      setLoadingAppointmentId(null);
      setProcessingStatus(null);
    }
  };
  const filteredAppointments = filterAppointmentsByStatus(activeTab);
  return (
    <>
      {loadingAppointmentId !== null && processingStatus && (
        <UpdateAppointmentStatusLoader status={processingStatus} />
      )}
      <div>
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {TABS.map((tab) => {
              const count = filterAppointmentsByStatus(tab).length;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {count > 0 && (
                    <span
                      className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all ${
                        activeTab === tab
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              {successMessage}
            </div>
          </div>
        )}
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 animate-in fade-in slide-in-from-top-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <div className="flex items-center gap-2">
              <X className="h-4 w-4" />
              {errorMessage}
            </div>
          </div>
        )}
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
        {!historyLoading && !historyError && filteredAppointments.length === 0 ? (
          <EmptyState status={activeTab} />
        ) : !historyLoading && filteredAppointments.length > 0 && (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const isProcessing = loadingAppointmentId === appointment.id;
              const isApproving = isProcessing && processingStatus === "APPROVED";
              const isRejecting = isProcessing && processingStatus === "REJECTED";
              return (
                <div
                  key={appointment.id}
                  className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md ${
                    isProcessing ? "opacity-75 scale-[0.99]" : ""
                  }`}
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
                      className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
                        appointment.status.toLowerCase().includes("approved") ||
                        appointment.status.toLowerCase().includes("scheduled")
                          ? "bg-green-50 text-green-700 border-green-200"
                          : appointment.status
                              .toLowerCase()
                              .includes("requested")
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : appointment.status
                              .toLowerCase()
                              .includes("completed")
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      } ${isProcessing ? "animate-pulse" : ""}`}
                    >
                      {appointment.status}
                    </span>
                  </div>
                  {/* Details */}
                  <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-semibold">
                        {new Date(appointment.schedule.date).toDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <p className="text-sm font-semibold">
                        {appointment.schedule.startTime.slice(11,16)}{" "}
                        -{" "}
                        {appointment.schedule.endTime.slice(11,16)}
                      </p>
                    </div>
                  </div>
                  {/* Notes */}
                  {appointment.notes && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <div className="flex gap-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <p className="text-sm text-amber-800">
                          {appointment.notes}
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {activeTab === "REQUESTED" && (
                      <>
                        <button
                          disabled={loadingAppointmentId === appointment.id}
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "APPROVED")
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white transition-all duration-200 disabled:cursor-not-allowed ${
                            isApproving
                              ? "bg-green-700 scale-95"
                              : "bg-green-600 hover:bg-green-700 hover:scale-105 active:scale-95"
                          } disabled:opacity-60`}
                        >
                          {isApproving ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Approving...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Approve
                            </>
                          )}
                        </button>
                        <button
                          disabled={loadingAppointmentId === appointment.id}
                          onClick={() =>
                            handleStatusUpdate(appointment.id, "REJECTED")
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white transition-all duration-200 disabled:cursor-not-allowed ${
                            isRejecting
                              ? "bg-red-700 scale-95"
                              : "bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95"
                          } disabled:opacity-60`}
                        >
                          {isRejecting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4" />
                              Reject
                            </>
                          )}
                        </button>
                      </>
                    )}
                    {appointment.reportUrl && (
                      <Link
                        href={appointment.reportUrl}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition-all duration-200 hover:bg-blue-700 hover:scale-105 active:scale-95"
                      >
                        <FileText className="h-4 w-4" />
                        View Report
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}