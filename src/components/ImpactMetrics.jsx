import React, { useState, useEffect } from 'react';
import { fetchCompanyImpactMetrics } from '../services/api';

export default function ImpactMetrics({ companyId }) {
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          setLoading(true);
          const data = await fetchCompanyImpactMetrics(companyId);
          setImpactData(data);
        } catch (error) {
          console.error("Error fetching impact metrics:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [companyId]);
  const metrics = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
      ),
      title: "CO₂ Reduction",
      value: "75,000 tons",
      subtitle: "annually",
      description: "Equivalent to removing 16,000 cars from the road each year",
      progress: 85
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
        </svg>
      ),
      title: "Energy Generated",
      value: "120 GWh per",
      subtitle: "year",
      description: "Powering approximately 35,000 households annually",
      progress: 65
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      ),
      title: "Communities Served",
      value: "65+ across 12",
      subtitle: "countries",
      description: "Improving quality of life for over 250,000 people",
      progress: 75
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
        </svg>
      ),
      title: "Jobs Created",
      value: "450 local",
      subtitle: "positions",
      description: "Including 320 manufacturing and 130 installation positions",
      progress: 90
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 lg:p-8 top-[10px]"> 
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 h-1 bg-orange-400 mr-4"></div>
        <h1 className="text-4xl font-bold text-gray-900">Impact Metrics</h1>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className="bg-white rounded-xl shadow-sm overflow-hidden 
                     transition-all duration-300 ease-in-out transform
                     hover:-translate-y-2 hover:bg-orange-50 hover:shadow-md"
          >
            {/* Header */}
            <div className="bg-orange-200 px-6 py-4 flex items-center transition-colors duration-300 group-hover:bg-orange-300">
              <div className="bg-orange-100 rounded-full p-2 mr-3 text-orange-600">
                {metric.icon}
              </div>
              <h2 className="font-semibold text-gray-800">{metric.title}</h2>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="mb-6">
                <div className="text-4xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-3xl font-bold text-gray-900">{metric.subtitle}</div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-orange-100 rounded-full h-2 mb-6">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-orange-300 h-2 rounded-full" 
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
