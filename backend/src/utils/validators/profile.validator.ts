// src/utils/validators/profile.validator.ts
import { UpdateProfileInput } from "../../types/profile.types";
import {
  PASSWORD_REGEX,
  FULL_NAME_REGEX,
  PHONE_REGEX,
} from "../regex/auth.regex";

export const validateUpdateProfileInput = (data: UpdateProfileInput) => {
  const {
    fullName,
    phone,
    password,
    confirmPassword,
    gender,
    dateOfBirth,
  } = data;

  if (fullName && !FULL_NAME_REGEX.test(fullName)) {
    throw new Error(
      "Full name must contain at least one space and only alphabets"
    );
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    throw new Error("Phone number must be exactly 10 digits");
  }

  if (password) {
    if (!PASSWORD_REGEX.test(password)) {
      throw new Error(
        "Password must contain uppercase, lowercase, special character and be at least 8 characters long"
      );
    }

    if (!confirmPassword) {
      throw new Error("Confirm password is required");
    }

    if (password !== confirmPassword) {
      throw new Error("Password and confirm password do not match");
    }
  }

  if (gender && !["MALE", "FEMALE"].includes(gender.toUpperCase())) {
    throw new Error("Gender must be either MALE or FEMALE");
  }

  if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
    throw new Error("Invalid dateOfBirth format");
  }
};
