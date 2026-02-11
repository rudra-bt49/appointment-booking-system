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







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile } from "@/services/profile.service";
import EditProfileForm from "./EditProfileForm";
import API_ROUTES from "@/config/routes";
import { ProfileResponse } from "@/types/profile.types";

export default function EditProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfile(data);
      } catch {
        console.error("Error fetching profile for edit:");
        router.push(API_ROUTES.AUTH.LOGIN);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // No profile state (will redirect in useEffect)
  if (!profile) {
    return null;
  }

  return <EditProfileForm profile={profile} />;
}