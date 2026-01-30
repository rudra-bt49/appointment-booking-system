import { getProfileServer } from "@/services/profile.service";
import DoctorProfile from "./DoctorProfile";
import PatientProfile from "./PatientProfile";
import { redirect } from "next/navigation";
import { ProfileResponse } from "@/types/profile.types";
import API_ROUTES from "@/config/routes";

export default async function ProfilePage() {
  let profile: ProfileResponse;

  try {
    profile = await getProfileServer();
    console.log("Profile data:", profile);
  } catch {
    redirect(API_ROUTES.AUTH.LOGIN);
  }

  console.log("role: ", profile.role);
  // ✅ JSX OUTSIDE try/catch
  if (profile.role === "DOCTOR") {
    console.log("role: ", profile.role);
    return <DoctorProfile profile={profile} />;
  }

  return <PatientProfile profile={profile} />;
}
