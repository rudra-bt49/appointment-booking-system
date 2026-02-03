import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-blue-50 border-b border-blue-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h2 className="text-lg font-bold text-blue-400">
              DocPulse
            </h2>
            <p className="mt-2 text-sm text-gray-400 max-w-xs">
              Book doctor appointments easily and manage
              healthcare digitally.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-black">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/doctor"
                  className="hover:text-blue-400 transition"
                >
                  Doctors
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="hover:text-blue-400 transition"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="hover:text-blue-400 transition"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-black">
              Contact
            </h3>

            <p className="mt-3 text-sm">
              Email:{" "}
              <a
                href="mailto:rudra0405@gmail.com"
                className="hover:text-blue-400 transition"
              >
                rudra0405@gmail.com
              </a>
            </p>

            <p className="text-sm">
              Phone:{" "}
              <a
                href="tel:1234567890"
                className="hover:text-blue-400 transition"
              >
                1234567890
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} DocPulse. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
