import axios from "axios";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "https://your-render-app.onrender.com/api";

// Create ONE axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true // 🔥 THIS FIXES CORS
});

export const addStudent = async (data) => {
  const response = await api.post("/students", data);
  return response.data;
};

export const getStudents = async () => {
  const response = await api.get("/students");
  return response.data;
};

export const updateStudent = async (index, data) => {
  const response = await api.put(`/students/${index}`, data);
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};
