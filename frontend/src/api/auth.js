import { apiClient } from "./client";

export const login = async (payload) => {
  const response = await apiClient.post("/auth/login", payload, { authenticated: false });
  return response.data;
};
