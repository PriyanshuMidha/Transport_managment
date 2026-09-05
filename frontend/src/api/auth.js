import { apiClient, clearRole, clearToken, setRole, setToken } from "./client";

export const login = async (username, password) => {
  const response = await apiClient.post("/auth/login", { username, password });
  setToken(response.data.token);
  setRole(response.data.role);
  return response.data;
};

export const logout = () => {
  clearToken();
  clearRole();
};
