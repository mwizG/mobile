import axios from 'axios';

// Base URL for your Django backend API
const BASE_URL = 'http://127.0.0.1:8000/api';

// Function to get the auth token from AsyncStorage (if needed)
async function getAuthToken() {
  // If using AsyncStorage to store tokens:
  // const token = await AsyncStorage.getItem('authToken');
  // return token;
  return null; // Replace with actual token retrieval logic
}

// Function to make GET requests
export async function apiGet(endpoint, params = {}) {
  const token = await getAuthToken();
  try {
    const response = await axios.get(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Function to make POST requests
export async function apiPost(endpoint, data) {
  const token = await getAuthToken();
  try {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Function to make PUT requests
export async function apiPut(endpoint, data) {
  const token = await getAuthToken();
  try {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}

// Function to make DELETE requests
export async function apiDelete(endpoint) {
  const token = await getAuthToken();
  try {
    const response = await axios.delete(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
}
