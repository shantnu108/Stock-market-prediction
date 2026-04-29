import api from "./axiosInstance";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const signupUser = async (name, email, password) => {
  const res = await api.post("/api/auth/signup", { name, email, password });
  return res.data;
};

export const loginUser = async (email, password) => {
  const res = await api.post("/api/auth/login", { email, password });
  return res.data;
};

export const getMe = async () => {
  const res = await api.get("/api/auth/me");
  return res.data;
};
