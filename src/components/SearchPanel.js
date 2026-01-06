import React, { useCallback } from 'react';
import { StandaloneSearchBox } from '@react-google-maps/api';
import { useJsApiLoader } from '@react-google-maps/api';
import { Button, FormControlLabel, Checkbox, CircularProgress } from '@mui/material';

const libraries = ['places'];

const SearchPanel = ({
  onOriginChange,
  onDestinationChange,
  onSearch,
  isLoading,
  origin,
  destination,
  showTransitLayer,
  setShowTransitLayer,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [originSearchBox, setOriginSearchBox] = React.useState(null);
  const [destSearchBox, setDestSearchBox] = React.useState(null);

  const onOriginLoad = useCallback(ref => setOriginSearchBox(ref), []);
  const onDestLoad = useCallback(ref => setDestSearchBox(ref), []);

  const onPlacesChanged = (searchBox, setter) => {
    const places = searchBox.getPlaces();
    if (places && places.length > 0) setter(places[0].geometry.location);
  };

  if (!isLoaded) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6 space-y-6 border-b">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
        <StandaloneSearchBox onLoad={onOriginLoad} onPlacesChanged={() => onPlacesChanged(originSearchBox, onOriginChange)}>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter starting point"
          />
        </StandaloneSearchBox>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
        <StandaloneSearchBox onLoad={onDestLoad} onPlacesChanged={() => onPlacesChanged(destSearchBox, onDestinationChange)}>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter destination"
          />
        </StandaloneSearchBox>
      </div>

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={onSearch}
        disabled={!origin || !destination || isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Find Live Routes'}
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            checked={showTransitLayer}
            onChange={e => setShowTransitLayer(e.target.checked)}
          />
        }
        label="Show transit lines & stops (real-time in supported cities)"
      />
    </div>
  );
};

export default SearchPanel;