const API_ROUTES = {
  HOME: "/",
  SIDEBAR: {
    DASHBOARD: "/dashboard",

  },
  DOCTOR: {
    DOCTOR_PAGE: "/doctor",
    DOCTOR_PROFILE_EDIT: "/profile/edit",
    GET_ME_ID: "/doctors/me/id",
    GET_ALL: "/doctors",
    GET_BY_ID: "/doctors/:id",
    GET_BY_DOCTOR_PROFILE_ID: "/doctors/doctorprofile/:id",

    SEARCH: "/doctors/search",
    SPECIALIZATIONS: "/doctors/specializations/all",
    FILTER_BY_SPECIALIZATION: "/doctors/filter/specialization",
  },
  AVAILABILITY: {
    BASE: "/availability",
    CREATE: "/doctor/availability",
    CREATE_SLOTS: "/doctor/availability/:availabilityId/slots",
    GET_MY: "/doctor/availability",
    DELETE_SLOT: "/doctor/slots/:slotId",
    GET_SLOTS_BY_DATE: "/doctor/availability/slots/by-date",
    GET_AVAILABILITY_DATES: "/doctor/availability/dates"
  },
  APPOINTMENT: {
    PATIENT_APPOINTMENTS: "/patientAppointments",
    DOCTOR_APPOINTMENTS: "/doctorAppointments",
    REQUEST: "/appointments/request",
    BY_DOCTOR: "/appointments/by-doctor",
    UPDATE_STATUS: "/appointments/update-status",
    HISTORY_PATIENT: "/appointments/history/patient",
    HISTORY_DOCTOR: "/appointments/history/doctor",
  },
  PAYMENT: {
    CHECK_EXPIRY: "/payments/check-expiry",
    STRIPE_CHECKOUT_SESSION: "/stripe/create-checkout-session",
  },
  PROFILE: "/profile",
  PROFILES: {
    GET_PROFILE: "/profile/get-profile",
    EDIT_PROFILE: "/profile/edit-profile",
  },
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  ANALYTICS: {
    ANALYTICS_BASE: "/doctor/analytics",
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
};

export default API_ROUTES;
