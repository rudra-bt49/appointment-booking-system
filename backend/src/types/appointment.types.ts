import { AppointmentStatus } from "@prisma/client";

export interface CreateAppointmentRequest {
  doctorId: number;
  timeSlotId: number;
  notes?: string;
  reportUrl?: string | null;
}

export interface PatientAppointmentResponse {
  id: number;
  notes: string | null;
  reportUrl: string | null;
  status: AppointmentStatus;

  doctor: {
    fullName: string;
    specialization: string;
    fees: number;
  };

  schedule: {
    date: Date;
    startTime: Date;
    endTime: Date;
  };
}

export interface DoctorAppointmentResponse {
  id: number;
  status: AppointmentStatus;
  notes: string | null;
  reportUrl: string | null;

  patient: {
    fullName: string;
    phone: string | null;
  };

  schedule: {
    date: Date;
    startTime: Date;
    endTime: Date;
  };
}
