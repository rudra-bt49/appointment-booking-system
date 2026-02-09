import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import doctorRoutes from "./routes/doctor.routes";
import availabilityRoutes from "./routes/availability.routes";
import appointmentRoutes from "./routes/appointment.routes";
import paymentRoutes from "./routes/payment.routes";
import stripeRoutes from "./routes/stripe.routes";
import doctorAnalyticsRoutes from "./routes/doctorAnalytics.routes";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use("/api/stripe/webhook", bodyParser.raw({ type: "application/json" }));

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor", availabilityRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);

// app.use("/api/stripe/webhook", bodyParser.raw({ type: "application/json" }));
app.use("/api/stripe", stripeRoutes);
app.use("/api/doctor/analytics", doctorAnalyticsRoutes);

export default app;
