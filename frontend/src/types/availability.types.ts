import { ISuccessResponse } from "./successResponse.types";

export interface IDoctorAvailability {
    id: number;
    doctorId: number;
    date: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreateAvailabilityRequest {
    date: string;
}

export interface ICreateAvailabilityResponse extends ISuccessResponse {
    data: IDoctorAvailability;
}

export interface ITimeSlot {
    id?: number;
    startTime: string;
    endTime: string;
    isBooked?: boolean;
}

export interface ICreateTimeSlotsRequest {
    slots: ITimeSlot[];
}

export interface ICreateTimeSlotsResponse extends ISuccessResponse {
    data: { count: number };
}

export interface IGetSlotsByDateRequest {
    doctorId: number;
    date: string;
}

export interface IGetSlotsByDateResponse extends ISuccessResponse {
    data: { slots: ITimeSlot[]; availabilityId: number };
}

export interface IGetDoctorIdResponse extends ISuccessResponse {
    data: { doctorProfileId: number };
}