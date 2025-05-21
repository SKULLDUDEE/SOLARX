import React, { useState, useEffect, useRef } from 'react';
import { fetchCompanies } from '../services/api';
import CompanyCard from './CompanyCard';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './SliderStyles.css';

export default function SolarXWinners() {
  // Create references for the slider
  const sliderRef = useRef(null);
  // Removed activeRegion state since we're not filtering by region anymore
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Empty array for when no companies are found
  const emptyCompanies = [];
  
  // Fetch companies data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch all companies without filtering
        const response = await fetchCompanies();
        
        if (response && response.data) {
          // Log the response to help with debugging
          console.log('API Response:', response);
          setCompanies(response);
        } else {
          // Fallback to default data if API returns empty
          console.log('No data in API response, using defaults');
          setCompanies([]);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to load companies. Please try again later.');
        // Fallback to default data on error
        setCompanies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // This function is now used only in the CompanyCard component
  // Removing to avoid unused variable warnings
  
  // Default region class for all companies
  const defaultRegionClass = 'orange-gradient';
  
  // This map is now used only in the CompanyCard component
  // Removing to avoid unused variable warnings
  
  // Process companies data from API to get basic info
  const processedCompanies = companies && companies.data && companies.data.length > 0 
    ? companies.data.map(company => {
        // Only extract the ID for the card component
        return {
          id: company.id
        };
      })
    : emptyCompanies;
  
  // Since we're removing region filtering, we'll just use all companies
  const filteredCompanies = processedCompanies;
  
  // Slider settings
  const slidesToShow = Math.min(3, filteredCompanies.length);
  const slidesToScroll = Math.min(3, filteredCompanies.length);
  
  const sliderSettings = {
    dots: true,
    arrows: true,
    infinite: filteredCompanies.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: slidesToScroll,
    initialSlide: 0,
    autoplay: filteredCompanies.length > 1,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: false,
    variableWidth: false,
    adaptiveHeight: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1536, // 2xl breakpoint
        settings: {
          slidesToShow: Math.min(3, filteredCompanies.length),
          slidesToScroll: Math.min(3, filteredCompanies.length),
          infinite: filteredCompanies.length > 3,
          dots: true
        }
      },
      {
        breakpoint: 1280, // xl breakpoint
        settings: {
          slidesToShow: Math.min(3, filteredCompanies.length),
          slidesToScroll: Math.min(3, filteredCompanies.length),
          infinite: filteredCompanies.length > 3,
          dots: true
        }
      },
      {
        breakpoint: 1024, // lg breakpoint
        settings: {
          slidesToShow: Math.min(2, filteredCompanies.length),
          slidesToScroll: Math.min(2, filteredCompanies.length),
          infinite: filteredCompanies.length > 2,
          dots: true
        }
      },
      {
        breakpoint: 768, // md breakpoint
        settings: {
          slidesToShow: Math.min(2, filteredCompanies.length),
          slidesToScroll: Math.min(2, filteredCompanies.length),
          initialSlide: 0
        }
      },
      {
        breakpoint: 640, // sm breakpoint
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0
        }
      }
    ]
  };

  return (
    <section id="startups" className="min-h-screen orange-gradient-light py-20 relative top-[20px]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-orange-600 text-shadow">SolarX Winners</h2>
          <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Removed Region Filter */}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
            {error}
          </div>
        )}
        
        {/* Empty State */}
        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-8 rounded-lg mb-8 text-center">
            <p className="text-lg font-medium mb-2">No companies found for this region</p>
            <p>Try selecting a different region or check back later.</p>
          </div>
        )}
        
        {/* Startups Slider */}
        {!loading && filteredCompanies.length > 0 && (
          <div className="mt-8 sm:mt-12">
            <div className="flex justify-between items-center mb-6 px-4 sm:px-8 md:px-12">
              <h3 className="text-xl sm:text-2xl font-bold text-orange-600">
                {filteredCompanies.length === 1 ? 'Featured Company' : 'Featured Companies'}
              </h3>
              {filteredCompanies.length > 1 && (
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600 hidden sm:block">
                    Swipe to see more
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => sliderRef.current.slickPrev()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                      aria-label="Previous slide"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => sliderRef.current.slickNext()}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                      aria-label="Next slide"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="slider-container">
              {filteredCompanies.length === 1 ? (
                // If there's only one company, render it directly without the slider
                <div className="flex justify-center">
                  <div className="h-full card-container max-w-md">
                    <CompanyCard 
                      companyId={filteredCompanies[0].id} 
                      regionClass={defaultRegionClass}
                    />
                  </div>
                </div>
              ) : (
                // Otherwise use the slider for multiple companies
                <Slider ref={sliderRef} className="company-slider" {...sliderSettings}>
                  {filteredCompanies.map(company => (
                    <div key={company.id} className="h-full card-container">
                      <CompanyCard 
                        companyId={company.id} 
                        regionClass={defaultRegionClass}
                      />
                    </div>
                  ))}
                </Slider>
              )}
            </div>
          </div>
        )}
        
        {/* Removed View All Button */}
      </div>
    </section>
  );
}