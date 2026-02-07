import { Request, Response } from "express";
import stripe from "../config/stripe";
import { stripeService } from "../services/stripe.service";

export const stripeWebhookController = {
  async handleWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );

      await stripeService.handleWebhook(event);

      return res.json({ received: true });
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },
};
