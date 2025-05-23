import React, { useState, useEffect, useRef } from 'react';

const GlobalPresence = () => {
  const [darkMode, setDarkMode] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Sample data matching the original structure
  const startup = {
    globalPresence: {
      regions: ['East Africa', 'West Africa', 'South Asia', 'Southeast Asia']
    },
    sectorFocus: ['Rural Electrification', 'Agricultural Productivity', 'Healthcare', 'Education', 'Small Business'],
    technologyTypes: ['Solar PV', 'Energy Storage', 'IoT Monitoring', 'Mobile Payment Integration', 'Predictive Maintenance']
  };

  // Map locations data
  const mapLocations = {
    currentOperations: [
      { lat: 1.3733, lng: 32.2903, name: 'Uganda', type: 'current' }, // Uganda
      { lat: -6.7924, lng: 39.2083, name: 'Tanzania', type: 'current' }, // Tanzania
      { lat: -1.2921, lng: 36.8219, name: 'Kenya', type: 'current' }, // Kenya
      { lat: 28.3949, lng: 84.1240, name: 'Nepal', type: 'current' }, // Nepal
      { lat: 23.6850, lng: 90.3563, name: 'Bangladesh', type: 'current' }, // Bangladesh
    ],
    expansionTargets: [
      { lat: 9.0820, lng: 8.6753, name: 'Nigeria', type: 'expansion' }, // Nigeria
      { lat: 7.9465, lng: -1.0232, name: 'Ghana', type: 'expansion' }, // Ghana
      { lat: 19.0760, lng: 72.8777, name: 'India', type: 'expansion' }, // India
      { lat: -26.2041, lng: 28.0473, name: 'South Africa', type: 'expansion' }, // South Africa
    ],
    partnerLocations: [
      { lat: 51.1657, lng: 10.4515, name: 'Germany', type: 'partner' }, // Germany
      { lat: 37.0902, lng: -95.7129, name: 'USA', type: 'partner' }, // USA
      { lat: 35.8617, lng: 104.1954, name: 'China', type: 'partner' }, // China
    ]
  };

  useEffect(() => {
    // Load Leaflet CSS and JS
    const loadLeaflet = async () => {
      // Load CSS
      if (!document.querySelector('link[href*="leaflet"]')) {
        const cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(cssLink);
      }

      // Load JS
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
        script.onload = initializeMap;
        document.head.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && window.L && !mapInstanceRef.current) {
        // Initialize map
        const map = window.L.map(mapRef.current, {
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        }).setView([20, 0], 2);

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
          maxZoom: 18
        }).addTo(map);

        // Add markers for different types of locations
        const addMarkers = (locations, color, size = 8) => {
          locations.forEach(location => {
            const marker = window.L.circleMarker([location.lat, location.lng], {
              radius: size,
              fillColor: color,
              color: color,
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.6
            }).addTo(map);
            
            marker.bindPopup(location.name);
          });
        };

        // Add different types of markers
        addMarkers(mapLocations.currentOperations, '#f97316', 8); // Orange
        addMarkers(mapLocations.expansionTargets, '#3b82f6', 6); // Blue
        addMarkers(mapLocations.partnerLocations, '#10b981', 6); // Green

        mapInstanceRef.current = map;
      }
    };

    loadLeaflet();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section className={`py-16 relative ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Global Presence
          </h2>
          <p className={`text-lg max-w-3xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Expanding our impact across regions, sectors, and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Interactive Map */}
          <div className={`lg:col-span-2 backdrop-blur-sm bg-opacity-80 rounded-xl overflow-hidden border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-white/80 border-orange-100'}`}>
            <div className={`p-6 border-b ${darkMode ? 'border-white/10' : 'border-orange-100'}`}>
              <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Operational Regions
              </h3>
            </div>
            <div className="relative">
              {/* Map container */}
              <div ref={mapRef} className="h-96 w-full z-10"></div>
              
              {/* Map legend */}
              <div className={`absolute bottom-4 right-4 p-3 rounded-lg z-20 backdrop-blur-sm border ${darkMode ? 'bg-black/70 border-white/10' : 'bg-white/90 border-orange-100'}`}>
                <h4 className={`text-sm font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Legend
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                    <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                      Current Operations
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                      Expansion Targets
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className={darkMode ? 'text-white/80' : 'text-gray-700'}>
                      Partner Locations
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Regions & Sectors */}
          <div className="space-y-6">
            {/* Regions */}
            <div className={`backdrop-blur-sm bg-opacity-80 rounded-xl p-6 border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-white/80 border-orange-100'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Regions
              </h3>
              <div className="flex flex-wrap gap-2">
                {startup.globalPresence.regions.map((region, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'}`}
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Sectors */}
            <div className={`backdrop-blur-sm bg-opacity-80 rounded-xl p-6 border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-white/80 border-orange-100'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Sector Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {startup.sectorFocus.map((sector, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'}`}
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Technology Types */}
            <div className={`backdrop-blur-sm bg-opacity-80 rounded-xl p-6 border ${darkMode ? 'bg-black/30 border-white/5' : 'bg-white/80 border-orange-100'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Technology Types
              </h3>
              <div className="flex flex-wrap gap-2">
                {startup.technologyTypes.map((tech, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-800'}`}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle for Demo */}
        <div className="text-center">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode 
                ? 'bg-white/10 text-white hover:bg-white/20' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;