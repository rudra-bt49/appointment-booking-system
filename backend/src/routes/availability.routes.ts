// import { Router } from "express";
// import { availabilityController } from "../controllers/availability.controller";
// import { authMiddleware } from "../middlewares/auth.middleware";
// import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";

// const router = Router();

// router.use(authMiddleware);

// router.post(
//   "/availability", doctorOnlyMiddleware,
//   availabilityController.createAvailability
// );

// router.get(
//   "/availability",
//   availabilityController.getMyAvailability
// );

// router.delete(
//   "/slots/:slotId", doctorOnlyMiddleware,
//   availabilityController.deleteTimeSlot
// );

// router.post(
//   "/availability/slots/by-date",
//   availabilityController.getSlotsByDoctorAndDate
// );

// router.post(
//   "/availability/dates",
//   availabilityController.getAvailableDates
// );

// export default router;





import { Router } from "express";
import { availabilityController } from "../controllers/availability.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";

const router = Router();

router.use(authMiddleware);

/* ---------------- DOCTOR ONLY ---------------- */

router.post(
  "/availability",
  doctorOnlyMiddleware,
  availabilityController.createAvailability
);

router.get(
  "/availability",
  doctorOnlyMiddleware,
  availabilityController.getMyAvailability
);

router.delete(
  "/slots/:slotId",
  doctorOnlyMiddleware,
  availabilityController.deleteTimeSlot
);

/* ---------------- PUBLIC (BOOKING) ---------------- */

router.post(
  "/availability/slots/by-date",
  availabilityController.getSlotsByDoctorAndDate
);

router.post(
  "/availability/dates",
  availabilityController.getAvailableDates
);

export default router;
