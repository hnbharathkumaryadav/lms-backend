import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // ✅ Spring Boot backend with /api prefix
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT token automatically to every request
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Handle 401 Unauthorized responses globally
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Clearing session...");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("userRole");
      // Redirect to home/login
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
