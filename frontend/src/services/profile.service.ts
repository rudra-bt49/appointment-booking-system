import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import { cookies } from "next/headers";
import { ProfileResponse } from "@/types/profile.types";

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: ProfileResponse;
}

export const getProfileServer = async (): Promise<ProfileResponse> => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("Unauthorized");
  }

  const res = await axiosInstance.get<ProfileApiResponse>(
    API_ROUTES.PROFILES.GET_PROFILE,
    {
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    },
  );

  return res.data.data; // ✅ FIX 2
};
