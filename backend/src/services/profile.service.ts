// src/services/profile.service.ts
import prisma from "../config/prisma";
import { UpdateProfileInput } from "../types/profile.types";
import { Role } from "@prisma/client";
import bcrypt from "bcrypt";

export const getProfile = async (userId: number, role: Role) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      doctorProfile: role === Role.DOCTOR,
      patientProfile: role === Role.PATIENT,
    },
  });

  if (!user) throw new Error("User not found");

  return user;
};

export const updateProfile = async (
  userId: number,
  role: Role,
  data: UpdateProfileInput
) => {
  const {
    password,
    confirmPassword, // ✅ REMOVE IT HERE
    specialization,
    experience,
    bio,
    gender,
    dateOfBirth,
    ...userFields
  } = data;

  const userUpdateData: any = { ...userFields };

  // 🔐 Update password only if provided
  if (password) {
    userUpdateData.password = await bcrypt.hash(password, 10);
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: userUpdateData, // ✅ confirmPassword is NOT sent to Prisma
    include: {
      doctorProfile: role === Role.DOCTOR,
      patientProfile: role === Role.PATIENT,
    },
  });

  if (role === Role.DOCTOR) {
    await prisma.doctorProfile.update({
      where: { userId },
      data: {
        specialization,
        experience,
        bio,
      },
    });
  }

  if (role === Role.PATIENT) {
    await prisma.patientProfile.update({
      where: { userId },
      data: {
        gender,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      },
    });
  }

  return user;
};
