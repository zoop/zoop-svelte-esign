// src/lib/api/axiosInstance.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "/api/v5",
  withCredentials: true,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error logging
    console.error("API Error:", error);
    // You can throw a custom error or toast it here
    return Promise.reject(error);
  }
);
