import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function SuccessStories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSlider, setShowSlider] = useState(false);
  const [visibleCards, setVisibleCards] = useState(3);

  const stories = [
    {
      image: "https://picsum.photos/seed/qwe/400/200",
      alt: "SolarTech Solutions",
      country: "Kenya",
      title: "SolarTech Solutions",
      subtitle: "Solar Home Systems",
      description: "Provided affordable solar home systems to 25,000+ rural households in Kenya, reducing kerosene use by 85% and improving indoor air quality.",
      sdgs: ["SDG 7", "SDG 3", "SDG 13"],
      fundingRaised: "$3.2M"
    },
    {
      image: "https://picsum.photos/seed/ert/400/200",
      alt: "SunWater",
      country: "India",
      title: "SunWater",
      subtitle: "Solar Irrigation",
      description: "Deployed 500+ solar-powered irrigation systems across rural India, increasing crop yields by 40% and farmer incomes by 35%.",
      sdgs: ["SDG 7", "SDG 2", "SDG 6"],
      fundingRaised: "$2.8M"
    },
    {
      image: "https://picsum.photos/seed/iouert/400/200",
      alt: "MicroSolar",
      country: "Colombia",
      title: "MicroSolar",
      subtitle: "Microgrids",
      description: "Built 12 community microgrids in remote Colombian villages, providing reliable electricity to 8,500 people for the first time.",
      sdgs: ["SDG 7", "SDG 11", "SDG 9"],
      fundingRaised: "$4.5M"
    },
    {
        image: "https://picsum.photos/seed/ksdljf/400/200",
        alt: "MicroSolar",
        country: "Colombia",
        title: "MicroSolar",
        subtitle: "Microgrids",
        description: "Built 12 community microgrids in remote Colombian villages, providing reliable electricity to 8,500 people for the first time.",
        sdgs: ["SDG 7", "SDG 11", "SDG 9"],
        fundingRaised: "$4.5M"
      }
  ];

  // Determine if slider should be shown based on number of stories
  useEffect(() => {
    setShowSlider(stories.length > visibleCards);
  }, [stories.length]);

  const nextSlide = () => {
    if (showSlider) {
      setCurrentSlide((prev) => {
        const nextSlide = prev + 1;
        return nextSlide >= Math.ceil(stories.length / visibleCards) ? 0 : nextSlide;
      });
    }
  };

  const prevSlide = () => {
    if (showSlider) {
      setCurrentSlide((prev) => {
        const prevSlide = prev - 1;
        return prevSlide < 0 ? Math.ceil(stories.length / visibleCards) - 1 : prevSlide;
      });
    }
  };

  const goToSlide = (index) => {
    if (showSlider) {
      setCurrentSlide(index);
    }
  };

  // Calculate total number of slides
  const totalSlides = Math.ceil(stories.length / visibleCards);

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">
            Success Stories
          </h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover how our startups are transforming communities and creating sustainable impact.
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative mb-12">
          {/* Navigation Arrows - Only show if slider is needed */}
          {showSlider && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            </>
          )}

          {/* Slides Container */}
          <div className={`overflow-hidden ${showSlider ? 'mx-12' : 'mx-auto'}`}>
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ 
                transform: showSlider ? `translateX(-${currentSlide * 100}%)` : 'none',
                display: showSlider ? 'flex' : 'grid',
                gridTemplateColumns: !showSlider ? `repeat(${Math.min(stories.length, visibleCards)}, 1fr)` : 'none',
                gap: !showSlider ? '1rem' : '0'
              }}
            >
              {stories.map((story, index) => (
                <div 
                  key={index} 
                  className={showSlider ? "w-full flex-shrink-0 px-4" : "px-4"}
                  style={showSlider ? { width: `${100 / visibleCards}%` } : {}}
                >
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-md mx-auto">
                    {/* Image with Country Badge */}
                    <div className="relative">
                      <img 
                        src={story.image} 
                        alt={story.alt}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {story.country}
                        </span>
                      </div>
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                      {/* Title on Image */}
                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold">{story.title}</h3>
                        <p className="text-sm opacity-90">{story.subtitle}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {story.description}
                      </p>

                      {/* SDG Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {story.sdgs.map((sdg, sdgIndex) => (
                          <span 
                            key={sdgIndex}
                            className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-medium"
                          >
                            {sdg}
                          </span>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-500 text-xs mb-1">Funding Raised</p>
                          <p className="text-orange-500 font-bold text-lg">{story.fundingRaised}</p>
                        </div>
                        <button className="flex items-center text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors">
                          Read More
                          <ArrowRight className="ml-1 w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator - Only show if slider is needed */}
          {showSlider && totalSlides > 1 && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentSlide === index ? 'bg-orange-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      
      </div>
    </div>
  );
}
