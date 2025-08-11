import React from "react";
import { useMap } from "react-leaflet";
import { Button } from "../ui/button";
import { Plus, Minus, Navigation } from "lucide-react";

export default function MapControls() {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  const centerMap = () => {
    map.setView([31.7683, 35.2137], 10);
  };

  return (
    <div className="absolute bottom-4 right-4 z-[1000] flex flex-col space-y-2">
      <Button
        size="sm"
        variant="outline"
        onClick={zoomIn}
        className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:bg-white"
      >
        <Plus className="w-5 h-5" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={zoomOut}
        className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:bg-white"
      >
        <Minus className="w-5 h-5" />
      </Button>
      
      <Button
        size="sm"
        variant="outline"
        onClick={centerMap}
        className="w-10 h-10 p-0 bg-white/95 backdrop-blur-sm shadow-lg border-0 hover:bg-white"
      >
        <Navigation className="w-4 h-4" />
      </Button>
    </div>
  );
}