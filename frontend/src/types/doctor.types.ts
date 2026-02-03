export interface IDoctor {
  id: number;
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;

  specialization: string;
  experience: number;
  bio?: string | null;
  fees: number;
  isAvailable: boolean;
  doctorProfileId?: number;
}

export interface GetDoctorsResponse {
  success: boolean;
  message: string;
  data: IDoctor[];
}

export interface GetDoctorByIdResponse {
  success: boolean;
  message: string;
  data: IDoctor;
}