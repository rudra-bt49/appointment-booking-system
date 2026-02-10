import { ISuccessResponse } from "./successResponse.types";

export interface ITimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface IDoctorAvailability {
  id: number;
  doctorId: number;
  date: string;
  startDuration: string;
  endDuration: string;
  timeSlots: ITimeSlot[];
}

export interface ICreateAvailabilityRequest {
  date: string;
  startDuration: string;
  endDuration: string;
}

export interface ICreateAvailabilityResponse extends ISuccessResponse {
  data: IDoctorAvailability;
}

export interface IGetSlotsByDateRequest {
  doctorId: number;
  date: string;
}

export interface IGetSlotsByDateResponse extends ISuccessResponse {
  data: IDoctorAvailability[];
}

export interface IGetMyProfileResponse extends ISuccessResponse {
  data: {
    id: number;
    email?: string;
    role?: string;
    fullName?: string;
    phone?: string;
  };
}

export interface GetAvailableDatesRequest {
  doctorId: number;
}

export interface GetAvailableDatesResponse extends ISuccessResponse {
  data: string[];
}