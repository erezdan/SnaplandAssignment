// src/services/auth-api.js

import api from './base-api';

/**
 * Logs in a user with email and password.
 * @param {string} email - User email.
 * @param {string} password - User password.
 * @returns {Promise<{ token: string, displayName: string }>}
 */
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

/**
 * Registers a new user.
 * @param {string} email - New user's email.
 * @param {string} password - New user's password.
 * @param {string} displayName - Display name for the user.
 * @returns {Promise<void>}
 */
export async function register(email, password, displayName) {
  await api.post('/auth/register', { email, password, displayName });
}

/**
 * Verifies whether the current token is still valid.
 * @returns {Promise<{ displayName: string }>}
 */
export async function verifyToken() {
  const response = await api.get('/auth/verify');
  return response.data;
}
