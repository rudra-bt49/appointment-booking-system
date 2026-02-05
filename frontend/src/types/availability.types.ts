import { ISuccessResponse } from "./successResponse.types";

// export interface IDoctorAvailability {
//     id: number;
//     doctorId: number;
//     date: string;
//     createdAt?: string;
//     updatedAt?: string;
// }

export interface IDoctorAvailability {
  id: number;
  doctorId: number;
  date: string;
  startDuration: string;
  endDuration: string;
}

// export interface ICreateAvailabilityRequest {
//     date: string;
// }

export interface ICreateAvailabilityRequest {
  date: string;
  startDuration: string;
  endDuration: string;
}
// export interface ICreateAvailabilityResponse extends ISuccessResponse {
//     data: IDoctorAvailability;
// }

export interface ICreateAvailabilityResponse extends ISuccessResponse {
  data: IDoctorAvailability;
}
// export interface ITimeSlot {
//     id?: number;
//     startTime: string;
//     endTime: string;
//     isBooked?: boolean;
// }


export interface ITimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}
// export interface ICreateTimeSlotsRequest {
//     slots: ITimeSlot[];
// }

// export interface ICreateTimeSlotsResponse extends ISuccessResponse {
//     data: { count: number };
// }

// export interface IGetSlotsByDateRequest {
//     doctorId: number;
//     date: string;
// }

export interface IGetSlotsByDateRequest {
  doctorId: number;
  date: string;
}
// export interface IGetSlotsByDateResponse extends ISuccessResponse {
//     data: { slots: ITimeSlot[]; availabilityId: number };
// }

export interface IGetSlotsByDateResponse extends ISuccessResponse {
  data: {
    availabilityId: number;
    slots: ITimeSlot[];
  };
}

// export interface IGetDoctorIdResponse extends ISuccessResponse {
//     data: { doctorProfileId: number };
// }

export interface IGetMyProfileResponse extends ISuccessResponse {
    data: {
        id: number;
        email?: string;
        role?: string;
        fullName?: string;
        phone?: string;
    }
}