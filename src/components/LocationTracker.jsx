import React, { useState, useEffect } from 'react';

function LocationTracker() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            setError(error.message);
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    };

    getLocation(); // Call the function to get the location

    // Optional: Watch for location changes (more resource-intensive)
    // const watchId = navigator.geolocation.watchPosition(
    //   (position) => {
    //     setLocation({
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     });
    //   },
    //   (error) => {
    //     setError(error.message);
    //   }
    // );

    // Cleanup: Clear the watch if you're using it
    // return () => {
    //   if (watchId) {
    //     navigator.geolocation.clearWatch(watchId);
    //   }
    // };
  }, []); // Empty dependency array ensures this runs only once on mount

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (location) {
    return (
      <div>
        <p>Latitude: {location.latitude}</p>
        <p>Longitude: {location.longitude}</p>
      </div>
    );
  }

  return <p>Getting location...</p>;
}

export default LocationTracker;