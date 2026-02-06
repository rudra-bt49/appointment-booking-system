import { cookies } from "next/headers";
import {
  getMyAppointmentsServer,
} from "@/services/appointment.service";
import AppointmentsList from "@/components/patient/AppointmentsList";

export default async function PatientAppointmentsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map(
      (cookie) => `${cookie.name}=${cookie.value}`
    )
    .join("; ");
  const response = await getMyAppointmentsServer(
    cookieHeader
  );
  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">
        My Appointments
      </h1>
      <AppointmentsList appointments={response.data} />
    </div>
  );
}