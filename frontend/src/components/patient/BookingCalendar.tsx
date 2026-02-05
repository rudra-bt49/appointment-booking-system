"use client";

import { useState } from "react";

interface BookingCalendarProps {
  onSelectDate: (date: string) => void;
}

export default function BookingCalendar({
  onSelectDate,
}: BookingCalendarProps) {
  const today = new Date();

  const [currentYear, setCurrentYear] = useState<number>(
    today.getFullYear()
  );
  const [currentMonth, setCurrentMonth] = useState<number>(
    today.getMonth()
  );
  const [selectedDate, setSelectedDate] = useState<string>("");

  const daysInMonth: number = new Date(
    currentYear,
    currentMonth + 1,
    0
  ).getDate();

  const firstDayIndex: number = new Date(
    currentYear,
    currentMonth,
    1
  ).getDay();

  const isPastDate = (date: string): boolean => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const t = new Date();
    t.setHours(0, 0, 0, 0);

    return d < t;
  };

  const isWeekend = (
    year: number,
    month: number,
    day: number
  ): boolean => {
    const d = new Date(year, month, day).getDay();
    return d === 0 || d === 6;
  };

  const handleDateClick = (day: number): void => {
    const date = `${currentYear}-${String(
      currentMonth + 1
    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    if (
      isPastDate(date) ||
      isWeekend(currentYear, currentMonth, day)
    )
      return;

    setSelectedDate(date);
    onSelectDate(date);
  };

  const changeMonth = (direction: "prev" | "next"): void => {
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
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => changeMonth("prev")}
          className="rounded-lg border px-3 py-1 text-sm font-semibold hover:bg-slate-100"
        >
          ◀
        </button>

        <h2 className="text-lg font-bold text-slate-800">
          {new Date(currentYear, currentMonth).toLocaleString(
            "default",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </h2>

        <button
          type="button"
          onClick={() => changeMonth("next")}
          className="rounded-lg border px-3 py-1 text-sm font-semibold hover:bg-slate-100"
        >
          ▶
        </button>
      </div>

      {/* DAY HEADERS */}
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-slate-600">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
          (d) => (
            <div key={d}>{d}</div>
          )
        )}
      </div>

      {/* DATES */}
      <div className="mt-2 grid grid-cols-7 gap-2">
        {Array.from({
          length:
            firstDayIndex === 0 ? 6 : firstDayIndex - 1,
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

          return (
            <button
              key={day}
              type="button"
              disabled={disabled}
              onClick={() => handleDateClick(day)}
              className={`rounded-lg py-2 font-semibold transition
                ${
                  disabled
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : isSelected
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-100"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
