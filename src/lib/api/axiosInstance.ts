// src/lib/api/axiosInstances.ts
import axios from "axios";

export const axiosV4 = axios.create({
  baseURL: "/api/v4",
  withCredentials: true,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

export const axiosV5 = axios.create({
  baseURL: "/api/v5",
  withCredentials: true,
  timeout: 120000,
  headers: {
    Accept: "application/json",
  },
});

// Add interceptors to both if needed
[axiosV4, axiosV5].forEach((instance) => {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      console.error("API Error:", err);
      return Promise.reject(err);
    }
  );
});
