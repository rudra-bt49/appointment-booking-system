// import { getDoctorById } from "@/services/doctor.service";
// import {
//   FaBriefcaseMedical,
//   FaMoneyBillWave,
//   FaEnvelope,
//   FaPhoneAlt,
// } from "react-icons/fa";
// import Link from "next/link";
// import BackButton from "@/components/common/BackButton";

// interface DoctorProfilePageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function DoctorProfilePage({
//   params,
// }: DoctorProfilePageProps) {
//   const { id } = await params;
//   const res = await getDoctorById(id);
//   const doctor = res.data;

//   return (
//     <div className="min-h-screen bg-[#f8fafc] pb-20">
//       <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700" />

//       <div className="mx-auto -mt-24 max-w-3xl px-4">
//         {/* ✅ Back Button */}
//         <BackButton />

//         <header className="mb-6 flex flex-col items-center text-center sm:items-start sm:text-left">
//           <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white">
//             <div className="flex h-full w-full items-center justify-center rounded-xl bg-blue-50 text-4xl font-bold text-blue-600">
//               {doctor.fullName.charAt(0)}
//             </div>
//           </div>

//           <div className="space-y-1">
//             <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-slate-900">
//               {doctor.fullName}
//             </h1>
//             <p className="text-lg font-semibold text-blue-100 sm:text-blue-600">
//               {doctor.specialization}
//             </p>
//           </div>
//         </header>

//         <div className="grid gap-6">
//           <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md">
//             <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
//                   <FaBriefcaseMedical size={18} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                     Experience
//                   </p>
//                   <p className="text-lg font-bold text-slate-800">
//                     {doctor.experience} Years
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
//                   <FaMoneyBillWave size={18} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                     Consultation Fee
//                   </p>
//                   <p className="text-lg font-bold text-slate-800">
//                     ₹{doctor.fees}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-4">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
//                   <FaEnvelope size={16} />
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                     Email Address
//                   </p>
//                   <p className="font-semibold text-slate-800">
//                     {doctor.email}
//                   </p>
//                 </div>
//               </div>

//               {doctor.phone && (
//                 <div className="flex items-center gap-4">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
//                     <FaPhoneAlt size={16} />
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
//                       Phone Number
//                     </p>
//                     <p className="font-semibold text-slate-800">
//                       {doctor.phone}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {doctor.bio && (
//               <div className="mt-8 border-t border-slate-100 pt-6">
//                 <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-900">
//                   About Doctor
//                 </h3>
//                 <p className="text-md leading-relaxed text-slate-600">
//                   {doctor.bio}
//                 </p>
//               </div>
//             )}
//           </div>

//           <Link
//             href={`/requestAppointment?doctorUserId=${id}`}
//             className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
//           >
//             Book Appointment
//             <span className="text-xl">→</span>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getDoctorByIdClient } from "@/services/doctor.client.service";
import { IDoctor } from "@/types/doctor.types";
import {
  FaBriefcaseMedical,
  FaMoneyBillWave,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";
import Link from "next/link";
import BackButton from "@/components/common/BackButton";
import API_ROUTES from "@/config/routes";

interface GetDoctorByIdResponse {
  success: boolean;
  message: string;
  data: IDoctor;
}

export default function DoctorProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<IDoctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDoctor = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching doctor with ID:", id);
        
        const response = await getDoctorByIdClient(id) as GetDoctorByIdResponse;

        if (response && response.data) {
          console.log("Doctor data:", response.data.doctorProfileId);
          setDoctor(response.data);
        } else {
          console.error("Invalid response structure:", response);
          setError("Invalid doctor data received");
        }
      } catch (err) {
        console.error("Error fetching doctor:", err);

        // Check if it's an axios error with response
        if (err && typeof err === "object" && "response" in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 401) {
            router.push(API_ROUTES.AUTH.LOGIN);
            return;
          }
        }

        setError("Failed to load doctor profile");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 max-w-md">
          <p className="text-red-700">
            {error || "Doctor not found"}. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700" />
      <div className="mx-auto -mt-24 max-w-3xl px-4">
        {/* ✅ Back Button */}
        <BackButton />

        <header className="mb-6 flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="mb-4 flex h-32 w-32 items-center justify-center rounded-2xl bg-white p-2 shadow-xl ring-4 ring-white">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-blue-50 text-4xl font-bold text-blue-600">
              {doctor.fullName.charAt(0)}
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-slate-900">
              {doctor.fullName}
            </h1>
            <p className="text-lg font-semibold text-blue-100 sm:text-blue-600">
              {doctor.specialization}
            </p>
          </div>
        </header>

        <div className="grid gap-6">
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <FaBriefcaseMedical size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Experience
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {doctor.experience} Years
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <FaMoneyBillWave size={18} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Consultation Fee
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    ₹{doctor.fees}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
                  <FaEnvelope size={16} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                    Email Address
                  </p>
                  <p className="font-semibold text-slate-800">
                    {doctor.email}
                  </p>
                </div>
              </div>

              {doctor.phone && (
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600">
                    <FaPhoneAlt size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Phone Number
                    </p>
                    <p className="font-semibold text-slate-800">
                      {doctor.phone}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {doctor.bio && (
              <div className="mt-8 border-t border-slate-100 pt-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-900">
                  About Doctor
                </h3>
                <p className="text-md leading-relaxed text-slate-600">
                  {doctor.bio}
                </p>
              </div>
            )}
          </div>

          <Link
            href={`/requestAppointment?doctorUserId=${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
          >
            Book Appointment
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}