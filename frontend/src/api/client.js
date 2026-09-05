const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "";

export const isApiConfigured = Boolean(API_BASE_URL);

const TOKEN_KEY = "authToken";
const ROLE_KEY = "authRole";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const getRole = () => localStorage.getItem(ROLE_KEY);
export const setRole = (role) => localStorage.setItem(ROLE_KEY, role);
export const clearRole = () => localStorage.removeItem(ROLE_KEY);

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

  if (response.status === 401) {
    clearToken();
    clearRole();
  }

  if (!response.ok) {
    throw new Error(payload?.message || "Something went wrong");
  }

  return payload;
};

const buildHeaders = (withBody = false) => {
  const headers = {
    Accept: "application/json",
  };

  if (withBody) {
    headers["Content-Type"] = "application/json";
  }

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const ensureConfigured = () => {
  if (!isApiConfigured) {
    throw new Error("VITE_API_BASE_URL is not set. Configure it to point at your backend URL, including /api.");
  }
};

export const apiClient = {
  get: async (path) => {
    ensureConfigured();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: buildHeaders(),
    });
    return parseResponse(response);
  },
  post: async (path, body) => {
    ensureConfigured();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  patch: async (path, body = {}) => {
    ensureConfigured();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  delete: async (path, body) => {
    ensureConfigured();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(Boolean(body)),
      body: body ? JSON.stringify(body) : undefined,
    });

    return parseResponse(response);
  },
};
