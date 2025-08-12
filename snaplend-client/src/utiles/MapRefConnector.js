import { useMap } from "react-leaflet";
import { useEffect } from "react";

function MapRefConnector({ onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map]);

  return null;
}

export default MapRefConnector;