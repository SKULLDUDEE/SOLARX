import React, { useState, useEffect } from 'react';

export default function PressFeaturesSection() {
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch media coverage data
        const mediaCoverageResponse = await fetch('http://localhost:1337/api/media-coverages');
        
        if (!mediaCoverageResponse.ok) {
          throw new Error(`Media coverage API request failed with status ${mediaCoverageResponse.status}`);
        }
        
        const mediaCoverageData = await mediaCoverageResponse.json();
        console.log('Media coverage data:', mediaCoverageData);
        
        if (mediaCoverageData && mediaCoverageData.data) {
          // Separate media coverage and awards
          const mediaItems = [];
          const awardItems = [];
          
          mediaCoverageData.data.forEach(item => {
            // Extract source from title if available
            let source = 'Media';
            
            // Try to extract source from the title
            if (item.title) {
              const sourceMatch = item.title.match(/\*\*(.*?)\*\*/);
              if (sourceMatch) {
                source = sourceMatch[1].trim();
              } else if (item.title.startsWith('1. **')) {
                // Handle numbered format
                const numberedMatch = item.title.match(/\d+\.\s*\*\*(.*?)\*\*/);
                if (numberedMatch) {
                  source = numberedMatch[1].trim();
                }
              } else if (item.title.includes('Times of India')) {
                source = 'Times of India';
              } else if (item.title.includes('Vibes of India')) {
                source = 'Vibes of India';
              }
            }
            
            // Extract title from the markdown format - try different patterns
            let title = '';
            
            // Try various patterns to extract the title
            if (item.title) {
              // Pattern: *"Title"*
              const titleMatch1 = item.title.match(/\*"(.*?)"\*/);
              
              // Pattern: **Source**: *"Title"*
              const titleMatch2 = item.title.match(/\*\*(.*?)\*\*:\s*\*"(.*?)"\*/);
              
              // Pattern: **Source**: Text
              const titleMatch3 = item.title.match(/\*\*(.*?)\*\*:\s*(.*)/);
              
              // Pattern: 1. **Source**: *"Title"*
              const titleMatch4 = item.title.match(/\d+\.\s*\*\*(.*?)\*\*:\s*\*"(.*?)"\*/);
              
              // Pattern: *Vibes of India**: *"Title"*
              const titleMatch5 = item.title.match(/\*(.*?)\*\*:\s*\*"(.*?)"\*/);
              
              if (titleMatch1) {
                title = titleMatch1[1];
              } else if (titleMatch2) {
                title = titleMatch2[2];
              } else if (titleMatch4) {
                title = titleMatch4[2];
              } else if (titleMatch5) {
                title = titleMatch5[2];
              } else if (titleMatch3 && !titleMatch3[2].includes('**')) {
                // For cases where there's no quoted title
                title = titleMatch3[2].split('*')[0].trim();
              } else {
                // If no pattern matches, use the original title
                title = item.title;
              }
            } else {
              title = 'Article Title';
            }
            
            // Extract description - try to find any text after the title pattern
            let description = '';
            
            // Look for description after the title in various formats
            if (item.title) {
              // For titles with quoted sections
              if (item.title.includes('"') && item.title.lastIndexOf('"') < item.title.length - 1) {
                const parts = item.title.split('"');
                if (parts.length > 2) {
                  description = parts[2].replace(/\*/g, '').trim();
                }
              } 
              // For titles with asterisks
              else if (item.title.includes('*') && item.title.lastIndexOf('*') < item.title.length - 1) {
                description = item.title.substring(item.title.lastIndexOf('*') + 1).trim();
              }
            }
            
            // Extract date if available
            const dateStr = item.date || '';
            
            // Get link from the item
            let link = item.link || '';
            
            // Check if this is an award or media coverage
            const isAward = item.title && (
              item.title.toLowerCase().includes('award') || 
              item.title.toLowerCase().includes('honor') || 
              item.title.toLowerCase().includes('recognition') ||
              item.title.toLowerCase().includes('prize')
            );
            
            // Create the processed item
            const processedItem = {
              id: item.id,
              source,
              title,
              description,
              date: dateStr,
              link,
              initials: source.substring(0, 2)
            };
            
            // Add to appropriate array based on content
            if (isAward && source === 'Royal Academy of Engineering') {
              // Extract organization and award title for awards
              let organization = source;
              let awardTitle = title;
              
              if (item.title && item.title.includes('Major Project Award')) {
                awardTitle = 'Major Project Award for Sustainability';
              }
              
              awardItems.push({
                ...processedItem,
                organization,
                awardTitle
              });
            } else {
              mediaItems.push(processedItem);
            }
          });
          
          console.log('Processed media coverage items:', mediaItems.length);
          console.log('Processed award items:', awardItems.length);
          
          setMediaCoverage(mediaItems);
          setAwards(awardItems);
        } else {
          setMediaCoverage([]);
          setAwards([]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-10 py-16 bg-white">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4 animate-fade-in">
          Media Coverage {awards.length > 0 && '& Recognition'}
        </h1>
        <p className="text-gray-600 text-lg animate-fade-in-delay">
          Our journey has been featured in leading publications{awards.length > 0 && ' and recognized by prestigious organizations'}.
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-2xl mx-auto">
          <p className="font-medium">Error loading content:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Content - Only show when data is loaded */}
      {!loading && !error && (
        <div>
          {/* Section Headers */}
          <div className={`${awards.length > 0 ? 'grid md:grid-cols-2 gap-x-16 gap-y-6 mb-8' : ''}`}>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-orange-500 after:rounded-full">
                Media Coverage
              </h2>
            </div>
            
            {awards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 relative after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-16 after:h-1 after:bg-orange-500 after:rounded-full">
                  Awards & Recognition
                </h2>
              </div>
            )}
          </div>
          
          {/* Content Sections */}
          <div className={`${awards.length > 0 ? 'grid md:grid-cols-2 gap-x-16 gap-y-8' : ''}`}>
            {/* Media Coverage Section */}
            <div className="animate-slide-in-left">
              {mediaCoverage.length > 0 ? (
                <div className={`grid ${awards.length === 0 ? 'md:grid-cols-2 gap-8' : 'gap-6'}`}>
                  {mediaCoverage.map((article, index) => (
                    <div 
                      key={article.id} 
                      className={`flex items-start space-x-4 group hover:bg-gradient-to-br hover:from-white hover:to-orange-50 hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out p-6 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 ${index > 0 ? `animation-delay-${(index % 3) * 200}` : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:scale-110">
                          {article.initials}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-orange-600 mb-2 font-medium flex items-center">
                          {article.source} 
                          {article.date && (
                            <>
                              <span className="mx-2 w-1 h-1 bg-orange-400 rounded-full inline-block"></span>
                              {article.date}
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                            {article.description}
                          </p>
                        )}
                        {article.link && (
                          <a 
                            href={article.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-2 hover:underline"
                          >
                            Read Article
                            <svg className="ml-1 w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
                  <h3 className="text-xl font-medium text-gray-700 mb-2">No Media Coverage Available</h3>
                  <p className="text-gray-500">Media coverage information will appear here once added.</p>
                </div>
              )}
            </div>

            {/* Awards & Recognition Section - Only show if there are awards */}
            {awards.length > 0 && (
              <div className="animate-slide-in-right">
                <div className="grid gap-6">
                  {awards.map((award, index) => (
                    <div 
                      key={award.id} 
                      className={`flex items-start space-x-4 group hover:bg-gradient-to-br hover:from-white hover:to-orange-50 hover:shadow-xl hover:scale-102 transition-all duration-300 ease-in-out p-6 rounded-xl cursor-pointer border border-transparent hover:border-orange-200 ${index > 0 ? `animation-delay-${(index % 3) * 200}` : ''}`}
                    >
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 group-hover:rotate-12">
                          <svg className="w-6 h-6 text-white group-hover:animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-orange-600 mb-2 font-medium flex items-center">
                          {award.organization}
                          {award.date && (
                            <>
                              <span className="mx-2 w-1 h-1 bg-orange-400 rounded-full inline-block"></span>
                              {award.date}
                            </>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                          {award.awardTitle || award.title}
                        </h3>
                        {award.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                            {award.description}
                          </p>
                        )}
                        {award.link && (
                          <a 
                            href={award.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform duration-300 mt-2 hover:underline"
                          >
                            Learn More
                            <svg className="ml-1 w-4 h-4 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes floatUp {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.4s both;
        }

        .animate-slide-in-right {
          animation: slideInRight 0.8s ease-out 0.6s both;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .hover\\:scale-102:hover {
          transform: scale(1.02);
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .group:hover .group-hover\\:line-clamp-none {
          -webkit-line-clamp: unset;
          display: block;
        }
      `}</style>
    </div>
  );
}