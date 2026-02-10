export interface IPatientAppointmentDoctor {
  fullName: string;
  specialization: string;
  fees: number;
}

export interface IPatientAppointmentSchedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface IPatientAppointment {
  id: number;
  notes: string | null;
  reportUrl: string | null;
  status: string;

  doctor: IPatientAppointmentDoctor;
  schedule: IPatientAppointmentSchedule;
}

export interface IGetMyAppointmentsResponse {
  message: string;
  data: IPatientAppointment[];
}