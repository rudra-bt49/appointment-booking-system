"use client";
import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { LogIn } from "lucide-react";
import Input from "@/components/common/Input";
import { loginValidationSchema } from "@/validations/auth.validation";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import API_ROUTES from "@/config/routes";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg">
            <LogIn className="text-white" size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to continue to your account
          </p>
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const response = await authService.login(values);
              Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome 👋",
                timer: 1500,
                showConfirmButton: false,
              });
              setUser(response);
              setTimeout(() => {
                router.push(API_ROUTES.HOME);
              }, 1500);
            } catch (error: unknown) {
              const message =
                (error as {
                  response?: {
                    data?: { message?: string };
                  };
                })?.response?.data?.message ||
                "Invalid email or password";
              Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: message,
              });
              if (message.toLowerCase().includes("email")) {
                setFieldError("email", message);
              } else {
                setFieldError("password", message);
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form className="space-y-5">
              {/* Email Input */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email ? errors.email : ""}
                />
              </div>

              {/* Password Input */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150">
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password ? errors.password : ""}
                />
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end animate-in fade-in duration-500 delay-200">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-purple-600 hover:underline transition"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-250">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Logging in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn size={20} />
                      Login
                    </span>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-6 animate-in fade-in duration-500 delay-300">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    New to our platform?
                  </span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center animate-in fade-in duration-500 delay-350">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    href={API_ROUTES.AUTH.REGISTER}
                    className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Additional Features */}
              <div className="pt-6 border-t border-gray-100 animate-in fade-in duration-500 delay-400">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <Link href="#" className="hover:text-blue-600 transition flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Privacy Policy
                  </Link>
                  <span>•</span>
                  <Link href="#" className="hover:text-purple-600 transition flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Terms of Service
                  </Link>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}