import { getDoctorById } from "@/services/appointment.service";
import { authService } from "@/services/auth.service";

export const getLoggedInDoctorProfileId = async (): Promise<number> => {
  const me = await authService.me();
  const userId = me?.data?.id;
  const doctor = await getDoctorById(String(userId));

  const doctorProfileId = doctor.data.doctorProfileId;
  if (doctorProfileId === undefined) {
    throw new Error("Doctor profile ID not found");
  }

  return doctorProfileId;
};
