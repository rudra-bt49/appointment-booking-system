import { getDoctorById } from "@/services/appointment.service";
import { authService } from "@/services/auth.service";

export const getLoggedInDoctorProfileId = async (): Promise<number> => {
  // use the typed authService to get a strongly-typed user
  const me = await authService.me();
  const userId = me?.data?.id;
  const doctor = await getDoctorById(String(userId));

  const doctorProfileId = doctor.data.doctorProfileId;
  if (doctorProfileId === undefined) {
    // keep the return type as number by throwing when not found
    throw new Error("Doctor profile ID not found");
  }

  return doctorProfileId;
};
