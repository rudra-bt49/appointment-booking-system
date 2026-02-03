import { ISuccessResponse } from "./successResponse.types";

export interface ICreateAppointmentRequest {
    doctorId: number;
    timeSlotId: number;
    notes: string;
    report?: File;
}

export interface IRequestedDoctor {
    id?: number;
    userId?: number;
    specialization?: string;
    experience?: number;
    bio?: string;
    fees: number;
    isAvailable: boolean;
    createdAt?: string;
    updatedAt?: string;
    user: {
        fullName: string;
        email:string
    }
}

export interface IRequestedTimeSlot {
    id?: number;
    availabilityId?: number;
    startTime: string;
    endTime: string;
    isBooked: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAppointmentData {
    id?: number;
    doctorId?: number;
    patientId?: number;
    timeSlotId?: number;
    status: string;
    notes: string;
    createdAt?: string;
    updatedAt?: string;
    doctor: IRequestedDoctor;
    timeSlot: IRequestedTimeSlot
}

export interface ICreateAppointmentResponse extends ISuccessResponse {
    data: IAppointmentData
}