// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { doctorAnalyticsService } from "@/services/doctorAnalytics.service";
import { DoctorAnalyticsData } from "@/types/doctorAnalytics.types";
import SummaryCards from "@/components/dashboard/SummaryCards";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AppointmentStatusChart from "@/components/dashboard/AppointmentStatusChart";
import TimeSlotsChart from "@/components/dashboard/TimeSlotsChart";
import PatientListingModal from "@/components/dashboard/PatientListingModal";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [analyticsData, setAnalyticsData] = useState<DoctorAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await doctorAnalyticsService.getAllAnalytics();
      setAnalyticsData(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err instanceof Error ? err.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !analyticsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full text-center animate-fadeIn">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h2>
          
          <p className="text-gray-600 mb-6">
            We could not load your dashboard data. This might be a temporary issue.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-700 font-mono break-all">
              {error || "Unknown error occurred"}
            </p>
          </div>

          <button
            onClick={fetchDashboardData}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>

          <p className="text-sm text-gray-500 mt-4">
            If this problem persists, please contact support
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-3 rounded-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Doctor Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track your performance and patient insights
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={analyticsData} />

      {/* Patient Listing Button */}
      <div className="mb-8 animate-fadeIn">
        <PatientListingModal patients={analyticsData.patients} />
      </div>

      {/* Charts Section */}
      <div className="space-y-6">
        {/* Revenue Chart - Full Width */}
        <div className="animate-slideUp">
          <RevenueChart data={analyticsData} />
        </div>

        {/* Appointment Status and Time Slots - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppointmentStatusChart data={analyticsData} />
          <TimeSlotsChart data={analyticsData} />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 text-center text-gray-500 text-sm animate-fadeIn">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}