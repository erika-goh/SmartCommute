import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import useDirections from './hooks/useDirections';
import SearchPanel from './components/SearchPanel';
import RouteList from './components/RouteList';
import MapContainer from './components/MapContainer';

function App() {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showTransitLayer, setShowTransitLayer] = useState(true);

  const { routes, loading: isLoading, error, refresh } = useDirections({ origin, destination });

  // Keep selectedRoute in sync when routes update
  useEffect(() => {
    if (routes && routes.length > 0) {
      setSelectedRoute((prev) => {
        if (prev) return prev;
        return routes[0];
      });
    } else {
      setSelectedRoute(null);
    }
  }, [routes]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header onRefresh={refresh} />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-full md:w-96 bg-white shadow-lg flex flex-col">
          <SearchPanel
            origin={origin}
            destination={destination}
            onOriginChange={setOrigin}
            onDestinationChange={setDestination}
            onSearch={refresh}
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
            onRefresh={refresh}
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