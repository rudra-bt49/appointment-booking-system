// import axiosInstance from "@/config/axios";
// import API_ROUTES from "@/config/routes";
// import {
//   ICreateAvailabilityRequest,
//   ICreateAvailabilityResponse,
//   IGetSlotsByDateRequest,
//   IGetSlotsByDateResponse,
// } from "@/types/availability.types";

// export const availabilityService = {
//   async createAvailability(
//     payload: ICreateAvailabilityRequest
//   ): Promise<ICreateAvailabilityResponse> {
//     const res = await axiosInstance.post<ICreateAvailabilityResponse>(
//       API_ROUTES.AVAILABILITY.CREATE,
//       payload
//     );
//     return res.data;
//   },

//   async getSlotsByDoctorAndDate(
//     doctorId: number,
//     date: string
//   ): Promise<IGetSlotsByDateResponse> {
//     const payload: IGetSlotsByDateRequest = { doctorId, date };
//     console.log(payload);
//     const res = await axiosInstance.post<IGetSlotsByDateResponse>(
//       API_ROUTES.AVAILABILITY.GET_SLOTS_BY_DATE,
//       payload
//     );
//     console.log("fetched slots", res.data.data.slots);
//     return res.data;
//   },

//   async deleteTimeSlot(slotId: number) {
//     const res = await axiosInstance.delete(
//       API_ROUTES.AVAILABILITY.DELETE_SLOT.replace(
//         ":slotId",
//         String(slotId)
//       )
//     );
//     return res.data;
//   },
// };








import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  ICreateAvailabilityRequest,
  ICreateAvailabilityResponse,
  IGetSlotsByDateRequest,
  IGetSlotsByDateResponse,
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
};
