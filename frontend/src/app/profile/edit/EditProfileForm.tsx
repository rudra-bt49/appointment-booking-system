"use client";

import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { ProfileResponse, EditProfileApiRequest } from "@/types/profile.types";
import { editProfileClient } from "@/services/profile.client.service";
import { profileValidationSchema } from "@/validations/profile.validation";
import API_ROUTES from "@/config/routes";
import BackButton from "@/components/common/BackButton";

interface FormValues {
  fullName: string;
  email: string;
  phone: string;

  password: string;
  confirmPassword: string;

  specialization: string;
  experience: string;
  bio: string;
}

export default function EditProfileForm({
  profile,
}: {
  profile: ProfileResponse;
}) {
  const router = useRouter();

  const formik = useFormik<FormValues>({
    enableReinitialize: true,

    initialValues: {
      fullName: profile.fullName ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",

      password: "",
      confirmPassword: "",

      specialization: profile.doctorProfile?.specialization ?? "",
      experience: profile.doctorProfile?.experience?.toString() ?? "",
      bio: profile.doctorProfile?.bio ?? "",
    },

    validationSchema: profileValidationSchema,

    onSubmit: async (values, { resetForm }) => {
      try {
        const payload: EditProfileApiRequest = {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
        };

        // 🔐 Send password only if user typed it
        if (values.password) {
          payload.password = values.password;
          payload.confirmPassword = values.confirmPassword;
        }

        if (profile.role === "DOCTOR") {
          payload.specialization = values.specialization || undefined;
          payload.bio = values.bio || undefined;
          payload.experience = values.experience
            ? Number(values.experience)
            : undefined;
        }

        await editProfileClient(payload);

        resetForm();
        router.push(API_ROUTES.PROFILE);
        router.refresh();
      } catch (err) {
        console.error("Profile update failed", err);
      }
    },
  });

  const inputClass =
    "w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const errorClass = "text-sm text-red-600 mt-1";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-2xl space-y-6 bg-white p-8 rounded-xl shadow"
      >
        <BackButton />
        <h1 className="text-2xl font-bold text-center">Edit Profile</h1>

        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            className={inputClass}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <p className={errorClass}>{formik.errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            className={inputClass}
          />
          {formik.touched.email && formik.errors.email && (
            <p className={errorClass}>{formik.errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            className={inputClass}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className={errorClass}>{formik.errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block font-medium mb-1">New Password</label>
          <input
            type="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            className={inputClass}
          />
          {formik.touched.password && formik.errors.password && (
            <p className={errorClass}>{formik.errors.password}</p>
          )}
        </div>

        {/* Confirm Password – only when password typed */}
        {formik.values.password && (
          <div>
            <label className="block font-medium mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              className={inputClass}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <p className={errorClass}>
                  {formik.errors.confirmPassword}
                </p>
              )}
          </div>
        )}

        {/* Doctor fields */}
        {profile.role === "DOCTOR" && (
          <>
            <div>
              <label className="block font-medium mb-1">Specialization</label>
              <input
                name="specialization"
                value={formik.values.specialization}
                onChange={formik.handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">
                Experience (years)
              </label>
              <input
                type="number"
                name="experience"
                value={formik.values.experience}
                onChange={formik.handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={formik.values.bio}
                onChange={formik.handleChange}
                rows={4}
                className={inputClass}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={!formik.dirty || formik.isSubmitting}
          className="w-full rounded-lg bg-blue-600 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {formik.isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
