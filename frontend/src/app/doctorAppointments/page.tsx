// import { cookies } from "next/headers";
// import DoctorAppointments from "@/components/Doctor/DoctorAppointments";
// import { getDoctorAppointmentsServer } from "@/services/appointment.service";

// export default async function DoctorAppointmentsPage() {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map((c) => `${c.name}=${c.value}`)
//     .join("; ");

//   const response = await getDoctorAppointmentsServer(cookieHeader);

//   return (
//     <main className="mx-auto max-w-6xl px-4 py-8">
//       <h1 className="mb-6 text-2xl font-bold">
//         My Appointments
//       </h1>

//       <DoctorAppointments appointments={response.data} />
//     </main>
//   );
// }







import { cookies } from "next/headers";
import DoctorAppointments from "@/components/Doctor/DoctorAppointments";
import { getDoctorAppointmentsServer } from "@/services/appointment.service";

export default async function DoctorAppointmentsPage() {
  let appointments = [];
  let error = null;

  try {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    
    const response = await getDoctorAppointmentsServer(cookieHeader);
    
    // Validate response structure
    if (response && response.data && Array.isArray(response.data)) {
      appointments = response.data;
    } else {
      console.error("Invalid response structure:", response);
      appointments = [];
    }
  } catch (err) {
    console.error("Error fetching doctor appointments:", err);
    error = err instanceof Error ? err.message : "Failed to load appointments";
    appointments = [];
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error}. Please try refreshing the page.
          </p>
        </div>
      ) : (
        <DoctorAppointments appointments={appointments} />
      )}
    </main>
  );
}