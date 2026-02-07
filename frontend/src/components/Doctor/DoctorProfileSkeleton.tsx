export default function DoctorProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto lg:mr-32">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 w-56 bg-gray-200 rounded-lg mb-2 animate-pulse" />
          <div className="h-6 w-72 bg-gray-200 rounded-lg animate-pulse" />
        </div>

        {/* Profile Card Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header Section Skeleton */}
          <div className="bg-gradient-to-r from-gray-300 to-gray-400 px-6 sm:px-8 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="h-9 w-48 bg-gray-200 rounded-lg mb-2 animate-pulse" />
                <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-11 w-32 bg-gray-200 rounded-lg animate-pulse" />
            </div>
          </div>

          {/* Information Grid Skeleton */}
          <div className="px-6 sm:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Phone Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-40 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Specialization Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-44 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Experience Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-32 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Email Skeleton */}
              <div className="space-y-2">
                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-7 w-56 bg-gray-200 rounded-lg animate-pulse" />
              </div>

              {/* Bio Skeleton - Full Width */}
              <div className="space-y-2 md:col-span-2">
                <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-7 w-full bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-7 w-full bg-gray-200 rounded-lg animate-pulse mb-2" />
                <div className="h-7 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}