import { Router } from "express";
import { createAppointmentRequest } from "../controllers/appointment.controller";
import { getMyAppointments } from "../controllers/appointment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadReport } from "../middlewares/upload.middleware";
import { getDoctorAppointments } from "../controllers/appointment.controller";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.post(
  ROUTES.APPOINTMENT.REQUEST,
  authMiddleware,
  uploadReport.single("report"), // ✅ PDF handled here
  createAppointmentRequest
);
router.get(
  ROUTES.APPOINTMENT.MY_APPOINTMENTS,
  authMiddleware,
  getMyAppointments
);

router.get(
  "/by-doctor",
  authMiddleware,
  doctorOnlyMiddleware,
  getDoctorAppointments
);

export default router;
