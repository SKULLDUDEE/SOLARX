import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProjectGallery = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch projects from Strapi API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Use populate=* to get all related data including images
        const response = await fetch('http://localhost:1337/api/projects?populate=*');
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Projects data from API:', data);
        
        // Process the projects data
        if (data && data.data && data.data.length > 0) {
          // Transform the API data into the format we need
          const processedProjects = data.data.map((project, index) => {
            // Extract description text from the rich text format
            let descriptionText = '';
if (project.description && Array.isArray(project.description)) {
  project.description.forEach(block => {
    if (block.children) {
      block.children.forEach(child => {
        if (child.text && !child.text.includes('http')) {
          descriptionText += child.text + ' ';
        } else if (child.children) {
          child.children.forEach(grandchild => {
            if (grandchild.text && !grandchild.text.includes('http')) {
              descriptionText += grandchild.text + ' ';
            }
          });
        }
      });
    }
  });
}

            
            // If we couldn't extract a description, use a default
            if (!descriptionText.trim()) {
              descriptionText = 'View project details and documentation';
            }
            
            // Extract image if available
            let image = null;
            if (project.documents && project.documents.length > 0) {
              const doc = project.documents[0];
              // Use medium format if available, otherwise use the original
              const imageUrl = doc.formats?.medium?.url || doc.url;
              
              // Construct the full URL (Strapi returns relative URLs)
              image = {
                url: `http://localhost:1337${imageUrl}`,
                alt: doc.name || 'Project image',
                width: doc.formats?.medium?.width || doc.width,
                height: doc.formats?.medium?.height || doc.height
              };
            }
            
            return {
              id: project.id,
              title: `Project ${index + 1}`,
              name: project.title || `Solar Project ${index + 1}`,
              description: descriptionText.trim(),
              // Extract any links or additional data if available
              links: extractLinks(project),
              image: image
            };
          });
          
          setProjects(processedProjects);
        } else {
          // If no projects are found, create some placeholder projects
          // This ensures the component still works even with no data
          setProjects([
            {
              id: 'placeholder-1',
              title: 'New Project',
              name: 'Solar Installation',
              description: 'Details about this project will be added soon.'
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        
        // Set fallback projects in case of error
        setProjects([
          {
            id: 'error-1',
            title: 'Project Data',
            name: 'Project Information',
            description: 'Unable to load project data. Please try again later.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  // Helper function to extract links from project data
  const extractLinks = (project) => {
    // Use a Set to avoid duplicate links
    const linkSet = new Set();
    
    // Try to extract links from description
    if (project.description && Array.isArray(project.description)) {
      project.description.forEach(block => {
        if (block.children) {
          block.children.forEach(child => {
            if (child.url) {
              linkSet.add(child.url);
            } else if (child.children) {
              child.children.forEach(grandchild => {
                if (grandchild.url) {
                  linkSet.add(grandchild.url);
                }
              });
            }
          });
        }
      });
    }
    
    // Convert Set back to array
    return Array.from(linkSet);
  };

  const itemsPerView = 3;
  const totalItems = projects.length;
  const showSlider = totalItems > itemsPerView;
  const maxIndex = Math.max(0, totalItems - itemsPerView);

  const goToPrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
  };

  const visibleProjects = projects.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 border-l-4 border-orange-500 pl-4">
          Project Gallery
        </h2>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-2xl mx-auto mb-8">
          <p className="font-medium">Error loading projects:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Gallery Container - Only show when data is loaded */}
      {!loading && (
        <div className="relative">
          {/* Navigation Buttons - Only show if slider is needed */}
          {showSlider && (
            <>
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  currentIndex === 0 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl'
                }`}
                aria-label="Previous project"
              >
                <ChevronLeft size={24} />
              </button>
              
              <button
                onClick={goToNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 p-2 rounded-full shadow-lg transition-all duration-200 ${
                  currentIndex >= maxIndex 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-xl'
                }`}
                aria-label="Next project"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Project Card Header - Show image if available, otherwise show gradient */}
                {project.image ? (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image.url} 
                      alt={project.image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <h3 className="text-2xl font-bold text-white p-4 w-full text-center">
                        {project.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white p-8 text-center relative">
                    <h3 className="text-3xl font-bold mb-2">{project.title}</h3>
                  </div>
                )}
                
                {/* Project Details */}
                <div className="p-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-lg">
                    {project.name}
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {project.description}
                  </p>
                  
                  {/* Project Documents Section - Only show if available */}
                  {project.links && project.links.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                      <h5 className="text-sm font-semibold text-gray-700 mb-3">Project Documents</h5>
                      <div className="flex flex-col space-y-3">
                        {(() => {
                          // Process all links to avoid duplicates
                          const allLinks = new Set();
                          
                          // Collect all individual links
                          project.links.forEach(link => {
                            link.split(',').forEach(l => {
                              allLinks.add(l.trim());
                            });
                          });
                          
                          // Return the unique links
                          const uniqueLinks = Array.from(allLinks);
                          
                          // Filter to only include Google Drive links
                          const driveLinks = uniqueLinks.filter(link => 
                            link.includes('drive.google.com')
                          );
                          
                         
                          if (driveLinks.length > 0) {
                            return driveLinks.map((link, i) => (
                              <a
                                key={i}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-orange-600 hover:text-orange-700 text-sm hover:underline transition-colors duration-200"
                              >
                                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                </svg>
                                Google Drive Document {i + 1}
                              </a>
                            ));
                          }
                          
                          return null;
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Dots Indicator - Only show if slider is needed */}
          {showSlider && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex 
                      ? 'bg-orange-500' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to project set ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;