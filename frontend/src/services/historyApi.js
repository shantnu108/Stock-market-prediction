import axios from "axios";

export const getHistory = async (symbol, days) => {
  const res = await axios.get(
    "http://localhost:5000/api/history",
    {
      params: { symbol, days }
    }
  );
  return res.data;
};
