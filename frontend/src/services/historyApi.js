// import axios from "axios";

// export const getHistory = async (symbol, days) => {
//   const res = await axios.get(
//     "http://localhost:5000/api/history",
//     {
//       params: { symbol, days }
//     }
//   );
//   return res.data;
// };



import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const getHistory = async (symbol, days) => {
  const res = await axios.get(
    `${BACKEND_URL}/api/history`,
    {
      params: { symbol, days }
    }
  );
  return res.data;
};
