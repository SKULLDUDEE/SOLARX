import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Shield } from "lucide-react";

const SuccessStoriesSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample data - you can replace this with your actual data
  const successStories = [
    {
      id: 1,
      title: "Transforming Rural Healthcare",
      location: "Kisumu County, Kenya",
      description:
        "Enabled 24/7 power for 12 rural clinics, increasing patient capacity by 40%",
    },
    {
      id: 2,
      title: "Empowering Women Entrepreneurs",
      location: "Dar es Salaam, Tanzania",
      description:
        "Provided reliable energy for 200+ women-owned businesses, increasing average income by 35%",
    },
    {
      id: 3,
      title: "Educational Revolution",
      location: "Northern Ghana",
      description:
        "Powered 35 schools, enabling digital learning for 12,000+ students",
    },
    {
      id: 4,
      title: "Clean Water Initiative",
      location: "Rural Uganda",
      description:
        "Solar-powered water purification systems serving 50,000+ people daily",
    },
    {
      id: 5,
      title: "Agricultural Innovation",
      location: "Central Kenya",
      description:
        "Smart irrigation systems increased crop yields by 60% for 500+ farmers",
    },
    {
      id: 6,
      title: "Community Digital Hub",
      location: "Lagos, Nigeria",
      description:
        "Connected 25 communities with reliable internet and digital services",
    },
  ];

  const cardsPerView = 3;
  const totalSlides = Math.ceil(successStories.length / cardsPerView);
  const showSlider = successStories.length > cardsPerView;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const getCurrentCards = () => {
    const startIndex = currentIndex * cardsPerView;
    return successStories.slice(startIndex, startIndex + cardsPerView);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Success Stories
        </h2>
        <p className="text-lg text-gray-600">
          Real-world impact through our sustainable energy solutions.
        </p>
      </div>

      {/* Cards Container */}
      <div className="relative">
        {showSlider && (
          <>
            {/* Previous Button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white rounded-full shadow-lg p-2 hover:bg-gray-50 transition-colors duration-200"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getCurrentCards().map((story) => (
            <div
              key={story.id}
              className="bg-orange-50 rounded-xl p-8 transition-transform duration-300 hover:scale-105"
            >
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-orange-100 rounded-full p-4">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-orange-600">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  {story.location}
                </p>
                <p className="text-gray-700 leading-relaxed">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        {showSlider && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentIndex
                    ? "bg-orange-500"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStoriesSlider;
