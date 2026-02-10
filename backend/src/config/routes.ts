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
    GET_BY_ID: "/:id",
    LOGGED_IN_DOCTOR_PROFILE_ID: "/me/id",
    GET_ALL_DOCTORS: "/",
    GET_DOCTOR_BY_ID: "/:id",
    SEARCH_DOCTOR: "/search",
    GET_DOCTOR_SPECIALIZATION: "/specializations/all",
    FILTER_DOCTORS: "/filter/specialization",
  },
  DOCTOR_AVAILABILITY: {
    BASE: "/doctor",
  },
  AVAILABILITY: {
    CREATE_AVAILABILITY: "/availability",
    GET_MY_AVAILABILITY: "/availability",
    DELETE_SLOT: "/slots/:slotId",
    GET_SLOTS_BY_DOCTOR_AND_DATE: "/availability/slots/by-date",
    GET_AVAILABLE_DATES: "/availability/dates"
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
  ANALYTICS: {
    PATIENTS: "/patients",

    REVENUE: "/revenue",
    REVENUE_TODAY: "/revenue/today",
    REVENUE_WEEK: "/revenue/week",
    REVENUE_MONTH: "/revenue/month",

    APPOINTMENT_STATUS: "/appointment-status",
    APPOINTMENT_STATUS_TODAY: "/appointment-status/today",
    APPOINTMENT_STATUS_WEEK: "/appointment-status/week",
    APPOINTMENT_STATUS_MONTH: "/appointment-status/month",

    TIME_SLOTS: "/time-slots",
    TIME_SLOTS_TODAY: "/time-slots/today",
    TIME_SLOTS_WEEK: "/time-slots/week",
    TIME_SLOTS_MONTH: "/time-slots/month",
  },
  PAYMENT: {
    CHECK_EXPIRY: "/check-expiry",
    CREATE_CHECKOUT_SESSION: "/create-checkout-session",
    WEBHOOK: "/webhook"
  }
};

export default ROUTES;
