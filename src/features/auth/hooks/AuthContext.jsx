import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../../shared/utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check expiration
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/users/login/", { email, password });
    const { access, refresh } = response.data;
    
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    
    const decoded = jwtDecode(access);
    setUser(decoded);
    return decoded;
  };

  const register = async (userData) => {
    const response = await api.post("/users/register/", userData);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  };

  const getPasswordRules = async () => {
    const response = await api.get("/users/password-rules/");
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getPasswordRules, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
