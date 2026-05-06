const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is required. Set it to your deployed backend URL, including /api.");
}

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

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

  return headers;
};

export const apiClient = {
  get: async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: buildHeaders(),
    });
    return parseResponse(response);
  },
  post: async (path, body) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  patch: async (path, body = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(true),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  delete: async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });

    return parseResponse(response);
  },
};
