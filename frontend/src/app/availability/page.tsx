"use client";
import { useEffect, useState, useRef } from "react";
import { Calendar, Clock, Plus, Trash2, X, AlertCircle } from "lucide-react";
import DoctorCalendar from "@/components/DoctorCalendar";
import { availabilityService } from "@/services/availability.service";
import { getLoggedInDoctorProfileId } from "@/services/doctorIdentity.service";
import { ITimeSlot, IDoctorAvailability } from "@/types/availability.types";

export default function AvailabilityPage() {
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<ITimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [startDuration, setStartDuration] = useState("");
  const [endDuration, setEndDuration] = useState("");
  const [validationError, setValidationError] = useState("");

  const createSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLoggedInDoctorProfileId()
      .then(setDoctorId)
      .catch(() => setDoctorId(null));
  }, []);

  useEffect(() => {
    if (!doctorId) return;
    availabilityService
      .getSlotsByDoctorAndDate(doctorId, date)
      .then((res) => {
        const availabilities = res.data ?? [];
        const allSlots = availabilities.flatMap(
          (a: IDoctorAvailability) => a.timeSlots
        );
        setSlots(allSlots);
      })
      .catch(() => setSlots([]))
      .finally(() => setLoading(false));
  }, [doctorId, date]);

  const validateTimeSlots = (start: string, end: string): string => {
    if (!start || !end) return "Please select both start and end times";

    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const duration = eh * 60 + em - (sh * 60 + sm);

    if (duration <= 0) return "End time must be after start time";
    if (duration < 60) return "Minimum slot duration is 1 hour";
    if (duration > 720) return "Maximum slot duration is 12 hours";

    return "";
  };

  const generateSlots = async () => {
    if (!doctorId) return;

    const error = validateTimeSlots(startDuration, endDuration);
    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError("");

    await availabilityService.createAvailability({
      date,
      startDuration,
      endDuration,
    });

    const res = await availabilityService.getSlotsByDoctorAndDate(
      doctorId,
      date
    );

    const availabilities = res.data ?? [];
    setSlots(availabilities.flatMap(a => a.timeSlots));

    setShowCreate(false);
    setStartDuration("");
    setEndDuration("");
  };

  const deleteSlot = async (slotId: number) => {
    await availabilityService.deleteTimeSlot(slotId);
    setSlots(prev => prev.filter(s => s.id !== slotId));
  };

  const handleShowCreate = () => {
    setShowCreate(true);
    setTimeout(() => {
      createSectionRef.current?.scrollIntoView({ 
        behavior: "smooth", 
        block: "start" 
      });
    }, 100);
  };

  const handleCancelCreate = () => {
    setShowCreate(false);
    setStartDuration("");
    setEndDuration("");
    setValidationError("");
  };

  const formatTime = (iso: string) => {
    const time = iso.slice(11, 16);
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            Availability Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your consultation time slots
          </p>
        </div>

        {/* Calendar Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Select Date
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {formatDate(date)}
            </p>
          </div>
          <DoctorCalendar value={date} onChange={setDate} />
        </div>

        {/* Time Slots Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                Available Time Slots
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {slots.length} slot{slots.length !== 1 ? "s" : ""} available
              </p>
            </div>
            {!showCreate && (
              <button
                onClick={handleShowCreate}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
              >
                <Plus className="w-5 h-5" />
                Create Slots
              </button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && slots.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                No slots available for this date
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {`Click "Create Slots" to add availability`}
              </p>
            </div>
          )}

          {!loading && slots.length > 0 && (
            <div className="grid gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-5 py-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 rounded-lg p-2">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {formatTime(slot.startTime)} → {formatTime(slot.endTime)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {slot.isAvailable ? "Available for booking" : "Slot booked"}
                      </p>
                    </div>
                  </div>
                  {slot.isAvailable ? (
                    <button
                      onClick={() => deleteSlot(slot.id)}
                      className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  ) : (
                    <div className="flex flex-col items-end">
                      <button
                        disabled
                        className="flex items-center gap-2 text-gray-400 bg-gray-100 px-4 py-2 rounded-lg font-medium cursor-not-allowed"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                      <p className="text-xs text-gray-500 mt-1">Slot booked</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Slots Card */}
        {showCreate && (
          <div 
            ref={createSectionRef}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-4 duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-green-600" />
                  Create Availability Slots
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Define your working hours for {formatDate(date)}
                </p>
              </div>
              <button
                onClick={handleCancelCreate}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={startDuration}
                    onChange={(e) => {
                      setStartDuration(e.target.value);
                      setValidationError("");
                    }}
                    placeholder="e.g., 09:00 AM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Select your starting time (e.g., 09:00 AM)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={endDuration}
                    onChange={(e) => {
                      setEndDuration(e.target.value);
                      setValidationError("");
                    }}
                    placeholder="e.g., 05:00 PM"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-700"
                  />
                  <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Select your ending time (e.g., 05:00 PM)
                </p>
              </div>
            </div>

            {validationError && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">
                    Validation Error
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    {validationError}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Requirements:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700">
                    <li>Minimum slot duration: 1 hour</li>
                    <li>Maximum slot duration: 12 hours</li>
                    <li>End time must be after start time</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={generateSlots}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Generate Slots
            </button>
          </div>
        )}
      </div>
    </div>
  );
}