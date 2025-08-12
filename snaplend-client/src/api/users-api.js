// src/services/users-api.js

import api from './base-api';

/**
 * Retrieves all users with their display name and active status.
 * @returns {Promise<Array<{ displayName: string, isActive: boolean }>>} - List of users with status.
 */
export async function getAllUsersStatus() {
  const response = await api.get('/users/status');
  return response.data;
}
