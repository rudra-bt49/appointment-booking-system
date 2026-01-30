import { getProfileServer } from "@/services/profile.service";
import EditProfileForm from "./EditProfileForm";
import { redirect } from "next/navigation";
import API_ROUTES from "@/config/routes";

export default async function EditProfilePage() {
  let profile;

  try {
    profile = await getProfileServer();
  } catch {
    redirect(API_ROUTES.AUTH.LOGIN);
  }

  return <EditProfileForm profile={profile} />;
}
