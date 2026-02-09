// types/doctorAnalytics.types.ts

export interface DoctorAnalyticsRequest {
  doctorId: number;
}

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
