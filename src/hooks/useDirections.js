import { useState, useEffect, useRef, useCallback } from 'react';

// Client-side Directions fetcher using window.google.maps.DirectionsService
// Exposes: routes (array), loading, error, refresh()

export default function useDirections({ origin, destination, modes = ['DRIVING','TRANSIT','BICYCLING','WALKING'], autoPoll = false, pollInterval = 45000 }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pollRef = useRef(null);
  const refreshKey = useRef(0);

  const fetchForMode = (mode) => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.maps) return reject(new Error('Google Maps SDK not loaded'));
      const ds = new window.google.maps.DirectionsService();
      const travelMode = mode === 'TRANSIT' ? window.google.maps.TravelMode.TRANSIT : (mode === 'BICYCLING' ? window.google.maps.TravelMode.BICYCLING : (mode === 'WALKING' ? window.google.maps.TravelMode.WALKING : window.google.maps.TravelMode.DRIVING));

      const request = {
        origin,
        destination,
        travelMode,
        provideRouteAlternatives: true,
      };

      // For driving, request traffic-aware ETA
      if (travelMode === window.google.maps.TravelMode.DRIVING) {
        request.departureTime = new Date();
      }

      ds.route(request, (result, status) => {
        if (status === 'OK') {
          resolve({ mode, result });
        } else {
          reject(new Error(`Directions ${mode} failed: ${status}`));
        }
      });
    });
  };

  const fetchAll = useCallback(async () => {
    if (!origin || !destination) return;
    setLoading(true);
    setError(null);
    const key = ++refreshKey.current;

    try {
      const tasks = modes.map((m) => fetchForMode(m).catch((e) => ({ mode: m, error: e.message })));
      const results = await Promise.all(tasks);

      // Normalize into a flat routes array with mode and route objects
      const normalized = [];
      results.forEach((res, idxMode) => {
        if (!res) return;
        if (res.error) return; // skip failed mode
        const { mode, result } = res;
        if (!result || !result.routes) return;
        result.routes.forEach((rt, idx) => {
          const leg = rt.legs && rt.legs[0];
          normalized.push({
            id: `${mode}_${idx}_${key}`,
            travelMode: mode,
            directionsRoute: rt,
            directionsResult: { routes: [rt] },
            distance: leg ? leg.distance.text : undefined,
            duration: leg ? leg.duration.text : undefined,
            durationValue: leg ? leg.duration.value : undefined,
            stepsModes: leg ? leg.steps.map(step => step.travel_mode).join(' → ') : undefined,
          });
        });
      });

      // Sort fastest first
      normalized.sort((a, b) => (a.durationValue || 0) - (b.durationValue || 0));

      setRoutes(normalized);
    } catch (e) {
      setError(e.message || 'Failed to fetch directions');
    } finally {
      setLoading(false);
    }
  }, [origin, destination, modes]);

  const refresh = useCallback(() => fetchAll(), [fetchAll]);

  useEffect(() => {
    if (autoPoll) {
      pollRef.current = setInterval(() => fetchAll(), pollInterval);
      return () => clearInterval(pollRef.current);
    }
    return undefined;
  }, [autoPoll, pollInterval, fetchAll]);

  useEffect(() => {
    // Run initial fetch whenever origin/destination changes
    fetchAll();
  }, [fetchAll]);

  return { routes, loading, error, refresh };
}
