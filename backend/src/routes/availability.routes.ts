import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.use(authMiddleware);

/* ---------------- DOCTOR ONLY ---------------- */

router.post(
  ROUTES.AVAILABILITY.CREATE_AVAILABILITY,
  doctorOnlyMiddleware,
  availabilityController.createAvailability
);

router.get(
  ROUTES.AVAILABILITY.GET_MY_AVAILABILITY,
  doctorOnlyMiddleware,
  availabilityController.getMyAvailability
);

router.delete(
  ROUTES.AVAILABILITY.DELETE_SLOT,
  doctorOnlyMiddleware,
  availabilityController.deleteTimeSlot
);

/* ---------------- PUBLIC (BOOKING) ---------------- */

router.post(
  ROUTES.AVAILABILITY.GET_SLOTS_BY_DOCTOR_AND_DATE,
  availabilityController.getSlotsByDoctorAndDate
);

router.post(
  ROUTES.AVAILABILITY.GET_AVAILABLE_DATES,
  availabilityController.getAvailableDates
);

export default router;
