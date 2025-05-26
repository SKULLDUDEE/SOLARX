// src/components/global_accelerator/HeroSectionGA.jsx
import React from "react";
import ImageCarousel from "./ImageCarousel"; // Import the new carousel

// Image paths should be relative to the public folder or imported
const carouselImages = [
  { src: "/imgs/carousel/1.jpg", alt: "Solar panels on a roof" },
  { src: "/imgs/carousel/2.jpg", alt: "Wind turbines in a field" },
  { src: "/imgs/carousel/3.jpg", alt: "Close-up of a solar panel" },
  { src: "/imgs/carousel/4.jpg", alt: "Technician working on solar equipment" },
];

const HeroSectionGA = () => {
  // Get navbar height (approximate or from context/prop if dynamic)
  // For now, let's assume a fixed height or ensure Navbar is not overlapping due to page structure.
  // The main page wrapper should handle padding for the fixed navbar.
  const navbarHeight = "4.5rem"; // Example: 'h-20' or 80px. Adjust this!

  return (
    <section
      className="bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 text-white py-20 md:py-24"
      style={{ paddingTop: `calc(${navbarHeight} + 3rem)` }} // Adding navbar height + some extra padding
    >
      <div className="max-w-7xl mx-auto pt-16">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-16 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Global Accelerator Program
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 pt-10 px-8 md:px-0">
          <div className="w-full md:w-1/2 md:pr-4">
            <p className="text-lg leading-relaxed text-gray-300 mb-5">
              The SolarX Global Accelerator Program, spearheaded by the
              International Solar Alliance (ISA), has emerged as a
              transformative platform for nurturing early-stage solar startups
              across its member nations. Through a dynamic blend of workshops,
              webinars, and mentoring sessions, the program aims to empower
              entrepreneurs with the tools and insights necessary to drive
              innovation in the solar energy sector. By fostering scalable and
              replicable business models, SolarX contributes significantly to
              accelerating the global transition towards clean energy.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              A notable highlight of the program is the SolarX Startup
              Challenge, which has garnered substantial participation from the
              Asia-Pacific region. In its 2024 edition, the challenge recognized
              30 promising startups—20 from the broader APAC region and 10 from
              India—each awarded a cash grant of USD 15,000. Beyond financial
              support, these startups benefit from a comprehensive acceleration
              program, including mentorship from seasoned professionals,
              investor connections, and market access initiatives. Such
              engagements underscore ISA's commitment to fostering a robust
              startup ecosystem, addressing energy access disparities, and
              promoting sustainable development across its member countries.
            </p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <ImageCarousel images={carouselImages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionGA;
