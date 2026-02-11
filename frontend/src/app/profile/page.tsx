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







"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/services/profile.service";
import DoctorProfile from "../../components/Doctor/DoctorProfile";
import PatientProfile from "../../components/patient/PatientProfile";
import { useRouter } from "next/navigation";
import { ProfileResponse } from "@/types/profile.types";
import API_ROUTES from "@/config/routes";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile(); // Uses axios with withCredentials
        setProfile(data);
      } catch {
        console.error("Error fetching profile:");
        // Redirect to login on error
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return null; // Will redirect in useEffect
  }

  // Render appropriate profile based on role
  if (profile.role === "DOCTOR") {
    return <DoctorProfile profile={profile} />;
  }

  return <PatientProfile profile={profile} />;
}