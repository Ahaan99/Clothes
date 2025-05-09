import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const registerUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/register`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginUser = async (userData) => {
  try {
    const { data } = await axios.post(`${API_URL}/login`, userData);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};
