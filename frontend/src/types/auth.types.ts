export type UserRole = "DOCTOR" | "PATIENT";

export interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
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

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  role: UserRole;
  data?: {
    email: string;
    fullName: string;
    id: number;
    phone: string | null;
    role: UserRole;
  }
}
