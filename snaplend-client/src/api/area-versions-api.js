// src/services/area-versions-api.js

import api from './base-api';

/**
 * Creates a new version for the given area.
 * @param {string} areaId - Area ID (UUID).
 * @param {string} name - Version name.
 * @param {number[][]} coordinates - Polygon coordinates as [ [lng, lat], ... ].
 * @returns {Promise<object>} - Created version data.
 */
export async function createAreaVersion(areaId, name, coordinates) {
  const response = await api.post(`/areas/${areaId}/versions`, {
    name,
    coordinates,
  });
  return response.data;
}

/**
 * Retrieves all versions for a specific area.
 * @param {string} areaId - Area ID (UUID).
 * @returns {Promise<Array>} - List of area versions.
 */
export async function getAreaVersions(areaId) {
  const response = await api.get(`/areas/${areaId}/versions`);
  return response.data;
}
