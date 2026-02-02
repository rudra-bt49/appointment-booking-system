export interface DoctorListItem {
  id: number; // userId
  fullName: string;
  email: string;
  phone?: string | null;
  avatarUrl?: string | null;

  specialization: string;
  experience: number;
  bio?: string | null;
  fees: number;
  isAvailable: boolean;
}
