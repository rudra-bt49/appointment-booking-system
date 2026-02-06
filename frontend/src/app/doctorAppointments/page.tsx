import { cookies } from "next/headers";
import DoctorAppointments from "@/components/Doctor/DoctorAppointments";
import { getDoctorAppointmentsServer } from "@/services/appointment.service";

export default async function DoctorAppointmentsPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  const response = await getDoctorAppointmentsServer(cookieHeader);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">
        My Appointments
      </h1>

      <DoctorAppointments appointments={response.data} />
    </main>
  );
}