import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { stripeService } from "../services/stripe.service";

export const stripeController = {
  async createCheckoutSession(req: AuthRequest, res: Response) {
    try {
      const { appointmentId } = req.body;
      const userId = req.user!.userId;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: "appointmentId is required",
        });
      }

      const session = await stripeService.createCheckoutSession(
        Number(appointmentId),
        userId
      );

      return res.status(200).json({
        success: true,
        data: session,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  },
};
