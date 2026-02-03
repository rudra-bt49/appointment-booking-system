const ROUTES = {
  AUTH: {
    SIGNUP: "/register",
    LOGIN: "/login",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
    ME: "/me", 
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
  },
};

export default ROUTES;
