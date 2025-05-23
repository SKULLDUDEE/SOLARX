import React, { useState } from 'react';
import { FileText, BarChart3, BookOpen, ChevronLeft, ChevronRight, Download } from 'lucide-react';

const SolarXPromotionalSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const materials = [
    {
      id: 1,
      icon: FileText,
      type: "PDF Brochure",
      title: "SolarX Program Overview",
      description: "A comprehensive overview of the SolarX program, eligibility criteria, and application process.",
      pages: "12 pages",
      updated: "May 2025"
    },
    {
      id: 2,
      icon: BarChart3,
      type: "Impact Report",
      title: "2024 Impact Report",
      description: "Detailed analysis of the social, economic, and environmental impact of SolarX startups across all regions.",
      pages: "28 pages",
      updated: "April 2025"
    },
    {
      id: 3,
      icon: BookOpen,
      type: "Case Studies",
      title: "Success Stories Compilation",
      description: "Collection of in-depth case studies highlighting the journey and impact of our most successful startups.",
      pages: "18 pages",
      updated: "March 2025"
    },
    // Add more items to test slider functionality
    {
      id: 4,
      icon: FileText,
      type: "PDF Guide",
      title: "Implementation Guide",
      description: "Step-by-step guide for implementing SolarX solutions in your organization.",
      pages: "15 pages",
      updated: "February 2025"
    },
    {
      id: 5,
      icon: BarChart3,
      type: "Analytics Report",
      title: "Market Analysis 2024",
      description: "Comprehensive market analysis and trends in solar energy adoption.",
      pages: "22 pages",
      updated: "January 2025"
    }
  ];

  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(materials.length / cardsPerSlide);
  const showSlider = materials.length > cardsPerSlide;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const getCurrentCards = () => {
    const startIndex = currentSlide * cardsPerSlide;
    return materials.slice(startIndex, startIndex + cardsPerSlide);
  };

  const IconComponent = (props) => {
    const Icon = props.icon;
    const { type } = props;
    const getIconColor = (type) => {
      switch (type) {
        case 'PDF Brochure':
        case 'PDF Guide':
          return 'text-orange-500';
        case 'Impact Report':
        case 'Analytics Report':
          return 'text-orange-500';
        case 'Case Studies':
          return 'text-orange-500';
        default:
          return 'text-orange-500';
      }
    };

    return (
      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-4 shadow-sm">
        <Icon className={`w-8 h-8 ${getIconColor(type)}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            SolarX Promotional Materials
          </h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Download our brochures, reports, and promotional materials to learn more about the SolarX program.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {showSlider && (
            <>
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
                disabled={currentSlide === totalSlides - 1}
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
            {getCurrentCards().map((material) => (
              <div
                key={material.id}
                className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-shadow duration-300"
              >
                <IconComponent icon={material.icon} type={material.type} />
                
                <div className="mb-2">
                  <span className="text-sm font-medium opacity-90">{material.type}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-4">{material.title}</h3>
                
                <p className="text-sm opacity-90 mb-6 leading-relaxed">
                  {material.description}
                </p>
                
                <div className="flex justify-between items-center text-sm opacity-80 mb-6">
                  <span>{material.pages}</span>
                  <span>Last updated: {material.updated}</span>
                </div>
                
                <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>

          {/* Slider Indicators */}
          {showSlider && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SolarXPromotionalSlider;
