// import BackButton from "@/components/common/BackButton";
// import { ProfileResponse } from "@/types/profile.types";
// import Link from "next/link";


// export default function PatientProfile({
//   profile,
// }: {
//   profile: ProfileResponse;
// }) {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <BackButton/>
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
//             My Profile
//           </h1>
//           <p className="text-gray-600">Manage your personal information</p>
//         </div>

//         {/* Profile Card */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           {/* Header Section */}
//           <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 sm:px-8 py-8">
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//               <div>
//                 <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
//                   {profile.fullName}
//                 </h2>
//                 <p className="text-blue-100">{profile.email}</p>
//               </div>
//               <Link
//                 href="/profile/edit"
//                 className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50"
//                >
//                 Edit Profile
//                </Link>
//             </div>
//           </div>

//           {/* Information Grid */}
//           <div className="px-6 sm:px-8 py-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Phone */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                   Phone Number
//                 </label>
//                 <p className="text-lg text-gray-900">
//                   {profile.phone || "Not provided"}
//                 </p>
//               </div>

//               {/* Gender */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                   Gender
//                 </label>
//                 <p className="text-lg text-gray-900">
//                   {profile.patientProfile?.gender || "Not provided"}
//                 </p>
//               </div>

//               {/* Date of Birth */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                   Date of Birth
//                 </label>
//                 <p className="text-lg text-gray-900">
//                   {profile.patientProfile?.dateOfBirth
//                     ? new Date(
//                         profile.patientProfile.dateOfBirth
//                       ).toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })
//                     : "Not provided"}
//                 </p>
//               </div>

//               {/* Email (repeated for balance) */}
//               <div className="space-y-2">
//                 <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
//                   Email Address
//                 </label>
//                 <p className="text-lg text-gray-900 break-all">
//                   {profile.email}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }











import BackButton from "@/components/common/BackButton";
import { ProfileResponse } from "@/types/profile.types";
import Link from "next/link";

export default function PatientProfile({
  profile,
}: {
  profile: ProfileResponse;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your personal information</p>
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
                className="bg-white text-blue-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
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

              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Gender
                </label>
                <p className="text-lg text-gray-900">
                  {profile.patientProfile?.gender || "Not provided"}
                </p>
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Date of Birth
                </label>
                <p className="text-lg text-gray-900">
                  {profile.patientProfile?.dateOfBirth
                    ? new Date(
                        profile.patientProfile.dateOfBirth
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}