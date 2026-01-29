import * as Yup from "yup";

/**
 * These regexes mirror backend intent
 */
const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

const FULL_NAME_REGEX =
  /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;

const PHONE_REGEX =
  /^\d{10}$/;

export const loginValidationSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .matches(EMAIL_REGEX, "Invalid email format"),

  password: Yup.string()
    .required("Password is required"),
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
    .matches(
      PHONE_REGEX,
      "Phone number must be exactly 10 digits"
    ),

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

  specialization: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema.required("Specialization is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  experience: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema.required("Experience is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  bio: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema.required("Bio is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

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
          (value) =>
            value ? !isNaN(Date.parse(value)) : false
        ),
    otherwise: (schema) => schema.notRequired(),
  }),
});
