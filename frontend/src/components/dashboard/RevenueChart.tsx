"use client";
import { useState } from "react";
import {
  RevenueByDateResponse,
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
import { TrendingUp } from "lucide-react";

interface RevenueChartProps {
  data: DoctorAnalyticsData;
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [selectedRange, setSelectedRange] = useState<DateRangeType>("month");

  const getRevenueData = (): RevenueByDateResponse[] => {
    switch (selectedRange) {
      case "today":
        return data.revenueToday;
      case "week":
        return data.revenueWeek;
      case "month":
        return data.revenueMonth;
      case "all":
        return data.revenueAll;
      default:
        return data.revenueMonth;
    }
  };

  const revenueData = getRevenueData();

  const chartData = revenueData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
    revenue: item.totalRevenue,
  }));

  const totalRevenue = revenueData.reduce(
    (sum, item) => sum + item.totalRevenue,
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
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 rounded-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Revenue Analytics
            </h2>
            <p className="text-sm text-gray-600">
              Total: ₹{totalRevenue.toLocaleString()}
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
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
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
          No revenue data available for this period
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 12 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickFormatter={(value) => `₹${value}`}
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
                return [`₹${numericValue.toLocaleString()}`, "Revenue"];
              }}
              labelStyle={{ color: "#374151", fontWeight: 600 }}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="url(#colorRevenue)"
              radius={[8, 8, 0, 0]}
              name="Revenue"
            />
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
