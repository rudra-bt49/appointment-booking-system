import { ISuccessResponse } from "./successResponse.types";

export type UpdateAppointmentStatusPayload = {
  appointmentId: number;
  status: "APPROVED" | "REJECTED";
};

export interface UpdateAppointmentStatusResponse extends ISuccessResponse {
  data: {
    id: number;
    status: string;
  };
}
