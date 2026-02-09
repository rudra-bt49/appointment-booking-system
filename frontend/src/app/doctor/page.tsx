import { getAllDoctors } from "@/services/doctor.service";
import DoctorsClient from "../../components/Doctor/DoctorsClient";

export default async function DoctorsPage() {
  const res = await getAllDoctors();
  return <DoctorsClient doctors={res.data} />;
}
