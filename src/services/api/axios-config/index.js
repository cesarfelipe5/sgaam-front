import axios from "axios";
import { errorInterceptor, responseInterceptor } from "./interceptors";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

const Api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Supondo que o token esteja salvo como 'token' no localStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(responseInterceptor, errorInterceptor);

export { Api };
