import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import { EditProfileApiRequest, ProfileResponse } from "@/types/profile.types";

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: ProfileResponse;
}

export const editProfileClient = async (
  payload: EditProfileApiRequest
): Promise<ProfileResponse> => {
  const res = await axiosInstance.put<ProfileApiResponse>(
    API_ROUTES.PROFILES.EDIT_PROFILE,
    payload,
    {
      withCredentials: true,
    }
  );

  return res.data.data;
};
