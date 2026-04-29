import api from "./axiosInstance";

export const getHistory = async (symbol, days) => {
  try {
    const res = await api.get("/api/history", {
      params: { symbol, days },
      timeout: 10000
    });

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (error) {
    console.error("API Error:", error);

    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`API Error (${status}): ${data?.error || "Unknown error"}`);
    } else if (error.request) {
      throw new Error("No response from server. Please check your connection.");
    } else {
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};
