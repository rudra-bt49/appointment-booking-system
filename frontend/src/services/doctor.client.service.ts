import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  SearchDoctorResponse,
  GetSpecializationsResponse,
  FilterDoctorBySpecializationResponse,
} from "@/types/doctor.types";

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
