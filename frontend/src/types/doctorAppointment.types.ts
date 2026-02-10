import { ISuccessResponse } from "./successResponse.types";


export interface DoctorAppointment {
    id: number,
    status: string,
    notes: string,
    reportUrl: string | null,
    patient: {
        fullName: string,
        phone: string
    },
    schedule: {
        date: string,
        startTime: string,
        endTime: string,
    }
}
export interface DoctorAppointmentApiResponse extends ISuccessResponse {
  data: DoctorAppointment[],
};