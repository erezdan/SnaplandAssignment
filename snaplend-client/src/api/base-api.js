// services/base-api.js

import axios from 'axios';
import AuthService from './auth-service';

// Create Axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – adds token from AuthService if available
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor – handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
