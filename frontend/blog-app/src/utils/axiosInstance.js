import axios from "axios";
import { BASE_URL } from "./apiPath.js";
import toast from "react-hot-toast";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 80000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


// =========================
// REQUEST INTERCEPTOR
// =========================
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


// =========================
// RESPONSE INTERCEPTOR
// =========================
axiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (!error.response) {
      toast.error("Network error — server unreachable");
      return Promise.reject(error);
    }

    const status = error.response.status;
    const message =
      error.response?.data?.message ||
      "Unexpected server error";

    // 🔐 Unauthorized → token invalid / expired
    if (status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired — login again");

      // hard redirect — safest
      window.location.href = "/";
    }

    // 🚫 Validation / bad request
    else if (status === 400) {
      toast.error(message);
    }

    // 🔥 Server error
    else if (status >= 500) {
      toast.error("Server exploded — try again later");
    }

    // fallback
    else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
