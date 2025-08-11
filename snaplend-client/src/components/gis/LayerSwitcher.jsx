import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Map, Satellite } from "lucide-react";

export default function LayerSwitcher({ currentLayer, onLayerChange }) {
  return (
    <Card className="absolute bottom-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm shadow-lg border-0">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-slate-700">Map Layer:</span>
          <div className="flex space-x-1">
            <Button
              size="sm"
              variant={currentLayer === "osm" ? "default" : "outline"}
              onClick={() => onLayerChange("osm")}
              className="px-3 py-1 h-8"
            >
              <Map className="w-3 h-3 mr-1" />
              Street
            </Button>
            <Button
              size="sm"
              variant={currentLayer === "satellite" ? "default" : "outline"}
              onClick={() => onLayerChange("satellite")}
              className="px-3 py-1 h-8"
            >
              <Satellite className="w-3 h-3 mr-1" />
              Satellite
            </Button>
          </div>
          <Badge variant="secondary" className="text-xs ml-2">
            {currentLayer === "osm" ? "OpenStreetMap" : "GovMap"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}