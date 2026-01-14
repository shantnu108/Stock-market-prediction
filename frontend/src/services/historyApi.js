import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const getHistory = async (symbol, days) => {
  const res = await axios.get(
    `${API_BASE}/api/history`,
    {
      params: { symbol, days }
    }
  );
  return res.data;
};
