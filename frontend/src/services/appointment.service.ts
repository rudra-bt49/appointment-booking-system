import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  ICreateAppointmentResponse,
} from "@/types/appointment.types";
import { GetDoctorByIdResponse } from "@/types/doctor.types";
import { IGetSlotsByDateRequest } from "@/types/availability.types";
import { IGetMyAppointmentsResponse } from "@/types/patientAppointment.types"

/* ----------------------------------------
   Get doctor by userId
----------------------------------------- */
export const getDoctorById = async (
  doctorUserId: string
): Promise<GetDoctorByIdResponse> => {
  const res = await axiosInstance.get<GetDoctorByIdResponse>(
    API_ROUTES.DOCTOR.GET_BY_ID.replace(":id", doctorUserId)
  );
  return res.data;
};

/* ----------------------------------------
   Get slots by doctorProfileId & date
----------------------------------------- */
export const getSlotsByDoctorAndDate = async (
  doctorProfileId: number,
  date: string
) => {
  const payload: IGetSlotsByDateRequest = {
    doctorId: doctorProfileId,
    date,
  };

  return axiosInstance.post(
    API_ROUTES.AVAILABILITY.GET_SLOTS_BY_DATE,
    payload
  );
};

/* ----------------------------------------
   Request appointment (with PDF)
----------------------------------------- */
export const requestAppointment = async (
  doctorProfileId: number,
  timeSlotId: number,
  notes: string,
  report?: File
): Promise<ICreateAppointmentResponse> => {
  const formData = new FormData();

  formData.append("doctorId", String(doctorProfileId));
  formData.append("timeSlotId", String(timeSlotId));
  formData.append("notes", notes);

  if (report) {
    formData.append("report", report); // 🔑 must match backend key
  }

  const res = await axiosInstance.post<ICreateAppointmentResponse>(
    API_ROUTES.APPOINTMENT.REQUEST,
    formData
  );
  console.log("res: ", res.data);
  return res.data;
};


/* ----------------------------------------
   Get my appointments (SERVER SAFE)
----------------------------------------- */
export const getMyAppointmentsServer = async (
  cookieHeader: string
): Promise<IGetMyAppointmentsResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/my`,
    {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch appointments");
  }

  return res.json();
};

export const getDoctorAppointmentsServer = async (
  cookieHeader: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/by-doctor`,
    {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch doctor appointments");
  }

  return res.json();
};