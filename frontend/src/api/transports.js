import { apiClient } from "./client";

export const getTransports = async () => {
  const response = await apiClient.get("/transports");
  return response.data;
};

export const createTransport = async (payload) => {
  const response = await apiClient.post("/transports", payload);
  return response.data;
};
