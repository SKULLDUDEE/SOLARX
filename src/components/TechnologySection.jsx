import React, { useState, useEffect } from 'react';
import { fetchCompanyTechnology } from '../services/api';

export default function TechnologySection({ companyId }) {
  const [techData, setTechData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          setLoading(true);
          const data = await fetchCompanyTechnology(companyId);
          setTechData(data);
        } catch (error) {
          console.error("Error fetching technology data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [companyId]);
  return (
    <div className="max-w-7xl mx-auto p-1">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="w-24 h-1 bg-orange-400 mr-4"></div>
        <h1 className="text-4xl font-bold text-gray-900">Technology</h1>
      </div>
      
      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex flex-col lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 pr-0 lg:pr-8">
            {/* SolarCell Title with Icon */}
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 rounded-lg p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-orange-500">SolarCell Technology</h2>
            </div>
            
            {/* Description */}
            <p className="text-gray-700 mb-8">
              Our patented SolarCell™ technology combines advanced photovoltaic materials with a 
              unique deployment system that allows for rapid installation in challenging environments. The 
              modular design enables scaling from small household units to community-wide power grids 
              without specialized equipment or extensive training.
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">Solar Energy</span>
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">Photovoltaic</span>
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">Modular Design</span>
              <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">Rapid Deployment</span>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Efficiency Card */}
              <div className="bg-orange-50 rounded-lg p-5">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Efficiency</h3>
                </div>
                <p className="text-gray-700">40% higher than industry standard</p>
              </div>
              
              {/* Lifespan Card */}
              <div className="bg-orange-50 rounded-lg p-5">
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-800">Lifespan</h3>
                </div>
                <p className="text-gray-700">25+ years with minimal maintenance</p>
              </div>
            </div>
          </div>
          
          {/* Right Content - Video */}
          <div className="w-full lg:w-96 mt-8 lg:mt-0">
            <div className="bg-orange-400 rounded-lg h-full flex items-center justify-center p-8 relative cursor-pointer overflow-hidden group">
              {/* Video Thumbnail with Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="text-white text-center">
                  <div className="text-6xl font-bold">Solar</div>
                  <div className="flex items-center justify-center my-2">
                    <div className="bg-white rounded-full p-2 flex items-center justify-center 
                                   transition-transform duration-300 group-hover:scale-110">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="text-6xl font-bold">Cell</div>
                </div>
              </div>
              
              {/* Video Element (Hidden initially) */}
              <video 
                className="absolute inset-0 w-full h-full object-cover opacity-0"
                poster="/api/placeholder/400/320"
                preload="none"
              >
                <source src="#" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}