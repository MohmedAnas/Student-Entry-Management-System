import axios from "axios";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const login = (credentials) => api.post("/auth/login", credentials);
