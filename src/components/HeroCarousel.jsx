import { useState, useEffect, useRef } from 'react';
import { BsChevronRight } from 'react-icons/bs';

export default function HeroCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isArrowVisible, setIsArrowVisible] = useState(true);

  const slides = [
    {
      title: 'Powering the Future with Solar Innovation',
      description:
        'Discover 50+ solar startups across Africa, Asia-Pacific, LAC, and MENA regions transforming energy access with innovative solutions.',
      bgClass: 'from-orange-500 to-amber-600',
      imgUrl: '/api/placeholder/1350/800',
    },
    {
      title: 'Sustainable Energy Solutions',
      description:
        'Supporting innovative startups that are creating affordable and accessible solar technologies for communities worldwide.',
      bgClass: 'from-green-600 to-emerald-700',
      imgUrl: '/api/placeholder/1350/800',
    },
    {
      title: 'Empowering Communities',
      description:
        'Building a network of solar entrepreneurs who are making a positive impact on local economies and the environment.',
      bgClass: 'from-blue-600 to-indigo-700',
      imgUrl: '/api/placeholder/1350/800',
    },
    {
      title: 'Driving Innovation in Solar Technology',
      description:
        'Accelerating the development and deployment of cutting-edge solar solutions to address global energy challenges.',
      bgClass: 'from-purple-600 to-violet-700',
      imgUrl: '/api/placeholder/1350/800',
    },
    {
      title: 'Creating a Sustainable Future',
      description:
        'Join our mission to build a cleaner, more sustainable world through renewable energy innovation and entrepreneurship.',
      bgClass: 'from-teal-600 to-cyan-700',
      imgUrl: '/api/placeholder/1350/800',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 15000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const blink = setInterval(() => {
      setIsArrowVisible((prev) => !prev);
    }, 600);
    return () => clearInterval(blink);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) goToNext();
    if (touchStart - touchEnd < -100) goToPrevious();
  };

  return (
    <section
      id="home"
      className="relative h-[600px] overflow-hidden mt-[63px] sm:mt-6 md:mt-0 md:top-[73px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={`slide-${index}`}
          className={`absolute inset-0 w-full h-full transition-opacity duration-[1500ms] ease-in-out ${
            index === currentIndex
              ? 'opacity-100 z-10 pointer-events-auto'
              : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0">
            <div className={`absolute inset-0 bg-gradient-to-br ${slide.bgClass} opacity-80 z-10`} />
            <img
              src={slide.imgUrl}
              alt={`Slide ${index + 1}`}
              className="absolute inset-0 w-full h-full object-cover object-center z-0"
            />
            <div className="absolute inset-0 bg-black/30 z-20" />
          </div>

          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full z-30" />
          <div className="absolute top-40 -left-20 w-80 h-80 bg-white/10 rounded-full z-30" />
          <div className="absolute -bottom-40 right-20 w-96 h-96 bg-white/10 rounded-full z-30" />
        </div>
      ))}

      {/* Arrow */}
      <div className="absolute top-0 right-0 bottom-0 left-0 hidden md:block z-[300]">
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
          <button
            onClick={goToNext}
            className="bg-transparent border-0 cursor-pointer p-4"
            aria-label="Next slide"
          >
            <BsChevronRight
              className={`text-white text-6xl ${isArrowVisible ? 'opacity-100' : 'opacity-30'}`}
            />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-40 h-full flex items-center justify-center pt-24 pb-16">
        <div className="container mx-auto px-6">
          {slides.map((slide, index) => (
            <div
              key={`content-${index}`}
              className={`text-center text-white transition-all duration-[1500ms] ease-in-out transform ${
                index === currentIndex
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-8 scale-95 absolute'
              }`}
              style={{ display: index === currentIndex ? 'block' : 'none' }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{slide.title}</h1>
              <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
                {slide.description}
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <a
                  href="#startups"
                  className={`bg-white ${
                    index === 0
                      ? 'text-orange-600'
                      : index === 1
                      ? 'text-green-600'
                      : index === 2
                      ? 'text-blue-600'
                      : index === 3
                      ? 'text-purple-600'
                      : 'text-teal-600'
                  } hover:bg-opacity-90 font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}
                >
                  Explore Startups
                </a>
                <a
                  href="/apply"
                  className="border-2 border-white text-white hover:bg-white/20 font-bold py-3 px-8 rounded-full transition-all duration-300"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-8 left-0 right-0 z-[1000] pointer-events-auto">
        <div className="flex justify-center space-x-4 px-4 py-2">
          {slides.map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => goToSlide(index)}
              className={`w-10 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-white scale-x-110' : 'bg-white/40'
              } hover:bg-white hover:scale-x-110 cursor-pointer`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
