// "use client";
// import axiosInstance from "@/config/axios";
// import API_ROUTES from "@/config/routes";
// import { cookies } from "next/headers";
// import { ProfileResponse } from "@/types/profile.types";

// interface ProfileApiResponse {
//   success: boolean;
//   message: string;
//   data: ProfileResponse;
// }

// export const getProfileServer = async (): Promise<ProfileResponse> => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("accessToken")?.value;
//   if (!accessToken) {
//     throw new Error("Unauthorized");
//   }

//   const res = await axiosInstance.get<ProfileApiResponse>(
//     API_ROUTES.PROFILES.GET_PROFILE,
//     {
//       headers: {
//         Cookie: `accessToken=${accessToken}`,
//       },
//     },
//   );

//   return res.data.data; // ✅ FIX 2
// };







import axiosInstance from "@/config/axios";
import API_ROUTES from "@/config/routes";
import { ProfileResponse } from "@/types/profile.types";

interface ProfileApiResponse {
  success: boolean;
  message: string;
  data: ProfileResponse;
}

// Client-side version (for use in client components)
export const getProfile = async (): Promise<ProfileResponse> => {
  const res = await axiosInstance.get<ProfileApiResponse>(
    API_ROUTES.PROFILES.GET_PROFILE,
    {
      withCredentials: true,
    }
  );
  return res.data.data;
};

// Server-side version (for use in server components)
export const getProfileServer = async (
  cookieHeader: string
): Promise<ProfileResponse> => {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiUrl) {
      throw new Error("API base URL is not configured");
    }

    const res = await fetch(`${apiUrl}${API_ROUTES.PROFILES.GET_PROFILE}`, {
      method: "GET",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Profile API Error:", res.status, errorText);
      throw new Error(`Failed to fetch profile: ${res.status}`);
    }

    const data: ProfileApiResponse = await res.json();

    if (!data || !data.data) {
      throw new Error("Invalid profile response structure");
    }

    return data.data;
  } catch (error) {
    console.error("getProfileServer error:", error);
    throw error;
  }
};