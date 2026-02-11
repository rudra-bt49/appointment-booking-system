import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  SearchDoctorResponse,
  GetSpecializationsResponse,
  FilterDoctorBySpecializationResponse,
} from "@/types/doctor.types";
import { GetDoctorsResponse, GetDoctorByIdResponse } from "@/types/doctor.types";

/* ----------------------------------------
   Get all doctors (CLIENT SIDE)
----------------------------------------- */
export const getAllDoctorsClient = async (): Promise<GetDoctorsResponse> => {
  const res = await axiosInstance.get<GetDoctorsResponse>(
    API_ROUTES.DOCTOR.GET_ALL,
    {
      withCredentials: true,
    }
  );
  return res.data;
};

/* ----------------------------------------
   Get doctor by ID (CLIENT SIDE)
----------------------------------------- */
export const getDoctorByIdClient = async (
  id: string
): Promise<GetDoctorByIdResponse> => {
  const res = await axiosInstance.get<GetDoctorByIdResponse>(
    API_ROUTES.DOCTOR.GET_BY_ID.replace(":id", id),
    {
      withCredentials: true,
    }
  );
  return res.data;
};

export const searchDoctorsByName = async (
  keyword: string
): Promise<SearchDoctorResponse> => {
  const res = await axiosInstance.post<SearchDoctorResponse>(
    API_ROUTES.DOCTOR.SEARCH,
    { keyword }
  );

  return res.data;
};

export const getAllUniqueSpecializations = async (): Promise<GetSpecializationsResponse> => {
  const res = await axiosInstance.get<GetSpecializationsResponse>(
    API_ROUTES.DOCTOR.SPECIALIZATIONS
  );

  return res.data;
};

export const getDoctorsBySpecialization = async (
  specialization: string
): Promise<FilterDoctorBySpecializationResponse> => {
  const res = await axiosInstance.post<FilterDoctorBySpecializationResponse>(
    API_ROUTES.DOCTOR.FILTER_BY_SPECIALIZATION,
    { specialization }
  );

  return res.data;
};