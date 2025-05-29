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
        setError(null);
        const response = await fetchCompanyById(companyId);

        if (response?.data) {
          const data = response.data;
          const processedCompany = {
            id: data.id,
            name: data.Name || "Unnamed Company",
            region: data.Regions || [],
            location:
              (await getLocationFromLatLong(data.HQ_Location?.lat, data.HQ_Location?.lng)) || "Location not specified",
            description: extractDescription(data.Description),
            category: data.Sector_Tags?.[0] || "General",
            logo: extractImageData(data.Company_Logo),
            coverImage: extractImageData(data.Cover_Image),
          };
          setCompany(processedCompany);
        } else {
          throw new Error("Company data not found");
        }
      } catch (err) {
        setError("Failed to load company details");
        console.error(`Error fetching company ${companyId}:`, err);
      } finally {
        setLoading(false);
      }
    };

    if (companyId) fetchCompanyDetails();
  }, [companyId]);

  const extractDescription = (desc) => {
    if (!desc) return "No description available";
    try {
      const children = desc?.[0]?.children;
      return Array.isArray(children)
        ? children.map((c) => c?.text || "").join(" ")
        : typeof desc === "string"
        ? desc
        : "No description available";
    } catch {
      return "No description available";
    }
  };

  const extractImageData = (img) => {
    try {
      const image = Array.isArray(img) ? img[0] : img;
      const format = image?.formats?.medium || image?.formats?.small || image?.formats?.thumbnail || image;
      return image?.url
        ? {
            url: format.url,
            width: format.width,
            height: format.height,
            alt: image.alternativeText || "",
          }
        : null;
    } catch {
      return null;
    }
  };

  const getCategoryColorName = (category) => {
    const map = {
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
    };
    return map[category] || "gray";
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

  const categoryColor = getCategoryColorName(company.category);
  const categoryTextClass = `text-${categoryColor}-700`;
  const categoryBgClass = `bg-${categoryColor}-100`;

  return (
    <Link
      to={`/startup/${company.id}`}
      className="flex flex-col h-full bg-white rounded-xl max-w-xl sm:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out group"
    >
      <div className="relative overflow-hidden image-container h-40 sm:h-48">
        {company.coverImage?.url ? (
          <img
            src={
              company.coverImage.url.startsWith("http")
                ? company.coverImage.url
                : `${import.meta.env.VITE_API_URL}${company.coverImage.url}`
            }
            alt={company.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No Cover Image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute top-2.5 right-2.5 flex flex-row space-x-1.5 z-10">
          {company.region.map((region, i) => (
            <div
              key={`${company.id}-region-${i}`}
              className={`${regionClass} text-white text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow`}
            >
              {region}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-800 line-clamp-1" title={company.name}>
          {company.name}
        </h3>
        <div className="flex items-center mb-2">
          <MapPin size={15} className="mr-1 text-orange-600" />
          <p className="text-base text-gray-500 line-clamp-1" title={company.location}>
            {company.location}
          </p>
        </div>
        <p
          className="text-sm text-gray-700 mb-3 line-clamp-2 flex-grow"
          style={{ minHeight: "2.5rem" }}
          title={company.description}
        >
          {company.description}
        </p>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-200">
          <span
            className={`inline-block px-2.5 py-1 text-xs font-semibold ${categoryTextClass} ${categoryBgClass} rounded-full`}
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
