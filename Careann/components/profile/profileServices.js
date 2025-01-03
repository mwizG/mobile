import axios from 'axios';
import { BASE_URL } from './api';

export const fetchProfile = async () => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await axios.get(`${BASE_URL}/profile/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching profile', error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const response = await axios.put(`${BASE_URL}/profile/update/`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating profile', error);
    throw error;
  }
};
