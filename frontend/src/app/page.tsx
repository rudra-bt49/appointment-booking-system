import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Book Doctor Appointments <br />
            <span className="text-blue-600">
              Anytime, Anywhere
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            DocPulse helps you find trusted doctors, book
            appointments instantly, and manage your
            healthcare digitally — all in one place.
          </p>

          <div className="mt-8 flex justify-center gap-4">
            {/* ✅ Correct page navigation */}
            <Link
              href="/doctor"
              className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
            >
              Find Doctors
            </Link>

            <Link
              href="/patientAppointments"
              className="rounded-lg border border-blue-600 px-6 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition"
            >
              My Appointments
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900">
              Verified Doctors
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Browse and book appointments with trusted and
              verified healthcare professionals.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900">
              Easy Booking
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Schedule appointments in just a few clicks —
              no waiting, no hassle.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900">
              Secure & Reliable
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Your data is safe with us. Built with modern
              security standards.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
