import { Request, Response } from "express";
import { doctorService } from "../services/doctor.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { AuthRequest } from "../middlewares/auth.middleware";


export const getAllDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return successResponse(res, "Doctors fetched successfully", doctors);
  } catch (error) {
    console.error("Get doctors error:", error);
    return errorResponse(res, "Failed to fetch doctors", 500);
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctorId = Number(req.params.id);

    if (isNaN(doctorId)) {
      return errorResponse(res, "Invalid doctor id", 400);
    }

    const doctor = await doctorService.getDoctorById(doctorId);

    if (!doctor) {
      return errorResponse(res, "Doctor not found", 404);
    }

    return successResponse(res, "Doctor fetched successfully", doctor);
  } catch (error) {
    console.error("Get doctor by id error:", error);
    return errorResponse(res, "Failed to fetch doctor", 500);
  }
};

export const getLoggedInDoctorProfileId = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const doctorProfileId =
      await doctorService.getDoctorProfileIdByUserId(userId);

    if (!doctorProfileId) {
      return errorResponse(res, "Doctor profile not found", 404);
    }

    return successResponse(res, "Doctor profile id fetched successfully", {
      doctorProfileId,
    });
  } catch (error) {
    console.error("Get logged in doctor profile id error:", error);
    return errorResponse(res, "Failed to fetch doctor profile id", 500);
  }
};

export const searchDoctorsByName = async (req: Request, res: Response) => {
  try {
    const { keyword } = req.body;

    if (!keyword || typeof keyword !== "string") {
      return errorResponse(res, "Keyword is required", 400);
    }

    const doctors = await doctorService.searchDoctorsByName(keyword);
    return successResponse(res, "Doctors fetched successfully", doctors);
  } catch (error) {
    return errorResponse(res, "Failed to search doctors", 500);
  }
};

export const getDoctorSpecializations = async (_req: Request, res: Response) => {
  try {
    const specializations =
      await doctorService.getAllUniqueSpecializations();

    return successResponse(
      res,
      "Doctor specializations fetched successfully",
      specializations
    );
  } catch (error) {
    return errorResponse(res, "Failed to fetch specializations", 500);
  }
};

export const getDoctorsBySpecialization = async (
  req: Request,
  res: Response
) => {
  try {
    const { specialization } = req.body;

    if (!specialization) {
      return errorResponse(res, "Specialization is required", 400);
    }

    const doctors =
      await doctorService.getDoctorsBySpecialization(specialization);

    return successResponse(res, "Doctors fetched successfully", doctors);
  } catch (error) {
    return errorResponse(res, "Failed to filter doctors", 500);
  }
};