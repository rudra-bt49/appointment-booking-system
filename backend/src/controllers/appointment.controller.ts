import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { appointmentService } from "../services/appointment.service";
import { successResponse, errorResponse } from "../utils/apiResponse";
import { Role } from "@prisma/client";

export const createAppointmentRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "PATIENT") {
      return errorResponse(res, "Only patients can request appointments", 403);
    }

    const doctorId = Number(req.body.doctorId);
    const timeSlotId = Number(req.body.timeSlotId);
    const notes = req.body.notes;

    if (!doctorId || !timeSlotId) {
      return errorResponse(res, "doctorId and timeSlotId are required", 400);
    }

    const reportUrl = req.file?.path || undefined;

    const appointment = await appointmentService.createAppointment(
      req.user.userId,
      {
        doctorId,
        timeSlotId,
        notes,
        reportUrl,
      }
    );

    return successResponse(
      res,
      "Appointment request sent successfully",
      appointment,
      201
    );
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

//new controller function
export const getMyAppointments = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;

    if (!user || user.role !== Role.PATIENT) {
      return res.status(403).json({
        message: "Only patients can access appointments",
      });
    }

    const appointments =
      await appointmentService.getAppointmentsByPatientUserId(user.userId);

    res.status(200).json({
      message: "Appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const getDoctorAppointments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.user!.userId;

    const appointments =
      await appointmentService.getAppointmentsByDoctorUserId(userId);

    return successResponse(
      res,
      "Doctor appointments fetched successfully",
      appointments
    );
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user || req.user.role !== "DOCTOR") {
      return errorResponse(res, "Only doctors can update appointment status", 403);
    }

    const { appointmentId, status } = req.body;

    if (!appointmentId || !status) {
      return errorResponse(res, "appointmentId and status are required", 400);
    }

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return errorResponse(res, "Invalid status value", 400);
    }

    const updatedAppointment =
      await appointmentService.updateAppointmentStatus(
        req.user.userId,
        appointmentId,
        status
      );

    return successResponse(
      res,
      `Appointment ${status.toLowerCase()} successfully`,
      updatedAppointment
    );
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};
