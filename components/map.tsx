"use client";

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Define the types for the component's props
interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

function MapComponent({ center, zoom }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center} // Use the center from props
        zoom={zoom}     // Use the zoom from props
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          zoomControl: false // Optional: hide zoom controls for a cleaner mobile view
        }}
      >
        <Marker position={center} />
      </GoogleMap>
  ) : <div>Loading Map...</div>
}

export default React.memo(MapComponent);