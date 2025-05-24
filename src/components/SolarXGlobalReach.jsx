import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // For better camera control
import {
  Fullscreen,
  Minimize,
  AlertTriangle,
  Globe as GlobeIconJsx,
  CheckCircle,
  Cpu,
  XCircle,
  Loader2,
} from "lucide-react";

// --- Constants ---
const PRESENCE_API_URL =
  "http://localhost:1337/api/global-presences?populate[0]=Presence&populate[1]=startups";
const STARTUPS_API_URL = "http://localhost:1337/api/startups?populate=*";

const PRESENCE_TYPE_COLORS_HEX = {
  "Current Operations": 0x007bff,
  "Expansion Targets": 0x28a745,
  "Strategic Partnership": 0xffc107,
  "Pilot Program": 0x17a2b8,
};
const DEFAULT_PRESENCE_COLOR_HEX = 0x6c757d;
const GLOBE_RADIUS = 1; // Base radius for the globe

// --- Helper Functions ---
const extractRichTextToString = (richTextArray) => {
  let textContent = "";
  if (Array.isArray(richTextArray)) {
    richTextArray.forEach((block) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.text) {
            textContent += child.text + " ";
          }
        });
      }
    });
  }
  return textContent.trim();
};

const latLngToVector3 = (lat, lng, radius = GLOBE_RADIUS) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180); // Ensure lng is in 0-360 range if needed, or adjust theta accordingly
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// --- Component ---
const SolarXGlobalReach = () => {
  const globeContainerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const globeMeshRef = useRef(null);
  const atmosphereMeshRef = useRef(null);
  const controlsRef = useRef(null);
  const animationFrameIdRef = useRef(null);
  const markersGroupRef = useRef(null); // A THREE.Group to hold all markers
  const individualMarkersRef = useRef([]); // Array to store actual marker meshes for raycasting

  const [isComponentLoading, setIsComponentLoading] = useState(true);
  const [isThreeJsReady, setIsThreeJsReady] = useState(false);
  const [apiError, setApiError] = useState(null);

  const [globeDataPoints, setGlobeDataPoints] = useState([]);
  const [allStartups, setAllStartups] = useState([]);

  const [regionSummary, setRegionSummary] = useState([]);
  const [sectorSummary, setSectorSummary] = useState([]);
  const [technologySummary, setTechnologySummary] = useState([]);

  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Data Fetching and Processing ---
  useEffect(() => {
    const fetchData = async () => {
      setIsComponentLoading(true);
      setApiError(null);
      try {
        const [presenceResponse, startupsResponse] = await Promise.all([
          fetch(PRESENCE_API_URL),
          fetch(STARTUPS_API_URL),
        ]);

        if (!presenceResponse.ok)
          throw new Error(
            `Global Presence API Error: ${presenceResponse.statusText}`
          );
        if (!startupsResponse.ok)
          throw new Error(`Startups API Error: ${startupsResponse.statusText}`);

        const presenceData = await presenceResponse.json();
        const startupsData = await startupsResponse.json();

        setAllStartups(startupsData.data || []);

        const points = [];
        if (presenceData.data && presenceData.data.length > 0) {
          presenceData.data.forEach((gp) => {
            const associatedStartups = gp.startups || [];
            if (gp.Presence && Array.isArray(gp.Presence)) {
              gp.Presence.forEach((p) => {
                if (
                  p.Location &&
                  typeof p.Location.lat === "number" &&
                  typeof p.Location.lng === "number"
                ) {
                  const mainStartup =
                    associatedStartups.length > 0 ? associatedStartups[0] : {};
                  points.push({
                    id: `pt-${gp.id}-${p.id}`,
                    lat: p.Location.lat,
                    lng: p.Location.lng,
                    color:
                      PRESENCE_TYPE_COLORS_HEX[p.Type] ||
                      DEFAULT_PRESENCE_COLOR_HEX,
                    // Info for panel
                    type: p.Type || "Unknown Presence",
                    startupId: mainStartup.id || "N/A",
                    startupName: mainStartup.Name || "N/A",
                    startupCountry: mainStartup.Country || "N/A",
                    startupRegions: mainStartup.Regions?.join(", ") || "N/A",
                    startupSectors:
                      mainStartup.Sector_Tags?.map((t) =>
                        t.split("|").pop().trim()
                      ).join(", ") || "N/A",
                    startupTech:
                      mainStartup.Technology_Tags?.map((t) =>
                        t.split("|").pop().trim()
                      ).join(", ") || "N/A",
                    startupDescription:
                      extractRichTextToString(mainStartup.Description) ||
                      "No description available.",
                  });
                }
              });
            }
          });
        }
        setGlobeDataPoints(points);
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError(error.message);
      } finally {
        setIsComponentLoading(false);
      }
    };
    fetchData();
  }, []);

  // Summaries processing (same as before)
  useEffect(() => {
    if (allStartups.length === 0) {
      setRegionSummary([]);
      setSectorSummary([]);
      setTechnologySummary([]);
      return;
    }
    const createSummary = (tagArrayField) => {
      const counts = {};
      allStartups.forEach((s) => {
        const tags = s[tagArrayField];
        if (tags && Array.isArray(tags) && tags.length > 0) {
          tags.forEach((tag) => {
            const tagName =
              typeof tag === "string" ? tag.split("|").pop().trim() : "Unknown";
            counts[tagName] = (counts[tagName] || 0) + 1;
          });
        }
      });
      return Object.entries(counts)
        .map(([name, count]) => ({
          name,
          count,
          percentage: Math.round((count / allStartups.length) * 100),
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    };
    setRegionSummary(createSummary("Regions"));
    setSectorSummary(createSummary("Sector_Tags"));
    setTechnologySummary(createSummary("Technology_Tags"));
  }, [allStartups]);

  // --- Three.js Setup and Animation Loop ---
  useEffect(() => {
    if (
      isComponentLoading ||
      !globeContainerRef.current ||
      rendererRef.current
    ) {
      // Don't init if loading or already initialized
      return;
    }

    const container = globeContainerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.5; // Adjusted initial zoom
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2; // Slower auto-rotation
    controlsRef.current = controls;

    // Lighting
    scene.add(new THREE.AmbientLight(0xcccccc, 0.8));
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Globe Mesh
    const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      "//unpkg.com/three-globe/example/img/earth-day.jpg", // Lighter texture
      (earthTexture) => {
        const globeMaterial = new THREE.MeshPhongMaterial({
          map: earthTexture,
          shininess: 5,
        });
        const globe = new THREE.Mesh(globeGeometry, globeMaterial);
        scene.add(globe);
        globeMeshRef.current = globe;

        // Atmosphere
        const atmosphereMaterial = new THREE.ShaderMaterial({
          vertexShader: `
                varying vec3 vNormal;
                void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
          fragmentShader: `
                varying vec3 vNormal;
                void main() {
                float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0); // Adjusted intensity calculation
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity * 0.4; // Adjusted alpha
                }
            `,
          side: THREE.BackSide,
          blending: THREE.AdditiveBlending,
          transparent: true,
          depthWrite: false,
        });
        const atmosphere = new THREE.Mesh(
          new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 64, 64),
          atmosphereMaterial
        );
        scene.add(atmosphere);
        atmosphereMeshRef.current = atmosphere;

        setIsThreeJsReady(true); // Signal that globe base is ready
      },
      undefined,
      (error) => {
        console.error("Error loading globe texture:", error);
        const fallbackMaterial = new THREE.MeshPhongMaterial({
          color: 0x4488bb,
          shininess: 5,
        });
        const globe = new THREE.Mesh(globeGeometry, fallbackMaterial);
        scene.add(globe);
        globeMeshRef.current = globe;
        setIsThreeJsReady(true); // Still signal ready with fallback
      }
    );

    // Markers Group
    markersGroupRef.current = new THREE.Group();
    scene.add(markersGroupRef.current);

    // Raycaster for clicking markers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMarkerClick = (event) => {
      if (
        !rendererRef.current ||
        !cameraRef.current ||
        individualMarkersRef.current.length === 0
      )
        return;

      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(
        individualMarkersRef.current,
        false
      );

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData && clickedObject.userData.id) {
          setSelectedMarkerData(clickedObject.userData);
          setIsInfoPanelOpen(true);
          if (controlsRef.current) controlsRef.current.autoRotate = false;
        }
      }
    };
    renderer.domElement.addEventListener("click", onMarkerClick);

    // Animation Loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      // Marker animations (e.g., pulsing)
      const time = Date.now() * 0.0025;
      individualMarkersRef.current.forEach((marker) => {
        if (marker.userData.isPulsing) {
          // Add this flag to markers you want to pulse
          const baseScale = marker.userData.baseScale || 1;
          marker.scale.setScalar(
            baseScale * (1 + 0.25 * Math.sin(time + marker.userData.id.length))
          ); // Simple pulse
        }
      });
      renderer.render(scene, camera);
    };
    animate();

    // Handle Resize
    const handleWindowResize = () => {
      if (
        !cameraRef.current ||
        !rendererRef.current ||
        !globeContainerRef.current
      )
        return;
      const newWidth = isFullscreen
        ? window.innerWidth
        : globeContainerRef.current.clientWidth;
      const newHeight = isFullscreen
        ? window.innerHeight
        : globeContainerRef.current.clientHeight; // Use clientHeight of container

      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };
    window.addEventListener("resize", handleWindowResize);
    // Initial call to set size correctly if fullscreen state changes
    if (isFullscreen) handleWindowResize();

    // Cleanup
    return () => {
      if (animationFrameIdRef.current)
        cancelAnimationFrame(animationFrameIdRef.current);
      window.removeEventListener("resize", handleWindowResize);
      renderer.domElement.removeEventListener("click", onMarkerClick);

      controls.dispose();
      renderer.dispose();

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      if (
        container &&
        renderer.domElement &&
        container.contains(renderer.domElement)
      ) {
        container.removeChild(renderer.domElement);
      }
      rendererRef.current = null; // Allow re-initialization
      sceneRef.current = null;
      cameraRef.current = null;
      globeMeshRef.current = null;
      atmosphereMeshRef.current = null;
      markersGroupRef.current = null;
      individualMarkersRef.current = [];
      setIsThreeJsReady(false);
    };
  }, [isComponentLoading, isFullscreen]); // Re-run setup if fullscreen changes or after initial load

  // Effect to update markers when globeDataPoints changes or Three.js is ready
  useEffect(() => {
    if (!isThreeJsReady || !markersGroupRef.current || !globeMeshRef.current)
      return;

    // Clear existing markers
    individualMarkersRef.current.forEach((marker) => {
      marker.geometry.dispose();
      // No need to dispose basic material like MeshBasicMaterial usually, but if complex, do it.
    });
    markersGroupRef.current.clear(); // Removes all children
    individualMarkersRef.current = [];

    // Add new markers
    globeDataPoints.forEach((point) => {
      const position = latLngToVector3(
        point.lat,
        point.lng,
        GLOBE_RADIUS + 0.01
      ); // Slightly above surface

      // INCREASED MARKER SIZE & SIMPLIFIED GEOMETRY
      const markerRadius = 0.03; // Adjust this for desired "bigness"
      const markerGeometry = new THREE.SphereGeometry(markerRadius, 16, 16); // Simpler sphere
      const markerMaterial = new THREE.MeshPhongMaterial({
        // Phong for some lighting interaction
        color: point.color,
        emissive: point.color, // Make it glow a bit with its own color
        emissiveIntensity: 0.4,
        shininess: 10,
      });

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(position);
      marker.lookAt(globeMeshRef.current.position); // Orient towards globe center (0,0,0)

      marker.userData = { ...point, isPulsing: true, baseScale: 1 }; // Attach all point data + animation flags

      markersGroupRef.current.add(marker);
      individualMarkersRef.current.push(marker);
    });
  }, [isThreeJsReady, globeDataPoints]);

  // --- UI Event Handlers ---
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);
  const closeInfoPanel = () => {
    setIsInfoPanelOpen(false);
    setSelectedMarkerData(null);
    if (controlsRef.current) controlsRef.current.autoRotate = true;
  };

  // --- Render Helper Components --- (InfoPanel and SummaryCard remain largely the same)
  const InfoPanel = ({ data, onClose }) => {
    if (!data) return null;
    return (
      <div
        className={`fixed md:absolute top-0 right-0 h-full md:h-auto md:max-h-[calc(100%-2rem)] md:top-4 md:right-4 w-full md:w-80 lg:w-96 bg-white/95 backdrop-blur-md shadow-2xl rounded-none md:rounded-lg z-50 p-6 overflow-y-auto transition-transform transform ${
          isInfoPanelOpen
            ? "translate-x-0"
            : "translate-x-full md:translate-x-[110%]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            className="text-xl font-bold text-gray-800 truncate"
            title={data.startupName || data.type}
          >
            {data.startupName || data.type}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="space-y-3 text-sm">
          <p>
            <strong className="text-gray-600">Type:</strong>{" "}
            <span
              style={{
                color: `#${new THREE.Color(data.color).getHexString()}`,
              }}
              className="font-semibold"
            >
              {data.type}
            </span>
          </p>
          {data.startupCountry !== "N/A" && (
            <p>
              <strong className="text-gray-600">Country:</strong>{" "}
              {data.startupCountry}
            </p>
          )}
          {data.startupRegions !== "N/A" && (
            <p>
              <strong className="text-gray-600">Region(s):</strong>{" "}
              {data.startupRegions}
            </p>
          )}
          {data.startupSectors !== "N/A" && (
            <p>
              <strong className="text-gray-600">Sector(s):</strong>{" "}
              {data.startupSectors}
            </p>
          )}
          {data.startupTech !== "N/A" && (
            <p>
              <strong className="text-gray-600">Technology:</strong>{" "}
              {data.startupTech}
            </p>
          )}
          {data.startupDescription &&
            data.startupDescription !== "No description available." && (
              <div className="mt-3 pt-3 border-t">
                <strong className="text-gray-600 block mb-1">
                  Description:
                </strong>
                <p className="text-gray-700 text-xs max-h-32 overflow-y-auto">
                  {data.startupDescription}
                </p>
              </div>
            )}
        </div>
        <div className="mt-6 text-center">
          <a
            href={`/startup/${data.startupId}`}
            className="inline-block bg-orange-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Startup Profile
          </a>
        </div>
      </div>
    );
  };

  const SummaryCard = ({ title, data, icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center text-orange-600 mb-3">
        {icon}
        <h4 className="text-xl font-semibold ml-2 text-gray-700">{title}</h4>
      </div>
      {data.length > 0 ? (
        <ul className="space-y-2 text-sm">
          {data.map((item) => (
            <li
              key={item.name}
              className="flex justify-between items-center text-gray-600"
            >
              <span className="truncate pr-2" title={item.name}>
                {item.name}
              </span>
              <span className="font-semibold text-orange-500">
                {item.count} ({item.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">
          {isComponentLoading ? "Loading data..." : "No data available."}
        </p>
      )}
    </div>
  );

  // --- Main Render ---
  if (isComponentLoading && !globeDataPoints.length && !isThreeJsReady) {
    /* Full page loader */
  }
  if (apiError) {
    /* Error display */
  }

  return (
    <>
      {isFullscreen && (
        <div
          className="fixed inset-0 bg-gray-900 z-[1000] flex items-center justify-center"
          ref={isFullscreen ? globeContainerRef : null}
        >
          {/* Globe will be re-parented or re-initialized here by the useEffect due to isFullscreen change */}
          <button
            onClick={toggleFullscreen}
            title="Exit Fullscreen"
            className="absolute top-5 right-5 z-[1001] bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all"
          >
            <Minimize size={24} />
          </button>
          <InfoPanel data={selectedMarkerData} onClose={closeInfoPanel} />
        </div>
      )}

      <section
        className={`py-16 bg-gray-50 transition-all duration-300 ${
          isFullscreen ? "hidden" : ""
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-4">
              SolarX Global Reach
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Visualizing our worldwide impact through innovative solar
              solutions and strategic partnerships.
            </p>
          </header>

          {(isComponentLoading ||
            (!isThreeJsReady && globeDataPoints.length > 0)) && (
            <div className="flex justify-center items-center min-h-[450px] lg:col-span-2 bg-gray-800 rounded-xl p-6">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
              <p className="ml-3 text-orange-300">
                {isComponentLoading
                  ? "Loading impact data..."
                  : "Initializing Globe..."}
              </p>
            </div>
          )}
          {apiError && (
            <div className="text-center text-red-600 p-4 bg-red-100 rounded-md lg:col-span-3">
              <AlertTriangle className="inline-block mr-2" />
              {apiError}
            </div>
          )}

          {!apiError && ( // Only render grid if no API error
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Globe Section - container always present, content conditional */}
              <div
                className={`lg:col-span-2 bg-gradient-to-br from-gray-700 to-gray-900 p-1 rounded-2xl shadow-2xl ${
                  isComponentLoading ? "hidden" : "block"
                }`}
              >
                <div className="bg-gray-800 p-4 sm:p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-semibold text-white">
                      Interactive Impact Globe
                    </h3>
                    <button
                      onClick={toggleFullscreen}
                      title="Toggle Fullscreen"
                      className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full transition-all text-sm flex items-center disabled:opacity-50"
                      disabled={!isThreeJsReady}
                    >
                      <Fullscreen size={18} />
                      <span className="ml-1.5 hidden sm:inline">
                        Fullscreen
                      </span>
                    </button>
                  </div>
                  {/* Ensure this div has explicit height for Three.js canvas */}
                  <div
                    ref={!isFullscreen ? globeContainerRef : null}
                    className="w-full h-[450px] rounded-lg overflow-hidden relative cursor-grab bg-gray-700/30"
                  >
                    {/* Placeholder will be covered by canvas once renderer appends it */}
                    {!isThreeJsReady && !isComponentLoading && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 text-orange-400 animate-spin" />
                        <p className="ml-2 text-orange-300">
                          Preparing Globe...
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
                    {Object.entries(PRESENCE_TYPE_COLORS_HEX).map(
                      ([type, colorValue]) => (
                        <div key={type} className="flex items-center">
                          <span
                            style={{
                              backgroundColor: `#${new THREE.Color(
                                colorValue
                              ).getHexString()}`,
                            }}
                            className="w-3 h-3 rounded-full mr-1.5 border border-white/20"
                          ></span>
                          <span className="text-gray-300">{type}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Info and Summaries - always present unless API error */}
              <div
                className={`space-y-8 lg:mt-0 ${
                  isComponentLoading ? "hidden" : "block"
                }`}
              >
                {isInfoPanelOpen && selectedMarkerData && !isFullscreen && (
                  <div className="bg-white p-6 rounded-xl shadow-xl border-t-4 border-orange-500">
                    <InfoPanel
                      data={selectedMarkerData}
                      onClose={closeInfoPanel}
                    />
                  </div>
                )}
                <SummaryCard
                  title="Regional Focus"
                  data={regionSummary}
                  icon={<GlobeIconJsx size={20} />}
                />
                <SummaryCard
                  title="Sector Impact"
                  data={sectorSummary}
                  icon={<CheckCircle size={20} />}
                />
                <SummaryCard
                  title="Key Technologies"
                  data={technologySummary}
                  icon={<Cpu size={20} />}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SolarXGlobalReach;
