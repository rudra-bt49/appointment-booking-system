import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import doctorRoutes from "./routes/doctor.routes";
import availabilityRoutes from "./routes/availability.routes";
import appointmentRoutes from "./routes/appointment.routes";


const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));

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


export default app;
