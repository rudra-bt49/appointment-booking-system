"use client";

import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

import Input from "@/components/common/Input";
import { loginValidationSchema } from "@/validations/auth.validation";
import { authService } from "@/services/auth.service";
import { useAuth } from "@/context/auth.context";
import API_ROUTES from "@/config/routes";

export default function LoginPage() {
  const { setUser } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Login</h1>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginValidationSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            try {
              const response = await authService.login(values);

              // ✅ success alert
              Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome 👋",
                timer: 1500,
                showConfirmButton: false,
              });

              setUser(response);
              localStorage.setItem("user", JSON.stringify(response));

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

              // ❌ error alert
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
            <Form className="flex flex-col gap-4">
              <Input
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                error={touched.email ? errors.email : ""}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password ? errors.password : ""}
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link
                  href={API_ROUTES.AUTH.REGISTER}
                  className="font-medium text-blue-600 hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
