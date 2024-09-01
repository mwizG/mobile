// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your backend's base URL

export async function apiGet(endpoint, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during GET request:', error);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiPost(endpoint, data, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during POST request:', error);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiPut(endpoint, data, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during PUT request:', error);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiDelete(endpoint, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during DELETE request:', error);
    throw error;  // Re-throw the error after logging it
  }
}
