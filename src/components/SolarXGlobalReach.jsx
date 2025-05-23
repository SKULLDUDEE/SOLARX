import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const SolarXGlobalReach = () => {
  const globeRef = useRef();
  const sceneRef = useRef();
  const rendererRef = useRef();
  const globeMeshRef = useRef();
  const animationIdRef = useRef();
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const solarProjects = [
    { lat: -1.2921, lng: 36.8219, country: 'Kenya', region: 'East Africa', sector: 'Rural Electrification', technology: 'Solar PV', color: 0xff0000 },
    { lat: 9.0820, lng: 8.6753, country: 'Nigeria', region: 'West Africa', sector: 'Healthcare', technology: 'Energy Storage', color: 0x0066ff },
    { lat: 28.6139, lng: 77.2090, country: 'India', region: 'South Asia', sector: 'Agricultural', technology: 'IoT Monitoring', color: 0x00ff00 },
    { lat: -6.2088, lng: 106.8456, country: 'Indonesia', region: 'Southeast Asia', sector: 'Education', technology: 'Mobile Payment', color: 0x9966ff },
    { lat: -26.2041, lng: 28.0473, country: 'South Africa', region: 'Southern Africa', sector: 'Small Business', technology: 'Predictive Maintenance', color: 0xff0000 },
    { lat: 23.8859, lng: 45.0792, country: 'Saudi Arabia', region: 'MENA', sector: 'Rural Electrification', technology: 'Solar PV', color: 0xff6600 },
    { lat: 14.0583, lng: 108.2772, country: 'Vietnam', region: 'Southeast Asia', sector: 'Agricultural', technology: 'Solar PV', color: 0x9966ff },
    { lat: -22.3285, lng: 24.6849, country: 'Botswana', region: 'Southern Africa', sector: 'Healthcare', technology: 'Energy Storage', color: 0xff0000 },
    { lat: 12.2797, lng: -1.5616, country: 'Burkina Faso', region: 'West Africa', sector: 'Education', technology: 'IoT Monitoring', color: 0x0066ff },
    { lat: 23.6345, lng: -102.5528, country: 'Mexico', region: 'LAC', sector: 'Small Business', technology: 'Mobile Payment', color: 0x00ffff },
  ];

  useEffect(() => {
    if (!globeRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const containerWidth = isFullscreen ? window.innerWidth : 400;
    const containerHeight = isFullscreen ? window.innerHeight : 400;
    
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000);
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;
    
    globeRef.current.appendChild(renderer.domElement);

    // Globe geometry and material
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://unpkg.com/three-globe@2.24.10/example/img/earth-blue-marble.jpg',
      (texture) => {
        const material = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9
        });
        
        const globe = new THREE.Mesh(geometry, material);
        globeMeshRef.current = globe;
        scene.add(globe);
        
        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.02, 64, 64);
        const atmosphereMaterial = new THREE.MeshPhongMaterial({
          color: 0x4488ff,
          transparent: true,
          opacity: 0.1,
          side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        scene.add(atmosphere);
        
        // Add project markers
        addProjectMarkers(scene);
        
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
        // Fallback: create globe without texture
        const material = new THREE.MeshPhongMaterial({
          color: 0x4488bb,
          transparent: true,
          opacity: 0.8
        });
        
        const globe = new THREE.Mesh(geometry, material);
        globeMeshRef.current = globe;
        scene.add(globe);
        
        addProjectMarkers(scene);
        setLoading(false);
      }
    );

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseDown = (event) => {
      isDragging = true;
      const rect = renderer.domElement.getBoundingClientRect();
      previousMousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    };

    const onMouseUp = (event) => {
      if (!isDragging) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / renderer.domElement.clientHeight) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        
        // Get all marker meshes from the globe
        const markers = markersRef.current;
        const intersects = raycaster.intersectObjects(markers, true);
        
        if (intersects.length > 0) {
          const selectedMarker = intersects[0].object;
          setSelectedCountry(selectedMarker.userData);
          setShowInfoPanel(true);
        }
      }
      isDragging = false;
    };

    const onMouseMove = (event) => {
      if (!isDragging || !globeMeshRef.current) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const currentMousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      const deltaMove = {
        x: currentMousePosition.x - previousMousePosition.x,
        y: currentMousePosition.y - previousMousePosition.y
      };

      const rotationSpeed = 0.005;
      globeMeshRef.current.rotation.y += deltaMove.x * rotationSpeed;
      globeMeshRef.current.rotation.x -= deltaMove.y * rotationSpeed;

      // Constrain vertical rotation
      globeMeshRef.current.rotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, globeMeshRef.current.rotation.x));

      previousMousePosition = currentMousePosition;
    };

    const canvas = renderer.domElement;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousemove', onMouseMove);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Auto-rotate when not being dragged
      if (!isDragging && globeMeshRef.current) {
        globeMeshRef.current.rotation.y += 0.002;
      }
      
      // Animate marker glows
      markersRef.current.forEach(marker => {
        if (marker.animateGlow) {
          marker.animateGlow();
        }
      });
      
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (globeRef.current && renderer.domElement && globeRef.current.contains(renderer.domElement)) {
        globeRef.current.removeChild(renderer.domElement);
      }
      const canvas = renderer.domElement;
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [isFullscreen]);

// Update the addProjectMarkers function
// const addProjectMarkers = (scene) => {
  const addProjectMarkers = () => {
  markersRef.current = [];
  solarProjects.forEach((project) => {
    // Convert lat/lng to 3D coordinates
    const phi = (90 - project.lat) * (Math.PI / 180);
    const theta = (project.lng + 180) * (Math.PI / 180);
    
    const x = -(Math.sin(phi) * Math.cos(theta));
    const z = (Math.sin(phi) * Math.sin(theta));
    const y = (Math.cos(phi));

    // Create marker group to hold marker and glow
    const markerGroup = new THREE.Group();
    
    // Create marker
    const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ 
      color: project.color,
      transparent: true,
      opacity: 1
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    // Position marker at surface of globe (radius = 1)
    marker.position.set(x, y, z);
    marker.position.multiplyScalar(1.01); // Slightly above surface
    marker.userData = project;
    
    // Create glow effect
    const glowGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: project.color,
      transparent: true,
      opacity: 0.4
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.copy(marker.position);
    
    // Add marker and glow to group
    markerGroup.add(marker);
    markerGroup.add(glow);
    
    // Add group to globe mesh
    globeMeshRef.current.add(markerGroup);
    markersRef.current.push(marker);
    
    // Add pulsing animation
    const animate = () => {
      const time = Date.now() * 0.005;
      glow.scale.setScalar(1 + 0.3 * Math.sin(time));
      glow.material.opacity = 0.2 + 0.2 * Math.sin(time);
    };
    marker.animateGlow = animate;
  });
};

  // const handleMarkerClick = (project) => {
  //   setSelectedCountry(project);
  //   setShowInfoPanel(true);
  // };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const FullscreenGlobe = () => (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <button 
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-60 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-sm transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {showInfoPanel && selectedCountry && (
        <div className="absolute right-4 top-4 bottom-4 w-80 bg-white/95 backdrop-blur-md p-6 shadow-xl z-50 border-l-4 border-orange-400 overflow-y-auto rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">{selectedCountry.country}</h3>
            <button 
              onClick={() => setShowInfoPanel(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="text-gray-600 mb-4">{selectedCountry.region}</div>
          
          <div className="bg-orange-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-gray-700 mb-1">Sector</h4>
            <p className="text-gray-800">{selectedCountry.sector}</p>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg mb-4">
            <h4 className="font-medium text-gray-700 mb-1">Technology</h4>
            <p className="text-gray-800">{selectedCountry.technology}</p>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium text-gray-700 mb-2">Project Details</h4>
            <p className="text-gray-600 mb-3">
              This solar project is part of SolarX's initiative to bring sustainable energy solutions to developing regions.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Capacity</div>
                <div className="font-medium">250 kW</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Beneficiaries</div>
                <div className="font-medium">1,200+</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">CO₂ Reduction</div>
                <div className="font-medium">180 tons/year</div>
              </div>
              <div className="bg-gray-50 p-2 rounded">
                <div className="text-xs text-gray-500">Investment</div>
                <div className="font-medium">$320,000</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={globeRef} className="w-full h-full flex items-center justify-center" />
      
      {/* Fullscreen legends */}
      <div className="absolute bottom-4 left-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg shadow-md text-white">
        <div className="font-medium mb-2">Click markers to explore solar projects</div>
        <div className="text-sm opacity-80">Drag to rotate • Auto-rotates when idle</div>
      </div>
    </div>
  );

  return (
    <>
      {isFullscreen && <FullscreenGlobe />}
      
      <section id="global-reach" className="py-20 bg-white relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600">Global Reach & Impact</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our global footprint across regions, sectors, and technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Regional Distribution</h3>
            <div className="bg-orange-50 rounded-3xl p-8 shadow-xl">
              <div className="relative mb-6 bg-white rounded-xl overflow-hidden shadow-md" style={{ height: '400px' }}>
                {/* Globe Title */}
                <div className="absolute top-0 left-0 w-full bg-white/80 backdrop-blur-sm py-2 px-4 z-10 text-center">
                  <h4 className="font-bold text-gray-800">SolarX Global Impact</h4>
                  <p className="text-xs text-gray-600">Interactive map of solar startups by region, sector, and technology</p>
                  <div className="flex justify-center items-center mt-1 space-x-4">
                    <button 
                      onClick={toggleFullscreen}
                      className="text-xs bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline-block mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                      View Fullscreen
                    </button>
                  </div>
                </div>
                
                {/* Info Panel */}
                {showInfoPanel && selectedCountry && (
                  <div className="absolute right-0 top-0 bottom-0 w-2/5 bg-white/95 backdrop-blur-md p-5 shadow-xl z-30 border-l-4 border-orange-400 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800">{selectedCountry.country}</h3>
                      <button 
                        onClick={() => setShowInfoPanel(false)}
                        className="text-gray-500 hover:text-gray-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="text-gray-600 mb-4">{selectedCountry.region}</div>
                    
                    <div className="bg-orange-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Sector</h4>
                      <p className="text-gray-800">{selectedCountry.sector}</p>
                    </div>
                    
                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                      <h4 className="font-medium text-gray-700 mb-1">Technology</h4>
                      <p className="text-gray-800">{selectedCountry.technology}</p>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-700 mb-2">Project Details</h4>
                      <p className="text-gray-600 mb-3">
                        This solar project is part of SolarX's initiative to bring sustainable energy solutions to developing regions.
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Capacity</div>
                          <div className="font-medium">250 kW</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Beneficiaries</div>
                          <div className="font-medium">1,200+</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs text-gray-500">CO₂ Reduction</div>
                          <div className="font-medium">180 tons/year</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-xs text-gray-500">Investment</div>
                          <div className="font-medium">$320,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Globe Container */}
                <div className="w-full h-full relative">
                  {/* Loading indicator */}
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-30">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-700">Loading Earth...</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Globe canvas */}
                  <div ref={globeRef} className="w-full h-full flex items-center justify-center" />
                  
                  {/* Region Legend */}
                  <div className="absolute top-14 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10">
                    <div className="text-xs font-medium text-gray-700 mb-1">Regions:</div>
                    <div className="flex items-center mb-1">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                      <span className="text-xs">East Africa</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                      <span className="text-xs">West Africa</span>
                    </div>
                    <div className="flex items-center mb-1">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                      <span className="text-xs">South Asia</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                      <span className="text-xs">Southeast Asia</span>
                    </div>
                  </div>
                  
                  {/* Sector Legend */}
                  <div className="absolute bottom-2 left-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 text-xs">
                    <div className="font-medium text-gray-700 mb-1">Sectors:</div>
                    <div className="grid grid-cols-2 gap-x-4">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                        <span>Rural Electrification</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                        <span>Agricultural</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                        <span>Healthcare</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                        <span>Education</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-orange-500 mr-1"></span>
                        <span>Small Business</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Technology Legend */}
                  <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md z-10 text-xs">
                    <div className="font-medium text-gray-700 mb-1">Technologies:</div>
                    <div className="grid grid-cols-1 gap-x-2">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                        <span>Solar PV</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                        <span>Energy Storage</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        <span>IoT Monitoring</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-1"></span>
                        <span>Mobile Payment</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        <span>Predictive Maintenance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-2">Africa</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">18</span>
                    <span className="text-sm text-gray-500">startups</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-2">Asia-Pacific</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">15</span>
                    <span className="text-sm text-gray-500">startups</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-2">LAC</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">10</span>
                    <span className="text-sm text-gray-500">startups</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-700 mb-2">MENA</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-600">7</span>
                    <span className="text-sm text-gray-500">startups</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full" style={{ width: '14%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Sector Distribution</h3>
                <div className="bg-orange-50 rounded-3xl p-8 shadow-xl">
                  <div className="aspect-w-16 aspect-h-9 bg-white rounded-xl overflow-hidden shadow-md">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-gray-500 mb-2">Sector Distribution Chart</div>
                        <div className="text-sm text-gray-400">Pie chart showing sector breakdown</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-600 mr-3"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-gray-700">Solar Home Systems</span>
                        <span className="font-bold text-orange-600">32%</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-400 mr-3"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-gray-700">Mini/Micro Grids</span>
                        <span className="font-bold text-orange-600">24%</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-300 mr-3"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-gray-700">Productive Use</span>
                        <span className="font-bold text-orange-600">18%</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-200 mr-3"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-gray-700">Solar Manufacturing</span>
                        <span className="font-bold text-orange-600">15%</span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-orange-100 mr-3"></div>
                      <div className="flex-1 flex justify-between">
                        <span className="font-medium text-gray-700">Other</span>
                        <span className="font-bold text-orange-600">11%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Technology Types</h3>
                <div className="bg-orange-50 rounded-3xl p-6 shadow-xl">
                  <div className="flex flex-wrap gap-3">
                    {[
                      'Photovoltaic Panels',
                      'Battery Storage',
                      'Smart Metering',
                      'IoT Integration',
                      'Mobile Payment',
                      'Solar Irrigation',
                      'Energy Efficiency',
                      'Solar Appliances'
                    ].map((tech, index) => (
                      <div
                        key={index}
                        className="bg-white px-4 py-3 rounded-full text-orange-600 text-sm font-medium shadow-sm flex items-center"
                      >
                        <span className="w-3 h-3 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mr-2"></span>
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
  );
};

export default SolarXGlobalReach;