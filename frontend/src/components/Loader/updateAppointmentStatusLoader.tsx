"use client";

interface UpdateAppointmentStatusLoaderProps {
  status: "APPROVED" | "REJECTED";
}

export default function UpdateAppointmentStatusLoader({
  status,
}: UpdateAppointmentStatusLoaderProps) {
  const isApproving = status === "APPROVED";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Animated Check/X Icon Container */}
        <div className="relative h-32 w-32">
          {/* Outer rotating ring */}
          <div
            className={`absolute inset-0 animate-spin rounded-full border-4 border-transparent ${
              isApproving
                ? "border-t-green-500 border-r-green-400"
                : "border-t-red-500 border-r-red-400"
            }`}
            style={{ animationDuration: "1.5s" }}
          ></div>

          {/* Middle pulsing ring */}
          <div
            className={`absolute inset-3 animate-pulse rounded-full border-4 border-transparent ${
              isApproving
                ? "border-b-green-300 border-l-green-200"
                : "border-b-red-300 border-l-red-200"
            }`}
          ></div>

          {/* Inner rotating ring (opposite direction) */}
          <div
            className={`absolute inset-6 rounded-full border-2 border-transparent ${
              isApproving
                ? "border-t-green-400 border-l-green-300"
                : "border-t-red-400 border-l-red-300"
            }`}
            style={{
              animation: "spin 1s linear infinite reverse",
            }}
          ></div>

          {/* Central Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full ${
                isApproving
                  ? "bg-gradient-to-br from-green-500 to-green-600"
                  : "bg-gradient-to-br from-red-500 to-red-600"
              } animate-pulse shadow-lg`}
            >
              {isApproving ? (
                // Check mark SVG
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                // X mark SVG
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Status message card */}
        <div className="mt-8 rounded-2xl bg-white px-10 py-6 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col items-center space-y-3">
            {/* Animated progress bar */}
            <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  isApproving ? "bg-green-500" : "bg-red-500"
                } animate-[loading_1.5s_ease-in-out_infinite]`}
              ></div>
            </div>

            {/* Main message */}
            <h3
              className={`text-xl font-bold ${
                isApproving ? "text-green-700" : "text-red-700"
              }`}
            >
              {isApproving ? "Approving Appointment" : "Rejecting Appointment"}
            </h3>

            {/* Sub message */}
            <p className="text-center text-sm text-slate-600">
              {isApproving
                ? "Processing approval request..."
                : "Processing rejection request..."}
            </p>

            {/* Animated dots */}
            <div className="flex space-x-2 pt-2">
              <div
                className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                  isApproving ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                  isApproving ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ animationDelay: "0.15s" }}
              ></div>
              <div
                className={`h-2.5 w-2.5 animate-bounce rounded-full ${
                  isApproving ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ animationDelay: "0.3s" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Decorative floating particles */}
        <div
          className={`absolute -left-16 top-8 h-3 w-3 animate-ping rounded-full ${
            isApproving ? "bg-green-400" : "bg-red-400"
          } opacity-75`}
        ></div>
        <div
          className={`absolute -right-20 top-16 h-2 w-2 animate-ping rounded-full ${
            isApproving ? "bg-green-300" : "bg-red-300"
          } opacity-75`}
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className={`absolute -bottom-8 left-12 h-2.5 w-2.5 animate-ping rounded-full ${
            isApproving ? "bg-green-400" : "bg-red-400"
          } opacity-75`}
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className={`absolute -bottom-12 -right-16 h-2 w-2 animate-ping rounded-full ${
            isApproving ? "bg-green-300" : "bg-red-300"
          } opacity-75`}
          style={{ animationDelay: "0.75s" }}
        ></div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}