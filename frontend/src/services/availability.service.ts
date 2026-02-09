import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  ICreateAvailabilityRequest,
  ICreateAvailabilityResponse,
  IGetSlotsByDateRequest,
  IGetSlotsByDateResponse,
  GetAvailableDatesRequest, 
  GetAvailableDatesResponse
} from "@/types/availability.types";

export const availabilityService = {
  async createAvailability(
    payload: ICreateAvailabilityRequest
  ): Promise<ICreateAvailabilityResponse> {
    const res = await axiosInstance.post<ICreateAvailabilityResponse>(
      API_ROUTES.AVAILABILITY.CREATE,
      payload
    );
    return res.data;
  },

  async getSlotsByDoctorAndDate(
    doctorId: number,
    date: string
  ): Promise<IGetSlotsByDateResponse> {
    const payload: IGetSlotsByDateRequest = { doctorId, date };

    const res = await axiosInstance.post<IGetSlotsByDateResponse>(
      API_ROUTES.AVAILABILITY.GET_SLOTS_BY_DATE,
      payload
    );

    return res.data;
  },

  async deleteTimeSlot(slotId: number) {
    const res = await axiosInstance.delete(
      API_ROUTES.AVAILABILITY.DELETE_SLOT.replace(
        ":slotId",
        String(slotId)
      )
    );
    return res.data;
  },
  async getAvailableDates(
    doctorId: number
  ): Promise<GetAvailableDatesResponse> {
    const payload: GetAvailableDatesRequest = { doctorId };

    const res = await axiosInstance.post<GetAvailableDatesResponse>(
      API_ROUTES.AVAILABILITY.GET_AVAILABILITY_DATES,
      payload
    );

    return res.data;
  },
};
