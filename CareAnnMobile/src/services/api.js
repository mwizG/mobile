import axios from 'axios';

// Use the special IP address for Android emulators to access your machine's localhost
const BASE_URL = 'http://10.0.2.2:8000/api'; 

export async function apiGet(endpoint, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    // Log the full URL and headers for debugging purposes
    console.log('GET Request URL:', url);
    console.log('GET Request Headers:', headers);

    const response = await axios.get(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during GET request:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiPost(endpoint, data, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    // Log the full URL and headers for debugging purposes
    console.log('POST Request URL:', url);
    console.log('POST Request Headers:', headers);

    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during POST request:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiPut(endpoint, data, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    // Log the full URL and headers for debugging purposes
    console.log('PUT Request URL:', url);
    console.log('PUT Request Headers:', headers);

    const response = await axios.put(url, data, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during PUT request:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error after logging it
  }
}

export async function apiDelete(endpoint, token = null) {
  try {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    
    // Log the full URL and headers for debugging purposes
    console.log('DELETE Request URL:', url);
    console.log('DELETE Request Headers:', headers);

    const response = await axios.delete(url, { headers });
    return response.data;
  } catch (error) {
    console.error('Error during DELETE request:', error.response ? error.response.data : error.message);
    throw error;  // Re-throw the error after logging it
  }
}
