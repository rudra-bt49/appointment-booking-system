import { getProfileServer } from "@/services/profile.service";
import DoctorProfile from "../../components/Doctor/DoctorProfile";
import PatientProfile from "../../components/patient/PatientProfile";
import { redirect } from "next/navigation";
import { ProfileResponse } from "@/types/profile.types";
import API_ROUTES from "@/config/routes";

export default async function ProfilePage() {
  let profile: ProfileResponse;

  try {
    profile = await getProfileServer();
  } catch {
    redirect(API_ROUTES.AUTH.LOGIN);
  }

  if (profile.role === "DOCTOR") {
    console.log("role: ", profile.role);
    return <DoctorProfile profile={profile} />;
  }

  return <PatientProfile profile={profile} />;
}
