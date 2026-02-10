// import { getProfileServer } from "@/services/profile.service";
// import EditProfileForm from "./EditProfileForm";
// import { redirect } from "next/navigation";
// import API_ROUTES from "@/config/routes";

// export default async function EditProfilePage() {
//   let profile;

//   try {
//     profile = await getProfileServer();
//   } catch {
//     redirect(API_ROUTES.AUTH.LOGIN);
//   }

//   return <EditProfileForm profile={profile} />;
// }







import { cookies } from "next/headers";
import { getProfileServer } from "@/services/profile.service";
import EditProfileForm from "./EditProfileForm";
import { redirect } from "next/navigation";
import API_ROUTES from "@/config/routes";
import { ProfileResponse } from "@/types/profile.types";

export default async function EditProfilePage() {
  let profile: ProfileResponse | null = null;

  try {
    // Get cookies from the request
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    // Check if we have any cookies (basic auth check)
    if (!cookieHeader) {
      console.log("No cookies found, redirecting to login");
      redirect(API_ROUTES.AUTH.LOGIN);
    }

    // Fetch profile with cookies
    profile = await getProfileServer(cookieHeader);

    // Validate profile data
    if (!profile) {
      console.error("Invalid profile data received");
      redirect(API_ROUTES.AUTH.LOGIN);
    }
  } catch (error) {
    console.error("Error fetching profile for edit:", error);
    redirect(API_ROUTES.AUTH.LOGIN);
  }

  return <EditProfileForm profile={profile} />;
}