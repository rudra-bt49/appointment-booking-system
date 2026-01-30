import * as Yup from "yup";

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FULL_NAME_REGEX =
  /^[A-Za-z]+(?:\s+[A-Za-z]+)+$/;

const PHONE_REGEX =
  /^\d{10}$/;

export const profileValidationSchema = Yup.object({
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
});
