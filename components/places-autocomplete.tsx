// components/places-autocomplete.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { Input } from "@/components/ui/input";

interface PlacesAutocompleteProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder: string;
  id: string;
}

export default function PlacesAutocomplete({ onPlaceSelect, placeholder, id }: PlacesAutocompleteProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onLoad = (autocompleteInstance: google.maps.places.Autocomplete) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      onPlaceSelect(place);
    } else {
      console.error('Autocomplete is not loaded yet!');
    }
  };

  return (
    <Autocomplete
      onLoad={onLoad}
      onPlaceChanged={onPlaceChanged}
      options={{ componentRestrictions: { country: 'za' } }}
      fields={['formatted_address', 'geometry']} // Only request the data we need
    >
      <Input
        id={id}
        placeholder={placeholder}
        ref={inputRef}
        className="flex-1"
      />
    </Autocomplete>
  );
}