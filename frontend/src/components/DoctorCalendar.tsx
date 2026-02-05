"use client";

export default function DoctorCalendar({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  const today = new Date().toISOString().split("T")[0];

  return (
    <input
      type="date"
      value={value}
      min={today}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border px-4 py-2"
    />
  );
}
