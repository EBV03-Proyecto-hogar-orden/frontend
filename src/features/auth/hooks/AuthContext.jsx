import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import authService from "../services/authService";
import { mapUserFromToken } from "../utils/authMapper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [homeGroup, setHomeGroup] = useState(null);
  const [loadingGroup, setLoadingGroup] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setHomeGroup(null);
  }, []);

  const fetchHomeGroup = useCallback(async () => {
    setLoadingGroup(true);
    try {
      const groupData = await authService.getMyGroup();
      setHomeGroup(groupData);
    } catch (error) {
      setHomeGroup(null);
    } finally {
      setLoadingGroup(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(mapUserFromToken(decoded));
          fetchHomeGroup();
        } else {
          logout();
          setLoadingGroup(false);
        }
      } catch (error) {
        logout();
        setLoadingGroup(false);
        console.error("Error decoding token:", error);
      }
    } else {
      setLoadingGroup(false);
    }
    setLoading(false);
  }, [logout, fetchHomeGroup]);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    const { access, refresh } = data;

    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);

    const decoded = jwtDecode(access);
    const mappedUser = mapUserFromToken(decoded);
    setUser(mappedUser);

    try {
      const groupData = await authService.getMyGroup();
      setHomeGroup(groupData);
    } catch (error) {
      setHomeGroup(null);
      console.error("Error fetching home group:", error);
    } finally {
      setLoadingGroup(false);
    }

    return mappedUser;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const getPasswordRules = async () => {
    return await authService.getPasswordRules();
  };

  const requestPasswordReset = async (email) => {
    return await authService.requestPasswordReset(email);
  };

  const confirmPasswordReset = async (
    uid,
    token,
    password,
    passwordConfirm,
  ) => {
    return await authService.confirmPasswordReset(
      uid,
      token,
      password,
      passwordConfirm,
    );
  };

  const createGroup = async (name) => {
    const data = await authService.createHomeGroup(name);
    setHomeGroup(data);
    return data;
  };

  const joinGroup = async (inviteCode) => {
    const data = await authService.joinHomeGroup(inviteCode);
    setHomeGroup(data);
    return data;
  };

  const switchGroup = async (groupId) => {
    const data = await authService.switchHomeGroup(groupId);
    setHomeGroup(data);
    return data;
  };

  const listGroups = async () => {
    return await authService.listHomeGroups();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        getPasswordRules,
        requestPasswordReset,
        confirmPasswordReset,
        loading,
        isAuthenticated: !!user,
        homeGroup,
        loadingGroup,
        createGroup,
        joinGroup,
        switchGroup,
        listGroups,
        fetchHomeGroup,
      }}
    >
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
