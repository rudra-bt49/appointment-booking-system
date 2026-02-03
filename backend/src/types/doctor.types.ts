export interface DoctorListItem {
  id: number; 
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;
  doctorProfileId?: number;
  specialization: string;
  experience: number;
  bio?: string | null;
  fees: number;
  isAvailable: boolean;
}
