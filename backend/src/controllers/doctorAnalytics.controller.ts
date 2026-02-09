import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { doctorAnalyticsService } from "../services/doctorAnalytics.service";
import { successResponse, errorResponse } from "../utils/apiResponse";

const resolveDoctorId = async (req: AuthRequest) =>
  doctorAnalyticsService.getDoctorIdByUserId(req.user!.userId);

export const doctorAnalyticsController = {
  patients: async (req: AuthRequest, res: Response) => {
    try {
      const doctorId = await resolveDoctorId(req);
      const data = await doctorAnalyticsService.getPatients(doctorId);
      return successResponse(res, "Patients fetched", data);
    } catch (e: any) {
      return errorResponse(res, e.message);
    }
  },

  revenue: async (req: AuthRequest, res: Response) => {
    try {
      const doctorId = await resolveDoctorId(req);
      return successResponse(
        res,
        "Revenue fetched",
        await doctorAnalyticsService.getRevenueByDate(doctorId)
      );
    } catch (e: any) {
      return errorResponse(res, e.message);
    }
  },

  revenueByRange:
    (range: "today" | "week" | "month") =>
    async (req: AuthRequest, res: Response) => {
      try {
        const doctorId = await resolveDoctorId(req);
        const data = await doctorAnalyticsService.getRevenueByRange(
          doctorId,
          range
        );
        return successResponse(res, "Revenue fetched", data);
      } catch (e: any) {
        return errorResponse(res, e.message);
      }
    },

  appointmentStatusByRange:
    (range?: "today" | "week" | "month") =>
    async (req: AuthRequest, res: Response) => {
      try {
        const doctorId = await resolveDoctorId(req);
        const data = range
          ? await doctorAnalyticsService.getAppointmentStatusByRange(
              doctorId,
              range
            )
          : await doctorAnalyticsService.getAppointmentStatusCount(doctorId);

        return successResponse(res, "Status fetched", data);
      } catch (e: any) {
        return errorResponse(res, e.message);
      }
    },

  timeSlotsByRange:
    (range?: "today" | "week" | "month") =>
    async (req: AuthRequest, res: Response) => {
      try {
        const doctorId = await resolveDoctorId(req);
        const data = range
          ? await doctorAnalyticsService.getTimeSlotUsageByRange(
              doctorId,
              range
            )
          : await doctorAnalyticsService.getTimeSlotUsage(doctorId);

        return successResponse(res, "Time slots fetched", data);
      } catch (e: any) {
        return errorResponse(res, e.message);
      }
    },
};
