// import { getProfileServer } from "@/services/profile.service";
// import DoctorProfile from "../../components/Doctor/DoctorProfile";
// import PatientProfile from "../../components/patient/PatientProfile";
// import { redirect } from "next/navigation";
// import { ProfileResponse } from "@/types/profile.types";
// import API_ROUTES from "@/config/routes";

// export default async function ProfilePage() {
//   let profile: ProfileResponse;

//   try {
//     profile = await getProfileServer();
//   } catch {
//     redirect(API_ROUTES.AUTH.LOGIN);
//   }

//   if (profile.role === "DOCTOR") {
//     console.log("role: ", profile.role);
//     return <DoctorProfile profile={profile} />;
//   }

//   return <PatientProfile profile={profile} />;
// }







import { cookies } from "next/headers";
import { getProfileServer } from "@/services/profile.service";
import DoctorProfile from "../../components/Doctor/DoctorProfile";
import PatientProfile from "../../components/patient/PatientProfile";
import { redirect } from "next/navigation";
import { ProfileResponse } from "@/types/profile.types";
import API_ROUTES from "@/config/routes";

export default async function ProfilePage() {
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
    if (!profile || !profile.role) {
      console.error("Invalid profile data received");
      redirect(API_ROUTES.AUTH.LOGIN);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
    redirect(API_ROUTES.AUTH.LOGIN);
  }

  // Render appropriate profile based on role
  if (profile.role === "DOCTOR") {
    console.log("Rendering doctor profile for:", profile.fullName);
    return <DoctorProfile profile={profile} />;
  }

  console.log("Rendering patient profile for:", profile.fullName);
  return <PatientProfile profile={profile} />;
}