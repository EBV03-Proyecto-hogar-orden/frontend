import axios from "axios";

// Use VITE_API_URL from env, fallback to localhost with /api for developer convenience
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

if (!import.meta.env.VITE_API_URL) {
  // eslint-disable-next-line no-console
  console.warn("VITE_API_URL not defined — using fallback:", baseURL);
}

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
    }
    return Promise.reject(error);
  }
);

export default api;
