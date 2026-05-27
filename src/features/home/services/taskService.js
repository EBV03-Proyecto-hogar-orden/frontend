import api from "../../../shared/utils/api";

export const taskService = {
  getTasks: async () => {
    const response = await api.get("/tasks/");
    return response.data;
  },

  createTask: async (taskData) => {
    const response = await api.post("/tasks/", taskData);
    return response.data;
  },

  assignTask: async (taskId, memberId) => {
    const response = await api.post(`/tasks/${taskId}/assign/`, { member_id: memberId });
    return response.data;
  },

  updateTaskStatus: async (taskId, status) => {
    const response = await api.patch(`/tasks/${taskId}/update_status/`, { status });
    return response.data;
  },

  deleteTask: async (taskId) => {
    const response = await api.delete(`/tasks/${taskId}/`);
    return response.data;
  },

  modifyTask: async (taskId, taskData) => {
    const response = await api.put(`/tasks/${taskId}/modify_task/`, taskData);
    return response.data;
  }
};

export default taskService;
