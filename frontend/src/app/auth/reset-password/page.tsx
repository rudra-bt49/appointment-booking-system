"use client";
import { Formik, Form } from "formik";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/common/Input";
import { authService } from "@/services/auth.service";
import { useState, useEffect } from "react";
import API_ROUTES from "@/config/routes";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      Swal.fire({ icon: "error", title: "Invalid Link", text: "Missing token" });
      router.push(API_ROUTES.AUTH.LOGIN);
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">Set a new password for your account.</p>
        </div>

        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          onSubmit={async (values) => {
            try {
              setIsSubmitting(true);
              await authService.resetPassword(token, values.password, values.confirmPassword);
              Swal.fire({ icon: "success", title: "Success", text: "Password reset successfully" });
              router.push("/auth/login");
            } catch (err: any) {
              Swal.fire({ icon: "error", title: "Error", text: err?.response?.data?.message || err.message });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          {({ values, handleChange }) => (
            <Form className="space-y-5">
              <Input label="New Password" name="password" type="password" value={values.password} onChange={handleChange} />
              <Input label="Confirm Password" name="confirmPassword" type="password" value={values.confirmPassword} onChange={handleChange} />

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-white font-semibold"
                >
                  {isSubmitting ? "Saving..." : "Reset Password"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
