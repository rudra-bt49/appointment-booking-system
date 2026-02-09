// components/dashboard/AppointmentStatusChart.tsx
"use client";
import { useState } from "react";
import {
  AppointmentStatusCountResponse,
  DateRangeType,
  DoctorAnalyticsData,
} from "@/types/doctorAnalytics.types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";
import { Calendar } from "lucide-react";

interface AppointmentStatusChartProps {
  data: DoctorAnalyticsData;
}

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "#3b82f6",
  COMPLETED: "#10b981",
  CANCELLED: "#ef4444",
  RESCHEDULED: "#f59e0b",
  PENDING: "#8b5cf6",
  NO_SHOW: "#6b7280",
};

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Scheduled",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  RESCHEDULED: "Rescheduled",
  PENDING: "Pending",
  NO_SHOW: "No Show",
};

export default function AppointmentStatusChart({
  data,
}: AppointmentStatusChartProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>("month");

  const getStatusData = (): AppointmentStatusCountResponse[] => {
    switch (selectedRange) {
      case "today":
        return data.appointmentStatusToday;
      case "week":
        return data.appointmentStatusWeek;
      case "month":
        return data.appointmentStatusMonth;
      case "all":
        return data.appointmentStatusAll;
      default:
        return data.appointmentStatusMonth;
    }
  };

  const statusData = getStatusData();

  const chartData = statusData.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    status: item.status,
  }));

  const totalAppointments = statusData.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const ranges: { value: DateRangeType; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "Week" },
    { value: "month", label: "Month" },
    { value: "all", label: "All Time" },
  ];

  const renderCustomLabel = (props: PieLabelRenderProps) => {
    const percent = props.percent ?? 0;
    const name = String(props.name ?? "");
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-3 rounded-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Status
            </h2>
            <p className="text-sm text-gray-600">
              Total: {totalAppointments} appointments
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
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
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
          No appointment data available for this period
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="w-full lg:w-2/3">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={STATUS_COLORS[entry.status] || "#94a3b8"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full lg:w-1/3 space-y-3">
            {chartData.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[entry.status] || "#94a3b8",
                    }}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {entry.name}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
