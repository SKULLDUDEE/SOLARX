import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// TODO: Get from CMS
const storiesData = [
  {
    image: "https://picsum.photos/seed/qwe/600/350", // Slightly larger images
    alt: "SolarTech Solutions",
    country: "Kenya",
    title: "SolarTech Solutions",
    subtitle: "Empowering Rural Homes",
    description:
      "Provided affordable solar home systems to 25,000+ rural households in Kenya, significantly reducing kerosene use and improving indoor air quality for healthier living.",
    sdgs: ["SDG 7", "SDG 3", "SDG 13"],
    fundingRaised: "$3.2M",
  },
  {
    image: "https://picsum.photos/seed/ert/600/350",
    alt: "SunWater",
    country: "India",
    title: "SunWater",
    subtitle: "Revolutionizing Agriculture",
    description:
      "Deployed 500+ solar-powered irrigation systems across rural India, boosting crop yields by an average of 40% and increasing farmer incomes.",
    sdgs: ["SDG 7", "SDG 2", "SDG 6"],
    fundingRaised: "$2.8M",
  },
  {
    image: "https://picsum.photos/seed/iouert/600/350",
    alt: "MicroSolar",
    country: "Colombia",
    title: "MicroSolar",
    subtitle: "Connecting Communities",
    description:
      "Built 12 community microgrids in remote Colombian villages, providing reliable and clean electricity to over 8,500 people for the first time.",
    sdgs: ["SDG 7", "SDG 11", "SDG 9"],
    fundingRaised: "$4.5M",
  },
  {
    image: "https://picsum.photos/seed/ksdljf/600/350",
    alt: "EcoCharge",
    country: "Nigeria",
    title: "EcoCharge",
    subtitle: "Sustainable Mobility",
    description:
      "Established a network of solar-powered EV charging stations in Lagos, promoting cleaner transportation and reducing urban air pollution.",
    sdgs: ["SDG 7", "SDG 11", "SDG 13"],
    fundingRaised: "$1.9M",
  },
  {
    image: "https://picsum.photos/seed/zxcvb/600/350",
    alt: "AquaPure Solar",
    country: "Bangladesh",
    title: "AquaPure Solar",
    subtitle: "Clean Water Access",
    description:
      "Implemented solar-powered water purification systems in coastal communities, providing safe drinking water to over 15,000 residents.",
    sdgs: ["SDG 7", "SDG 6", "SDG 3"],
    fundingRaised: "$2.1M",
  },
];

export default function SuccessStories() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stories, setStories] = useState(storiesData); // Use state for stories if they might change
  const [visibleCards, setVisibleCards] = useState(3); // Default for larger screens

  // --- Responsive Logic for visibleCards ---
  const updateVisibleCards = useCallback(() => {
    if (window.innerWidth < 640) {
      // sm breakpoint
      setVisibleCards(1);
    } else if (window.innerWidth < 1024) {
      // lg breakpoint
      setVisibleCards(2);
    } else {
      setVisibleCards(3); // Default for lg and up
    }
  }, []);

  useEffect(() => {
    updateVisibleCards(); // Initial check
    window.addEventListener("resize", updateVisibleCards);
    return () => window.removeEventListener("resize", updateVisibleCards);
  }, [updateVisibleCards]);

  const showSlider = stories.length > visibleCards;
  const totalItems = stories.length;

  // Calculate total number of "pages" or "slides" for the slider
  const totalSlides = showSlider ? Math.ceil(totalItems / visibleCards) : 1;

  const nextSlide = () => {
    if (!showSlider) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (!showSlider) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    if (!showSlider) return;
    setCurrentSlide(index);
  };

  // Determine which stories to display based on currentSlide and visibleCards
  const displayedStories = useMemo(() => {
    if (!showSlider) {
      return stories.slice(0, visibleCards); // Show first 'visibleCards' items if not sliding
    }
    const startIndex = currentSlide * visibleCards;
    // Handle cases where the last slide might not be full
    return stories.slice(
      startIndex,
      Math.min(startIndex + visibleCards, totalItems)
    );
  }, [currentSlide, visibleCards, stories, showSlider, totalItems]);

  return (
    <section
      id="success-stories"
      className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-white py-16 sm:py-24 px-6 sm:px-10 lg:px-16"
    >
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
            Our <span className="text-orange-600">Success Stories</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover how our startups are transforming communities and creating
            sustainable impact across the globe.
          </p>
          <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mt-6"></div>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {showSlider && (
            <>
              <button
                onClick={prevSlide}
                aria-label="Previous success story"
                className="absolute left-0 sm:-left-5 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 sm:p-3 rounded-full shadow-xl hover:bg-orange-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </button>
              <button
                onClick={nextSlide}
                aria-label="Next success story"
                className="absolute right-0 sm:-right-5 top-1/2 transform -translate-y-1/2 z-20 bg-white p-2 sm:p-3 rounded-full shadow-xl hover:bg-orange-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </button>
            </>
          )}

          {/* Slides Wrapper - This handles the sliding effect */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out py-8"
              style={{
                // This transform moves the whole strip of all items.
                // We will only render the 'displayedStories'
                // but the transform logic implies a long strip.
                // For simplicity, we'll directly render `displayedStories` and might not need transform.
                // However, if you want actual sliding animation, you'd render all and use transform.
                // Let's simplify for now by just re-rendering the `displayedStories` without a translateX.
                // If true sliding animation is desired, the approach to render items needs to change.
                transform: "none", // No translateX for this simplified re-render approach
                // width: `${totalItems * (100 / visibleCards)}%`, // If rendering all items for sliding
              }}
            >
              {/* This div now acts as a grid for the currently visible items */}
              <div
                className="grid gap-6 sm:gap-8 w-full"
                style={{
                  // Dynamically set grid columns based on visibleCards
                  gridTemplateColumns: `repeat(${visibleCards}, minmax(0, 1fr))`,
                }}
              >
                {displayedStories.map((story, index) => (
                  <div
                    key={story.title + index} // Use a more unique key if titles can repeat
                    className="flex flex-col h-full" // Ensure cards take full height of their grid cell
                  >
                    <div className="flex-grow bg-white rounded-xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 flex flex-col transform hover:-translate-y-1">
                      {/* Image with Country Badge */}
                      <div className="relative">
                        <img
                          src={story.image}
                          alt={story.alt}
                          className="w-full h-52 object-cover" // Consistent image height
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-md">
                            {story.country}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <h3 className="text-lg sm:text-xl font-bold drop-shadow-sm">
                            {story.title}
                          </h3>
                          <p className="text-sm opacity-90">{story.subtitle}</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-6 flex flex-col flex-grow">
                        {" "}
                        {/* flex-grow for content area */}
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-4 flex-grow">
                          {" "}
                          {/* line-clamp and flex-grow for description */}
                          {story.description}
                        </p>
                        {/* SDG Tags */}
                        <div className="flex flex-wrap gap-2 my-4">
                          {story.sdgs.map((sdg, sdgIndex) => (
                            <span
                              key={sdgIndex}
                              className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full text-xs font-medium"
                            >
                              {sdg}
                            </span>
                          ))}
                        </div>
                        {/* Footer */}
                        <div className="mt-auto pt-4 border-t border-gray-200 flex justify-between items-center">
                          <div>
                            <p className="text-gray-500 text-xs mb-0.5">
                              Funding Raised
                            </p>
                            <p className="text-orange-600 font-bold text-md sm:text-lg">
                              {story.fundingRaised}
                            </p>
                          </div>
                          <button className="group inline-flex items-center text-orange-600 font-medium text-sm hover:text-orange-700 transition-colors">
                            Read More
                            <ArrowRight className="ml-1.5 w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {showSlider && totalSlides > 1 && (
            <div className="flex justify-center mt-10 space-x-2.5">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ease-in-out hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                    ${
                      currentSlide === index
                        ? "bg-orange-600 scale-125"
                        : "bg-gray-300"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
