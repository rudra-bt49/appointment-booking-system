// src/app/auth/register/page.tsx
"use client";

import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Stethoscope, User } from "lucide-react";

import Input from "@/components/common/Input";
import { registerValidationSchema } from "@/validations/auth.validation";
import { authService } from "@/services/auth.service";
import { UserRole, RegisterPayload } from "@/types/auth.types";
import API_ROUTES from "@/config/routes";

interface RegisterFormValues {
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  role: UserRole;

  specialization: string;
  experience: string;
  bio: string;

  gender: string;
  dateOfBirth: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const initialValues: RegisterFormValues = {
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    role: "PATIENT",

    specialization: "",
    experience: "",
    bio: "",

    gender: "",
    dateOfBirth: "",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl border border-gray-100">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Create Account
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Join our healthcare platform today
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={registerValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const payload: RegisterPayload = {
                email: values.email,
                phone: values.phone,
                password: values.password,
                confirmPassword: values.confirmPassword,
                fullName: values.fullName,
                role: values.role,

                specialization:
                  values.role === "DOCTOR"
                    ? values.specialization
                    : undefined,

                experience:
                  values.role === "DOCTOR" && values.experience
                    ? Number(values.experience)
                    : undefined,

                bio:
                  values.role === "DOCTOR"
                    ? values.bio
                    : undefined,

                gender:
                  values.role === "PATIENT"
                    ? values.gender
                    : undefined,

                dateOfBirth:
                  values.role === "PATIENT"
                    ? values.dateOfBirth
                    : undefined,
              };

              await authService.register(payload);

              // ✅ success alert
              Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "Your account has been created 🎉",
                timer: 1500,
                showConfirmButton: false,
              });

              setTimeout(() => {
                router.push(API_ROUTES.AUTH.LOGIN);
              }, 1500);
            } catch (error: unknown) {
              const message =
                (error as {
                  response?: {
                    data?: { message?: string };
                  };
                })?.response?.data?.message ||
                "Something went wrong. Please try again.";

              // ❌ error alert
              Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: message,
              });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({
            values,
            handleChange,
            errors,
            touched,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    I am a...
                  </h2>
                  <p className="text-sm text-gray-600">
                    Select your role to continue
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFieldValue("role", "PATIENT")}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      values.role === "PATIENT"
                        ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`p-4 rounded-full transition-colors duration-300 ${
                          values.role === "PATIENT"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600"
                        }`}
                      >
                        <User size={32} strokeWidth={2} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Patient
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Seeking medical care
                        </p>
                      </div>
                    </div>
                    {values.role === "PATIENT" && (
                      <div className="absolute top-3 right-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFieldValue("role", "DOCTOR")}
                    className={`group relative p-6 rounded-xl border-2 transition-all duration-300 ${
                      values.role === "DOCTOR"
                        ? "border-purple-500 bg-purple-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-purple-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3">
                      <div
                        className={`p-4 rounded-full transition-colors duration-300 ${
                          values.role === "DOCTOR"
                            ? "bg-purple-500 text-white"
                            : "bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600"
                        }`}
                      >
                        <Stethoscope size={32} strokeWidth={2} />
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Doctor
                        </h3>
                        <p className="text-xs text-gray-600 mt-1">
                          Providing medical care
                        </p>
                      </div>
                    </div>
                    {values.role === "DOCTOR" && (
                      <div className="absolute top-3 right-3 animate-in fade-in zoom-in duration-300">
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm">✓</span>
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Animated Form Fields */}
              <div
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                key={values.role}
              >
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${values.role === "PATIENT" ? "bg-blue-500" : "bg-purple-500"}`}></span>
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={values.fullName}
                      onChange={handleChange}
                      error={touched.fullName ? errors.fullName : ""}
                    />

                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      error={touched.email ? errors.email : ""}
                    />

                    <Input
                      label="Phone Number"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      error={touched.phone ? errors.phone : ""}
                    />

                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      error={touched.password ? errors.password : ""}
                    />

                    <Input
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      error={
                        touched.confirmPassword
                          ? errors.confirmPassword
                          : ""
                      }
                    />

                    {values.role === "PATIENT" && (
                      <>
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <label className="text-sm font-medium text-gray-700">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={values.gender}
                            onChange={handleChange}
                            className={`mt-1 w-full rounded-lg border px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                              touched.gender && errors.gender
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                          {touched.gender && errors.gender && (
                            <p className="text-xs text-red-600 font-semibold mt-1">
                              {errors.gender}
                            </p>
                          )}
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
                          <Input
                            label="Date of Birth"
                            name="dateOfBirth"
                            type="date"
                            value={values.dateOfBirth}
                            onChange={handleChange}
                            error={
                              touched.dateOfBirth
                                ? errors.dateOfBirth
                                : ""
                            }
                          />
                        </div>
                      </>
                    )}

                    {values.role === "DOCTOR" && (
                      <>
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <Input
                            label="Specialization"
                            name="specialization"
                            value={values.specialization}
                            onChange={handleChange}
                            error={
                              touched.specialization
                                ? errors.specialization
                                : ""
                            }
                          />
                        </div>

                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-75">
                          <Input
                            label="Experience (years)"
                            name="experience"
                            value={values.experience}
                            onChange={handleChange}
                            error={
                              touched.experience
                                ? errors.experience
                                : ""
                            }
                          />
                        </div>

                        <div className="col-span-full animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
                          <Input
                            label="Bio"
                            name="bio"
                            value={values.bio}
                            onChange={handleChange}
                            error={touched.bio ? errors.bio : ""}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full rounded-xl py-3 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${
                      values.role === "PATIENT"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
                    } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Signing up...
                      </span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>

                  <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href={API_ROUTES.AUTH.LOGIN}
                      className={`font-medium hover:underline transition ${
                        values.role === "PATIENT"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      Login
                    </Link>
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}