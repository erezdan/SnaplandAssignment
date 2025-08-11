import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { 
  X, 
  MapPin, 
  Calendar, 
  User, 
  Ruler,
  Eye,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";

export default function AreasList({ areas, selectedArea, onAreaSelect, onClose }) {
  const [hoveredArea, setHoveredArea] = useState(null);

  return (
    <Card className="absolute right-4 top-32 bottom-4 w-80 z-[1000] bg-white/95 backdrop-blur-sm shadow-2xl border-0 animate-slide-in">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-sky-600" />
            Saved Areas
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-600">
          <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
          <span>{areas.length} areas in current view</span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-3">
            {areas.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-500">No areas saved yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Start drawing to create your first area
                </p>
              </div>
            ) : (
              areas.map((area) => (
                <div
                  key={area.id}
                  className={`group p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                    selectedArea?.id === area.id
                      ? "border-sky-500 bg-sky-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  onClick={() => onAreaSelect(area)}
                  onMouseEnter={() => setHoveredArea(area.id)}
                  onMouseLeave={() => setHoveredArea(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-slate-900 truncate">
                          {area.name}
                        </h3>
                        {hoveredArea === area.id && (
                          <ChevronRight className="w-4 h-4 text-sky-600 animate-fade-in" />
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Ruler className="w-3 h-3 text-slate-400" />
                          <Badge variant="secondary" className="text-xs">
                            {area.area_km2?.toFixed(3)} km²
                          </Badge>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <User className="w-3 h-3" />
                          <span>{area.created_by || "Unknown"}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {format(new Date(area.created_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAreaSelect(area);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {selectedArea?.id === area.id && (
                    <div className="mt-3 pt-3 border-t border-sky-200 animate-fade-in">
                      <div className="flex items-center space-x-2 text-xs text-sky-600">
                        <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse"></div>
                        <span>Currently viewing this area</span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}