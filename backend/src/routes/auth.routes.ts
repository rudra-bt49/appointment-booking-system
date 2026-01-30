import { Router } from "express";
import { register, login, refresh, logout, me } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

import ROUTES from "../config/routes";

const router = Router();

router.post(ROUTES.AUTH.SIGNUP, register);
router.post(ROUTES.AUTH.LOGIN, login);
router.post(ROUTES.AUTH.REFRESH, refresh);
router.post(ROUTES.AUTH.LOGOUT, authMiddleware, logout);
router.get(ROUTES.AUTH.ME, authMiddleware, me);

export default router;
