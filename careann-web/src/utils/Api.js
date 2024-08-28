import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:8000/api'; // Replace with your backend's base URL

export async function apiGet(endpoint, token = null) {
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await axios.get(url, { headers });
  return response.data;
}

export async function apiPost(endpoint, data, token = null) {
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  const response = await axios.post(url, data, { headers });
  return response.data;
}
export async function apiPut(endpoint, data, token = null) {
    const headers = token ? { Authorization: `Token ${token}` } : {};
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const response = await axios.put(url, data, { headers });
    return response.data;
  }