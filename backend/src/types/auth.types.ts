import { Role } from "@prisma/client";

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  fullName: string;
  phone?: string;

  // Doctor
  specialization?: string;
  experience?: number;
  bio?: string;

  // Patient
  gender?: string;
  dateOfBirth?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}