import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";

const router = Router();

router.use(authMiddleware);

router.post(
  "/availability", doctorOnlyMiddleware,
  availabilityController.createAvailability
);

// router.post(
//   "/availability/:availabilityId/slots", doctorOnlyMiddleware,
//   availabilityController.createTimeSlots
// );

router.get(
  "/availability",
  availabilityController.getMyAvailability
);

router.delete(
  "/slots/:slotId", doctorOnlyMiddleware,
  availabilityController.deleteTimeSlot
);

router.post(
  "/availability/slots/by-date",
  availabilityController.getSlotsByDoctorAndDate
);


export default router;
