const ROUTES = {
  AUTH: {
    SIGNUP: "/register",
    LOGIN: "/login",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
    ME: "/me",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },
  PROFILE: {
    GET_PROFILE: "/get-profile",
    UPDATE_PROFILE: "/edit-profile",
  },
  DOCTOR: {
    GET_ALL: "/doctors",
    GET_BY_ID: "/doctors/:id",
  },
  DOCTOR_AVAILABILITY: {
    BASE: "/doctor",
  },
  APPOINTMENT: {
    REQUEST: "/request",
    MY_APPOINTMENTS: "/my",
    UPLOAD_REPORT: "/:id/upload-report",
    BY_DOCTOR: "/by-doctor",
    UPDATE_STATUS: "/update-status",
    HISTORY_PATIENT: "/history/patient",
    HISTORY_DOCTOR: "/history/doctor",
  },
  PAYMENT: {
    CHECK_EXPIRY: "/check-expiry",
  }
};

export default ROUTES;
