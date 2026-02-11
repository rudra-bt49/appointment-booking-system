// import { getAllDoctors } from "@/services/doctor.service";
// import DoctorsClient from "../../components/Doctor/DoctorsClient";

// export default async function DoctorsPage() {
//   const res = await getAllDoctors();
//   return <DoctorsClient doctors={res.data} />;
// }



"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllDoctorsClient } from "@/services/doctor.client.service";
import DoctorsClient from "../../components/Doctor/DoctorsClient";
import { IDoctor } from "@/types/doctor.types";
import API_ROUTES from "@/config/routes";

interface GetDoctorsResponse {
  success: boolean;
  message: string;
  data: IDoctor[];
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<IDoctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllDoctorsClient() as GetDoctorsResponse;

        if (response && response.data && Array.isArray(response.data)) {
          setDoctors(response.data);
        } else {
          console.error("Invalid response structure:", response);
          setDoctors([]);
        }
      } catch (err) {
        console.error("Error fetching doctors:", err);

        // Check if it's an axios error with response
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            router.push(API_ROUTES.AUTH.LOGIN);
            return;
          }
        }

        setError("Failed to load doctors");
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 max-w-md">
          <p className="text-red-700">
            {error}. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return <DoctorsClient doctors={doctors} />;
}