import axios from 'axios';
import { BASE_URL } from './api';

export const getProfile = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/profiles/me/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateProfile = async (profileData, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/profiles/update/`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
