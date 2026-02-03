"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getDoctorById,
  getSlotsByDoctorAndDate,
  requestAppointment,
} from "@/services/appointment.service";
import BackButton from "@/components/common/BackButton";

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
}

export default function RequestAppointmentPage() {
  const searchParams = useSearchParams();
  const doctorUserId = searchParams.get("doctorUserId");

  const [doctorProfileId, setDoctorProfileId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /* --------------------------------------------
     STEP 1: Fetch doctorProfileId
  --------------------------------------------- */
  useEffect(() => {
    if (!doctorUserId) return;

    const fetchDoctor = async () => {
      try {
        const res = await getDoctorById(doctorUserId);
        setDoctorProfileId(res.data.doctorProfileId);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDoctor();
  }, [doctorUserId]);

  /* --------------------------------------------
     STEP 2: Fetch slots
  --------------------------------------------- */
  const handleDateChange = async (date: string) => {
    if (!doctorProfileId) return;

    setSelectedDate(date);
    setSelectedSlotId(null);

    try {
      const res = await getSlotsByDoctorAndDate(doctorProfileId, date);
      setSlots(res?.data?.data?.slots ?? []);
    } catch {
      setSlots([]);
    }
  };

  /* --------------------------------------------
     STEP 3: Submit appointment
  --------------------------------------------- */
  const handleSubmit = async () => {
    if (!doctorProfileId || !selectedSlotId || !notes.trim()) return;

    if (reportFile && reportFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    try {
      setLoading(true);

      await requestAppointment(
        doctorProfileId,
        selectedSlotId,
        notes,
        reportFile ?? undefined
      );

      window.location.href = "/patientAppointments";
    } catch {
      alert("Appointment already booked");
    } finally {
      setLoading(false);
    }
  };

  const isSubmitEnabled =
    Boolean(selectedDate) &&
    Boolean(selectedSlotId) &&
    Boolean(notes.trim());

  /* --------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-10 shadow ring-1 ring-slate-200">
        {/* ✅ Shared Back Button */}
        <BackButton />

        <h1 className="mb-6 text-3xl font-extrabold text-slate-900">
          Request Appointment
        </h1>

        {/* DATE */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Select Date
          </label>
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
          />
        </div>

        {/* TIME SLOTS */}
        {selectedDate && (
          <div className="mb-8">
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Available Time Slots
            </h2>

            {slots.length === 0 ? (
              <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-center">
                <p className="text-lg font-bold text-red-700">
                  No slots available for this date.
                </p>
                <p className="mt-1 font-semibold text-red-600">
                  Please select another date.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={`rounded-xl border px-4 py-3 font-semibold transition ${
                      selectedSlotId === slot.id
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-300 hover:border-blue-400"
                    }`}
                  >
                    {slot.startTime.slice(11, 16)} →{" "}
                    {slot.endTime.slice(11, 16)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTES */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Notes for Doctor
          </label>
          <textarea
            rows={4}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* PDF UPLOAD */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Upload Report (PDF only)
          </label>

          <div className="space-y-3">
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 hover:border-blue-400">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 font-bold text-red-600">
                PDF
              </div>

              <div className="flex-1 text-sm text-slate-600">
                {reportFile ? (
                  <span className="font-semibold text-slate-800">
                    {reportFile.name}
                  </span>
                ) : (
                  "Click to upload medical report"
                )}
              </div>

              <input
                type="file"
                accept="application/pdf"
                hidden
                onChange={(e) =>
                  setReportFile(e.target.files ? e.target.files[0] : null)
                }
              />
            </label>

            {reportFile && (
              <button
                type="button"
                onClick={() => setReportFile(null)}
                className="text-sm font-semibold text-red-600 hover:underline"
              >
                Remove uploaded PDF
              </button>
            )}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          disabled={!isSubmitEnabled || loading}
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Requesting..." : "Request Appointment"}
        </button>
      </div>
    </div>
  );
}
