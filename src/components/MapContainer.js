import React, { useEffect, useState } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';

const mapContainerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: 37.7749, lng: -122.4194 };

const MapContainer = ({ selectedRoute, showTransitLayer }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [transitLayer, setTransitLayer] = useState(null);

  useEffect(() => {
    if (!map) return;
    if (!transitLayer) {
      const layer = new window.google.maps.TransitLayer();
      setTransitLayer(layer);
    }
    transitLayer?.setMap(showTransitLayer ? map : null);
  }, [map, showTransitLayer, transitLayer]);

  useEffect(() => {
    if (map && selectedRoute) {
      map.fitBounds(selectedRoute.directionsRoute.bounds);
    }
  }, [map, selectedRoute]);

  if (!isLoaded) return <div className="flex items-center justify-center h-full bg-gray-200">Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={defaultCenter}
      onLoad={setMap}
    >
      {selectedRoute && (
        <DirectionsRenderer
          directions={selectedRoute.directionsResult}
          options={{ suppressMarkers: false }}
        />
      )}
    </GoogleMap>
  );
};

export default MapContainer;