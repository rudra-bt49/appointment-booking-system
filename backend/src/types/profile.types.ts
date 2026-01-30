// src/types/profile.types.ts
export interface UpdateProfileInput {
  email?: string; 
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  password?: string;
  confirmPassword?: string;

  // Doctor fields
  specialization?: string;
  experience?: number;
  bio?: string;

  // Patient fields
  gender?: string;
  dateOfBirth?: string;
}
