import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { doctorOnlyMiddleware } from "../middlewares/doctor.middleware";
import { doctorAnalyticsController } from "../controllers/doctorAnalytics.controller";
import ROUTES from "../config/routes";

const router = Router();

router.use(authMiddleware, doctorOnlyMiddleware);

/* PATIENTS */
router.post(ROUTES.ANALYTICS.PATIENTS, doctorAnalyticsController.patients);

/* REVENUE */
router.post(ROUTES.ANALYTICS.REVENUE, doctorAnalyticsController.revenue);
router.post(ROUTES.ANALYTICS.REVENUE_TODAY, doctorAnalyticsController.revenueByRange("today"));
router.post(ROUTES.ANALYTICS.REVENUE_WEEK, doctorAnalyticsController.revenueByRange("week"));
router.post(ROUTES.ANALYTICS.REVENUE_MONTH, doctorAnalyticsController.revenueByRange("month"));

/* APPOINTMENT STATUS */
router.post(
  ROUTES.ANALYTICS.APPOINTMENT_STATUS,
  doctorAnalyticsController.appointmentStatusByRange()
);
router.post(
  ROUTES.ANALYTICS.APPOINTMENT_STATUS_TODAY,
  doctorAnalyticsController.appointmentStatusByRange("today")
);
router.post(
  ROUTES.ANALYTICS.APPOINTMENT_STATUS_WEEK,
  doctorAnalyticsController.appointmentStatusByRange("week")
);
router.post(
  ROUTES.ANALYTICS.APPOINTMENT_STATUS_MONTH,
  doctorAnalyticsController.appointmentStatusByRange("month")
);

/* TIME SLOTS */
router.post(
  ROUTES.ANALYTICS.TIME_SLOTS,
  doctorAnalyticsController.timeSlotsByRange()
);
router.post(
  ROUTES.ANALYTICS.TIME_SLOTS_TODAY,
  doctorAnalyticsController.timeSlotsByRange("today")
);
router.post(
  ROUTES.ANALYTICS.TIME_SLOTS_WEEK,
  doctorAnalyticsController.timeSlotsByRange("week")
);
router.post(
  ROUTES.ANALYTICS.TIME_SLOTS_MONTH,
  doctorAnalyticsController.timeSlotsByRange("month")
);

export default router;
