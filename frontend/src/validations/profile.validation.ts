import * as Yup from "yup";
import { EMAIL_REGEX, FULL_NAME_REGEX} from "../utils/regex";

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
    .matches(/^\d+$/, "Phone number must contain only digits")
    .length(10, "Phone number must be exactly 10 digits"),
  
  password: Yup.string()
    .notRequired()
    .min(8, "Password must be at least 8 characters"),

  confirmPassword: Yup.string().when("password", {
    is: (val: string | undefined) => Boolean(val),
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords do not match"),
    otherwise: (schema) => schema.notRequired(),
  }),

  specialization: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema.required("Specialization is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  experience: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema
        .required("Experience is required")
        .matches(/^\d+$/, "Experience must be a number"),
    otherwise: (schema) => schema.notRequired(),
  }),

  bio: Yup.string().when("role", {
    is: "DOCTOR",
    then: (schema) =>
      schema.required("Bio is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
