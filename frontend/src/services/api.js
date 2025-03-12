import { getToken } from "../context/AuthContext"; // ✅ Only import `getToken`
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// 🔥 Interceptor: Attach Token to Every Request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Interceptor: Handle API Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    toast.error(error.response?.data?.message || "Something went wrong");

    // ✅ Let components handle logout using useAuth()
    return Promise.reject(error);
  }
);

export default api;
