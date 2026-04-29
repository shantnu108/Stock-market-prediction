import api from "./axiosInstance";

export const getPrediction = async (symbol) => {
  const res = await api.post("/api/predict", { symbol });
  return res.data.data;
};
