import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const getPrediction = async (symbol) => {
  const res = await axios.post(
    `${API_BASE}/api/predict`,
    { symbol }
  );
  return res.data.data;
};
