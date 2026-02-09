"use client";
import { Formik, Form } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/common/Input";
import { authService } from "@/services/auth.service";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password</h1>
          <p className="text-gray-600">{`Enter your email and we'll send a reset link.`}</p>
        </div>

        <Formik
          initialValues={{ email: "" }}
          onSubmit={async (values) => {
            try {
              setIsSubmitting(true);
              await authService.forgotPassword(values.email);
              Swal.fire({
                icon: "success",
                title: "Email Sent",
                text: "If an account exists, a reset link has been sent to your email.",
                timer: 2500,
                showConfirmButton: false,
              });
              setTimeout(() => router.push("/auth/login"), 2000);
            } catch  {
              Swal.fire({ icon: "error", title: "Error"});
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-5">
              <Input label="Email" name="email" type="email" value={values.email} onChange={handleChange} />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white font-semibold"
                >
                  {isSubmitting ? "Sending..." : "Send Reset Link"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
