// src/services/api.js
import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your backend's base URL

// Function to refresh the access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post(`${BASE_URL}/accounts/token/refresh/`, {
      refresh: refreshToken,
    });

    // Update the access token in local storage
    localStorage.setItem('accessToken', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
}

export async function apiGet(endpoint, token = null) {
  try {
    const headers = token ? { Authorization: `Bearer ${token}`, } : {};
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
    const headers = token ? { Authorization: `Bearer ${token}`, } : {};
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
    const headers = token ? { Authorization: `Bearer ${token}`, } : {};
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
    const headers = token ? { Authorization: `Bearer ${token}`, } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during DELETE request:', error);
    throw error;  // Re-throw the error after logging it
  }
}

// Function to make an authenticated request with token refresh logic
export async function apiRequestWithRefresh(endpoint, data, method = 'get') {
  const accessToken = localStorage.getItem('accessToken');

  try {
    let response;
    if (method === 'post') {
      response = await apiPost(endpoint, data, accessToken);
    } else if (method === 'put') {
      response = await apiPut(endpoint, data, accessToken);
    } else {
      response = await apiGet(endpoint, accessToken);
    }
    return response;
  } catch (error) {
    // Check for 401 Unauthorized error to refresh the token
    if (error.response && error.response.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        // Retry the original request with the new access token
        if (method === 'post') {
          return await apiPost(endpoint, data, newAccessToken);
        } else if (method === 'put') {
          return await apiPut(endpoint, data, newAccessToken);
        } else {
          return await apiGet(endpoint, newAccessToken);
        }
      } catch (refreshError) {
        console.error('Failed to refresh access token:', refreshError);
        throw refreshError;  // Re-throw if refresh fails
      }
    }
    throw error;  // Re-throw the original error if not a 401
  }
}
