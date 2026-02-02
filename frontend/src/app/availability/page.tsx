"use client";

import { useEffect, useState } from "react";
import { availabilityService } from "@/services/availability.service";
import { ITimeSlot } from "@/types/availability.types";

export default function AvailabilityPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() =>
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<ITimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newSlots, setNewSlots] = useState<ITimeSlot[]>([
    { startTime: "", endTime: "" },
  ]);

  // ===============================
  // FETCH SLOTS FOR DATE
  // ===============================
  const fetchSlots = async (date: string) => {
    try {
      setLoading(true);
      const res = await availabilityService.getSlotsByDoctorAndDate(date);
      localStorage.setItem(
        "doctorAvailabilityId",
        String(res.data.availabilityId)
      );
      setSlots(res.data.slots);
    } catch {
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots(selectedDate);
  }, [selectedDate]);

  // ===============================
  // DELETE SLOT
  // ===============================
  const handleDelete = async (slotId?: number) => {
    if (!slotId) return;
    await availabilityService.deleteTimeSlot(slotId);
    fetchSlots(selectedDate);
  };

  // ===============================
  // ADD SLOT ROW
  // ===============================
  const addRow = () => {
    setNewSlots([...newSlots, { startTime: "", endTime: "" }]);
  };

  // ===============================
  // UPDATE SLOT ROW
  // ===============================
  const updateRow = (index: number, key: "startTime" | "endTime", value: string) => {
    const copy = [...newSlots];
    copy[index][key] = value;
    setNewSlots(copy);
  };

  // ===============================
  // CREATE AVAILABILITY + SLOTS
  // ===============================
  const handleCreateSlots = async () => {
    if(!localStorage.getItem("doctorAvailabilityId")) {
      await availabilityService.createAvailability({ date: selectedDate });
    }
    await availabilityService.createTimeSlots({ slots: newSlots });

    setShowCreate(false);
    setNewSlots([{ startTime: "", endTime: "" }]);
    fetchSlots(selectedDate);
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-6 text-2xl font-semibold">Doctor Availability</h1>

      {/* Calendar */}
      <div className="mb-6">
        <label className="mb-2 block font-medium">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full rounded-lg border p-2 sm:w-64"
        />
      </div>

      {/* Slots */}
      <div className="rounded-xl border p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium">Time Slots</h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
          >
            Create Slots
          </button>
        </div>

        {loading && <p className="text-gray-500">Loading slots...</p>}

        {!loading && slots.length === 0 && (
          <p className="text-gray-500">No slots available for this date.</p>
        )}

        <div className="grid gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <span className="text-sm">
                {slot.startTime} - {slot.endTime}
              </span>
              <button
                onClick={() => handleDelete(slot.id)}
                className="text-sm text-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE SLOTS MODAL */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6">
            <h3 className="mb-4 text-lg font-semibold">Create Slots</h3>

            <div className="space-y-3">
              {newSlots.map((slot, i) => (
                <div key={i} className="grid grid-cols-2 gap-3">
                  <input
                    type="time"
                    value={slot.startTime}
                    onChange={(e) => updateRow(i, "startTime", e.target.value)}
                    className="rounded-lg border p-2"
                  />
                  <input
                    type="time"
                    value={slot.endTime}
                    onChange={(e) => updateRow(i, "endTime", e.target.value)}
                    className="rounded-lg border p-2"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="mt-3 text-sm text-blue-600"
            >
              + Add another slot
            </button>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSlots}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
