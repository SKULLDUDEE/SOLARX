import React, { useState, useEffect } from 'react';
import { fetchGlobalPresenceData } from '../services/api';

const GlobalImpactSection = () => {
  const [sdgData, setSdgData] = useState([]);
  const [impactMetrics, setImpactMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGlobalPresence = async () => {
      try {
        setLoading(true);
        const data = await fetchGlobalPresenceData();

        if (data && data.data && data.data.length > 0) {
          // Assuming the first item contains the relevant data
          const attributes = data.data[0].attributes || {};

          // Map SDG data - adjust according to actual API response structure
          const sdgs = attributes.sdgs || [];
          const mappedSdgData = sdgs.map(sdg => ({
            number: sdg.number,
            color: sdg.color || 'bg-gray-500',
            title: sdg.title
          }));

          // Map impact metrics - adjust according to actual API response structure
          const metrics = attributes.impactMetrics || [];
          const mappedImpactMetrics = metrics.map(metric => ({
            label: metric.label,
            value: metric.value,
            percentage: metric.percentage
          }));

          setSdgData(mappedSdgData);
          setImpactMetrics(mappedImpactMetrics);
        } else {
          setSdgData([]);
          setImpactMetrics([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalPresence();
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
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-orange-600 mb-4">Global Impact</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">Driving sustainable change through innovative solutions</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SDG Alignment */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 font-bold">🎯</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">SDG Alignment</h3>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {sdgData.length > 0 ? (
                sdgData.map((sdg, index) => (
                  <div key={index} className="text-center group">
                    <div className={`${sdg.color} text-white rounded-xl w-16 h-16 flex items-center justify-center text-xl font-bold mx-auto mb-3 group-hover:scale-110 transform transition-all duration-300 shadow-md`}>
                      {sdg.number}
                    </div>
                    <p className="text-xs text-gray-600 leading-tight font-medium">{sdg.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center col-span-3">No SDG data available.</p>
              )}
            </div>
          </div>

          {/* Impact Metrics */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">📊</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800">Impact Metrics</h3>
            </div>
            <div className="space-y-6">
              {impactMetrics.length > 0 ? (
                impactMetrics.map((metric, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                      <span className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-full">{metric.value}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
                        style={{ width: `${metric.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">No impact metrics data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlobalImpactSection;
