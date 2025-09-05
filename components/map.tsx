"use client";

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import type { Report } from '@/lib/store'; // Gives Us Report Type

// Define colors for each report type
const reportIconColors = {
  pothole: "#F59E0B", // Amber
  "traffic-light": "#EF4444", // Red
  obstruction: "#EAB308", // Yellow
  debris: "#3B82F6", // Blue
  accident: "#8B5CF6", // Violet
};

// Define the types for the component's props
interface MapComponentProps {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
  reports: Report[]; // Accept an array of reports
  directionsResponse: google.maps.DirectionsResult | null;
}

function MapComponent({ center, zoom, reports, directionsResponse }: MapComponentProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!
  });

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '100%' }}
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
        {reports.map((report) => (
          <Marker
            key={report.id}
            position={report.location}
            title={report.address}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              fillColor: reportIconColors[report.type] || '#A1A1AA', // Use mapped color
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#FFFFFF',
              scale: 8, // Adjust size of the circle
            }}
          />
        ))}
        
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
  ) : <div>Loading Map...</div>
}

export default React.memo(MapComponent);