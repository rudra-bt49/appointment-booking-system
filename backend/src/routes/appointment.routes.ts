import { Router } from "express";
import { createAppointmentRequest } from "../controllers/appointment.controller";
import { getMyAppointments } from "../controllers/appointment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadReport } from "../middlewares/upload.middleware";
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

export default router;
