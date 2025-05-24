import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  FileText,
} from "lucide-react";

// Helper function to extract plain text from Strapi's rich text format
const extractRichTextToString = (richTextArray) => {
  let text = "";
  if (Array.isArray(richTextArray)) {
    richTextArray.forEach((block) => {
      if (block.children && Array.isArray(block.children)) {
        block.children.forEach((child) => {
          if (child.text) {
            text += child.text + " ";
          }
          // Optional: Handle nested children if your structure is deeper
          if (child.children && Array.isArray(child.children)) {
            child.children.forEach((grandchild) => {
              if (grandchild.text) {
                text += grandchild.text + " ";
              }
            });
          }
        });
      }
    });
  }
  return text.trim();
};

const ProjectGallery = ({ companyId }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!companyId) {
        setError("Company ID is required to fetch projects.");
        setLoading(false);
        setProjects([]);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        const apiUrl = `http://localhost:1337/api/projects?filters[startup][id][$eq]=${companyId}&populate[0]=Banner_Image&populate[1]=startup`;
        // console.log('Fetching projects from:', apiUrl);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.error?.message ||
            `API request failed: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log("Projects data from API:", result);

        if (result && result.data && result.data.length > 0) {
          const processedProjects = result.data.map((apiProject) => {
            const overviewText =
              extractRichTextToString(apiProject.Overview) ||
              apiProject.One_Line_Description ||
              "No detailed overview available.";

            let imageUrl = null;
            let imageAlt = apiProject.Name || "Project image";
            if (apiProject.Banner_Image) {
              const img = apiProject.Banner_Image;
              const rawUrl =
                img.formats?.medium?.url || img.formats?.small?.url || img.url;
              imageUrl = rawUrl ? `http://localhost:1337${rawUrl}` : null;
              imageAlt = img.alternativeText || img.name || imageAlt;
            }

            return {
              id: apiProject.id,
              name: apiProject.Name || `Project ${apiProject.id}`,
              description: overviewText,
              oneLiner: apiProject.One_Line_Description || "",
              image: imageUrl ? { url: imageUrl, alt: imageAlt } : null,
              externalUrl: apiProject.URL || null, // Main project URL
            };
          });

          setProjects(processedProjects);
        } else {
          console.log(`No projects found for companyId: ${companyId}.`);
          // Provide a specific message if no projects, rather than placeholders if not desired
          setProjects([]); // Or set placeholder if required by design
          // setError(`No projects found for this company.`); // Optionally set error for no data
        }
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(
          err.message || "An unknown error occurred while fetching projects."
        );
        setProjects([]); // Clear projects on error
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [companyId]);

  const itemsPerView = 3; // Number of projects visible at a time
  const totalItems = projects.length;

  // Adjust itemsPerView based on screen size for responsiveness
  const getResponsiveItemsPerView = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 768) return 1; // Small screens
      if (window.innerWidth < 1024) return 2; // Medium screens
    }
    return 3; // Large screens
  };

  const [effectiveItemsPerView, setEffectiveItemsPerView] = useState(
    getResponsiveItemsPerView()
  );

  useEffect(() => {
    const handleResize = () => {
      setEffectiveItemsPerView(getResponsiveItemsPerView());
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial check
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const showSlider = totalItems > effectiveItemsPerView;
  const maxIndex = Math.max(0, totalItems - effectiveItemsPerView);

  const goToPrevious = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Calculate visible projects based on currentIndex and *effective* itemsPerView
  const visibleProjects = projects.slice(
    currentIndex,
    currentIndex + effectiveItemsPerView
  );

  // Fallback content if no projects are loaded or available
  const renderFallbackContent = () => {
    if (projects.length === 0 && !error) {
      // No projects, no error
      return (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">
            No Projects Yet
          </h3>
          <p className="text-gray-500">
            This company hasn't added any projects to their gallery.
          </p>
        </div>
      );
    }
    return null; // Error/loading handled separately
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-3xl font-bold text-gray-800 inline-block relative">
          Project Gallery
          <span className="block w-20 h-1 bg-orange-500 mt-2 mx-auto sm:mx-0"></span>
        </h2>
        {projects.length > 0 && projects[0].oneLiner && (
          <p className="mt-3 text-lg text-gray-600">{projects[0].oneLiner}</p>
        )}
      </div>

      {loading && (
        <div className="flex flex-col justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-700">Loading projects...</p>
        </div>
      )}

      {error && !loading && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-2xl mx-auto mb-8"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!loading && !error && projects.length === 0 && renderFallbackContent()}

      {!loading && !error && projects.length > 0 && (
        <div className="relative">
          {showSlider && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 -ml-3 sm:-ml-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  currentIndex === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
                }`}
                aria-label="Previous projects"
              >
                <ChevronLeft size={28} />
              </button>

              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 -mr-3 sm:-mr-5 z-20 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  currentIndex >= maxIndex
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                    : "bg-white text-gray-700 hover:bg-orange-500 hover:text-white hover:shadow-xl"
                }`}
                aria-label="Next projects"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${
              effectiveItemsPerView === 2 ? "lg:grid-cols-2" : ""
            } ${
              effectiveItemsPerView === 1 ? "md:grid-cols-1 lg:grid-cols-1" : ""
            }`}
          >
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden">
                  {project.image ? (
                    <img
                      src={project.image.url}
                      alt={project.image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <FileText size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-xl font-bold text-white">
                      {project.name}
                    </h3>
                    {project.oneLiner && (
                      <p className="text-sm text-orange-200 mt-1 truncate">
                        {project.oneLiner}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4 flex-grow">
                    {project.description}
                  </p>

                  {project.externalUrl && (
                    <div className="mt-auto pt-4 border-t border-gray-200">
                      <a
                        href={project.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium text-sm hover:underline transition-colors duration-200 group/link"
                      >
                        Learn More
                        <ExternalLink
                          size={16}
                          className="ml-1.5 transform transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                        />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showSlider && totalItems > effectiveItemsPerView && (
            <div className="flex justify-center mt-8 space-x-2">
              {Array.from({
                length: Math.ceil(totalItems / 1) - effectiveItemsPerView + 1,
              }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)} // Each dot represents a starting index for a "view"
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 ${
                    index === currentIndex
                      ? "bg-orange-500 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to project set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
      <style jsx>{`
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ProjectGallery;
