"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  getDoctorById,
  requestAppointment,
} from "@/services/appointment.service";
import { availabilityService } from "@/services/availability.service";
import BackButton from "@/components/common/BackButton";
import BookingCalendar from "@/components/patient/BookingCalendar";
import { IDoctorAvailability } from "@/types/availability.types";

interface Slot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export default function RequestAppointmentPage() {
  const searchParams = useSearchParams();
  const doctorUserId: string | null =
    searchParams.get("doctorUserId");

  const [doctorProfileId, setDoctorProfileId] = useState<
    number | undefined
  >(undefined);

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<
    number | null
  >(null);
  const [notes, setNotes] = useState<string>("");
  const [reportFile, setReportFile] = useState<File | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  /* --------------------------------------------
     STEP 1: Fetch doctorProfileId
  --------------------------------------------- */
  useEffect(() => {
    if (!doctorUserId) return;

    const fetchDoctor = async (): Promise<void> => {
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
     STEP 2: Fetch slots (FIXED)
  --------------------------------------------- */
  const handleDateChange = async (
    date: string
  ): Promise<void> => {
    if (!doctorProfileId) return;

    setSelectedDate(date);
    setSelectedSlotId(null);

    try {
      const res =
        await availabilityService.getSlotsByDoctorAndDate(
          doctorProfileId,
          date
        );

      const availabilities: IDoctorAvailability[] =
        res.data ?? [];

      // 🔑 FLATTEN slots from all availability blocks
      const allSlots = availabilities.flatMap(
        (a) => a.timeSlots
      );

      setSlots(allSlots);
    } catch {
      setSlots([]);
    }
  };

  /* --------------------------------------------
     STEP 3: Submit appointment
  --------------------------------------------- */
  const handleSubmit = async (): Promise<void> => {
    if (!doctorProfileId || !selectedSlotId || !notes.trim())
      return;

    if (
      reportFile &&
      reportFile.type !== "application/pdf"
    ) {
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

  const isSubmitEnabled: boolean =
    Boolean(selectedDate) &&
    Boolean(selectedSlotId) &&
    Boolean(notes.trim());

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-10 shadow ring-1 ring-slate-200">
        <BackButton />

        <h1 className="mb-8 text-3xl font-extrabold text-slate-900">
          Request Appointment
        </h1>

        {/* CALENDAR + SLOTS */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <BookingCalendar onSelectDate={handleDateChange} />

          {selectedDate && (
            <div>
              <h2 className="mb-4 text-lg font-bold text-slate-800">
                Available Time Slots
              </h2>

              {slots.length === 0 ? (
                <div className="rounded-xl border border-dashed border-red-300 bg-red-50 p-6 text-center">
                  <p className="text-lg font-bold text-red-700">
                    No slots available
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() =>
                        setSelectedSlotId(slot.id)
                      }
                      className={`rounded-xl border px-4 py-3 font-semibold transition ${
                        !slot.isAvailable
                          ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                          : selectedSlotId === slot.id
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
        </div>

        {/* NOTES */}
        <div className="mt-10">
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
        <div className="mt-8">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Upload Report (PDF only)
          </label>

          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              setReportFile(
                e.target.files ? e.target.files[0] : null
              )
            }
          />
        </div>

        {/* SUBMIT */}
        <button
          disabled={!isSubmitEnabled || loading}
          onClick={handleSubmit}
          className="mt-10 w-full rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white disabled:opacity-50"
        >
          {loading ? "Requesting..." : "Request Appointment"}
        </button>
      </div>
    </div>
  );
}
