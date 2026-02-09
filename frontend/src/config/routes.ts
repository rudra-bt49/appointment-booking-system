  const API_ROUTES = {
    HOME: "/",
    DOCTOR: {
      GET_ME_ID: "/doctors/me/id",
      GET_ALL: "/doctors",
      GET_BY_ID: "/doctors/:id",
      GET_BY_DOCTOR_PROFILE_ID: "/doctors/doctorprofile/:id",

      SEARCH: "/doctors/search",
      SPECIALIZATIONS: "/doctors/specializations/all",
      FILTER_BY_SPECIALIZATION: "/doctors/filter/specialization",
    },
    AVAILABILITY: {
      CREATE: "/doctor/availability",
      CREATE_SLOTS: "/doctor/availability/:availabilityId/slots",
      GET_MY: "/doctor/availability",
      DELETE_SLOT: "/doctor/slots/:slotId",
      GET_SLOTS_BY_DATE: "/doctor/availability/slots/by-date",
      GET_AVAILABILITY_DATES: "/doctor/availability/dates"
    },
    APPOINTMENT: {
      REQUEST: "/appointments/request",
      BY_DOCTOR: "/appointments/by-doctor",
      UPDATE_STATUS: "/appointments/update-status",
    },
    PAYMENT: {
      CHECK_EXPIRY:"/payments/check-expiry"
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
  };

  export default API_ROUTES;
