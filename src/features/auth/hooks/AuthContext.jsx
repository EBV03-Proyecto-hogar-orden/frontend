import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import { mapUserFromToken } from "../utils/authMapper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(mapUserFromToken(decoded));
        } else {
          logout();
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const { access, refresh } = data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const decoded = jwtDecode(access);
    const mappedUser = mapUserFromToken(decoded);
    setUser(mappedUser);
    return mappedUser;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const getPasswordRules = async () => {
    return await authService.getPasswordRules();
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
