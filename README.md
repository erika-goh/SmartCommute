# Smart Commute Optimizer

A React app prototype to find and compare commute routes (Driving, Transit, Bike, Walk) with live refresh, transit overlay, and an **estimated** CO₂ eco-score per route. This is an MVP focused on client-side UX and Google Maps integration (Directions API + TransitLayer). 

---

## Key Features

- Refresh button to re-query live route data (traffic-aware ETAs using `departureTime: now`).
- Toggleable Google Maps `TransitLayer` to show transit lines, stops, and (when available) real-time vehicles.
- Eco-score (CO₂ estimate) per route (estimated using mode-specific averages):
  - Driving ≈ **170 g/km**
  - Transit ≈ **80 g/km**
  - Bike / Walk = **0 g/km**
  
- Loading states, error handling, and disabled states for better UX. 
- Map auto-fits to the selected route bounds and single-route rendering to avoid overlay duplication. 
- Mobile responsive layout using Tailwind CSS. 

---

## Project Structure 

src/
├── components/
│   ├── Header.js
│   ├── SearchPanel.js
│   ├── RouteList.js
│   └── MapContainer.js
├── App.js
├── index.js
└── index.css

