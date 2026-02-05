// import { Response } from "express";
// import { AuthRequest } from "../middlewares/auth.middleware";
// import { availabilityService } from "../services/availability.service";
// import { successResponse, errorResponse } from "../utils/apiResponse";

// export const availabilityController = {
//     async createAvailability(req: AuthRequest, res: Response) {
//         try {
//             const data = await availabilityService.createAvailability(
//                 req.user!.userId,
//                 req.body
//             );

//             return successResponse(res, "Availability created", data, 201);
//         } catch (error: any) {
//             return errorResponse(res, error.message);
//         }
//     },

//     async createTimeSlots(req: AuthRequest, res: Response) {
//         try {
//             const availabilityId = Number(req.params.availabilityId);

//             const result = await availabilityService.createTimeSlots(
//                 req.user!.userId,
//                 availabilityId,
//                 req.body
//             );

//             return successResponse(
//                 res,
//                 "Time slots created",
//                 { count: result.count },
//                 201
//             );
//         } catch (error: any) {
//             return errorResponse(res, error.message);
//         }
//     },

//     async getMyAvailability(req: AuthRequest, res: Response) {
//         try {
//             const data = await availabilityService.getDoctorAvailability(
//                 req.user!.userId
//             );

//             return successResponse(res, "Doctor availability fetched", data);
//         } catch (error: any) {
//             return errorResponse(res, error.message);
//         }
//     },

//     async deleteTimeSlot(req: AuthRequest, res: Response) {
//         try {
//             await availabilityService.deleteTimeSlot(
//                 req.user!.userId,
//                 Number(req.params.slotId)
//             );

//             return successResponse(res, "Time slot deleted");
//         } catch (error: any) {
//             return errorResponse(res, error.message);
//         }
//     },
//     async getSlotsByDoctorAndDate(req: AuthRequest, res: Response) {
//         try {
//             const data = await availabilityService.getSlotsByDoctorAndDate(
//                 req.body
//             );

//             return successResponse(
//                 res,
//                 "Time slots fetched",
//                 data
//             );
//         } catch (error: any) {
//             return errorResponse(res, error.message);
//         }
//     }

// };









import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { availabilityService } from "../services/availability.service";
import { successResponse, errorResponse } from "../utils/apiResponse";

export const availabilityController = {
  async createAvailability(req: AuthRequest, res: Response) {
    try {
      const data = await availabilityService.createAvailability(
        req.user!.userId,
        req.body
      );
      return successResponse(res, "Availability created", data, 201);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  },

  async getMyAvailability(req: AuthRequest, res: Response) {
    try {
      const data = await availabilityService.getDoctorAvailability(
        req.user!.userId
      );
      return successResponse(res, "Doctor availability fetched", data);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  },

  async deleteTimeSlot(req: AuthRequest, res: Response) {
    try {
      await availabilityService.deleteTimeSlot(
        req.user!.userId,
        Number(req.params.slotId)
      );
      return successResponse(res, "Time slot deleted");
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  },

  async getSlotsByDoctorAndDate(req: AuthRequest, res: Response) {
    try {
      const data = await availabilityService.getSlotsByDoctorAndDate(req.body);
      return successResponse(res, "Time slots fetched", data);
    } catch (error: any) {
      return errorResponse(res, error.message);
    }
  },
};
