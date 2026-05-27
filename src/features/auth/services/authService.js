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

  requestPasswordReset: async (email) => {
    console.log("authService.requestPasswordReset called with email:", email);
    console.log("Axios api baseURL is:", api.defaults.baseURL);
    const response = await api.post("/users/password-reset/", { email });
    return response.data;
  },

  confirmPasswordReset: async (uid, token, password, passwordConfirm) => {
    const response = await api.post("/users/password-reset-confirm/", {
      uid,
      token,
      password,
      password_confirm: passwordConfirm,
    });
    return response.data;
  },

  getMyGroup: async () => {
    const response = await api.get("/users/home-groups/my-group/");
    return response.data;
  },

  createHomeGroup: async (name) => {
    const response = await api.post("/users/home-groups/create/", { name });
    return response.data;
  },

  joinHomeGroup: async (inviteCode) => {
    const response = await api.post("/users/home-groups/join/", {
      invite_code: inviteCode,
    });
    return response.data;
  },

  listHomeGroups: async () => {
    const response = await api.get("/users/home-groups/list/");
    return response.data;
  },

  switchHomeGroup: async (groupId) => {
    const response = await api.post("/users/home-groups/switch/", {
      group_id: groupId,
    });
    return response.data;
  },

  getMembers: async () => {
    const response = await api.get("/users/home-groups/members/");
    return response.data;
  },

  addMember: async (memberData) => {
    const response = await api.post("/users/home-groups/members/", memberData);
    return response.data;
  },

  updateMember: async (memberId, memberData) => {
    const response = await api.put(`/users/home-groups/members/${memberId}/`, memberData);
    return response.data;
  },

  removeMember: async (memberId) => {
    const response = await api.delete(`/users/home-groups/members/${memberId}/`);
    return response.data;
  },
};

export default authService;
