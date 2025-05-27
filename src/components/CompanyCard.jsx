import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCompanyById } from "../services/api";
import { getLocationFromLatLong } from "../utils/strapiHelper";
import { MapPin } from "lucide-react";

export default function CompanyCard({ companyId, regionClass }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error on new fetch
        const response = await fetchCompanyById(companyId);

        if (response && response.data) {
          const companyData = response.data;
          console.log(`Company ${companyId} raw data:`, companyData);

          const newCompanyState = {
            id: companyData.id,
            name: companyData.Name || "Unnamed Company",
            // Ensure 'region' is an array, even if Regions is null/undefined
            region: companyData.Regions || [],
            // regionName: companyData.Regions, // This seems redundant if 'region' holds the array
            location:
              (await getLocationFromLatLong(
                companyData.HQ_Location.lat,
                companyData.HQ_Location.lng
              )) || "Location not specified",
            description: extractDescription(
              // Safer access to nested properties
              companyData.Description?.[0]?.children?.[0]?.text
            ),
            category: companyData.Sector_Tags?.[0] || "General", // Default category
            // categoryColor: getCategoryColor('Clean Energy'), // You need to define/use this
            logo: extractImageData(companyData.Company_Logo),
            coverImage: extractImageData(companyData.Cover_Image),
          };
          setCompany(newCompanyState);
          console.log(`Company ${companyId} processed state:`, newCompanyState); // Log new state
        } else {
          setError("Company data not found");
          setCompany(null); // Clear company on error
        }
      } catch (err) {
        console.error(`Error fetching company ${companyId}:`, err);
        setError("Failed to load company details");
        setCompany(null); // Clear company on error
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  const extractDescription = (introduction) => {
    // console.log("Introduction structure for description:", introduction);
    if (!introduction) return "No description available";
    try {
      if (typeof introduction === "string") return introduction;
      if (Array.isArray(introduction)) {
        if (
          introduction[0]?.children &&
          Array.isArray(introduction[0].children)
        ) {
          return introduction[0].children
            .map((child) => child.text || "")
            .filter((text) => text)
            .join(" ");
        }
      }
      if (introduction.data && Array.isArray(introduction.data)) {
        return extractDescription(introduction.data);
      }
    } catch (err) {
      console.error("Error extracting description:", err);
    }
    return "No description available";
  };

  const extractImageData = (imageDataField) => {
    // console.log("Image data structure:", imageDataField);
    if (!imageDataField) return null;
    try {
      if (Array.isArray(imageDataField) && imageDataField.length > 0) {
        const image = imageDataField[0];
        if (!image) return null;

        // Prefer specific formats if available (common in Strapi)
        if (image.formats) {
          const format =
            image.formats.medium ||
            image.formats.small ||
            image.formats.thumbnail ||
            image;
          return {
            url: format.url,
            width: format.width,
            height: format.height,
            alt: image.alternativeText || "",
          };
        }
        // Fallback to top-level image data if formats aren't present but url is
        if (image.url)
          return {
            url: image.url,
            width: image.width,
            height: image.height,
            alt: image.alternativeText || "",
          };

        return image; // Final fallback
      } else if (imageDataField.url) {
        // Handles if imageDataField is a single image object
        return {
          url: imageDataField.url,
          width: imageDataField.width,
          height: imageDataField.height,
          alt: imageDataField.alternativeText || "",
        };
      }
    } catch (err) {
      console.error("Error extracting image data:", err);
    }
    return null;
  };

  // Get color for category
  // You'll need to use this if you want dynamic category colors.
  // For now, I'll use a static color for the example, but you can re-enable this.
  const getCategoryColorName = (category) => {
    const categoryColorMap = {
      Rural: "blue",
      Urban: "green",
      Agriculture: "purple",
      Healthcare: "orange",
      Education: "red",
      "Small Business / SMEs": "blue",
      "Women Empowerment": "indigo",
      "Electric Mobility": "green",
      "Fisher Fold": "yellow",
      "Construction / Housing": "emerald",
      "Off-grid Communities": "pink",
      "Utility-Scale / Grid": "teal",
      "Public Infrastructure / Amenities": "cyan",
      Tourism: "rose",
      "Cold Chain / Perishables": "lime",
      "Poultry / Livestock": "amber",
      "Manufacturing / Industrial": "slate",
      "EV Fleets": "violet",
      "Remote Monitoring / Telecom": "fuchsia",
      "Microfinance / Financial Inclusion": "zinc",
      General: "gray",
      // Add more categories as needed
    };
    return categoryColorMap[category] || "gray"; // Default color if category not found
  };

  if (loading) {
    return (
      <div className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl animate-pulse h-full">
        <div className="h-40 sm:h-48 bg-gray-300"></div>
        <div className="p-4 sm:p-6 flex-grow flex flex-col justify-between">
          <div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4"></div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <div className="h-6 w-20 bg-gray-300 rounded-full"></div>
            <div className="h-4 w-24 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="group flex flex-col bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl h-full">
        <div className="p-4 sm:p-6 text-center flex-grow flex flex-col justify-center items-center">
          <p className="text-red-500 font-semibold">Error Loading Company</p>
          {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
      </div>
    );
  }

  const categoryColorName = getCategoryColorName(company.category);
  const categoryTextColorClass = `text-${categoryColorName}-700`;
  const categoryBgColorClass = `bg-${categoryColorName}-100`;

  return (
    <Link
      to={`/startup/${company.id}`} // Use company.id from state
      className="flex flex-col h-full bg-white rounded-xl max-w-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group"
    >
      <div className="relative overflow-hidden image-container h-40 sm:h-48">
        {company.coverImage && company.coverImage.url ? (
          <img
            src={
              company.coverImage.url.startsWith("http")
                ? company.coverImage.url
                : `http://localhost:1337${company.coverImage.url}`
            }
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Cover Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute top-2.5 right-2.5 flex flex-row justify-between items-end space-x-1.5 z-10">
          {company.region &&
            company.region.length > 0 &&
            company.region.map((regionItem, idx) => (
              <div
                key={`${company.id}-region-${idx}`}
                className={`${regionClass} text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow`}
              >
                {regionItem}
              </div>
            ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3
          className="text-lg sm:text-xl font-bold mb-1 text-gray-800 line-clamp-1"
          title={company.name}
        >
          {company.name}
        </h3>
        <div className="flex items-center mb-2">
          <MapPin size={15} className="mr-1 text-orange-600" />
          <p
            className="text-base  text-gray-500 line-clamp-1"
            title={company.location}
          >
            {company.location}
          </p>
        </div>
        <p
          className="text-sm text-gray-700 mb-3 line-clamp-2 flex-grow" // flex-grow to push footer down
          style={{ minHeight: "2.5rem" }} // Approx 2 lines of text
          title={company.description}
        >
          {company.description}
        </p>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-200">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold ${categoryTextColorClass} ${categoryBgColorClass} rounded-full`}
            title={`Category: ${company.category}`}
          >
            {company.category}
          </span>
          <div className="text-orange-600 hover:text-orange-700 text-xs sm:text-sm font-medium group-hover:underline">
            View Details →
          </div>
        </div>
      </div>
    </Link>
  );
}
