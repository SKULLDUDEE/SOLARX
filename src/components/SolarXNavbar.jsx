import React, { useState, useEffect } from 'react';

export default function SolarXNavbar() {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Listen for scroll events to detect when banner is hidden
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setBannerVisible(false);
      } else {
        setBannerVisible(true);
      }
    };
    
    // Check initial state
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Funding", href: "/funding" },
    { label: "Impact", href: "/impact" },
    { label: "Global Reach", href: "/global-reach" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className={`fixed left-0 right-0 bg-amber-50 py-4 px-6 flex justify-between items-center w-full shadow-sm transition-all duration-300 top-0 z-50`}>
      {/* Logo and Brand */}
      <div className="flex items-center">
        <div className="bg-orange-500 rounded-full h-10 w-10 flex items-center justify-center mr-2">
          <div className="bg-amber-50 rounded-full h-6 w-6"></div>
        </div>
        <span className="text-orange-500 text-xl font-bold">SolarX</span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.label} className="relative group">
              <a
                href={item.href}
                className="text-gray-800 group-hover:text-orange-500 transition-colors duration-300"
              >
                {item.label}
                {/* Underline */}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
          <li className="relative group">
            <a
              href="/apply"
              className="text-gray-800 group-hover:text-orange-500 transition-colors duration-300"
            >
              Apply
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
            </a>
          </li>
        </ul>
      </nav>

     

      {/* Mobile Menu Button */}
      <button 
        className="lg:hidden flex flex-col space-y-1 z-50"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span 
          className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-300 ${
            mobileMenuOpen ? 'transform rotate-45 translate-y-1.5' : ''
          }`}
        ></span>
        <span 
          className={`block w-5 h-0.5 bg-gray-800 transition-opacity duration-300 ${
            mobileMenuOpen ? 'opacity-0' : 'opacity-100'
          }`}
        ></span>
        <span 
          className={`block w-5 h-0.5 bg-gray-800 transition-transform duration-300 ${
            mobileMenuOpen ? 'transform -rotate-45 -translate-y-1.5' : ''
          }`}
        ></span>
      </button>

      {/* Mobile Navigation Overlay */}
      <div 
        className={`fixed inset-0 bg-amber-50 z-40 flex flex-col justify-center items-center transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'transform translate-x-0' : 'transform translate-x-full'
        }`}
      >
        <nav className="w-full max-w-md px-6 h-auto max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <li key={item.label} className="border-b border-gray-200 pb-2">
                <a
                  href={item.href}
                  className="text-gray-800 hover:text-orange-500 transition-colors duration-300 text-lg font-medium block py-1.5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="/apply"
                className="bg-orange-500 text-white font-medium rounded-full px-6 py-2 text-lg block text-center shadow-md hover:bg-orange-600 transition-colors duration-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
