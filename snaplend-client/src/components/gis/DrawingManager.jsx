import React, { useState, useEffect } from 'react';
import { useMapEvents, Polygon } from 'react-leaflet';

/**
 * Calculates the geodesic area of a polygon.
 * @param {L.LatLng[]} latlngs - An array of Leaflet LatLng objects.
 * @returns {number} The area in square kilometers.
 */
const calculateArea = (latlngs) => {
    if (!latlngs || latlngs.length < 3) {
        return 0;
    }

    const EARTH_RADIUS_M = 6378137; // WGS-84 semi-major axis in meters
    const rad = Math.PI / 180;
    let area = 0;
    const n = latlngs.length;

    for (let i = 0; i < n; i++) {
        const p1 = latlngs[i];
        const p2 = latlngs[(i + 1) % n];
        
        const lon1 = p1.lng * rad;
        const lon2 = p2.lng * rad;
        const lat1 = p1.lat * rad;
        const lat2 = p2.lat * rad;

        // Formula for area of a spherical trapezoid
        area += (lon2 - lon1) * (2 + Math.sin(lat1) + Math.sin(lat2));
    }

    area = Math.abs(area * EARTH_RADIUS_M * EARTH_RADIUS_M / 2.0);
    return area / 1000000.0; // Convert square meters to square kilometers
};

export default function DrawingManager({ isDrawing, onAreaUpdate, onPolygonComplete }) {
  const [points, setPoints] = useState([]);
  const [clickTimeout, setClickTimeout] = useState(null);

  const map = useMapEvents({
    click(e) {
      if (!isDrawing) return;

      // small delay to ignot the cklick
      if (clickTimeout) clearTimeout(clickTimeout);

      const timeout = setTimeout(() => {
        const newPoints = [...points, e.latlng];
        setPoints(newPoints);
        const area = calculateArea(newPoints);
        onAreaUpdate(area);
      }, 200);

      setClickTimeout(timeout);
    },

    dblclick(e) {
      if (!isDrawing || points.length < 2) return;
      
      if (clickTimeout) {
        clearTimeout(clickTimeout);
        setClickTimeout(null);
      }

      const finalPoints = [...points, e.latlng];
      onPolygonComplete(finalPoints);
      setPoints([]);
    }
  });

  useEffect(() => {
    if (isDrawing) {
      map.getContainer().style.cursor = 'crosshair';
      setPoints([]);
    } else {
      map.getContainer().style.cursor = '';
      setPoints([]);
    }

    return () => {
      if (map.getContainer()) map.getContainer().style.cursor = '';
      if (clickTimeout) clearTimeout(clickTimeout);
    };
  }, [isDrawing, map]);

  if (!isDrawing || points.length === 0) return null;

  return (
    <Polygon
      positions={points}
      pathOptions={{
        color: "#0ea5e9",
        fillColor: "#0ea5e9",
        fillOpacity: 0.2,
        weight: 3,
        dashArray: '5, 5'
      }}
    />
  );
}
