import React, { useState, useEffect, useRef } from 'react';

export default function ImpactMetrics({ companyId }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [impactData, setImpactData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiMetrics, setApiMetrics] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all impact metrics from Strapi with the correct relation field
        const response = await fetch(`http://localhost:1337/api/impact-metrics?populate=companies`);
        const result = await response.json();
        
        console.log("Impact metrics API response:", result);
        
        if (result && result.data && result.data.length > 0) {
          let metricsToUse = [];
          
          if (companyId) {
            // Filter metrics for the current company
            const companyMetrics = result.data.filter(metric => {
              // Check if this metric is associated with the current company
              if (metric.companies && Array.isArray(metric.companies)) {
                return metric.companies.some(company => company.id.toString() === companyId.toString());
              }
              return false;
            });
            
            // If we found company-specific metrics, use those
            if (companyMetrics.length > 0) {
              metricsToUse = companyMetrics;
              console.log("Using company-specific metrics:", companyMetrics);
            } else {
              // If no company-specific metrics, use all metrics
              metricsToUse = result.data;
              console.log("No company-specific metrics found, using all metrics");
            }
          } else {
            // If no company ID provided, use all metrics
            metricsToUse = result.data;
            console.log("No company ID provided, using all metrics");
          }
          
          setApiMetrics(metricsToUse);
          setImpactData(true); // Just to indicate we have data
        } else {
          // No metrics found at all
          setApiMetrics([]);
          setImpactData(false);
          console.log("No impact metrics found in the API");
        }
      } catch (error) {
        console.error("Error fetching impact metrics:", error);
        setApiMetrics([]);
        setImpactData(false);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [companyId]);
  // Define icons for different categories
  const getIconForCategory = (category) => {
    // Default icons based on category
    if (category && typeof category === 'string') {
      const lowerCategory = category.toLowerCase();
      
      if (lowerCategory.includes('co2') || lowerCategory.includes('carbon') || lowerCategory.includes('emission')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        );
      }
      
      if (lowerCategory.includes('energy') || lowerCategory.includes('power') || lowerCategory.includes('electricity')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        );
      }
      
      if (lowerCategory.includes('community') || lowerCategory.includes('social') || lowerCategory.includes('people')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        );
      }
      
      if (lowerCategory.includes('job') || lowerCategory.includes('employment') || lowerCategory.includes('work')) {
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
        );
      }
    }
    
    // Default icon
    return (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
      </svg>
    );
  };
  
  // Convert API metrics to the format needed for display
  const convertApiMetricsToDisplayFormat = () => {
    if (!apiMetrics || apiMetrics.length === 0) {
      return []; // Return empty array if no API data
    }
    
    return apiMetrics.map((metric, index) => {
      // Split the value into main value and subtitle if possible
      let value = metric.value || '';
      let subtitle = '';
      
      if (value.includes(' ')) {
        const parts = value.split(' ');
        // Take the first part as the main value
        value = parts[0];
        // Join the rest as the subtitle
        subtitle = parts.slice(1).join(' ');
      }
      
      return {
        id: metric.id || index + 1,
        icon: getIconForCategory(metric.category),
        title: metric.metric || 'Impact Metric',
        value: value,
        subtitle: subtitle,
        description: metric.category || '',
        progress: 75 + (index * 5) % 25 // Generate a progress value between 75-99
      };
    });
  };
  
  // Get the metrics to display from API only
  const displayMetrics = convertApiMetricsToDisplayFormat();
  
  // Calculate the number of slides needed
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(displayMetrics.length / itemsPerSlide);
  const needsSlider = displayMetrics.length > itemsPerSlide;
  
  // Navigation functions for the slider
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };
  
  // Get the current metrics to display based on the current slide
  const getCurrentSlideMetrics = () => {
    const startIndex = currentSlide * itemsPerSlide;
    return displayMetrics.slice(startIndex, startIndex + itemsPerSlide);
  };

  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-5 lg:p-8 top-[10px]"> 
      {/* Header with Navigation Controls */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-24 h-1 bg-orange-400 mr-4"></div>
          <h1 className="text-4xl font-bold text-gray-900">Impact Metrics</h1>
        </div>
        
        {/* Navigation Controls - Only show if we need a slider */}
        {!loading && needsSlider && (
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 text-sm">
              {currentSlide + 1} / {totalSlides}
            </span>
            <button 
              onClick={goToPrevSlide}
              className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              aria-label="Previous slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={goToNextSlide}
              className="p-2 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
              aria-label="Next slide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {!loading && displayMetrics.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <p className="text-gray-700 text-center">No impact metrics available for this company.</p>
        </div>
      )}
      
      {!loading && displayMetrics.length > 0 && (
        <div className="relative">
          {/* Slider Container */}
          <div 
            ref={sliderRef}
            className="overflow-hidden"
          >
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Show all metrics if no slider needed, otherwise show current slide metrics */}
              {(needsSlider ? getCurrentSlideMetrics() : displayMetrics).map((metric) => (
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
                      <div className="text-xl font-bold text-gray-700">{metric.subtitle}</div>
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
          
          {/* Slide Indicators - Only show if we need a slider */}
          {needsSlider && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-orange-500' : 'bg-orange-200'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

