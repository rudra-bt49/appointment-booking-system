"use client";
import { DoctorAnalyticsData } from "@/types/doctorAnalytics.types";
import {
  Users,
  DollarSign,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
} from "lucide-react";

interface SummaryCardsProps {
  data: DoctorAnalyticsData;
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const totalRevenue = data.revenueAll.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const todayRevenue = data.revenueToday.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  );
  const totalAppointments = data.appointmentStatusAll.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const totalPatients = data.patients.length;

  const cards = [
    {
      title: "Total Patients",
      value: totalPatients,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Total Appointments",
      value: totalAppointments,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Time Slots Used",
      value: data.timeSlotsAll.reduce((sum, slot) => sum + slot.count, 0),
      icon: Clock,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Active This Week",
      value: data.appointmentStatusWeek.reduce(
        (sum, item) => sum + item.count,
        0
      ),
      icon: Activity,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 group animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {card.value}
                </h3>
              </div>
              <div
                className={`${card.bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className={`w-6 h-6 ${card.textColor}`} />
              </div>
            </div>
            <div className={`h-1 w-full bg-gradient-to-r ${card.color} rounded-full mt-4`}></div>
          </div>
        );
      })}
    </div>
  );
}