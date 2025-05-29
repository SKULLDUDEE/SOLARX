import React, { useState, useEffect, useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";


const slidesData = [
  {
    id: "s1",
    title: "Powering the Future with Solar Innovation",
    description:
      "Discover 50+ solar startups across Africa, Asia-Pacific, LAC, and MENA regions transforming energy access with innovative solutions.",
    layout: "center",
    bgClass: "bg-gradient-to-br from-orange-500 to-amber-600",
    imgUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&h=1080",
    buttonTextColor: "text-orange-600",
  },
  {
    id: "s2",
    title: "Sustainable Energy Solutions",
    description:
      "Supporting innovative startups that are creating affordable and accessible solar technologies for communities worldwide.",
    layout: "left",
    bgClass: "bg-gradient-to-br from-green-600 to-emerald-700",
    imgUrl:
      "https://images.unsplash.com/photo-1497440001374-f26997328c1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&h=1080",
    buttonTextColor: "text-green-600",
  },
  {
    id: "s3",
    title: "Empowering Communities",
    description:
      "Building a network of solar entrepreneurs who are making a positive impact on local economies and the environment.",
    layout: "center",
    bgClass: "bg-gradient-to-br from-blue-600 to-indigo-700",
    imgUrl:
      "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&h=1080",
    buttonTextColor: "text-blue-600",
  },
  {
    id: "s4",
    title: "Driving Innovation in Solar Technology",
    description:
      "Accelerating the development and deployment of cutting-edge solar solutions to address global energy challenges.",
    layout: "right",
    bgClass: "bg-gradient-to-br from-purple-600 to-violet-700",
    imgUrl:
      "https://images.unsplash.com/photo-1690191795384-0e4997a886a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&h=1080",
    buttonTextColor: "text-purple-600",
  },
  {
    id: "s5",
    title: "Creating a Sustainable Future",
    description:
      "Join our mission to build a cleaner, more sustainable world through renewable energy innovation and entrepreneurship.",
    layout: "bottom",
    bgClass: "bg-gradient-to-br from-teal-600 to-cyan-700",
    imgUrl:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&h=1080",
    buttonTextColor: "text-teal-600",
  },
];

const PrevButton = ({ enabled, onClick }) => (
  <button
    className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 z-30 
               text-white/70 hover:text-white focus:outline-none transition-all duration-300 
               opacity-0 group-hover/carousel:opacity-100 md:block 
               disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Previous slide"
  >
    <BsChevronLeft
      className="h-10 w-10 md:h-14 md:w-14"
      style={{ strokeWidth: "0.5" }}
    />
  </button>
);

/**
 * Next button component for carousel navigation
 */
const NextButton = ({ enabled, onClick }) => (
  <button
    className="absolute right-4 md:right-6 top-1/2 transform -translate-y-1/2 z-30 
               text-white/70 hover:text-white focus:outline-none transition-all duration-300 
               opacity-0 group-hover/carousel:opacity-100 md:block 
               disabled:opacity-30 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={!enabled}
    aria-label="Next slide"
  >
    <BsChevronRight
      className="h-10 w-10 md:h-14 md:w-14"
      style={{ strokeWidth: "0.5" }}
    />
  </button>
);

/**
 * Dot indicator button component for carousel navigation
 */
const DotButton = ({ selected, onClick, index }) => (
  <button
    className={`h-1 rounded-sm transition-all duration-500 ease-out focus:outline-none
            ${
              selected
                ? "bg-white w-8 md:w-10 scale-x-110"
                : "bg-white/50 w-6 md:w-8 hover:bg-white/75"
            }`}
    type="button"
    onClick={onClick}
    aria-label={`Go to slide ${index + 1}`}
    aria-current={selected ? "true" : "false"}
  />
);

/**
 * HeroCarousel component - A responsive, accessible carousel for hero section
 * Features autoplay, navigation controls, and responsive design
 */
export default function HeroCarousel() {
  // Constants
  const NAVBAR_HEIGHT = "4.5rem";
  const AUTOPLAY_DELAY = 7000;
  const AUTOPLAY_RESUME_DELAY = 5000;
  
  // Carousel configuration
  const autoplayOptions = {
    delay: AUTOPLAY_DELAY,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  };
  
  // State hooks
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay(autoplayOptions)]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const interactionTimeoutRef = useRef(null);

  // Navigation callbacks
  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  
  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Event handlers
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  const onInteraction = useCallback(() => {
    if (!emblaApi || !emblaApi.plugins()?.autoplay) return;
    const autoplay = emblaApi.plugins().autoplay;
    if (!autoplay) return;

    autoplay.stop();
    
    if (interactionTimeoutRef.current) {
      clearTimeout(interactionTimeoutRef.current);
    }
    
    interactionTimeoutRef.current = setTimeout(() => {
      autoplay.play();
    }, AUTOPLAY_RESUME_DELAY);
  }, [emblaApi]);

  // Setup effect
  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("pointerDown", onInteraction);
    emblaApi.on("keyDown", onInteraction);

    // Cleanup function
    return () => {
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current);
      }
      
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
      emblaApi.off("pointerDown", onInteraction);
      emblaApi.off("keyDown", onInteraction);
    };
  }, [emblaApi, onSelect, onInteraction]);

  // Preload images
  useEffect(() => {
    slidesData.slice(0, 2).forEach((slide) => {
      const img = new Image();
      img.src = slide.imgUrl;
    });
  }, []);

  // Layout utility functions
  const getLayoutClasses = (layout) => {
    switch (layout) {
      case "left":
        return "items-start text-left";
      case "right":
        return "items-end text-right";
      case "bottom":
        return "items-center text-center justify-end pb-16 sm:pb-20 md:pb-24";
      case "top":
        return "items-center text-center justify-start pt-16 sm:pt-20 md:pt-24";
      case "center":
      default:
        return "items-center text-center justify-center";
    }
  };

  const getContentTransitionClasses = (layout, isActive) => {
    const baseTransition = "transition-all duration-700 ease-out";
    
    if (!isActive) {
      switch (layout) {
        case "left":
          return `${baseTransition} opacity-0 -translate-x-12`;
        case "right":
          return `${baseTransition} opacity-0 translate-x-12`;
        case "bottom":
          return `${baseTransition} opacity-0 translate-y-12`;
        case "top":
          return `${baseTransition} opacity-0 -translate-y-12`;
        case "center":
        default:
          return `${baseTransition} opacity-0 scale-90`;
      }
    }
    
    return `${baseTransition} opacity-100 translate-x-0 translate-y-0 scale-100 delay-300`;
  };

  // Button alignment utility
  const getButtonAlignment = (layout) => {
    if (layout === "left") return "justify-start";
    if (layout === "right") return "justify-end";
    return "justify-center";
  };

  // Render component
  return (
    <section
      id="home"
      className="relative w-full overflow-hidden group/carousel"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT})`,
        paddingTop: NAVBAR_HEIGHT,
        minHeight: "650px",
        maxHeight: `calc(90vh - ${NAVBAR_HEIGHT})`,
      }}
      aria-roledescription="carousel"
      aria-label="Hero Highlights"
      onMouseEnter={() => emblaApi?.plugins?.()?.autoplay?.stop()}
      onMouseLeave={() => emblaApi?.plugins?.()?.autoplay?.play()}
    >
      {/* Carousel Viewport */}
      <div
        className="embla h-full overflow-hidden"
        ref={emblaRef}
      >
        {/* Carousel Container */}
        <div className="embla__container flex h-full">
          {slidesData.map((slide, index) => (
            <div
              className={`embla__slide relative h-full min-w-0 ${slide.bgClass}`}
              style={{ flex: "0 0 100%" }}
              key={slide.id}
            >
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                  src={slide.imgUrl}
                  alt={`${slide.title}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  loading={index < 2 ? "eager" : "lazy"}
                />
              </div>

              {/* Slide Content */}
              <div
                className={`relative z-20 h-full flex ${getLayoutClasses(slide.layout)} p-6 md:p-10 lg:p-12`}
              >
                <div
                  className={`w-full max-w-3xl text-white ${getContentTransitionClasses(
                    slide.layout,
                    index === selectedIndex
                  )}`}
                >
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 text-shadow">
                    {slide.title}
                  </h1>
                  <p
                    className={`text-lg md:text-xl mb-6 md:mb-8 text-white/90 leading-relaxed max-w-2xl 
                      ${slide.layout === "left" || slide.layout === "right" ? "" : "mx-auto"}`}
                  >
                    {slide.description}
                  </p>
                  <div className={`flex flex-col sm:flex-row gap-4 ${getButtonAlignment(slide.layout)}`}>
                    <a
                      href="#startups"
                      className={`bg-white ${slide.buttonTextColor} hover:bg-opacity-90 font-semibold py-3 px-7 
                        rounded-full shadow-xl hover:scale-105 transition-all duration-300 ease-in-out text-base md:text-lg`}
                    >
                      Explore Startups
                    </a>
                    <a
                      href="/apply"
                      className="border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-7 
                        rounded-full shadow-lg hover:scale-105 transition-all duration-300 ease-in-out text-base md:text-lg"
                    >
                      Apply Now
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Controls */}
      <PrevButton onClick={scrollPrev} enabled={prevBtnEnabled} />
      <NextButton onClick={scrollNext} enabled={nextBtnEnabled} />

      {/* Dot Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex justify-center space-x-2 md:space-x-2.5 z-30">
        {scrollSnaps.map((_, index) => (
          <DotButton
            key={index}
            selected={index === selectedIndex}
            onClick={() => scrollTo(index)}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
