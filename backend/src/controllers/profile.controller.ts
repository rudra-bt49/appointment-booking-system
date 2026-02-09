// src/controllers/profile.controller.ts
import { Response } from "express";
import { getProfile, updateProfile } from "../services/profile.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { validateUpdateProfileInput } from "../utils/validators/profile.validator";
import { Role } from "@prisma/client";

export const getProfileController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role as Role;

    const user = await getProfile(userId, role);

    return successResponse(res, "Profile fetched successfully", user);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const updateProfileController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;
    const role = req.user!.role as Role;
    const data = req.body;

    // Common validation (password, phone, name, etc.)
    validateUpdateProfileInput(data);

    // 🔐 PASSWORD UPDATE VALIDATION (OPTIONAL)
    if (data.password || data.confirmPassword) {
      if (!data.password || !data.confirmPassword) {
        throw new Error("Both password and confirmPassword are required");
      }

      if (data.password !== data.confirmPassword) {
        throw new Error("Password and confirmPassword do not match");
      }
    }

    // 🔒 ROLE-BASED FIELD VALIDATION
    if (role === Role.DOCTOR) {
      if (data.gender || data.dateOfBirth) {
        throw new Error(
          "PATIENT fields are not allowed for DOCTOR profile"
        );
      }
    }

    if (role === Role.PATIENT) {
      if (data.specialization || data.experience || data.bio) {
        throw new Error(
          "DOCTOR fields are not allowed for PATIENT profile"
        );
      }
    }

    const updatedUser = await updateProfile(userId, role, data);

    return successResponse(res, "Profile updated successfully", updatedUser);
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};
