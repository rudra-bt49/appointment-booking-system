// import { cookies } from "next/headers";
// import {
//   getMyAppointmentsServer,
// } from "@/services/appointment.service";
// import AppointmentsList from "@/components/patient/AppointmentsList";

// export default async function PatientAppointmentsPage() {
//   const cookieStore = await cookies();
//   const cookieHeader = cookieStore
//     .getAll()
//     .map(
//       (cookie) => `${cookie.name}=${cookie.value}`
//     )
//     .join("; ");
//   const response = await getMyAppointmentsServer(
//     cookieHeader
//   );
//   return (
//     <div className="mx-auto max-w-4xl p-6">
//       <h1 className="mb-6 text-2xl font-bold">
//         My Appointments
//       </h1>
//       <AppointmentsList appointments={response.data} />
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMyAppointments } from "@/services/appointment.service";
import AppointmentsList from "@/components/patient/AppointmentsList";
import { IPatientAppointment } from "@/types/patientAppointment.types";
import API_ROUTES from "@/config/routes";

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<IPatientAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMyAppointments();

        // Validate response structure
        if (response && response.data && Array.isArray(response.data)) {
          setAppointments(response.data);
        } else {
          console.error("Invalid response structure:", response);
          setAppointments([]);
        }
      } catch (err: any) {
        console.error("Error fetching appointments:", err);

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
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">
            {error}. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-bold">My Appointments</h1>
      <AppointmentsList appointments={appointments} />
    </div>
  );
}