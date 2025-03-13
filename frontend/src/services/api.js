import { getToken } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: "http://localhost:3000",
});

// Add a request interceptor to include the authorization token in headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(error.response?.data?.message || "Something went wrong");
    return Promise.reject(error);
  }
);

export default api;
