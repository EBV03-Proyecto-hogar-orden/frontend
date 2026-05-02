import api from "../../../shared/utils/api";

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/users/login/", { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await api.post("/users/register/", userData);
    return response.data;
  },

  getPasswordRules: async () => {
    const response = await api.get("/users/password-rules/");
    return response.data;
  },
};

export default authService;
