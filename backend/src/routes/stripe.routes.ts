import { Router } from "express";
import { stripeController } from "../controllers/stripe.controller";
import { stripeWebhookController } from "../controllers/stripeWebhook.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.post(
  ROUTES.PAYMENT.CREATE_CHECKOUT_SESSION,
  authMiddleware,
  stripeController.createCheckoutSession
);

router.post(
  ROUTES.PAYMENT.WEBHOOK,
  stripeWebhookController.handleWebhook
);

export default router;
