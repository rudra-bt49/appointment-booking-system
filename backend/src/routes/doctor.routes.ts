import { Router } from "express";
import { 
    getAllDoctors,
    getDoctorById,
    getLoggedInDoctorProfileId, 
} from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me/id", authMiddleware, getLoggedInDoctorProfileId);


router.get("/", authMiddleware, getAllDoctors);
router.get("/:id", authMiddleware, getDoctorById);

export default router;
