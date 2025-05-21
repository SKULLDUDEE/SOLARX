import { useState, useEffect } from 'react';
import { Sun, ArrowRight, X, Globe, Users, Lightbulb, Award } from 'lucide-react';

export default function WelcomeBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Animation effect on component mount and check for mobile
  useEffect(() => {
    // Set a small delay to ensure the animation is visible
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    
    // Check if mobile view
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Function to handle scroll events
    const handleScroll = () => {
      // Once scrolled, the banner stays hidden until page reload
      if (window.scrollY > 100 && !hasScrolled) {
        setHasScrolled(true);
      }
    };
    
    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', checkMobile);
    
    // Rotate through sections automatically (only on desktop)
    const sectionTimer = setInterval(() => {
      if (!isMobile) {
        setActiveSection((prev) => (prev + 1) % 3);
      }
    }, 5000);
    
    // Clean up the event listeners and timers on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
      clearInterval(sectionTimer);
    };
  }, [hasScrolled, isMobile]);

  // Close the banner manually
  const closeBanner = () => {
    setHasScrolled(true);
  };

  // Combined visibility classes
  const visibilityClass = !isVisible || hasScrolled
    ? 'opacity-0 -translate-y-full pointer-events-none'
    : 'opacity-100 translate-y-0';

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-[9999] overflow-hidden transition-all duration-500 transform ${visibilityClass}`}
    >
      <div className="bg-gradient-to-r from-amber-50 to-orange-100 shadow-lg border-b border-amber-200 bg-opacity-100">
        <div className="relative max-w-6xl mx-auto px-4 py-3 md:py-8 lg:py-12">
          {/* Close button */}
          <button 
            onClick={closeBanner}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 text-amber-500 hover:text-amber-700 transition-colors"
            aria-label="Close welcome banner"
          >
            <X size={20} className="sm:hidden" />
            <X size={24} className="hidden sm:block" />
          </button>
          
          {/* Header - Simplified for mobile */}
          <div className="flex flex-row items-center gap-3 md:gap-6 lg:gap-10 mb-3 md:mb-8 animate-fadeIn">
            {/* Sun icon with pulse animation - smaller on mobile */}
            <div className="text-amber-400 shrink-0 relative">
              <div className="absolute inset-0 bg-amber-200 rounded-full scale-110 animate-ping opacity-30"></div>
              <Sun size={36} strokeWidth={1.5} className="relative sm:hidden" />
              <Sun size={64} strokeWidth={1.5} className="relative hidden sm:block" />
            </div>
            
            {/* Title - Simplified for mobile */}
            <div className="flex-1 text-left">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-amber-800 mb-1 md:mb-2">
                Welcome to <span className="text-orange-500 animate-pulse">SolarX</span>
              </h2>
              
              <p className="text-amber-700 text-sm sm:text-lg md:text-xl max-w-3xl md:block">
                {isMobile ? 'Supporting innovative solar startups globally.' : 
                  'An initiative by the International Solar Alliance supporting innovative solar startups across Africa, Asia-Pacific, and India.'}
              </p>
            </div>
          </div>
          
          {/* Information Sections - Hidden on mobile, visible on tablet/desktop */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* About SolarX */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md border border-amber-100 transition-all duration-500 transform ${activeSection === 0 ? 'scale-105 shadow-lg border-amber-300' : 'scale-100'}`}>
              <div className="flex items-center mb-3 sm:mb-4">
                <Lightbulb className="text-amber-500 mr-2 sm:mr-3" size={24} />
                <h3 className="text-lg sm:text-xl font-semibold text-amber-800">About SolarX</h3>
              </div>
              <p className="text-amber-700 text-sm sm:text-base mb-3 sm:mb-4">
                SolarX is a flagship program designed to identify, fund, and scale innovative solar energy startups. 
                We provide financial support, technical expertise, and global networking opportunities to entrepreneurs 
                who are developing cutting-edge solar technologies and business models.
              </p>
              <p className="text-amber-700 text-sm sm:text-base">
                Our mission is to accelerate the global transition to renewable energy by supporting the next generation 
                of solar innovators and entrepreneurs.
              </p>
            </div>
            
            {/* About ISA */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md border border-amber-100 transition-all duration-500 transform ${activeSection === 1 ? 'scale-105 shadow-lg border-amber-300' : 'scale-100'}`}>
              <div className="flex items-center mb-3 sm:mb-4">
                <Globe className="text-amber-500 mr-2 sm:mr-3" size={24} />
                <h3 className="text-lg sm:text-xl font-semibold text-amber-800">About ISA</h3>
              </div>
              <p className="text-amber-700 text-sm sm:text-base mb-3 sm:mb-4">
                The International Solar Alliance (ISA) is an intergovernmental organization working to increase the 
                deployment of solar energy technologies worldwide. Founded in 2015, ISA now includes over 100 member 
                countries committed to promoting solar energy.
              </p>
              <p className="text-amber-700 text-sm sm:text-base">
                ISA facilitates cooperation among solar-resource-rich countries and mobilizes investments of more than 
                USD 1 trillion by 2030 for massive deployment of solar energy.
              </p>
            </div>
            
            {/* Program Benefits */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-lg p-4 sm:p-6 shadow-md border border-amber-100 transition-all duration-500 transform ${activeSection === 2 ? 'scale-105 shadow-lg border-amber-300' : 'scale-100'}`}>
              <div className="flex items-center mb-3 sm:mb-4">
                <Award className="text-amber-500 mr-2 sm:mr-3" size={24} />
                <h3 className="text-lg sm:text-xl font-semibold text-amber-800">Program Benefits</h3>
              </div>
              <ul className="text-amber-700 text-sm sm:text-base space-y-1 sm:space-y-2">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span> 
                  <span>Funding up to $100,000 for early-stage startups</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span> 
                  <span>Technical mentorship from industry experts</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span> 
                  <span>Access to testing facilities and infrastructure</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span> 
                  <span>Global networking with investors and partners</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span> 
                  <span>Market entry support in member countries</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Mobile-only compact section */}
          <div className="md:hidden mb-3">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-md border border-amber-100">
              <div className="flex items-center mb-2">
                <Award className="text-amber-500 mr-2" size={18} />
                <h3 className="text-base font-semibold text-amber-800">Key Benefits</h3>
              </div>
              <ul className="text-amber-700 text-xs space-y-1">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-1">•</span> 
                  <span>Funding up to $100,000</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-1">•</span> 
                  <span>Technical mentorship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-1">•</span> 
                  <span>Global networking opportunities</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Section indicators - Hidden on mobile */}
          <div className="hidden md:flex justify-center gap-2 mb-4 sm:mb-6">
            {[0, 1, 2].map((index) => (
              <button 
                key={index}
                onClick={() => setActiveSection(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${activeSection === index ? 'bg-amber-500 scale-125' : 'bg-amber-300'}`}
                aria-label={`View section ${index + 1}`}
              />
            ))}
          </div>
          
          {/* CTA Buttons - Simplified for mobile */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <button className="bg-orange-400 hover:bg-orange-500 text-white font-medium text-xs sm:text-base py-1.5 sm:py-3 px-3 sm:px-6 rounded-md transition-all duration-300 flex items-center gap-1 sm:gap-2 hover:scale-105 shadow-md">
              Learn More <ArrowRight size={14} className="sm:hidden" /><ArrowRight size={18} className="hidden sm:block" />
            </button>
            <button className="bg-white hover:bg-amber-50 text-amber-700 border border-amber-300 font-medium text-xs sm:text-base py-1.5 sm:py-3 px-3 sm:px-6 rounded-md transition-all duration-300 flex items-center gap-1 sm:gap-2 hover:border-amber-500">
              Apply Now <ArrowRight size={14} className="sm:hidden" /><ArrowRight size={18} className="hidden sm:block" />
            </button>
          </div>
          
          {/* Scroll indicator - Smaller on mobile */}
          <div className="absolute bottom-0 sm:bottom-2 left-1/2 transform -translate-x-1/2 text-amber-500/70 animate-bounce">
            <div className="flex flex-col items-center">
              <span className="text-[10px] sm:text-xs mb-0 sm:mb-1">Scroll</span>
              <svg width="12" height="8" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:hidden">
                <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden sm:block">
                <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}