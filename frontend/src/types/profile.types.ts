export interface UserBase {
  id: number;
  email: string;
  fullName: string;
  role: "DOCTOR" | "PATIENT";
  phone?: string;
}

export interface DoctorProfile {
  specialization?: string;
  experience?: number;
  bio?: string;
}

export interface PatientProfile {
  gender?: string;
  dateOfBirth?: string;
}

export interface ProfileResponse extends UserBase {
  doctorProfile?: DoctorProfile | null;
  patientProfile?: PatientProfile | null;
}

export interface EditProfileApiRequest {
    fullName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    specialization?: string;
    experience?: number;
    bio?: string;
}