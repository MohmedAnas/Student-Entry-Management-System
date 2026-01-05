import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const addStudent = async (data) => {
  const response = await axios.post(`${API_URL}/students`, data);
  return response.data;
};

export const getStudents = async () => {
  const response = await axios.get(`${API_URL}/students`);
  return response.data;
};

export const updateStudent = async (index, data) => {
  const response = await axios.put(`${API_URL}/students/${index}`, data);
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};
