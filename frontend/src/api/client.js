const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getAuthToken = () => localStorage.getItem("authToken");

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
    throw new Error(payload?.message || "Something went wrong");
  }

  return payload;
};

const buildHeaders = (authenticated = true) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (authenticated) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

export const apiClient = {
  get: async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: buildHeaders(options.authenticated !== false),
    });
    return parseResponse(response);
  },
  post: async (path, body, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(options.authenticated !== false),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  patch: async (path, body = {}, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(options.authenticated !== false),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  delete: async (path, options = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(options.authenticated !== false),
    });

    return parseResponse(response);
  },
};
