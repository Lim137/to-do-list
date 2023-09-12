import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
});

export default {
  createTaskList(data) {
    return apiClient.post("/task-lists", data);
  },
  getAllTaskListsByUserId(id) {
    return apiClient.get("/task-lists/" + id);
  },
  getUserIdByEmail(email) {
    return apiClient.get("/getUserByEmail/" + email);
  },
  updateTaskList(id, title) {
    return apiClient.put(`/task-lists/${id}`, { title: title });
  },
  deleteTaskList(id) {
    return apiClient.delete(`/task-lists/${id}`);
  },
  createTask(data) {
    return apiClient.post("/unsolved", data);
  },
  getAllUncompletedTasksByListId(listId) {
    return apiClient.get(`/unsolved/all/${listId}`);
  },
  deleteTask(id) {
    return apiClient.delete(`/unsolved/${id}`);
  },
  updateTask(id, title) {
    return apiClient.put(`/unsolved/${id}`, { title: title });
  },
  deleteAllUncompletedTasksFromDB(listId) {
    return apiClient.delete(`/unsolved/all/${listId}`);
  },
  addCompletedTask(data) {
    return apiClient.post("/solved", data);
  },
  getAllCompletedTasksByListId(listId) {
    return apiClient.get(`/solved/all/${listId}`);
  },
  deleteAllCompletedTasksFromDB(listId) {
    return apiClient.delete(`/solved/all/${listId}`);
  },
  getCountOfCompletedTasks(listId) {
    return apiClient.get(`/solved/quantity/${listId}`);
  },
  deleteOldestCompletedTaskByListId(listId){
    return apiClient.delete(`/solved/oldest/${listId}`);
  },
};
