const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "https://your-render-backend.onrender.com/api").replace(
  /\/$/,
  ""
);

if (API_BASE_URL.includes("your-render-backend.onrender.com")) {
  console.warn("Set VITE_API_BASE_URL to your deployed Render backend before releasing the app.");
}

const parseResponse = async (response) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Something went wrong");
  }

  return payload;
};

const buildHeaders = () => ({
  "Content-Type": "application/json",
});

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
      headers: buildHeaders(),
      body: JSON.stringify(body),
    });

    return parseResponse(response);
  },
  patch: async (path, body = {}) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers: buildHeaders(),
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
