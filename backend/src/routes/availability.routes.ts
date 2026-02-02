import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";

const router = Router();

router.use(authMiddleware, doctorOnlyMiddleware);

router.post(
  "/availability",
  availabilityController.createAvailability
);

router.post(
  "/availability/:availabilityId/slots",
  availabilityController.createTimeSlots
);

router.get(
  "/availability",
  availabilityController.getMyAvailability
);

router.delete(
  "/slots/:slotId",
  availabilityController.deleteTimeSlot
);

router.post(
  "/availability/slots/by-date",
  availabilityController.getSlotsByDoctorAndDate
);


export default router;
