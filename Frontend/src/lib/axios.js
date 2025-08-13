import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`, // ✅ Works in Node
  withCredentials: true,
});
