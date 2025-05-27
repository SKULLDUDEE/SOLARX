import { useState, useEffect } from "react";
import { getLocationFromLatLong } from "../utils/strapiHelper";

const SolarFlowHero = ({ companyId }) => {
  const [showEfficiency, setShowEfficiency] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Stagger animations for a more professional feel
    const timer1 = setTimeout(() => setShowContent(true), 300);
    const timer2 = setTimeout(() => setShowEfficiency(true), 800);
    const timer3 = setTimeout(() => setShowCost(true), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  // Function to manually parse rich text content
  const parseRichText = (content) => {
    if (!content) return "";

    // If it's a string, return it directly
    if (typeof content === "string") return content;

    // If it's an array (Strapi rich text format)
    if (Array.isArray(content)) {
      return content
        .map((block) => {
          if (block.children && Array.isArray(block.children)) {
            return block.children.map((child) => child.text || "").join("");
          }
          return "";
        })
        .join("\n");
    }

    // If we can't parse it, return empty string
    return "";
  };

  // Fetch company data when companyId changes
  useEffect(() => {
    const getCompanyData = async () => {
      if (!companyId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // Get all companies first
        const response = await fetch(
          `http://localhost:1337/api/startups?filters[id][$eq]=${companyId}&populate=*`
        );
        const result = await response.json();

        // Find the company with the matching ID
        const company =
          result.data && result.data.length > 0 ? result.data[0] : null;

        // Fetch logo images from upload files API

        // Get the latest logo file (assuming the most recent upload is the one to use)
        const logoUrl = company.Company_Logo.url;

        if (company) {
          const data = {
            id: company.id,
            name: company.Name,
            description: company.Description[0].children[0].text,
            website: company.Website_URL,
            contactEmail: company.Contact_Email,
            foundingYear: company.Founding_Year,
            headquarters:
              (await getLocationFromLatLong(
                company.HQ_Location.lat,
                company.HQ_Location.lng
              )) || "Location not specified",
            teamSize: company.Team_Size,
            LogoUrl: logoUrl,
            coverImage: company.Cover_Image.url,
          };

          setCompanyData(data);
        } else {
          console.warn("No company found with ID:", companyId);
          setCompanyData(null);
        }
      } catch (error) {
        console.error("Error fetching company hero data:", error);
        setError(`Error: ${error.message || "Failed to fetch company data"}`);
      } finally {
        setLoading(false);
      }
    };

    getCompanyData();
  }, [companyId]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-[40px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800">
            Loading company data...
          </h2>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-[40px]">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600">
            Please try again later or contact support if the problem persists.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-[40px]">
      <div className="max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between px-4 md:px-8">
        <div className={`w-full lg:w-2/3 `}>
          <div className="text-5xl md:text-6xl font-bold mb-6 flex flex-col space-y-4 items-start">
            {companyData && companyData.name && (
              <span className="text-orange-600 text-shadow">
                {companyData.name}
              </span>
            )}
            <div className="w-1/5 h-[5px] bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-6"></div>
          </div>

          <p className="text-gray-700 text-md md:text-xl mb-4 w-4/5">
            {companyData && companyData.description && (
              <span>{companyData.description}</span>
            )}
          </p>
        </div>

        <div className="w-full lg:w-1/3 relative">
          {/* Company logo image */}
          {companyData && companyData.LogoUrl ? (
            <img
              src={`http://localhost:1337${companyData.LogoUrl}`}
              alt={companyData.name || "Cover Image"}
              className="w-full h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <div className="text-gray-400 text-xl">No logo available</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolarFlowHero;
