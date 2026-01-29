// src/app/auth/register/page.tsx
"use client";

import { Formik, Form } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Sign Up
        </h1>

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

              router.push(API_ROUTES.AUTH.LOGIN);
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
          }) => (
            <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="col-span-full">
                <label className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <select
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="PATIENT">Patient</option>
                  <option value="DOCTOR">Doctor</option>
                </select>
              </div>

              {values.role === "DOCTOR" && (
                <>
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

                  <div className="col-span-full">
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

              {values.role === "PATIENT" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      className={`mt-1 w-full rounded-lg border px-3 py-2 ${
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
                </>
              )}

              <div className="col-span-full mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>

                <p className="mt-4 text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href={API_ROUTES.AUTH.LOGIN}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
