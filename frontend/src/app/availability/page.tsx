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

  const fetchSlots = async (date: string) => {
    try {
      setLoading(true);
      localStorage.removeItem("doctorAvailabilityId");

      const res = await availabilityService.getSlotsByDoctorAndDate(date);

      if (res.data.availabilityId) {
        localStorage.setItem(
          "doctorAvailabilityId",
          String(res.data.availabilityId)
        );
      }

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

  const handleDelete = async (slotId?: number) => {
    if (!slotId) return;
    await availabilityService.deleteTimeSlot(slotId);
    fetchSlots(selectedDate);
  };

  const addRow = () => {
    setNewSlots([...newSlots, { startTime: "", endTime: "" }]);
  };

  const removeRow = (index: number) => {
    setNewSlots(newSlots.filter((_, i) => i !== index));
  };

  const updateRow = (
    index: number,
    key: "startTime" | "endTime",
    value: string
  ) => {
    const copy = [...newSlots];

    if (key === "startTime") {
      copy[index].startTime = value;

      if (value) {
        const [h, m] = value.split(":").map(Number);
        const date = new Date();
        date.setHours(h);
        date.setMinutes(m + 30);
        date.setSeconds(0);

        const endH = String(date.getHours()).padStart(2, "0");
        const endM = String(date.getMinutes()).padStart(2, "0");

        copy[index].endTime = `${endH}:${endM}`;
      } else {
        copy[index].endTime = "";
      }
    } else {
      copy[index][key] = value;
    }

    setNewSlots(copy);
  };

  const handleCreateSlots = async () => {
    if (!localStorage.getItem("doctorAvailabilityId")) {
      await availabilityService.createAvailability({ date: selectedDate });
    }

    await availabilityService.createTimeSlots({ slots: newSlots });

    setShowCreate(false);
    setNewSlots([{ startTime: "", endTime: "" }]);
    fetchSlots(selectedDate);
  };

  const formatTime = (iso: string) => iso.slice(11, 16);

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6">
      <h1 className="mb-8 text-3xl font-semibold text-gray-900">
        Doctor Availability
      </h1>

      {/* Date Picker */}
      <div className="mb-8">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Select Date
        </label>
        <input
          type="date"
          value={selectedDate}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full max-w-sm rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Time Slots */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            Time Slots
          </h2>
          <button
            onClick={() => setShowCreate(true)}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Create Slots
          </button>
        </div>

        {loading && (
          <p className="text-sm text-gray-500">Loading slots…</p>
        )}

        {!loading && slots.length === 0 && (
          <p className="text-sm text-gray-500">
            No slots available for this date.
          </p>
        )}

        <div className="space-y-4">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4"
            >
              <span className="text-base font-semibold text-gray-800">
                {formatTime(slot.startTime)} → {formatTime(slot.endTime)}
              </span>
              <button
                onClick={() => handleDelete(slot.id)}
                className="text-sm font-medium text-red-600 hover:text-red-700"
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
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-6 text-lg font-semibold text-gray-900">
              Create Slots
            </h3>

            <div className="space-y-6">
              {newSlots.map((slot, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-200 p-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={slot.startTime}
                        onChange={(e) =>
                          updateRow(i, "startTime", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        End Time (Auto 30 mins)
                      </label>
                      <input
                        type="time"
                        value={slot.endTime}
                        readOnly
                        className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-2 text-sm"
                      />
                    </div>
                  </div>

                  {newSlots.length > 1 && (
                    <div className="mt-3 text-right">
                      <button
                        onClick={() => removeRow(i)}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Remove slot
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={addRow}
              className="mt-4 text-sm font-medium text-blue-600 hover:underline"
            >
              + Add another slot
            </button>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSlots}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
