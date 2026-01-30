const API_ROUTES = {
  HOME: "/",
  DOCTOR: "/doctors",
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
  },
};

export default API_ROUTES;
