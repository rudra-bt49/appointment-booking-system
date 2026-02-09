// services/doctorAnalytics.service.ts
import axiosInstance from "../config/axios";
import {
  ApiResponse,
  PatientListingResponse,
  RevenueByDateResponse,
  AppointmentStatusCountResponse,
  TimeSlotUsageResponse,
  DoctorAnalyticsData,
} from "@/types/doctorAnalytics.types";

const ANALYTICS_BASE = "/doctor/analytics";

export const doctorAnalyticsService = {
  /* ---------------- PATIENTS ---------------- */
  async getPatients(): Promise<PatientListingResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<PatientListingResponse[]>
    >(`${ANALYTICS_BASE}/patients`);
    return response.data.data;
  },

  /* ---------------- REVENUE ---------------- */
  async getRevenueAll(): Promise<RevenueByDateResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<RevenueByDateResponse[]>
    >(`${ANALYTICS_BASE}/revenue`);
    return response.data.data;
  },

  async getRevenueToday(): Promise<RevenueByDateResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<RevenueByDateResponse[]>
    >(`${ANALYTICS_BASE}/revenue/today`);
    return response.data.data;
  },

  async getRevenueWeek(): Promise<RevenueByDateResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<RevenueByDateResponse[]>
    >(`${ANALYTICS_BASE}/revenue/week`);
    return response.data.data;
  },

  async getRevenueMonth(): Promise<RevenueByDateResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<RevenueByDateResponse[]>
    >(`${ANALYTICS_BASE}/revenue/month`);
    return response.data.data;
  },

  /* ---------------- APPOINTMENT STATUS ---------------- */
  async getAppointmentStatusAll(): Promise<AppointmentStatusCountResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<AppointmentStatusCountResponse[]>
    >(`${ANALYTICS_BASE}/appointment-status`);
    return response.data.data;
  },

  async getAppointmentStatusToday(): Promise<
    AppointmentStatusCountResponse[]
  > {
    const response = await axiosInstance.post<
      ApiResponse<AppointmentStatusCountResponse[]>
    >(`${ANALYTICS_BASE}/appointment-status/today`);
    return response.data.data;
  },

  async getAppointmentStatusWeek(): Promise<AppointmentStatusCountResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<AppointmentStatusCountResponse[]>
    >(`${ANALYTICS_BASE}/appointment-status/week`);
    return response.data.data;
  },

  async getAppointmentStatusMonth(): Promise<
    AppointmentStatusCountResponse[]
  > {
    const response = await axiosInstance.post<
      ApiResponse<AppointmentStatusCountResponse[]>
    >(`${ANALYTICS_BASE}/appointment-status/month`);
    return response.data.data;
  },

  /* ---------------- TIME SLOTS ---------------- */
  async getTimeSlotsAll(): Promise<TimeSlotUsageResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<TimeSlotUsageResponse[]>
    >(`${ANALYTICS_BASE}/time-slots`);
    return response.data.data;
  },

  async getTimeSlotsToday(): Promise<TimeSlotUsageResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<TimeSlotUsageResponse[]>
    >(`${ANALYTICS_BASE}/time-slots/today`);
    return response.data.data;
  },

  async getTimeSlotsWeek(): Promise<TimeSlotUsageResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<TimeSlotUsageResponse[]>
    >(`${ANALYTICS_BASE}/time-slots/week`);
    return response.data.data;
  },

  async getTimeSlotsMonth(): Promise<TimeSlotUsageResponse[]> {
    const response = await axiosInstance.post<
      ApiResponse<TimeSlotUsageResponse[]>
    >(`${ANALYTICS_BASE}/time-slots/month`);
    return response.data.data;
  },

  /* ---------------- FETCH ALL ANALYTICS ---------------- */
  async getAllAnalytics(): Promise<DoctorAnalyticsData> {
    const [
      patients,
      revenueAll,
      revenueToday,
      revenueWeek,
      revenueMonth,
      appointmentStatusAll,
      appointmentStatusToday,
      appointmentStatusWeek,
      appointmentStatusMonth,
      timeSlotsAll,
      timeSlotsToday,
      timeSlotsWeek,
      timeSlotsMonth,
    ] = await Promise.all([
      this.getPatients(),
      this.getRevenueAll(),
      this.getRevenueToday(),
      this.getRevenueWeek(),
      this.getRevenueMonth(),
      this.getAppointmentStatusAll(),
      this.getAppointmentStatusToday(),
      this.getAppointmentStatusWeek(),
      this.getAppointmentStatusMonth(),
      this.getTimeSlotsAll(),
      this.getTimeSlotsToday(),
      this.getTimeSlotsWeek(),
      this.getTimeSlotsMonth(),
    ]);

    return {
      patients,
      revenueAll,
      revenueToday,
      revenueWeek,
      revenueMonth,
      appointmentStatusAll,
      appointmentStatusToday,
      appointmentStatusWeek,
      appointmentStatusMonth,
      timeSlotsAll,
      timeSlotsToday,
      timeSlotsWeek,
      timeSlotsMonth,
    };
  },
};