// import axiosInstance from "@/config/axios";
// import API_ROUTES from "@/config/routes";
// import {
//   ICreateAppointmentResponse,
// } from "@/types/appointment.types";
// import { GetDoctorByIdResponse } from "@/types/doctor.types";
// import { IGetSlotsByDateRequest } from "@/types/availability.types";
// import { IGetMyAppointmentsResponse } from "@/types/patientAppointment.types"
// import {
//   UpdateAppointmentStatusPayload,
//   UpdateAppointmentStatusResponse,
// } from "@/types/updateAppointmentStatus.types";
  
// /* ----------------------------------------
//    Get doctor by userId
// ----------------------------------------- */
// export const getDoctorById = async (
//   doctorUserId: string
// ): Promise<GetDoctorByIdResponse> => {
//   const res = await axiosInstance.get<GetDoctorByIdResponse>(
//     API_ROUTES.DOCTOR.GET_BY_ID.replace(":id", doctorUserId)
//   );
//   return res.data;
// };

// /* ----------------------------------------
//    Get slots by doctorProfileId & date
// ----------------------------------------- */
// export const getSlotsByDoctorAndDate = async (
//   doctorProfileId: number,
//   date: string
// ) => {
//   const payload: IGetSlotsByDateRequest = {
//     doctorId: doctorProfileId,
//     date,
//   };

//   return axiosInstance.post(
//     API_ROUTES.AVAILABILITY.GET_SLOTS_BY_DATE,
//     payload
//   );
// };

// /* ----------------------------------------
//    Request appointment (with PDF)
// ----------------------------------------- */
// export const requestAppointment = async (
//   doctorProfileId: number,
//   timeSlotId: number,
//   notes: string,
//   report?: File
// ): Promise<ICreateAppointmentResponse> => {
//   const formData = new FormData();

//   formData.append("doctorId", String(doctorProfileId));
//   formData.append("timeSlotId", String(timeSlotId));
//   formData.append("notes", notes);

//   if (report) {
//     formData.append("report", report); // 🔑 must match backend key
//   }

//   const res = await axiosInstance.post<ICreateAppointmentResponse>(
//     API_ROUTES.APPOINTMENT.REQUEST,
//     formData
//   );
//   console.log("res: ", res.data);
//   return res.data;
// };


// /* ----------------------------------------
//    Get my appointments (SERVER SAFE)
// ----------------------------------------- */
// export const getMyAppointmentsServer = async (
//   cookieHeader: string
// ): Promise<IGetMyAppointmentsResponse> => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/my`,
//     {
//       method: "GET",
//       headers: {
//         Cookie: cookieHeader,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch appointments");
//   }

//   return res.json();
// };

// export const getDoctorAppointmentsServer = async (
//   cookieHeader: string
// ) => {
//   const res = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/appointments/by-doctor`,
//     {
//       method: "GET",
//       headers: {
//         Cookie: cookieHeader,
//       },
//       cache: "no-store",
//     }
//   );

//   if (!res.ok) {
//     throw new Error("Failed to fetch doctor appointments");
//   }

//   return res.json();
// };

// export const updateAppointmentStatus = async (
//   payload: UpdateAppointmentStatusPayload
// ): Promise<UpdateAppointmentStatusResponse> => {
//   const res = await axiosInstance.patch<UpdateAppointmentStatusResponse>(
//     API_ROUTES.APPOINTMENT.UPDATE_STATUS,
//     payload
//   );
//   return res.data;
// };

// /* ----------------------------------------
//    Get patient history appointments
// ----------------------------------------- */
// export const getPatientHistoryAppointments = async () => {
//   const res = await axiosInstance.get(
//     API_ROUTES.APPOINTMENT.HISTORY_PATIENT
//   );
//   return res.data;
// };

// /* ----------------------------------------
//    Get doctor history appointments
// ----------------------------------------- */
// export const getDoctorHistoryAppointments = async () => {
//   const res = await axiosInstance.get(
//     API_ROUTES.APPOINTMENT.HISTORY_DOCTOR
//   );
//   return res.data;
// };





import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  ICreateAppointmentResponse,
} from "@/types/appointment.types";
import { GetDoctorByIdResponse } from "@/types/doctor.types";
import { IGetSlotsByDateRequest } from "@/types/availability.types";
import { IGetMyAppointmentsResponse } from "@/types/patientAppointment.types";
import {
  UpdateAppointmentStatusPayload,
  UpdateAppointmentStatusResponse,
} from "@/types/updateAppointmentStatus.types";

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
    formData.append("report", report);
  }
  const res = await axiosInstance.post<ICreateAppointmentResponse>(
    API_ROUTES.APPOINTMENT.REQUEST,
    formData
  );
  console.log("res: ", res.data);
  return res.data;
};

/* ----------------------------------------
   Get my appointments (CLIENT SIDE)
----------------------------------------- */
export const getMyAppointments = async (): Promise<IGetMyAppointmentsResponse> => {
  const res = await axiosInstance.get<IGetMyAppointmentsResponse>(
    "/appointments/my",
    {
      withCredentials: true,
    }
  );
  return res.data;
};

/* ----------------------------------------
   Get doctor appointments (CLIENT SIDE)
----------------------------------------- */
export const getDoctorAppointments = async () => {
  const res = await axiosInstance.get(
    "/appointments/by-doctor",
    {
      withCredentials: true,
    }
  );
  return res.data;
};

/* ----------------------------------------
   Update appointment status
----------------------------------------- */
export const updateAppointmentStatus = async (
  payload: UpdateAppointmentStatusPayload
): Promise<UpdateAppointmentStatusResponse> => {
  const res = await axiosInstance.patch<UpdateAppointmentStatusResponse>(
    API_ROUTES.APPOINTMENT.UPDATE_STATUS,
    payload
  );
  return res.data;
};

/* ----------------------------------------
   Get patient history appointments
----------------------------------------- */
export const getPatientHistoryAppointments = async () => {
  const res = await axiosInstance.get(
    API_ROUTES.APPOINTMENT.HISTORY_PATIENT
  );
  return res.data;
};

/* ----------------------------------------
   Get doctor history appointments
----------------------------------------- */
export const getDoctorHistoryAppointments = async () => {
  const res = await axiosInstance.get(
    API_ROUTES.APPOINTMENT.HISTORY_DOCTOR
  );
  return res.data;
};