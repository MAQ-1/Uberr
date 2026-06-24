import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Custom Uber-style live location blue marker
const customMarkerIcon = L.divIcon({
  className: 'custom-location-icon',
  html: `<div style="
    background-color: #276ef1; 
    width: 24px; 
    height: 24px; 
    border-radius: 50%; 
    border: 4px solid white; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  "></div>
  <div style="
    background-color: rgba(39, 110, 241, 0.2);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: pulse 2s infinite;
  "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12], // Anchors the exact center
})

// Sub-component to track the user location and optionally keep it centered
const MapController = ({ position, shouldCenter, setShouldCenter }) => {
  const map = useMap();
  
  // Follow marker with smooth scroll
  useEffect(() => {
    if (position && shouldCenter) {
      map.flyTo(position, 16, {
        animate: true,
        duration: 1.5, // Uber-like smooth sliding
      });
    }
  }, [position, shouldCenter, map]);

  // If user interactively drags the map, stop auto-following
  useEffect(() => {
    const handleDragStart = () => {
      setShouldCenter(false);
    };
    
    map.on('dragstart', handleDragStart);
    return () => {
      map.off('dragstart', handleDragStart);
    };
  }, [map, setShouldCenter]);

  return null;
}

const LiveTracking = () => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [error, setError] = useState(null)
  const [shouldCenter, setShouldCenter] = useState(true) // Track if map lock is active
  
  const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported")
      return
    }

    // Reactivate watchPosition for real-time optimal tracking
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setCurrentPosition([latitude, longitude])
        setError(null)
      },
      (err) => {
        console.error("Watch Error:", err.message)
        setError(err.message)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  if (!geoapifyApiKey) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 text-red-600 p-4 text-center border-t">
        <strong>Error: Missing Geoapify API Key</strong>
      </div>
    )
  }

  // Force Recenter Action handler
  const handleRecenter = () => {
    if (currentPosition) {
      setShouldCenter(true); // Turns auto-follow back on temporarily triggering effect
    }
  }

  return (
    // Style applied globally to run the pulse animation for the marker
    <div className="h-full w-full relative overflow-hidden bg-gray-200">
      <style>
        {`
          @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          }
          .custom-location-icon { background: transparent; border: none; }
          .leaflet-control-container { display: none; } 
        `}
      </style>

      {/* Floating Action Recenter Button */}
      <button 
        onClick={handleRecenter}
        className="absolute top-4 right-4 z-[1000] bg-white w-12 h-12 rounded-full shadow-lg border border-gray-100 flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
        title="Find My Location"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="#276ef1">
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12C15 13.6569 13.6569 15 12 15Z"/>
        </svg>
      </button>

      {/* Main Map UI */}
      {currentPosition ? (
        <MapContainer 
          center={currentPosition} 
          zoom={16} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          zoomControl={false}
          attributionControl={false} // Clean minimal UI for app
        >
          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${geoapifyApiKey}`}
          />
          
          <MapController position={currentPosition} shouldCenter={shouldCenter} setShouldCenter={setShouldCenter} />
          
          <Marker position={currentPosition} icon={customMarkerIcon} />
        </MapContainer>
      ) : (
        <div className="flex items-center justify-center h-full w-full">
           {/* Fallback spinner / loading screen */}
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#276ef1]"></div>
        </div>
      )}

      {error && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-100 text-red-600 p-3 rounded-lg text-center text-sm shadow-lg border border-red-200">
          <strong>Location Error:</strong> {error}
        </div>
      )}
    </div>
  )
}

export default LiveTracking