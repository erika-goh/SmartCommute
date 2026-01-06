import React, { useState } from 'react';
import Header from './components/Header';
import SearchPanel from './components/SearchPanel';
import RouteList from './components/RouteList';
import MapContainer from './components/MapContainer';

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showTransitLayer, setShowTransitLayer] = useState(true);

  const calculateRoutes = async () => {
    if (!origin || !destination) return;

    setIsLoading(true);
    setError(null);
    setRoutes([]);

    try {
      const directionsService = new window.google.maps.DirectionsService();
      const modeStrings = ['DRIVING', 'TRANSIT', 'BICYCLING', 'WALKING'];
      const modes = modeStrings.map(m => window.google.maps.TravelMode[m]);

      const requests = modes.map((mode, idx) => {
        const request = {
          origin,
          destination,
          travelMode: mode,
          provideRouteAlternatives: true,
        };
        if (mode === window.google.maps.TravelMode.DRIVING) {
          request.drivingOptions = {
            departureTime: new Date(),
            trafficModel: window.google.maps.TrafficModel.BEST_GUESS,
          };
        }
        return directionsService.route(request);
      });

      const responses = await Promise.all(requests.map(p => p.catch(() => null)));

      const allRoutes = [];
      responses.forEach((result, idx) => {
        if (result && result.routes) {
          result.routes.forEach(route => {
            const leg = route.legs[0];
            allRoutes.push({
              directionsRoute: route,
              directionsResult: { routes: [route] },
              travelMode: modeStrings[idx],
              distance: leg.distance.text,
              duration: leg.duration.text,
              durationValue: leg.duration.value,
              stepsModes: leg.steps.map(step => step.travel_mode).join(' → '),
            });
          });
        }
      });

      // Sort fastest first
      allRoutes.sort((a, b) => a.durationValue - b.durationValue);

      setRoutes(allRoutes);
      if (allRoutes.length > 0) setSelectedRoute(allRoutes[0]);
    } catch (err) {
      setError('Failed to calculate routes. Check API key, connection, or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-96 bg-white shadow-lg flex flex-col">
          <SearchPanel
            origin={origin}
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onSearch={calculateRoutes}
            isLoading={isLoading}
            showTransitLayer={showTransitLayer}
            setShowTransitLayer={setShowTransitLayer}
          />
          <RouteList
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            isLoading={isLoading}
            error={error}
            onRefresh={calculateRoutes}
            hasLocations={!!origin && !!destination}
          />
        </div>
        <div className="flex-1">
          <MapContainer
            selectedRoute={selectedRoute}
            showTransitLayer={showTransitLayer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;