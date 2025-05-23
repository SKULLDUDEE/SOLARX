import React, { useState, useEffect } from 'react';

export default function TechnologySection({ companyId }) {
  const [techData, setTechData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Function to parse rich text content
  const parseRichText = (content) => {
    if (!content) return '';
    
    // If it's a string, return it directly
    if (typeof content === 'string') return content;
    
    // If it's an array (Strapi rich text format)
    if (Array.isArray(content)) {
      return content.map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map(child => child.text || '').join('');
        }
        return '';
      }).join('\n');
    }
    
    // If we can't parse it, return empty string
    return '';
  };
  
  // Function to extract links from rich text
  const extractLinks = (content) => {
    if (!content || !Array.isArray(content)) return [];
    
    const links = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    
    // Convert the rich text to a string
    const textContent = content.map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join('\n');
    
    // Extract all links using regex
    let match;
    while ((match = linkRegex.exec(textContent)) !== null) {
      links.push({
        text: match[1],
        url: match[2]
      });
    }
    
    return links;
  };
  
  // Function to extract technology items from rich text
  const extractTechItems = (content) => {
    if (!content || !Array.isArray(content)) return [];
    
    // Create a simple array to store our technology items
    const items = [];
    
    // Create a simple text representation of the content
    const fullText = content.map(block => {
      if (block.children && Array.isArray(block.children)) {
        return block.children.map(child => child.text || '').join('');
      }
      return '';
    }).join('\n');
    
    // Split the text by lines
    const lines = fullText.split('\n');
    
    // Variables to track the current item
    let currentTitle = '';
    let currentDescription = '';
    let currentLinks = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // Check if this is a numbered item (likely a technology item)
      if (/^\d+\./.test(line)) {
        // If we have a previous item, add it to our list
        if (currentTitle) {
          items.push({
            title: currentTitle,
            description: currentDescription,
            links: [...currentLinks]
          });
          
          // Reset for the new item
          currentLinks = [];
        }
        
        // Extract the title and description
        // Remove the number and dot prefix
        const textWithoutNumber = line.replace(/^\d+\.\s+/, '');
        
        // Split by the first dash or hyphen if present
        let parts = [];
        if (textWithoutNumber.includes('–')) {
          parts = textWithoutNumber.split('–');
        } else if (textWithoutNumber.includes('-')) {
          parts = textWithoutNumber.split('-');
        } else if (textWithoutNumber.includes(':')) {
          parts = textWithoutNumber.split(':');
        } else {
          // If no separator, assume the whole text is the title
          parts = [textWithoutNumber];
        }
        
        // Clean up the title (remove asterisks if present)
        currentTitle = parts[0].replace(/\*\*/g, '').trim();
        
        // Set the description if available
        currentDescription = parts.length > 1 ? parts[1].trim() : '';
      }
      // Check if this is a link line
      else if ((line.includes('🔗') || line.includes('http')) && line.includes('[')) {
        // Extract the link using a simple regex
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch && linkMatch[1] && linkMatch[2]) {
          currentLinks.push({
            text: linkMatch[1],
            url: linkMatch[2]
          });
        }
      }
      // If it's not a numbered item or a link, it might be additional description text
      else if (currentTitle && !line.startsWith('🔗')) {
        // Append to the current description
        currentDescription += ' ' + line;
      }
    }
    
    // Add the last item if we have one
    if (currentTitle) {
      items.push({
        title: currentTitle,
        description: currentDescription,
        links: currentLinks
      });
    }
    
    return items;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          setLoading(true);
          
          // Fetch from the technologies endpoint with company filter
          const response = await fetch(`http://localhost:1337/api/technologies?filters[company][id][$eq]=${companyId}`);
          const result = await response.json();
          
          // If no data found with company filter, try fetching all technologies
          let technologyData = null;
          
          if (result && result.data && result.data.length > 0) {
            // We found technology data for this company
            technologyData = result.data[0].attributes || result.data[0];
          } else {
            // Try to fetch all technologies if no company-specific data found
            const allResponse = await fetch(`http://localhost:1337/api/technologies`);
            const allResult = await allResponse.json();
            
            if (allResult && allResult.data && allResult.data.length > 0) {
              // Use the first technology entry if available
              technologyData = allResult.data[0].attributes || allResult.data[0];
            }
          }
          
          if (technologyData) {
            // Log the data structure to help with debugging
            console.log("Technology data structure:", JSON.stringify(technologyData, null, 2));
            
            // Extract technology items from the description
            const techItems = extractTechItems(technologyData.description);
            console.log("Extracted tech items:", techItems);
            
            // Create tags from tech item titles
            const tags = techItems.map(item => item.title);
            
            // Create the technology data object
            const processedTechData = {
              title: technologyData.title || "Solar Technology",
              description: parseRichText(technologyData.description),
              tags: tags,
              techItems: techItems,
              mediaLinks: technologyData.mediaLinks
            };
            
            setTechData(processedTechData);
          } else {
            // If no data found, set techData to null
            setTechData(null);
          }
        } catch (error) {
          console.error("Error fetching technology data:", error);
          setTechData(null);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [companyId]);
  return (
    <div className="max-w-7xl mx-auto p-1">
      {/* Header */}
      <div className="flex items-center mb-6">
        <div className="w-16 h-1 bg-orange-400 mr-3"></div>
        <h1 className="text-3xl font-bold text-gray-900">Technology</h1>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {!loading && !techData && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-gray-700 text-center">No technology data available for this company.</p>
        </div>
      )}
      
      {!loading && techData && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          {/* Technology Title with Icon */}
          <div className="flex items-center mb-5">
            <div className="bg-orange-500 rounded-lg p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-orange-500">{techData.title || "Technology"}</h2>
          </div>
          
          {/* Tags */}
          {techData.tags && techData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {techData.tags.map((tag, index) => (
                <span key={index} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">{tag}</span>
              ))}
            </div>
          )}
          
          {/* Technology Items */}
          {techData.techItems && techData.techItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {techData.techItems.map((item, index) => (
                <div key={index} className="bg-orange-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-orange-200 pb-2">{item.title}</h3>
                  <p className="text-gray-700 mb-3">{item.description}</p>
                  {item.links && item.links.length > 0 && (
                    <div className="mt-auto">
                      {item.links.map((link, linkIndex) => (
                        <a 
                          key={linkIndex} 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-orange-500 hover:text-orange-700 inline-flex items-center mr-4 hover:underline"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          {link.text}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-700">
              {techData.description || "No technology description available."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}