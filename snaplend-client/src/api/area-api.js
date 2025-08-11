// src/services/area-api.js

import api from './base-api';

/**
 * Creates a new area with name and coordinates.
 * @param {string} name - Name of the area.
 * @param {number[][]} coordinates - Polygon coordinates as [ [lng, lat], ... ].
 * @returns {Promise<object>} - Created area data.
 */
export async function createArea(name, coordinates) {
  const response = await api.post('/areas', { name, coordinates });
  return response.data;
}

/**
 * Retrieves all areas inside a bounding box.
 * @param {number} minLng - Minimum longitude (SW corner).
 * @param {number} minLat - Minimum latitude (SW corner).
 * @param {number} maxLng - Maximum longitude (NE corner).
 * @param {number} maxLat - Maximum latitude (NE corner).
 * @returns {Promise<Array>} - List of area DTOs.
 */
export async function getAreas(minLng, minLat, maxLng, maxLat) {
  const response = await api.get('/areas', {
    params: { minLng, minLat, maxLng, maxLat },
  });
  return response.data;
}

/**
 * Retrieves a specific area by ID.
 * @param {string} id - Area ID.
 * @returns {Promise<object>} - Area DTO.
 */
export async function getAreaById(id) {
  const response = await api.get(`/areas/${id}`);
  return response.data;
}

/**
 * Soft deletes an area by ID.
 * @param {string} id - Area ID.
 * @returns {Promise<void>}
 */
export async function deleteArea(id) {
  await api.delete(`/areas/${id}`);
}
