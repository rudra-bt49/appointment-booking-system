import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import { RegisterInput } from "../types/auth.types";

import { comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { LoginInput } from "../types/auth.types";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const registerUser = async (data: RegisterInput) => {
  const {
    email,
    password,
    role,
    fullName,
    phone,
    specialization,
    experience,
    bio,
    gender,
    dateOfBirth,
  } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  const hashedPassword = await hashPassword(password);

  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        fullName,
        phone,
      },
    });

    if (role === Role.DOCTOR) {
      if (!specialization || experience === undefined) {
        throw new Error("Doctor details are required");
      }

      await tx.doctorProfile.create({
        data: {
          userId: user.id,
          specialization,
          experience,
          bio,
        },
      });
    }

    if (role === Role.PATIENT) {
      if(!gender){
        throw new Error("Patient gender is required");
      }
      await tx.patientProfile.create({
        data: {
          userId: user.id,
          gender: gender!.toUpperCase(),
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        },
      });
    }

    return user;
  });
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Email not found");
  }

  const isPasswordValid = await comparePassword(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Incorrect password");
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  const refreshTokenExpiry = new Date();
  refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

  // Single-device login: replace existing refresh token
  await prisma.refreshToken.upsert({
    where: { userId: user.id },
    update: {
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
    },
    create: {
      userId: user.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiry,
    },
  });

  return {
    user,
    accessToken,
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  let payload: any;

  try {
    payload = jwt.verify(refreshToken, JWT_SECRET) as {
      userId: number;
    };
  } catch {
    throw new Error("Invalid refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { userId: payload.userId },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error("Refresh token not found");
  }

  if (storedToken.token !== refreshToken) {
    throw new Error("Refresh token mismatch");
  }

  if (storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token expired");
  }

  const newAccessToken = generateAccessToken({
    userId: storedToken.user.id,
    role: storedToken.user.role,
  });

  return {
    accessToken: newAccessToken,
    user: storedToken.user,
  };
};

export const logoutUser = async (userId: number) => {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
};