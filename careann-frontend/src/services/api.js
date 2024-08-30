// src/utils/api.js

import axios from 'axios';

// Set the base URL for the API
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
});

// Optionally, you can also set default headers if needed, like authorization tokens
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Token ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
