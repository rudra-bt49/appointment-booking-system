import { cookies } from "next/headers";
import PatientProfileSkeleton from "../../components/patient/PatientProfileSkeleton";
import DoctorProfileSkeleton from "../../components/Doctor/DoctorProfileSkeleton";

export default async function Loading() {
  // Try to get the user role from cookies
  const cookieStore = await cookies();
  const userRole = cookieStore.get("userRole")?.value as "PATIENT" | "DOCTOR" | undefined;

  // Render the appropriate skeleton based on role
  if (userRole === "DOCTOR") {
    return <DoctorProfileSkeleton />;
  }

  // Default to patient skeleton
  return <PatientProfileSkeleton />;
}