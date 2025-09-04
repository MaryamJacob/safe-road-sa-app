// components/current-location.tsx

/**
 * Fetches the user's current geographic location.
 * @returns A Promise that resolves with an object containing latitude and longitude.
 */
export const fetchCurrentLocation = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation is not supported by your browser."));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        // Return a more user-friendly error message
        switch(error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("You denied the request for Geolocation."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable."));
            break;
          case error.TIMEOUT:
            reject(new Error("The request to get user location timed out."));
            break;
          default:
            reject(new Error("An unknown error occurred while fetching location."));
            break;
        }
      }
    );
  });
};