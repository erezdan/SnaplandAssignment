// api/auth-api.js

import api from './base-api';
import AuthService from '../services/auth-service';

const authApi = {
  /**
   * Register a new user and log them in if successful.
   * @param {Object} userData - { email, password, displayName }
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData);
    if (response.data?.token) {
      AuthService.onLogin(response.data);
    }
    return response.data;
  },

  /**
   * Login an existing user and store the token if successful.
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials);
    if (response.data?.token) {
      AuthService.onLogin(response.data);
    }
    return response.data;
  },
};

export default authApi;
