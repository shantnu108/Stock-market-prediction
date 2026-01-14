// import axios from "axios";

// export const getPrediction = async (symbol) => {
//   const res = await axios.post(
//     "http://localhost:5000/api/predict",
//     { symbol }
//   );
//   return res.data.data;
// };
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getPrediction = async (symbol) => {
  const res = await axios.post(
    `${BACKEND_URL}/api/predict`,
    { symbol }
  );
  return res.data.data;
};
