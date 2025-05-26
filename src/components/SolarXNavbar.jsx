import { useState, useEffect } from "react";
import logo from "/logo.svg";

// TODO: Reuse this component in StartupDetails.jsx
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

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // TODO: Pass as props
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Global Accelerator", href: "/global-accelerator" },
    { label: "Funding", href: "/funding" },
    { label: "Impact", href: "/impact" },
    { label: "Global Reach", href: "/global-reach" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Contact", href: "/contact" },
    { label: "Apply Now", href: "/apply" },
  ];

  return (
    <header className="fixed top-0 left-0 bg-orange-600 px-6 flex justify-between items-center w-full shadow-sm transition-all duration-300 z-[1000]">
      <img
        src={logo}
        alt="International Solar Alliance Logo"
        className="bg-white p-2 rounded-sm w-48"
      />

      {/* Desktop Navigation */}
      <nav className="hidden lg:block">
        <ul className="flex space-x-6">
          {navItems.map((item) => (
            <li key={item.label} className="relative group">
              <a href={item.href} className="text-stone-50 font-medium text-lg">
                {item.label}
                {/* Underline */}
                <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 rounded-md bg-white transition-all duration-300 group-hover:w-full"></span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden flex flex-col space-y-1 z-[1002]"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span
          className={`block w-5 h-0.5 transform transition-all duration-500 ${
            mobileMenuOpen
              ? "origin-center rotate-45 translate-y-1.5 bg-black"
              : "bg-white"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 bg-white transition-all duration-500 ${
            mobileMenuOpen ? "opacity-0" : "opacity-100"
          }`}
        ></span>
        <span
          className={`block w-5 h-0.5 transform transition-all duration-500 ${
            mobileMenuOpen
              ? "origin-center -rotate-45 -translate-y-1.5 bg-black"
              : "bg-white"
          }`}
        ></span>
      </button>

      {/* Mobile Navigation Overlay */}
      <div
        className={`fixed inset-0 bg-amber-50 z-[1001] flex flex-col justify-center items-center transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen
            ? "transform translate-x-0"
            : "transform translate-x-full"
        }`}
      >
        <nav className="w-full max-w-md px-6 h-auto max-h-[80vh] overflow-y-auto">
          <ul className="flex flex-col space-y-4">
            {navItems.map((item) => {
              return item.label !== "Apply Now" ? (
                <li key={item.label} className="border-b border-gray-200 pb-2">
                  <a
                    href={item.href}
                    className="text-gray-800 hover:text-orange-500 transition-colors duration-300 text-lg font-medium block py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ) : (
                <li className="pt-2" key={item.label}>
                  <a
                    href={item.href}
                    className="bg-orange-500 text-white font-medium rounded-full px-6 py-2 text-lg block text-center shadow-md hover:bg-orange-600 transition-colors duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
