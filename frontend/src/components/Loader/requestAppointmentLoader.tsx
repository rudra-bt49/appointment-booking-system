"use client";

export default function RequestAppointmentLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
      <div className="relative flex flex-col items-center">
        {/* Animated Medical Cross */}
        <div className="relative h-32 w-32">
          {/* Rotating ring */}
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-400"></div>
          
          {/* Pulsing ring */}
          <div className="absolute inset-2 animate-pulse rounded-full border-4 border-transparent border-b-blue-300 border-l-blue-200"></div>
          
          {/* Medical cross icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative h-16 w-16">
              {/* Vertical bar */}
              <div className="absolute left-1/2 top-1/2 h-16 w-4 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-b from-blue-500 to-blue-600"></div>
              {/* Horizontal bar */}
              <div className="absolute left-1/2 top-1/2 h-4 w-16 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            </div>
          </div>
        </div>

        {/* Loading message card */}
        <div className="mt-8 rounded-2xl bg-white px-8 py-6 shadow-2xl ring-1 ring-slate-200">
          <div className="flex flex-col items-center space-y-3">
            {/* Animated dots */}
            <div className="flex space-x-2">
              <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.3s]"></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
              <div className="h-3 w-3 animate-bounce rounded-full bg-blue-500"></div>
            </div>

            {/* Main message */}
            <h3 className="text-xl font-bold text-slate-900">
              Requesting Appointment
            </h3>
            
            {/* Sub message */}
            <p className="text-center text-sm text-slate-600">
              Please wait while we process your request...
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -left-20 top-10 h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75"></div>
        <div className="absolute -right-16 top-20 h-3 w-3 animate-ping rounded-full bg-blue-300 opacity-75 [animation-delay:0.5s]"></div>
        <div className="absolute -bottom-10 left-10 h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75 [animation-delay:1s]"></div>
      </div>
    </div>
  );
}