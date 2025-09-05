"use client";

import { LoadScript } from "@react-google-maps/api";
import React from "react";

// Define the libraries you need globally here. 'places' and 'geometry' are good defaults.
const libraries: ("places" | "geometry")[] = ['places', 'geometry'];

export function GoogleMapsProvider({ children }: { children: React.ReactNode }) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={libraries}
    >
      {children}
    </LoadScript>
  );
}
