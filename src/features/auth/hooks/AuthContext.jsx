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

const deriveAuthState = (token, currentTime = Date.now()) => {
  if (!token) return { isValid: false, user: null, reason: "no_token" };
  try {
    const decoded = jwtDecode(token);
    if (decoded.exp * 1000 > currentTime) {
      return { isValid: true, user: mapUserFromToken(decoded), reason: null };
    }
    return { isValid: false, user: null, reason: "expired" };
  } catch (error) {
    return { isValid: false, user: null, reason: "invalid_format" };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("accessToken");
    const auth = deriveAuthState(token);
    return auth.isValid ? auth.user : null;
  });

  const [homeGroup, setHomeGroup] = useState(null);
  const loadingGroup = !!user && !homeGroup;

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setHomeGroup(null);
  }, []);

  const fetchHomeGroup = useCallback(async () => {
    try {
      const groupData = await authService.getMyGroup();
      setHomeGroup(groupData);
    } catch (error) {
      console.error("Error fetching home group:", error);
      setHomeGroup(null);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const auth = deriveAuthState(token);

    if (auth.isValid) {
      fetchHomeGroup();
    } else if (auth.reason === "expired" || auth.reason === "invalid_format") {
      logout();
    }
  }, [fetchHomeGroup, logout]);

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

  const getMembers = async () => {
    return await authService.getMembers();
  };

  const addMember = async (memberData) => {
    return await authService.addMember(memberData);
  };

  const updateMember = async (memberId, memberData) => {
    return await authService.updateMember(memberId, memberData);
  };

  const removeMember = async (memberId) => {
    return await authService.removeMember(memberId);
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
        loading: false,
        isAuthenticated: !!user,
        homeGroup,
        loadingGroup,
        createGroup,
        joinGroup,
        switchGroup,
        listGroups,
        fetchHomeGroup,
        getMembers,
        addMember,
        updateMember,
        removeMember,
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
