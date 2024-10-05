import axios from 'axios';

// Base URL for the API
const BASE_URL = 'http://192.168.251.86:8000/api';

// Create an Axios instance with the base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper methods for API requests
const get = (url, config = {}) => {
  return api.get(url, config);
};

const post = (url, data, config = {}) => {
  return api.post(url, data, config);
};

const put = (url, data, config = {}) => {
  return api.put(url, data, config);
};

const del = (url, config = {}) => {
  return api.delete(url, config);
};

// Export the API methods
export { get, post, put, del };
export default api;
