import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { errorResponse } from "../utils/apiResponse";

export const doctorOnlyMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "DOCTOR") {
    console.log("id: ", req.user?.userId);
    return errorResponse(res, "Only doctors are allowed", 403);
  }
  next();
};
