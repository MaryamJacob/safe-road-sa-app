// safe-road-sa-app/components/location-picker-map.tsx

"use client";

import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Button } from '@/components/ui/button';
import { fetchCurrentLocation } from './current-location';

const containerStyle = {
  width: '100%',
  height: '60vh' // Use viewport height to be responsive
};

// Define the component's props for communication
interface LocationPickerProps {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
  onClose: () => void;
}

export default function LocationPickerMap({ onLocationSelect, onClose }: LocationPickerProps) {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: -26.2041, lng: 28.0473 }); // Default to Johannesburg

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  // Handle map click event
  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkerPosition(newPos);
    }
  };
  
  // Center map on user's current location initially
  const centerOnUser = async () => {
    try {
      const coords = await fetchCurrentLocation();
      setMapCenter(coords);
      setMarkerPosition(coords); // Also place a marker there
    } catch (error) {
      console.error(error);
      alert("Could not get your current location.");
    }
  }

  // Confirm the selected location
  const handleConfirmLocation = () => {
    if (markerPosition) {
      onLocationSelect(markerPosition);
    }
  };

  return isLoaded ? (
    <div className="space-y-4">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={12}
        onClick={handleMapClick}
        onLoad={centerOnUser} // Center on user when map first loads
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
      <div className="flex justify-end gap-2">
         <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
         <Button type="button" onClick={handleConfirmLocation} disabled={!markerPosition}>
           Confirm Location
         </Button>
      </div>
    </div>
  ) : <div>Loading Map...</div>
}