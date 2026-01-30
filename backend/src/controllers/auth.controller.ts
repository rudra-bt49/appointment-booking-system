import { Request, Response } from "express";
import { registerUser, 
  loginUser, 
  refreshAccessToken,
  logoutUser 
} from "../services/auth.service";
import { successResponse, 
  errorResponse 
} from "../utils/apiResponse";
import { AuthRequest } from "../middlewares/auth.middleware";
import { validateRegisterInput } from "../utils/validators/auth.validator";
import { validateLoginInput } from "../utils/validators/auth.validator";

import { getMe } from "../services/auth.service";


export const register = async (req: Request, res: Response) => {
  try {
    validateRegisterInput(req.body);

    const user = await registerUser(req.body);

    return successResponse(
      res,
      "User registered successfully",
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      201
    );
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    validateLoginInput(req.body);

    const { user, accessToken, refreshToken } = await loginUser(req.body);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, "Login successful", {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, "Refresh token is required", 400);
    }

    const { accessToken, user } =
      await refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return successResponse(res, "Access token refreshed", {
      id: user.id,
      email: user.email,
      role: user.role,
    });
  } catch (error: any) {
    return errorResponse(res, error.message, 401);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    await logoutUser(userId);

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production
    });

    return successResponse(res, "Logout successful");
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await getMe(userId);

    return successResponse(res, "User authenticated", user);
  } catch (error: any) {
    return errorResponse(res, error.message, 401);
  }
};