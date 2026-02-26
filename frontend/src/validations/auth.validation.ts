import * as Yup from "yup";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  FULL_NAME_REGEX,
  PHONE_REGEX,
} from "../utils/regex";

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),

  password: Yup.string().required("Password is required"),
});

export const registerValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Full name is required")
    .matches(
      FULL_NAME_REGEX,
      "Full name must contain at least one space and only alphabets"
    ),

  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),

  phone: Yup.string()
    .required("Phone number is required")
    .matches(PHONE_REGEX, "Phone number must be exactly 10 digits"),

  password: Yup.string()
    .required("Password is required")
    .matches(
      PASSWORD_REGEX,
      "Password must contain uppercase, lowercase, special character and be at least 8 characters long"
    ),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf(
      [Yup.ref("password")],
      "Password and confirm password do not match"
    ),

  role: Yup.string()
    .oneOf(["DOCTOR", "PATIENT"])
    .required("Role must be either DOCTOR or PATIENT"),

  /* ================= DOCTOR FIELDS ================= */

  specialization: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema
        .required("Specialization is required")
        .matches(
          /^[A-Za-z\s]+$/,
          "Specialization must contain only alphabets"
        )
        .min(2, "Specialization must be at least 2 characters")
        .max(50, "Specialization cannot exceed 50 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  experience: Yup.number().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema
        .typeError("Experience must be a number")
        .required("Experience is required")
        .integer("Experience must be a whole number")
        .min(1, "Minimum experience is 1 year")
        .max(50, "Maximum experience allowed is 50 years"),
    otherwise: (schema) => schema.notRequired(),
  }),

  bio: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema
        .required("Bio is required")
        .matches(
          /^[A-Za-z\s.,'-]+$/,
          "Bio can contain only alphabets and basic punctuation"
        )
        .min(10, "Bio must be at least 10 characters")
        .max(500, "Bio cannot exceed 500 characters"),
    otherwise: (schema) => schema.notRequired(),
  }),

  /* ================= PATIENT FIELDS ================= */

  gender: Yup.string().when("role", {
    is: "PATIENT",
    then: (schema) =>
      schema
        .required("Gender must be either MALE or FEMALE")
        .oneOf(["MALE", "FEMALE", "male", "female"]),
    otherwise: (schema) => schema.notRequired(),
  }),

  dateOfBirth: Yup.string().when("role", {
    is: "PATIENT",
    then: (schema) =>
      schema
        .required("Date of birth is required")
        .test(
          "valid-date",
          "Invalid dateOfBirth format",
          (value) => (value ? !isNaN(Date.parse(value)) : false)
        )
        .test(
          "not-in-future",
          "Date of birth cannot be in the future",
          (value) => {
            if (!value) return false;
            return new Date(value) <= new Date();
          }
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
