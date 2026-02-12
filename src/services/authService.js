import apiClient from "./apiClient";

/**
 * LOGIN
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    console.log("Login API Response:", response.data);

    const { token, role, email, username, id } = response.data;

    if (!token) {
      throw new Error("Token not received from server");
    }

    // ✅ Store auth data
    localStorage.setItem("token", token);
    localStorage.setItem("userRole", role);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("username", username);
    localStorage.setItem("userId", id); // ✅ FIXED

    return response.data;
  } catch (error) {
    console.error("Login service error:", error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Login failed. Please try again.");
  }
};

/**
 * REGISTER
 */
export const register = async (userData) => {
  try {
    const response = await apiClient.post("/auth/signup", userData);
    console.log("Register API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Registration service error:", error);

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Registration failed. Please try again.");
  }
};

/**
 * LOGOUT
 */
export const logout = () => {
  localStorage.clear(); // ✅ simpler & safer
};

/**
 * GET CURRENT USER
 */
export const getCurrentUser = () => {
  const token = localStorage.getItem("token");

  if (!token) return null;

  return {
    token,
    role: localStorage.getItem("userRole"),
    email: localStorage.getItem("userEmail"),
    username: localStorage.getItem("username"),
    id: localStorage.getItem("userId")
      ? Number(localStorage.getItem("userId"))
      : null,
  };
};

