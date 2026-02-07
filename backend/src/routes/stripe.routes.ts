import { Router } from "express";
import { stripeController } from "../controllers/stripe.controller";
import { stripeWebhookController } from "../controllers/stripeWebhook.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/create-checkout-session",
  authMiddleware,
  stripeController.createCheckoutSession
);

router.post(
  "/webhook",
  stripeWebhookController.handleWebhook
);

export default router;
