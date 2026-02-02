import { getDoctorById } from "@/services/doctor.service";
import {
  FaBriefcaseMedical,
  FaMoneyBillWave,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

interface DoctorProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorProfilePage({
  params,
}: DoctorProfilePageProps) {
  const { id } = await params;

  const res = await getDoctorById(id);
  const doctor = res.data;

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Decorative Header Background */}
      <div className="h-48 w-full bg-gradient-to-r from-blue-600 to-indigo-700" />

      <div className="mx-auto -mt-24 max-w-3xl px-4">
        <header className="mb-6 flex flex-col items-center text-center sm:items-start sm:text-left">
          {/* Avatar Placeholder */}
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
          {/* Main Info Card */}
          <div className="overflow-hidden rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md">
            <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
              {/* Experience */}
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

              {/* Fees */}
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

              {/* Email */}
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

              {/* Phone */}
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

          {/* Book Appointment Button */}
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]">
            Book Appointment
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
