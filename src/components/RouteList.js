import React from 'react';
import { List, ListItem, ListItemText, Divider, Button, CircularProgress } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

const getCO2Estimate = (travelMode, distMeters) => {
  if (!distMeters) return 'N/A';
  const distKm = distMeters / 1000;
  let gramsPerKm = 0;
  switch (travelMode) {
    case 'DRIVING':
      gramsPerKm = 170; // average car
      break;
    case 'TRANSIT':
      gramsPerKm = 80; // average public transit
      break;
    case 'BICYCLING':
    case 'WALKING':
      return 'Zero emissions 🌿';
    default:
      return 'N/A';
  }
  return `${Math.round(distKm * gramsPerKm)}g CO₂ (est.)`;
};

const RouteList = ({ routes, selectedRoute, onSelectRoute, isLoading, error, onRefresh, hasLocations }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-gray-50 p-4 flex justify-between items-center border-b sticky top-0 z-10">
        <h2 className="text-xl font-semibold">Route Options {routes.length > 0 && `(${routes.length})`}</h2>
        {hasLocations && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            disabled={isLoading}
          >
            Refresh
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center p-12">
          <CircularProgress />
          <p className="mt-4 text-gray-600">Fetching live traffic & transit...</p>
        </div>
      )}

      {error && (
        <div className="p-6 text-center text-red-600">
          {error}
        </div>
      )}

      {!isLoading && !error && routes.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          Enter locations above and click "Find Live Routes"
        </div>
      )}

      {routes.length > 0 && (
        <List>
          {routes.map((routeObj, i) => {
            const { directionsRoute } = routeObj;
            const leg = directionsRoute.legs[0];
            return (
              <React.Fragment key={i}>
                <ListItem
                  button
                  selected={selectedRoute === routeObj}
                  onClick={() => onSelectRoute(routeObj)}
                  className="hover:bg-blue-50"
                >
                  <ListItemText
                    primary={`${routeObj.distance} • ${routeObj.duration}`}
                    secondary={`${routeObj.stepsModes} • ${getCO2Estimate(routeObj.travelMode, leg.distance.value)}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            );
          })}
        </List>
      )}
    </div>
  );
};

export default RouteList;