// src/routes/profile.routes.ts
import { Router } from "express";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/profile.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import ROUTES from "../config/routes";

const router = Router();

router.use(authMiddleware);

router.get(ROUTES.PROFILE.GET_PROFILE, authMiddleware, getProfileController);
router.put(ROUTES.PROFILE.UPDATE_PROFILE, authMiddleware, updateProfileController);

export default router;
