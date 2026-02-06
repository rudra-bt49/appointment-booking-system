import { Router } from "express";
import { createAppointmentRequest, 
  updateAppointmentStatus, 
  getDoctorAppointments 
} from "../controllers/appointment.controller";
import { getMyAppointments } from "../controllers/appointment.controller";

import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadReport } from "../middlewares/upload.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.post(
  ROUTES.APPOINTMENT.REQUEST,
  authMiddleware,
  uploadReport.single("report"), 
  createAppointmentRequest
);
router.get(
  ROUTES.APPOINTMENT.MY_APPOINTMENTS,
  authMiddleware,
  getMyAppointments
);

router.get(
  ROUTES.APPOINTMENT.BY_DOCTOR,
  authMiddleware,
  doctorOnlyMiddleware,
  getDoctorAppointments
);

router.patch(
  ROUTES.APPOINTMENT.UPDATE_STATUS,
  authMiddleware,
  doctorOnlyMiddleware,
  updateAppointmentStatus
);

export default router;
