import React, { useState, useEffect } from "react";
import axios from "axios";

const SDG_INFO = {
  1: { title: "No Poverty", color: "bg-red-600" },
  2: { title: "Zero Hunger", color: "bg-yellow-600" },
  3: { title: "Good Health", color: "bg-green-500" },
  4: { title: "Quality Education", color: "bg-blue-500" },
  5: { title: "Gender Equality", color: "bg-pink-500" },
  6: { title: "Clean Water", color: "bg-blue-400" },
  7: { title: "Affordable Clean Energy", color: "bg-yellow-500" },
  8: { title: "Decent Work", color: "bg-red-500" },
  9: { title: "Industry, Innovation", color: "bg-indigo-500" },
  10: { title: "Reduced Inequality", color: "bg-pink-400" },
  11: { title: "Sustainable Cities", color: "bg-orange-500" },
  12: { title: "Responsible Consumption", color: "bg-yellow-700" },
  13: { title: "Climate Action", color: "bg-green-600" },
  14: { title: "Life Below Water", color: "bg-blue-600" },
  15: { title: "Life on Land", color: "bg-green-700" },
  16: { title: "Peace & Justice", color: "bg-gray-700" },
  17: { title: "Partnerships", color: "bg-blue-800" },
};

const shuffleArray = (arr) => [...arr].sort(() => 0.5 - Math.random());

const GlobalImpactSection = () => {
  const [sdgData, setSdgData] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [sdgRes, fullRes] = await Promise.all([
          axios.get("http://localhost:1337/api/startups?fields=SDG"),
          axios.get("http://localhost:1337/api/startups?populate=*"),
        ]);

        // Extract SDGs
        const sdgs = sdgRes?.data?.data?.[0]?.SDG || [];
        const mappedSdgs = sdgs.map((number) => ({
          number,
          title: SDG_INFO[number]?.title || `SDG ${number}`,
          color: SDG_INFO[number]?.color || "bg-gray-500",
        }));
        setSdgData(mappedSdgs);

        // Extract and merge all impact metrics
        const startup = fullRes?.data?.data?.[0] || {};
        const allMetrics = [
          ...(startup.Environmental_Impact_Metrics || []),
          ...(startup.Social_Impact_Metrics || []),
          ...(startup.Economic_Impact_Metrics || []),
          ...(startup.Technology_And_Scalability_Metrics || []),
        ];
        const selectedMetrics = shuffleArray(allMetrics)
          .slice(0, 5)
          .map((metric) => ({
            label: metric.Title,
            value: metric.Metric,
          }));

        setImpactMetrics(selectedMetrics);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-2xl mx-auto text-center">
        <p className="font-medium">Error loading global impact data:</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-4">
            Global Impact
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Driving sustainable change through innovative solutions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SDGs */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">🎯</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                SDG Alignment
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {sdgData.map((sdg, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium ${sdg.color}`}
                >
                  <span className="font-bold">{sdg.number}</span>
                  <span>{sdg.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">
                Impact Metrics
              </h3>
            </div>
            <ul className="space-y-4">
              {impactMetrics.map((metric, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3 shadow-sm"
                >
                  <span className="text-gray-700 font-medium">
                    {metric.label}
                  </span>
                  <span className="text-gray-900 font-bold">
                    {metric.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
