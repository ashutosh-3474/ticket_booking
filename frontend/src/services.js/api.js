// src/services/api.js
import axios from "axios";
const API_URL = "http://localhost:5000"; // change if your backend port differs

const api = axios.create({ baseURL: API_URL });

// helper to set/remove Authorization header
export function setAuthToken(token) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;
