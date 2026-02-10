"use client";

import { useState } from "react";
import {
  TimeSlotUsageResponse,
  DateRangeType,
  DoctorAnalyticsData,
} from "@/types/doctorAnalytics.types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Clock } from "lucide-react";

interface TimeSlotsChartProps {
  data: DoctorAnalyticsData;
}

export default function TimeSlotsChart({ data }: TimeSlotsChartProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>("month");

  const getTimeSlotsData = (): TimeSlotUsageResponse[] => {
    switch (selectedRange) {
      case "today":
        return data.timeSlotsToday;
      case "week":
        return data.timeSlotsWeek;
      case "month":
        return data.timeSlotsMonth;
      case "all":
        return data.timeSlotsAll;
      default:
        return data.timeSlotsMonth;
    }
  };

  const timeSlotsData = getTimeSlotsData();

  const extractTime = (value: string | Date): string => {
    const str = typeof value === "string" ? value : value.toISOString();
    return str.slice(11, 16);
  };

  const chartData = timeSlotsData
    .map((slot) => ({
      timeSlot: `${extractTime(slot.startTime)} - ${extractTime(
        slot.endTime
      )}`,
      bookings: slot.count,
      startTime: new Date(slot.startTime).getTime(),
    }))
    .sort((a, b) => a.startTime - b.startTime);

  const totalBookings = timeSlotsData.reduce(
    (sum, slot) => sum + slot.count,
    0
  );

  const ranges: { value: DateRangeType; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "all", label: "All Time" },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-3 rounded-lg">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Time Slot Usage
            </h2>
            <p className="text-sm text-gray-600">
              Total Bookings: {totalBookings}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {ranges.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRange === range.value
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-80 flex items-center justify-center text-gray-500">
          No time slot data available for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              type="category"
              dataKey="timeSlot"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              axisLine={{ stroke: "#e5e7eb" }}
              width={160}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number" ? value : Number(value ?? 0);
                return [numericValue, "Bookings"];
              }}
              labelStyle={{ color: "#374151", fontWeight: 600 }}
            />
            <Legend />
            <Bar
              dataKey="bookings"
              fill="url(#colorSlots)"
              radius={[0, 8, 8, 0]}
              name="Bookings"
            />
            <defs>
              <linearGradient id="colorSlots" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f97316" stopOpacity={1} />
                <stop offset="100%" stopColor="#fb923c" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
