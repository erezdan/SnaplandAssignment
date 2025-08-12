
import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { User } from "../entities/User";
import { Area } from "../entities/Area";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { Save, X } from "lucide-react";
import { createArea, getAreas } from "../api/area-api";
import { getAllUsersStatus } from "../api/users-api";
import { useToast } from "../components/ui/use-toast";
import MapRefConnector from "../utiles/MapRefConnector";

import DrawingTools from "../components/gis/DrawingTools";
import AreasList from "../components/gis/AreasList";
import ActiveUsers from "../components/gis/ActiveUsers";
import MapControls from "../components/gis/MapControls";
import LayerSwitcher from "../components/gis/LayerSwitcher";
import DrawingManager from "../components/gis/DrawingManager";
import AuthService from "../services/auth-service"; // Import for authentication
import AuthModal from "../components/gis/AuthModal";

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function GISMapPage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);
  const [currentLayer, setCurrentLayer] = useState("osm");
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentArea, setCurrentArea] = useState(0);
  const [finalPolygon, setFinalPolygon] = useState(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [areaName, setAreaName] = useState("");
  const [showAreasList, setShowAreasList] = useState(false);
  const [showActiveUsers, setShowActiveUsers] = useState(false);
  
  const mapRef = useRef(null);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      const userData = await checkAuth();
      if (userData) {
        // Only call authenticated APIs if user is authenticated
        try {
          const users = await getAllUsersStatus();
          setActiveUsers(users);
          await loadAreas();
        } catch (error) {
          console.error('Error loading data:', error);
          // Handle 401 gracefully without showing auth modal again
        }
      }
      // If no user, show auth modal
      if (!userData) {
        setShowAuthModal(true);
      }
    };
  
    init();
  }, []);

  const checkAuth = async () => {
    try {
      // Only make API call if there's a user token in localStorage
      if (AuthService.isAuthenticated()) {
        const userData = await User.me();
        setUser(userData);
        return userData;
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);}
    return null;
  };

  const loadAreas = async () => {
    try {
      const map = mapRef.current;
      if (!map) return;
  
      // Get bounds from Leaflet map
      const bounds = map.getBounds();
      const minLat = bounds.getSouth();
      const maxLat = bounds.getNorth();
      const minLng = bounds.getWest();
      const maxLng = bounds.getEast();
  
      const areasData = await getAreas(minLng, minLat, maxLng, maxLat);
      setAreas(areasData);
    } catch (error) {
      console.error("Error loading areas:", error);
    }
  };

  const handleLogin = async (userData) => {
    if (userData) {
      // User successfully logged in
      setUser(userData);
      setShowAuthModal(false);
      
      // Load data after successful login
      try {
        const users = await getAllUsersStatus();
        setActiveUsers(users);
        await loadAreas();
      } catch (error) {
        console.error('Error loading data after login:', error);
        // Don't show auth modal again on 401, just log the error
        // The user is already logged in, so we don't want to force them to log in again
      }
    } else {
      // User closed the modal without logging in
      setShowAuthModal(false);
    }
  };

  const handleLogout = () => {
    AuthService.onLogout();
    setUser(null);
  };

  const handleSaveArea = async () => {
    if (!finalPolygon || !areaName.trim()) return;
  
    const coordinates = finalPolygon.map(p => [p.lng, p.lat]);
  
    try {
      await createArea(areaName, coordinates);
      await loadAreas();
    } catch (err) {
      toast({
        title: "Error",
        description: `Error saving area: ${err.message}` || "Error saving area: ",
        variant: "destructive",
      });
    }
  
    // Reset state
    setShowSaveDialog(false);
    setFinalPolygon(null);
    setAreaName("");
    setCurrentArea(0);
  };
  

  const handleAreaSelect = (area) => {
    setSelectedArea(area);
    if (mapRef.current && area.bounds) {
      mapRef.current.fitBounds([
        [area.bounds.south, area.bounds.west],
        [area.bounds.north, area.bounds.east]
      ]);
    }
  };

  const handleLayerChange = (layerType) => {
    setCurrentLayer(layerType);
  };
  
  const handlePolygonComplete = (points) => {
    setFinalPolygon(points);
    setShowSaveDialog(true);
    setIsDrawing(false);
  };
  
  const handleCancelSave = () => {
    setShowSaveDialog(false);
    setFinalPolygon(null);
    setAreaName("");
    setCurrentArea(0);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
          <p className="text-slate-600 font-medium">Loading GIS Application...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-slate-50">
      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">GIS Collaborative</h1>
                <p className="text-xs text-slate-500">Real-time mapping platform</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
          {user ? (
            <>
              {/* Toggle areas panel - visible only on medium screens and up */}
              <button
                onClick={() => setShowAreasList(!showAreasList)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <span className="text-sm font-medium">Areas</span>
              </button>

              {/* Show active users - visible only on medium screens and up */}
              <button
                onClick={() => setShowActiveUsers(!showActiveUsers)}
                className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">
                  {activeUsers.filter(u => u.isActive).length} Online
                </span>
              </button>

              {/* User avatar, name, and logout */}
              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-sky-600 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-white">
                      {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-slate-900">{user.full_name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            // Login button for unauthenticated users
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition-colors text-sm font-medium"
            >
              Login
            </button>
          )}
        </div>
        </div>
      </header>

      {/* Main Map Container */}
      <div className="absolute inset-0 pt-20">
        <MapContainer
          center={[31.7683, 35.2137]} // Jerusalem coordinates
          zoom={10}
          className="w-full h-full"
          zoomControl={false}
        >
            <MapRefConnector onMapReady={async (mapInstance) => {
              mapRef.current = mapInstance;
            }} />

          {currentLayer === "osm" ? (
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          ) : (
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='Tiles &copy; Esri'
            />
          )}
          
          <MapControls />
          
          {user && (
            <DrawingManager
              isDrawing={isDrawing}
              onAreaUpdate={setCurrentArea}
              onPolygonComplete={handlePolygonComplete}
            />
          )}
        </MapContainer>

        {/* Layer Switcher */}
        <LayerSwitcher
          currentLayer={currentLayer}
          onLayerChange={handleLayerChange}
        />

        {/* Drawing Tools */}
        {user && (
          <DrawingTools
            isDrawing={isDrawing}
            currentArea={currentArea}
            onStartDrawing={() => {
                setIsDrawing(true);
                setCurrentArea(0);
            }}
            onCancelDrawing={() => {
                setIsDrawing(false);
                setCurrentArea(0);
            }}
          />
        )}

        {/* Areas List Sidebar */}
        {user && showAreasList && (
          <AreasList
            areas={areas}
            selectedArea={selectedArea}
            onAreaSelect={handleAreaSelect}
            onClose={() => setShowAreasList(false)}
          />
        )}

        {/* Active Users Panel */}
        {user && showActiveUsers && (
          <ActiveUsers
            users={activeUsers}
            currentUser={user}
            onClose={() => setShowActiveUsers(false)}
          />
        )}
      </div>
      
      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[1500] flex items-center justify-center animate-fade-in">
          <Card className="w-full max-w-md mx-4 bg-white shadow-2xl border-0">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Save className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Save New Area</h3>
                  <p className="text-sm text-slate-600">
                    Area: <Badge variant="outline" className="ml-1">{currentArea.toFixed(3)} km²</Badge>
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Area Name</label>
                  <Input
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="Enter area name..."
                    className="w-full"
                    autoFocus
                  />
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={handleCancelSave}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveArea}
                    disabled={!areaName.trim()}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save Area
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      )}
      {showAuthModal && (
        <AuthModal open={true} onClose={handleLogin} />
      )}
    </div>
  );
}
