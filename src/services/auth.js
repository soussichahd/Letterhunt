import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:3000',
});

export const login = async (credentials) => {
  try {
    const response = await API.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw error.response?.data;
  }
};