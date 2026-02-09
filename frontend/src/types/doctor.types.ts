import { ISuccessResponse } from "../types/successResponse.types"

export interface IDoctor {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;

  specialization: string;
  experience: number;
  bio?: string | null;
  fees: number;
  isAvailable: boolean;
  doctorProfileId?: number;
}

export interface GetDoctorsResponse {
  success: boolean;
  message: string;
  data: IDoctor[];
}

export interface GetDoctorByIdResponse {
  success: boolean;
  message: string;
  data: IDoctor;
}

//
export interface SearchDoctorRequest {
  keyword: string;
}

export interface SearchDoctorResponse extends ISuccessResponse {
  data: IDoctor[];
}

export interface GetSpecializationsResponse extends ISuccessResponse {
  data: string[];
}

export interface FilterDoctorBySpecializationRequest {
  specialization: string;
}

export interface FilterDoctorBySpecializationResponse extends ISuccessResponse {
  data: IDoctor[];
}