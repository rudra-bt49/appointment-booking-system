// types/doctorAnalytics.types.ts

/* ---------------- PATIENT LISTING ---------------- */
export interface PatientListingResponse {
  patientId: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  gender: string;
  dateOfBirth?: Date;
}

/* ---------------- REVENUE ---------------- */
export interface RevenueByDateResponse {
  date: string;
  totalRevenue: number;
}

/* ---------------- APPOINTMENT STATUS ---------------- */
export interface AppointmentStatusCountResponse {
  status: string;
  count: number;
}

/* ---------------- TIME SLOT ---------------- */
export interface TimeSlotUsageResponse {
  timeSlotId: number;
  startTime: Date;
  endTime: Date;
  count: number;
}

/* ---------------- API RESPONSE WRAPPERS ---------------- */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

/* ---------------- AGGREGATED ANALYTICS DATA ---------------- */
export interface DoctorAnalyticsData {
  patients: PatientListingResponse[];
  revenueAll: RevenueByDateResponse[];
  revenueToday: RevenueByDateResponse[];
  revenueWeek: RevenueByDateResponse[];
  revenueMonth: RevenueByDateResponse[];
  appointmentStatusAll: AppointmentStatusCountResponse[];
  appointmentStatusToday: AppointmentStatusCountResponse[];
  appointmentStatusWeek: AppointmentStatusCountResponse[];
  appointmentStatusMonth: AppointmentStatusCountResponse[];
  timeSlotsAll: TimeSlotUsageResponse[];
  timeSlotsToday: TimeSlotUsageResponse[];
  timeSlotsWeek: TimeSlotUsageResponse[];
  timeSlotsMonth: TimeSlotUsageResponse[];
}

export type DateRangeType = "today" | "week" | "month" | "all";