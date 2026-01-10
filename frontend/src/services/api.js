import axios from "axios";

export const getPrediction = async (symbol) => {
  const res = await axios.post(
    "http://localhost:5000/api/predict",
    { symbol }
  );
  return res.data.data;
};
