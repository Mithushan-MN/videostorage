// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://videostorage-7xwu.vercel.app/api'
});

export default api;