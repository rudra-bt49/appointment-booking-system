import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { hashPassword } from "../utils/hash";
import { RegisterInput, LoginInput } from "../types/auth.types";
import { comparePassword } from "../utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token";
import { sendMail } from "../utils/smtp/sendMail";
import { welcomeSignupTemplate, passwordResetTemplate } from "../utils/smtp/emailTemplates";

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

  const user = await prisma.$transaction(async (tx) => {
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
      if (!gender) {
        throw new Error("Patient gender is required");
      }

      await tx.patientProfile.create({
        data: {
          userId: user.id,
          gender: gender.toUpperCase(),
          dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        },
      });
    }

    return user;
  });

  /* ===============================
     SEND SIGNUP EMAIL (AFTER SUCCESS)
     =============================== */

  await sendMail({
    to: user.email,
    subject: "🎉 Welcome to Appointment Booking System",
    html: welcomeSignupTemplate({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      specialization,
      experience,
      gender,
    }),
  });

  return user;
};

/* ===============================
   LOGIN / REFRESH / LOGOUT (UNCHANGED)
   =============================== */

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
    refreshToken,
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

export const getMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      fullName: true,
      phone: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const sendForgotPasswordEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  // Check if user exists
  if (!user) {
    throw new Error("Email Not Exists. Please Enter a Valid Email");
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "15m" });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;

  await sendMail({
    to: user.email,
    subject: "Password Reset Request",
    html: passwordResetTemplate({
      fullName: user.fullName || user.email,
      resetLink,
      expiryMinutes: 15,
    }),
  });
};

export const resetPasswordWithToken = async (token: string, newPassword: string) => {
  let payload: any;
  try {
    payload = jwt.verify(token, JWT_SECRET) as { userId: number };
  } catch (err) {
    throw new Error("Invalid or expired token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new Error("User not found");
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
};
