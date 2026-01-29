import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import { LoginPayload, RegisterPayload } from "@/types/auth.types";

export const authService = {
  register: async (payload: RegisterPayload) => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.REGISTER, payload);
    return res.data;
  },

  login: async (payload: LoginPayload) => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, payload);
    return res.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.REFRESH, {
      refreshToken,
    });
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post(API_ROUTES.AUTH.LOGOUT);
    return res.data;
  },
};