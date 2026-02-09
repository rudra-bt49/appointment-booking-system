import { Role } from "@prisma/client";
import {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  FULL_NAME_REGEX,
  PHONE_REGEX,
} from "../regex/auth.regex";
import { RegisterInput } from "../../types/auth.types";
import { LoginInput } from "../../types/auth.types";

export const validateRegisterInput = (data: RegisterInput) => {
  const {
    email,
    password,
    confirmPassword,
    role,
    fullName,
    phone,
    gender,
    dateOfBirth,
  } = data;

  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Invalid email format");
  }

  if (!PASSWORD_REGEX.test(password)) {
    throw new Error(
      "Password must contain uppercase, lowercase, special character and be at least 8 characters long"
    );
  }

  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match");
  }

  if (!Object.values(Role).includes(role)) {
    throw new Error("Role must be either DOCTOR or PATIENT");
  }

  if (!FULL_NAME_REGEX.test(fullName)) {
    throw new Error(
      "Full name must contain at least one space and only alphabets"
    );
  }

  if (phone && !PHONE_REGEX.test(phone)) {
    throw new Error("Phone number must be exactly 10 digits");
  }

  if (role === Role.PATIENT) {
    if (!gender || !["MALE", "FEMALE"].includes(gender.toUpperCase())) {
      throw new Error("Gender must be either MALE or FEMALE");
    }

    if (dateOfBirth && isNaN(Date.parse(dateOfBirth))) {
      throw new Error("Invalid dateOfBirth format");
    }
  }
};

export const validateLoginInput = (data: LoginInput) => {
  const { email, password } = data;

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }
};

export const validateForgotPasswordInput = (data: { email?: string }) => {
  const { email } = data;
  if (!email) {
    throw new Error("Email is required");
  }
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Invalid email format");
  }
};

export const validateResetPasswordInput = (data: { token?: string; password?: string; confirmPassword?: string }) => {
  const { token, password, confirmPassword } = data;
  if (!token) {
    throw new Error("Token is required");
  }
  if (!password) {
    throw new Error("Password is required");
  }
  if (!PASSWORD_REGEX.test(password)) {
    throw new Error("Password must contain uppercase, lowercase, special character and be at least 8 characters long");
  }
  if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match");
  }
};