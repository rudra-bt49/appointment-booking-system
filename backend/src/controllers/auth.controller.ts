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
import { sendForgotPasswordEmail, resetPasswordWithToken } from "../services/auth.service";
import { validateForgotPasswordInput, validateResetPasswordInput } from "../utils/validators/auth.validator";


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
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return errorResponse(res, "Refresh token missing", 401);
    }

    const { accessToken, user } = await refreshAccessToken(refreshToken);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true in prod (HTTPS)
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

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    validateForgotPasswordInput(req.body);
    const { email } = req.body;
    await sendForgotPasswordEmail(email);
    return successResponse(res, "If an account with that email exists, a reset link has been sent.");
  } catch (error: any) {
    return errorResponse(res, error.message);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    validateResetPasswordInput(req.body);
    const { token, password } = req.body;
    await resetPasswordWithToken(token, password);
    return successResponse(res, "Password has been reset successfully");
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};