import { apiClient } from "./client";

export const createParcel = async (payload) => {
  const response = await apiClient.post("/parcels", payload);
  return response.data;
};

export const getAllParcels = async () => {
  const response = await apiClient.get("/parcels");
  return response.data;
};

export const getOpenedReport = async (search = "") => {
  const query = new URLSearchParams();

  if (search.trim()) {
    query.set("search", search.trim());
  }

  const response = await apiClient.get(`/parcels/report/opened${query.size ? `?${query.toString()}` : ""}`);
  return response.data;
};

export const getInStockReport = async (search = "") => {
  const query = new URLSearchParams();

  if (search.trim()) {
    query.set("search", search.trim());
  }

  const response = await apiClient.get(`/parcels/report/in-stock${query.size ? `?${query.toString()}` : ""}`);
  return response.data;
};

export const markParcelOpened = async (parcelId) => {
  const response = await apiClient.patch(`/parcels/${parcelId}/open`);
  return response.data;
};

export const updateParcel = async (parcelId, payload) => {
  const response = await apiClient.patch(`/parcels/${parcelId}`, payload);
  return response.data;
};

export const deleteParcel = async (parcelId) => {
  const response = await apiClient.delete(`/parcels/${parcelId}`);
  return response.data;
};
