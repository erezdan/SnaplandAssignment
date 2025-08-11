import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Square, 
  X,
  Ruler
} from "lucide-react";

export default function DrawingTools({ 
  isDrawing, 
  currentArea,
  onStartDrawing,
  onCancelDrawing,
}) {

  return (
    <>
      {/* Drawing Tools Toolbar */}
      <div className="absolute left-4 top-32 z-[1000] animate-slide-in">
        <Card className="bg-white/95 backdrop-blur-sm shadow-lg border-0">
          <CardContent className="p-3">
            <div className="flex flex-col space-y-2">
              <Button
                size="sm"
                variant={isDrawing ? "default" : "outline"}
                onClick={onStartDrawing}
                disabled={isDrawing}
                className="w-full justify-start"
              >
                <Square className="w-4 h-4 mr-2" />
                Draw Area
              </Button>
              
              {isDrawing && (
                <>
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Ruler className="w-4 h-4 text-sky-600" />
                      <span className="text-sky-700 font-medium">
                        {currentArea.toFixed(3)} km²
                      </span>
                    </div>
                    <p className="text-xs text-sky-600 mt-1">
                      Click to add points. Double-click to finish.
                    </p>
                  </div>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onCancelDrawing}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}