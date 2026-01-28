export const EMAIL_REGEX: RegExp =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_REGEX: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;

export const FULL_NAME_REGEX: RegExp =
  /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;

export const PHONE_REGEX: RegExp =
  /^\d{10}$/;
