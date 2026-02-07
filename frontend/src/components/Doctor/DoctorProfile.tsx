import { ProfileResponse } from "@/types/profile.types";
import Link from "next/link";

export default function DoctorProfile({
  profile,
}: {
  profile: ProfileResponse;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto lg:mr-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Doctor Profile
          </h1>
          <p className="text-gray-600">Manage your professional information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                  {profile.fullName}
                </h2>
                <p className="text-blue-100">{profile.email}</p>
              </div>
                <Link
                    href="/profile/edit"
                    className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50"
                >
                Edit Profile
                </Link>
            </div>
          </div>

          {/* Information Grid */}
          <div className="px-6 sm:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Phone Number
                </label>
                <p className="text-lg text-gray-900">
                  {profile.phone || "Not provided"}
                </p>
              </div>

              {/* Specialization */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Specialization
                </label>
                <p className="text-lg text-gray-900">
                  {profile.doctorProfile?.specialization || "Not provided"}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Experience
                </label>
                <p className="text-lg text-gray-900">
                  {profile.doctorProfile?.experience
                    ? `${profile.doctorProfile.experience} years`
                    : "Not provided"}
                </p>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Email Address
                </label>
                <p className="text-lg text-gray-900 break-all">
                  {profile.email}
                </p>
              </div>

              {/* Bio - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Bio
                </label>
                <p className="text-lg text-gray-900 leading-relaxed">
                  {profile.doctorProfile?.bio || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}