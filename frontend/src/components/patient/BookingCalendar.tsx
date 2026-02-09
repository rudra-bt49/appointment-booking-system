"use client";
import { useState } from "react";

interface BookingCalendarProps {
  onSelectDate: (date: string) => void;
  availableDates: string[];
}

export default function BookingCalendar({
  onSelectDate,
  availableDates,
}: BookingCalendarProps) {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");

  const daysInMonth = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDayIndex = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const isPastDate = (date: string) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const t = new Date();
    t.setHours(0, 0, 0, 0);

    return d < t;
  };

  const isWeekend = (year: number, month: number, day: number) => {
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  };

  const handleDateClick = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;

    if (
      isPastDate(date) ||
      isWeekend(currentYear, currentMonth, day)
    )
      return;

    setSelectedDate(date);
    onSelectDate(date);
  };

  const changeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((y) => y - 1);
      } else {
        setCurrentMonth((m) => m - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((y) => y + 1);
      } else {
        setCurrentMonth((m) => m + 1);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => changeMonth("prev")}
          className="rounded-lg border px-3 py-1 font-semibold hover:bg-slate-100"
        >
          ◀
        </button>

        <h2 className="text-lg font-bold text-slate-800">
          {new Date(currentYear, currentMonth).toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() => changeMonth("next")}
          className="rounded-lg border px-3 py-1 font-semibold hover:bg-slate-100"
        >
          ▶
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-600">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({
          length: firstDayIndex === 0 ? 6 : firstDayIndex - 1,
        }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;

          const dateStr = `${currentYear}-${String(
            currentMonth + 1
          ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

          const disabled =
            isPastDate(dateStr) ||
            isWeekend(currentYear, currentMonth, day);

          const isSelected = selectedDate === dateStr;
          const isAvailable = availableDates.includes(dateStr);

          return (
            <button
              key={day}
              disabled={disabled}
              onClick={() => handleDateClick(day)}
              className={`
                relative rounded-lg py-2 font-semibold transition
                ${
                  disabled
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : isSelected
                    ? "bg-blue-600 text-white ring-2 ring-blue-500 ring-offset-2"
                    : isAvailable
                    ? "bg-green-50 text-green-700 border-2 border-green-500 hover:bg-green-100"
                    : "hover:bg-blue-100"
                }
              `}
            >
              {day}

              {/* Availability indicator */}
              {isAvailable && !isSelected && (
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-green-500 shadow-md" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
