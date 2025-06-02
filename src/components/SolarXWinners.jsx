import React, { useState, useEffect, useMemo, useRef } from "react";
import { fetchCompanies } from "../services/api"; // Assuming this fetches all companies
import CompanyCard from "./CompanyCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./SliderStyles.css";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const REGIONS_OPTIONS = [
  "All Regions",
  "Asia-Pacific",
  "LAC",
  "MENA",
  "Africa",
];

export default function SolarXWinners() {
  const sliderRef = useRef(null);
  const [allCompaniesRaw, setAllCompaniesRaw] = useState(null);
  const [processedCompanies, setProcessedCompanies] = useState([]); // Store companies with id and regions
  const [selectedRegion, setSelectedRegion] = useState(REGIONS_OPTIONS[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch companies data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchCompanies(); // Fetches all companies

        if (response && response.data) {
          setAllCompaniesRaw(response.data); // Assuming response.data is the array of companies
        } else {
          console.warn(
            "No data in API response for SolarXWinners, or structure is unexpected."
          );
          setAllCompaniesRaw([]);
        }
      } catch (err) {
        console.error("Error fetching companies for SolarXWinners:", err);
        setError("Failed to load SolarX Winners. Please try again later.");
        setAllCompaniesRaw([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process raw companies data once it's fetched
  useEffect(() => {
    if (allCompaniesRaw) {
      const newProcessedCompanies = allCompaniesRaw.map((company) => ({
        id: company.id,
        // Adjust 'company.attributes.Regions' if your API structure is different
        // Ensure 'regions' is always an array
        regions: company.Regions || [],
      }));
      setProcessedCompanies(newProcessedCompanies);
    }
  }, [allCompaniesRaw]);

  // Filter companies based on selected region
  const filteredCompanies = useMemo(() => {
    if (!processedCompanies || processedCompanies.length === 0) {
      return [];
    }
    if (selectedRegion === "All Regions") {
      return processedCompanies;
    }
    return processedCompanies.filter(
      (company) => company.regions && company.regions.includes(selectedRegion)
    );
  }, [processedCompanies, selectedRegion]);

  const defaultRegionClass = "orange-gradient"; // For CompanyCard internal badge styling

  // Dynamically adjust slider settings based on filtered companies
  const currentSlidesToShow = Math.min(
    3,
    filteredCompanies.length > 0 ? filteredCompanies.length : 1
  );

  const sliderSettings = {
    dots: true,
    arrows: false, // We'll use custom arrows
    infinite: filteredCompanies.length > currentSlidesToShow,
    speed: 500,
    slidesToShow: currentSlidesToShow,
    slidesToScroll: Math.min(
      3,
      filteredCompanies.length > 0 ? filteredCompanies.length : 1
    ),
    initialSlide: 0,
    autoplay: filteredCompanies.length > currentSlidesToShow,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(
            2,
            filteredCompanies.length > 0 ? filteredCompanies.length : 1
          ),
          slidesToScroll: Math.min(
            2,
            filteredCompanies.length > 0 ? filteredCompanies.length : 1
          ),
          infinite:
            filteredCompanies.length >
            Math.min(
              2,
              filteredCompanies.length > 0 ? filteredCompanies.length : 1
            ),
        },
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(
            2,
            filteredCompanies.length > 0 ? filteredCompanies.length : 1
          ),
          slidesToScroll: Math.min(
            2,
            filteredCompanies.length > 0 ? filteredCompanies.length : 1
          ),
          infinite:
            filteredCompanies.length >
            Math.min(
              2,
              filteredCompanies.length > 0 ? filteredCompanies.length : 1
            ),
        },
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: filteredCompanies.length > 1,
        },
      },
    ],
  };

  return (
    <section
      id="winners"
      className="max-w-screen-2xl mx-auto min-w-full bg-gradient-to-b from-white via-orange-50 to-white py-16 md:py-24 relative"
    >
      <div className="px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-800">
            Meet Our <span className="text-orange-600">SolarX Winners</span>
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto my-8">
            Discover innovative startups driving change in the solar energy
            sector.
          </p>
        </div>

        {/* Region Badge Selector */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-10 md:mb-12 px-2">
          {REGIONS_OPTIONS.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500
                ${
                  selectedRegion === region
                    ? "bg-orange-600 text-white shadow-lg hover:bg-orange-700 transform scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-50 shadow-sm hover:shadow-md border border-gray-300 hover:border-orange-400"
                }`}
            >
              {region}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20 min-h-[300px]">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-md mb-8 text-center shadow-md max-w-lg mx-auto">
            <div className="flex justify-center mb-3">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="font-semibold text-lg mb-1">
              Oops! Something went wrong.
            </p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && filteredCompanies.length === 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-400 text-orange-700 p-6 rounded-md mb-8 text-center shadow-md max-w-lg mx-auto min-h-[200px] flex flex-col justify-center items-center">
            <p className="text-xl font-semibold mb-2">No Companies Found</p>
            <p className="text-sm">
              {selectedRegion === "All Regions"
                ? "There are currently no companies to display."
                : `No companies found for the "${selectedRegion}" region.`}
            </p>
            <p className="text-sm mt-1">
              Try selecting a different region or check back later.
            </p>
          </div>
        )}

        {!loading && !error && filteredCompanies.length > 0 && (
          <div className="mt-8">
            {/* Slider Controls (Optional - if you want them outside the slider component) */}
            {filteredCompanies.length > currentSlidesToShow && (
              <div className="flex justify-end items-center mb-4 px-1 sm:px-0">
                <div className="flex gap-2">
                  <button
                    onClick={() => sliderRef.current?.slickPrev()}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                    aria-label="Previous slide"
                  >
                    <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                  <button
                    onClick={() => sliderRef.current?.slickNext()}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white text-orange-600 hover:bg-orange-100 shadow-md hover:shadow-lg transition-all border border-gray-200"
                    aria-label="Next slide"
                  >
                    <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </div>
            )}

            <div className="slider-container -mx-2 sm:-mx-3">
              {" "}
              {/* Negative margin to counteract padding in slides */}
              <Slider
                ref={sliderRef}
                {...sliderSettings}
                className="company-slider"
              >
                {filteredCompanies.map((company) => (
                  <div
                    key={company.id}
                    className="px-2 sm:px-3 h-full card-container"
                  >
                    {" "}
                    {/* Padding for spacing between cards */}
                    <CompanyCard
                      companyId={company.id}
                      regionClass={defaultRegionClass} // Pass this for internal CompanyCard styling
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
