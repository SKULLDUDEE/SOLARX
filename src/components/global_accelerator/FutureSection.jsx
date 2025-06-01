// src/components/global_accelerator/FutureSection.jsx
import React from "react";
import ImageCarousel from "./ImageCarousel";

// Use the same or different images for this carousel
const futureCarouselImages = [
  { src: "/imgs/carousel/1.jpg", alt: "Future of Solar Energy" }, // Example path
  { src: "/imgs/carousel/2.jpg", alt: "Global Collaboration" },
  // ... add more images
];

const FutureSection = () => {
  return (
    <section className="writeup bg-gradient-to-br from-gray-900 via-orange-900 to-orange-700 text-white py-20 md:py-24">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 md:mb-4 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Our Future
        </h1>
        <div className="w-1/5 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16 px-4 md:px-0">
          <div className="w-full md:w-1/2 md:pr-4">
            <p className="text-lg leading-relaxed text-gray-300 mb-5">
              Looking ahead, the SolarX Challenge under the International Solar
              Alliance (ISA) aims to expand its global footprint by deepening
              engagement with member countries and{" "}
              <strong>fostering regional innovation ecosystems</strong>. Future
              editions of the challenge will emphasize sector-specific solar
              solutions—such as for{" "}
              <strong>
                agriculture, healthcare, and decentralized rural electrification
              </strong>
              —ensuring that solar innovation directly addresses critical
              developmental needs. ISA plans to partner with academic
              institutions, development agencies, and private sector leaders to
              provide a robust support system for innovators, from ideation to
              implementation.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              To further accelerate impact, SolarX will also focus on scaling
              successful solutions through{" "}
              <strong>
                pilot projects, cross-country deployments, and access to green
                finance
              </strong>
              . The challenge will
              <strong>integrate digital tools</strong> to track progress,
              measure impact, and facilitate knowledge-sharing among
              participants. By nurturing a pipeline of solar entrepreneurs and
              enhancing the visibility of
              <strong> clean tech solutions</strong>, ISA envisions SolarX as a
              catalyst in achieving global climate goals and delivering energy
              access to the last mile.
            </p>
          </div>
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <ImageCarousel images={futureCarouselImages} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FutureSection;
