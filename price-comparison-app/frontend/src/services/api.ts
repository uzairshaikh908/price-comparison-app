import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const url = error.config?.url || "";
    const isAuthRequest =
      url.includes("/auth/login") ||
      url.includes("/auth/register");

    if (error.response?.status === 401 && !isAuthRequest) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export const registerUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/register", {
    email,
    password,
  });

  return response.data;
};
export const loginUser = async (
  email: string,
  password: string
) => {
  const response = await api.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};
export const searchComparison = async (
  query: string,
  token: string
) => {
  const response = await api.post(
    "/comparisons/search",
    {
      query,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const saveComparison = async (
  data: any,
  token: string
) => {
  const response = await api.post(
    "/comparisons/save",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getSavedComparisons = async (
  token: string
) => {
  const response = await api.get(
    "/comparisons/saved",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export default api;