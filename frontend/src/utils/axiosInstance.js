import axios from "axios";
import { attachJweInterceptors } from "../crypto/jweInterceptor";
const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


attachJweInterceptors(axiosInstance);

/*
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for 401 Unauthorized
    if (
      error.response &&
      error.response.status === 401
    ) {
      // Clear credentials and reload/login redirect
      //localStorage.removeItem("token");
      //localStorage.removeItem("user");
      //window.location.href = "/"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);*/

export default axiosInstance;
