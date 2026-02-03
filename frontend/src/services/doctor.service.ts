// src/services/doctor.service.ts
import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import { cookies } from "next/headers";
import { GetDoctorsResponse, GetDoctorByIdResponse } from "@/types/doctor.types";

export const getAllDoctors = async (): Promise<GetDoctorsResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await axiosInstance.get<GetDoctorsResponse>(
    API_ROUTES.DOCTOR.GET_ALL,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getDoctorById = async (
  id: string
): Promise<GetDoctorByIdResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  console.log("Fetching doctor with ID:", id);

  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await axiosInstance.get<GetDoctorByIdResponse>(
    API_ROUTES.DOCTOR.GET_BY_ID.replace(":id", id),
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    }
  );
  console.log("Doctor data:", res.data.data.doctorProfileId);
  return res.data;
};