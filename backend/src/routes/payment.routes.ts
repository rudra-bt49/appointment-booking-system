import { Router } from "express";
import { paymentController } from "../controllers/payment.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.post(
  ROUTES.PAYMENT.CHECK_EXPIRY,
  authMiddleware,
  paymentController.checkPaymentExpiry
);

export default router;
