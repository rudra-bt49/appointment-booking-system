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
import ROUTES from "../config/routes";

const router = Router();

router.get(ROUTES.DOCTOR.LOGGED_IN_DOCTOR_PROFILE_ID, authMiddleware, getLoggedInDoctorProfileId);


router.get(ROUTES.DOCTOR.GET_ALL_DOCTORS, authMiddleware, getAllDoctors);
router.get(ROUTES.DOCTOR.GET_BY_ID, authMiddleware, getDoctorById);


router.post(ROUTES.DOCTOR.SEARCH_DOCTOR, authMiddleware, searchDoctorsByName);
router.get(ROUTES.DOCTOR.GET_DOCTOR_SPECIALIZATION, authMiddleware, getDoctorSpecializations);
router.post(ROUTES.DOCTOR.FILTER_DOCTORS, authMiddleware, getDoctorsBySpecialization);

export default router;
