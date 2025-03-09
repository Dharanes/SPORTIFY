import axios from "axios";
import { logout } from "../ReduxToolKit/AuthSlice";
export const BASE_URL = "http://localhost:8070";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  

  if (isTokenExpired(token)) {
    // Redirect to login or handle token refresh
    localStorage.removeItem("authToken");
    window.location.href = "/signin";
    return Promise.reject(new Error("Token expired"));
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const setAuthHeader = (token, api) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};
