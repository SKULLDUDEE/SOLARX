import { useState, useEffect } from "react";
import axios from "axios";
import {
  Target,
  BarChart3,
  AlertTriangle,
  Loader2,
  Globe,
} from "lucide-react";
import KeyImpactMetricsScroller from "../components/KeyImpactMetricsScroller"; // Adjust path as needed

// SDG Info - Remains the same
const SDG_INFO = {
  1: { title: "No Poverty", color: "bg-red-600", iconChar: "1" },
  2: { title: "Zero Hunger", color: "bg-yellow-600", iconChar: "2" },
  3: { title: "Good Health", color: "bg-green-500", iconChar: "3" },
  4: { title: "Quality Education", color: "bg-blue-500", iconChar: "4" },
  5: { title: "Gender Equality", color: "bg-pink-500", iconChar: "5" },
  6: { title: "Clean Water", color: "bg-blue-400", iconChar: "6" },
  7: {
    title: "Affordable Clean Energy",
    color: "bg-yellow-500",
    iconChar: "7",
  },
  8: { title: "Decent Work", color: "bg-red-500", iconChar: "8" },
  9: { title: "Industry, Innovation", color: "bg-indigo-500", iconChar: "9" },
  10: { title: "Reduced Inequality", color: "bg-pink-400", iconChar: "10" },
  11: { title: "Sustainable Cities", color: "bg-orange-500", iconChar: "11" },
  12: {
    title: "Responsible Consumption",
    color: "bg-yellow-700",
    iconChar: "12",
  },
  13: { title: "Climate Action", color: "bg-green-600", iconChar: "13" },
  14: { title: "Life Below Water", color: "bg-blue-600", iconChar: "14" },
  15: { title: "Life on Land", color: "bg-green-700", iconChar: "15" },
  16: { title: "Peace & Justice", color: "bg-gray-700", iconChar: "16" },
  17: { title: "Partnerships", color: "bg-blue-800", iconChar: "17" },
};

// Original shuffleArray function - Remains the same
const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

// Component to display an SDG Goal - Remains the same
const SdgGoalDisplay = ({ number, title, color, iconChar }) => (
  <div
    className={`group flex items-center space-x-2.5 px-3.5 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-default ${color} text-white transform hover:scale-105 min-w-[170px]`}
    title={`SDG ${number}: ${title}`}
  >
    <div className="flex-shrink-0 w-6 h-6 bg-white/25 rounded-full flex items-center justify-center text-xs font-bold ring-1 ring-white/40">
      {iconChar || number}
    </div>
    <span className="text-xs sm:text-sm font-medium truncate group-hover:text-clip group-hover:whitespace-normal">
      {title}
    </span>
  </div>
);

const GlobalImpactSection = () => {
  const [sdgData, setSdgData] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState([]); // This will be passed to the new component
  const [regionalImpactData, setRegionalImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // useEffect for isVisible remains the same
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // REGION_COLORS, REGIONS_OF_INTEREST, and useEffect for fetchData remain largely the same.
  // The key is that `setImpactMetrics(selectedMetrics)` populates the state.
  // Define colors for the regional list
  const REGION_COLORS = {
    "Asia-Pacific": "bg-sky-500",
    LAC: "bg-lime-500",
    MENA: "bg-amber-500",
    Africa: "bg-purple-500",
    Other: "bg-slate-400",
  };
  const REGIONS_OF_INTEREST = ["Asia-Pacific", "LAC", "MENA", "Africa"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [sdgRes, fullRes] = await Promise.all([
          axios.get("http://localhost:1337/api/startups?fields=SDG"),
          axios.get("http://localhost:1337/api/startups?populate=*"),
        ]);

        const sdgsRaw = sdgRes?.data?.data?.[0]?.SDG || [];
        const mappedSdgs = sdgsRaw.map((number) => ({
          number,
          title: SDG_INFO[number]?.title || `SDG ${number}`,
          color: SDG_INFO[number]?.color || "bg-gray-500",
          iconChar: SDG_INFO[number]?.iconChar || String(number),
        }));
        setSdgData(mappedSdgs);

        const firstStartupForMetrics = fullRes?.data?.data?.[0] || {};
        // --- IMPORTANT: ENSURE YOU HAVE ENOUGH METRICS FOR A GOOD SCROLL ---
        // If you slice to 5, and they are narrow, the scroll might look short.
        // Consider taking more, or ensuring your sample data has more if this is for testing.
        const allMetricsRaw = [
          ...(firstStartupForMetrics.Environmental_Impact_Metrics || []),
          ...(firstStartupForMetrics.Social_Impact_Metrics || []),
          ...(firstStartupForMetrics.Economic_Impact_Metrics || []),
          ...(firstStartupForMetrics.Technology_And_Scalability_Metrics || []),
        ];
        // For a good scroll, you want more items. Let's shuffle and take up to 10 for example.
        // Or, if 'allMetricsRaw' usually has enough, just use that.
        const selectedMetrics = shuffleArray(allMetricsRaw)
          .slice(0, Math.min(10, allMetricsRaw.length)) // Take up to 10, or fewer if not available
          .map((metric) => ({
            label: metric.Title || "Untitled Metric",
            value: metric.Metric || "N/A",
          }));
        // If you have very few metrics (e.g., < 4), the duplication might be very obvious.
        // Consider a fallback or different display if metrics.length is too small for a scroller.
        setImpactMetrics(selectedMetrics);

        if (fullRes?.data?.data && Array.isArray(fullRes.data.data)) {
          const allStartups = fullRes.data.data;
          const counts = {};
          allStartups.forEach((startup) => {
            const startupRegions = startup.Regions;
            if (Array.isArray(startupRegions)) {
              startupRegions.forEach((region) => {
                if (REGIONS_OF_INTEREST.includes(region)) {
                  counts[region] = (counts[region] || 0) + 1;
                }
              });
            }
          });
          const processedRegionalData = Object.entries(counts)
            .map(([regionName, count]) => ({
              name: regionName,
              count: count,
              color: REGION_COLORS[regionName] || REGION_COLORS["Other"],
            }))
            .sort((a, b) => b.count - a.count);
          setRegionalImpactData(
            processedRegionalData.length > 0 ? processedRegionalData : null
          );
        } else {
          setRegionalImpactData(null);
        }
      } catch (err) {
        console.error("Error fetching global impact data:", err);
        setError(err.message || "Unknown error fetching impact data.");
        setSdgData([]);
        setImpactMetrics([]);
        setRegionalImpactData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto" />
          <p className="mt-3 text-gray-600">
            Loading Global Impact Highlights...
          </p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-red-50">
        <div className="max-w-2xl mx-auto text-center p-6 bg-white rounded-xl shadow-lg border border-red-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-700 mb-2">
            Could Not Load Impact Data
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  if (
    sdgData.length === 0 &&
    impactMetrics.length === 0 &&
    !regionalImpactData
  ) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Impact Information Available
          </h3>
          <p className="text-gray-500 text-sm">
            SDG alignment, specific impact metrics, or regional data have not
            yet been provided.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`py-20 bg-white relative overflow-hidden transition-opacity duration-200 max-w-7xl min-w-full mx-auto ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className="text-center mb-16 transform transition-all duration-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-5">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">
              Global Impact
            </span>
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Driving sustainable change through innovative solutions aligned with
            global goals and measurable outcomes.
          </p>
        </div>

        <div className="flex flex-row space-y-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12">
            {/* Left Column: SDGs and Metrics */}
            <div className="col-span-1 flex flex-col justify-start space-y-8">
              {sdgData.length > 0 && (
                <div
                  className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-orange-100/60 transform transition-all duration-200 hover:-translate-y-1 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-10"
                  }`}
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-shrink-0 p-3.5 bg-gradient-to-tr from-orange-500 to-red-600 rounded-xl shadow-lg">
                      <Target size={30} className="text-white" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      SDG Alignment
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">
                    Commitment to the UN's Sustainable Development Goals:
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {sdgData.map((sdg, idx) => (
                      <SdgGoalDisplay key={idx} {...sdg} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Regional Impact List */}
            <div className="col-span-1 flex flex-col justify-start space-y-8">
              {regionalImpactData && regionalImpactData.length > 0 && (
                <div
                  className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-2xl border border-green-100/60 transform transition-all duration-200 hover:-translate-y-1 ${
                    isVisible
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 translate-x-10"
                  }`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center space-x-4 mb-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                      Regional Focus
                    </h3>
                  </div>
                  <p className="text-gray-600 mb-6 text-sm">
                    Distribution of startups across key operational regions:
                  </p>
                  {regionalImpactData && regionalImpactData.length > 0 ? (
                    <ul className="space-y-3">
                      {regionalImpactData.map((regionData, index) => (
                        <li
                          key={index}
                          className={`flex items-center justify-between p-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-transparent hover:border-gray-200
                                            ${
                                              index % 2 === 0
                                                ? "bg-gray-50"
                                                : "bg-white"
                                            }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span
                              className={`flex-shrink-0 w-4 h-4 rounded-full ${regionData.color} ring-2 ring-offset-1 ring-white/50`}
                            ></span>
                            <span className="text-sm font-medium text-gray-700">
                              {regionData.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-800 bg-gray-100 px-2.5 py-0.5 rounded-full">
                            {regionData.count} startup
                            {regionData.count !== 1 ? "s" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-8">
                      Regional distribution data is currently being compiled.
                    </p>
                  )}
                </div>
              )}
              {/* Placeholder if no regional data but other data exists and not loading */}
              {(!regionalImpactData || regionalImpactData.length === 0) &&
                (sdgData.length > 0 || impactMetrics.length > 0) &&
                !loading && (
                  <div
                    className={`bg-white/90 backdrop-blur-lg p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100/60 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                    style={{ animationDelay: "0.3s" }}
                  >
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex-shrink-0 p-3.5 bg-gray-200 rounded-xl shadow">
                        <Globe size={30} className="text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700">
                        Regional Focus
                      </h3>
                    </div>
                    <p className="text-gray-500 text-sm text-center py-10">
                      Regional distribution data is currently unavailable.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>

        <KeyImpactMetricsScroller
          metrics={[...impactMetrics, ...impactMetrics]}
          isVisible={isVisible}
        />
      </div>
      <style jsx>{`
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-300 {
          animation-delay: 0.3s;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .group:hover .group-hover\\:text-clip {
          text-overflow: clip;
        }
        .group:hover .group-hover\\:whitespace-normal {
          white-space: normal;
        }
      `}</style>
    </section>
  );
};

export default GlobalImpactSection;
