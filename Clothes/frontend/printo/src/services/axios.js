import axios from "axios";
import { store } from "../store";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    console.log("[Axios Request]:", config.method?.toUpperCase(), config.url);
    const authState = JSON.parse(localStorage.getItem("authState") || "{}");
    const token = authState.token;

    if (token) {
      // Token already includes 'Bearer ' prefix from backend
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    console.error("[Axios Debug] Request error:", error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const errorCode = error.response?.data?.code;

      if (errorCode === "SESSION_EXPIRED" || errorCode === "TOKEN_EXPIRED") {
        localStorage.removeItem("authState");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
