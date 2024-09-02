import axios from 'axios';
import { BASE_URL } from './api';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/accounts/login/`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/accounts/register/`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
