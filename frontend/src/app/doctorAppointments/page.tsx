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







"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DoctorAppointments from "@/components/Doctor/DoctorAppointments";
import { getDoctorAppointments } from "@/services/appointment.service";
import { DoctorAppointment } from "@/types/doctorAppointment.types";
import API_ROUTES from "@/config/routes";

interface DoctorAppointmentsResponse {
  success: boolean;
  message: string;
  data: DoctorAppointment[];
}

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState<DoctorAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDoctorAppointments() as DoctorAppointmentsResponse;

        // Validate response structure
        if (response && response.data && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          console.error("Invalid response structure:", response);
          setAppointments([]);
        }
      } catch (err: any) {
        console.error("Error fetching doctor appointments:", err);
        
        // If unauthorized, redirect to login
        if (err.response?.status === 401) {
          router.push(API_ROUTES.AUTH.LOGIN);
          return;
        }
        
        setError(err.message || "Failed to load appointments");
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </main>
    );
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