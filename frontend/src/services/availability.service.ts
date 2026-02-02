// src/services/availability.service.ts

import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";

import {
  ICreateAvailabilityRequest,
  ICreateAvailabilityResponse,
  ICreateTimeSlotsRequest,
  ICreateTimeSlotsResponse,
  IGetSlotsByDateRequest,
  IGetSlotsByDateResponse,
  IGetDoctorIdResponse,
} from "@/types/availability.types";

export const availabilityService = {
  // ===============================
  // CREATE AVAILABILITY
  // ===============================
  async createAvailability(
    payload: ICreateAvailabilityRequest
  ): Promise<ICreateAvailabilityResponse> {
    const res = await axiosInstance.post<ICreateAvailabilityResponse>(
      API_ROUTES.AVAILABILITY.CREATE,
      payload
    );

    // 🔥 STORE availabilityId
    const availabilityId = res.data.data.id;
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "doctorAvailabilityId",
        String(availabilityId)
      );
    }

    return res.data;
  },

  // ===============================
  // CREATE TIME SLOTS
  // ===============================
  async createTimeSlots(
    payload: ICreateTimeSlotsRequest
  ): Promise<ICreateTimeSlotsResponse> {
    const availabilityId = localStorage.getItem("doctorAvailabilityId");
      
    // const storedId = typeof window !== "undefined" 
    //   ? localStorage.getItem("doctorAvailabilityId") 
    //   : null;

    if (!availabilityId) {
      throw new Error("Availability ID not found");
    }
    console.log("Creating slots for availability ID:", availabilityId);
    const res = await axiosInstance.post<ICreateTimeSlotsResponse>(
      API_ROUTES.AVAILABILITY.CREATE_SLOTS.replace(
        ":availabilityId",
        availabilityId
      ),
      payload
    );

    return res.data;
  },

  // ===============================
  // GET MY AVAILABILITY
  // ===============================
  async getMyAvailability() {
    const res = await axiosInstance.get(
      API_ROUTES.AVAILABILITY.GET_MY
    );

    return res.data;
  },

  // ===============================
  // GET DOCTOR PROFILE ID
  // ===============================
  async getMyDoctorProfileId(): Promise<number> {
    const res = await axiosInstance.get<IGetDoctorIdResponse>(
      API_ROUTES.DOCTOR.GET_ME_ID
    );

    const doctorProfileId = res.data.data.doctorProfileId;
    console.log("Fetched doctorProfileId:", doctorProfileId);
    localStorage.setItem(
      "doctorProfileId",
      String(doctorProfileId)
    );
    // if (typeof window !== "undefined") {
    //   localStorage.setItem(
    //     "doctorProfileId",
    //     String(doctorProfileId)
    //   );
    // }

    return doctorProfileId;
  },

  // ===============================
  // GET SLOTS BY DATE
  // ===============================
  async getSlotsByDoctorAndDate(
    date: string
  ): Promise<IGetSlotsByDateResponse> {
    // 🔥 Fetch doctorId dynamically
    let doctorId = typeof window !== "undefined" ? localStorage.getItem("doctorProfileId") : null;

    if (!doctorId) {
      doctorId = String(await this.getMyDoctorProfileId());
    }

    const payload: IGetSlotsByDateRequest = {
      doctorId: Number(doctorId),
      date,
    };

    const res = await axiosInstance.post<IGetSlotsByDateResponse>(
      API_ROUTES.AVAILABILITY.GET_SLOTS_BY_DATE,
      payload
    );

    // 🔥 STORE SLOT IDS
    const slotIds = res.data.data.slots.map((slot) => slot.id);
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "doctorSlotIds",
        JSON.stringify(slotIds)
      );
    }

    return res.data;
  },

  // ===============================
  // DELETE TIME SLOT
  // ===============================
  async deleteTimeSlot(slotId: number) {
    const res = await axiosInstance.delete(
      API_ROUTES.AVAILABILITY.DELETE_SLOT.replace(
        ":slotId",
        String(slotId)
      )
    );

    return res.data;
  },
};