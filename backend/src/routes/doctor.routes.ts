import { Router } from "express";
import { 
    getAllDoctors,
    getDoctorById,
    getLoggedInDoctorProfileId,
    searchDoctorsByName,
    getDoctorSpecializations,
    getDoctorsBySpecialization,
} from "../controllers/doctor.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me/id", authMiddleware, getLoggedInDoctorProfileId);


router.get("/", authMiddleware, getAllDoctors);
router.get("/:id", authMiddleware, getDoctorById);


router.post("/search", authMiddleware, searchDoctorsByName);
router.get("/specializations/all", authMiddleware, getDoctorSpecializations);
router.post("/filter/specialization", authMiddleware, getDoctorsBySpecialization);

export default router;
