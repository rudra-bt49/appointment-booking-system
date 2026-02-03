"use client";

import { IDoctor } from "@/types/doctor.types";
import DoctorCard from "@/components/Doctor/DoctorCard";
import BackButton from "@/components/common/BackButton";
export default function DoctorsClient({
  doctors,
}: {
  doctors: IDoctor[];
}) {
  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-[2160px] px-4 py-8 sm:px-6 lg:px-12">
        <BackButton/>
        <header className="mb-10 flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Available Doctors
          </h1>
          <p className="text-slate-500">
            Find and book appointments with our world-class medical specialists.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      </div>
    </div>
  );
}
