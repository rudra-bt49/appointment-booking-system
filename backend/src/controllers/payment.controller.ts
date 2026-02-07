import { Request, Response } from "express";
import { paymentService } from "../services/payment.service";

export const paymentController = {
  async checkPaymentExpiry(req: Request, res: Response) {
    try {
      const { appointmentId } = req.body;

      if (!appointmentId) {
        return res.status(400).json({
          success: false,
          message: "appointmentId is required",
        });
      }

      const result = await paymentService.checkAndHandleExpiry(
        Number(appointmentId)
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  },
};
