import prisma from "../config/prisma";
import { DoctorListItem } from "../types/doctor.types";
import { Role } from "@prisma/client";

export const doctorService = {
  getAllDoctors: async (): Promise<DoctorListItem[]> => {
    const doctors = await prisma.user.findMany({
      where: {
        role: Role.DOCTOR,
        doctorProfile: { isAvailable: true },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        doctorProfile: {
          select: {
            specialization: true,
            experience: true,
            bio: true,
            fees: true,
            isAvailable: true,
          },
        },
      },
    });

    // Flatten response (important)
    return doctors
      .filter((d) => d.doctorProfile !== null)
      .map((d) => ({
        id: d.id,
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        avatarUrl: d.avatarUrl,

        specialization: d.doctorProfile!.specialization,
        experience: d.doctorProfile!.experience,
        bio: d.doctorProfile!.bio,
        fees: d.doctorProfile!.fees,
        isAvailable: d.doctorProfile!.isAvailable,
      }));
  },

  getDoctorById: async (doctorId: number): Promise<DoctorListItem | null> => {
    const doctor = await prisma.user.findFirst({
      where: {
        id: doctorId,
        role: Role.DOCTOR,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        doctorProfile: {
          select: {
            specialization: true,
            experience: true,
            bio: true,
            fees: true,
            isAvailable: true,
          },
        },
      },
    });

    if (!doctor || !doctor.doctorProfile) {
      return null;
    }

    return {
      id: doctor.id,
      fullName: doctor.fullName,
      email: doctor.email,
      phone: doctor.phone,
      avatarUrl: doctor.avatarUrl,

      specialization: doctor.doctorProfile.specialization,
      experience: doctor.doctorProfile.experience,
      bio: doctor.doctorProfile.bio,
      fees: doctor.doctorProfile.fees,
      isAvailable: doctor.doctorProfile.isAvailable,
    };
  },
  getDoctorProfileIdByUserId: async (
    userId: number
  ): Promise<number | null> => {
    const doctorProfile = await prisma.doctorProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    return doctorProfile?.id ?? null;
  },
};


