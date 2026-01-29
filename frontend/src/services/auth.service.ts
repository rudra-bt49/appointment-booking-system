import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import {
  LoginPayload,
  RegisterPayload,
  AuthUser,
} from "@/types/auth.types";

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthUser> => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, payload);
    return res.data as AuthUser;
  },

  login: async (payload: LoginPayload): Promise<AuthUser> => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, payload);
    return res.data as AuthUser;
  },

  refresh: async (refreshToken: string): Promise<AuthUser> => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.REFRESH, {
      refreshToken,
    });
    return res.data as AuthUser;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
  },
};
