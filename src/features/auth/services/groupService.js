import api from "../../../utils/api";

export const groupService = {
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
};
