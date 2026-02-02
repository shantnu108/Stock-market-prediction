import axios from "axios";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const getHistory = async (symbol, days) => {
  try {
    const res = await axios.get(
      `${API_BASE}/api/history`,
      {
        params: { symbol, days },
        timeout: 10000 // 10 second timeout
      }
    );
    
    if (res.data.error) {
      throw new Error(res.data.error);
    }
    
    return res.data;
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      throw new Error(`API Error (${status}): ${data?.error || 'Unknown error'}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request
      throw new Error(`Request failed: ${error.message}`);
    }
  }
};
