import React, { useState, useEffect } from 'react';

export default function BusinessSummary({ companyId }) {
  const [businessData, setBusinessData] = useState(null);
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
  
  // Function to extract business features from rich text paragraphs
  const extractFeaturesFromRichText = (richTextContent) => {
    if (!richTextContent || !Array.isArray(richTextContent)) return [];
    
    const features = [];
    
    // Process each paragraph as a potential feature
    richTextContent.forEach(paragraph => {
      if (paragraph.children && Array.isArray(paragraph.children)) {
        const text = paragraph.children.map(child => child.text || '').join('');
        
        // Check if the text contains a feature (has a title and description separated by a dash or hyphen)
        const featureParts = text.split(/\s*-\s*/);
        
        if (featureParts.length >= 2) {
          features.push({
            title: featureParts[0].trim(),
            description: featureParts.slice(1).join(' - ').trim()
          });
        }
      }
    });
    
    return features;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          setLoading(true);
          
          // Fetch business summaries from API
          const url = `http://localhost:1337/api/business-summaries`;
          console.log("Fetching business summary from:", url);
          
          const response = await fetch(url);
          const result = await response.json();
          
          console.log("Business summaries response:", result);
          
          if (result && result.data && result.data.length > 0) {
            // Use the first business summary from the API
            const businessSummary = result.data[0];
            console.log("Found business summary:", businessSummary);
            
            // Get a simple summary from the first paragraph if available
            let summaryText = "";
            if (businessSummary.summary && Array.isArray(businessSummary.summary) && businessSummary.summary.length > 0) {
              // Try to find a paragraph that doesn't look like a feature (doesn't have a dash)
              const summaryParagraph = businessSummary.summary.find(p => {
                if (p.children && Array.isArray(p.children)) {
                  const text = p.children.map(child => child.text || '').join('');
                  return !text.includes('-');
                }
                return false;
              });
              
              if (summaryParagraph) {
                summaryText = parseRichText([summaryParagraph]);
              } else {
                // If no suitable paragraph found, use a generic summary
                summaryText = "Please add a summary paragraph in the Strapi admin panel.";
              }
            }
            
            // Extract features directly from the rich text summary paragraphs
            console.log("Extracting features from rich text:", businessSummary.summary);
            const features = extractFeaturesFromRichText(businessSummary.summary);
            
            console.log("Extracted features:", features);
            
            // Create the business data object with data from API only
            const businessDataObj = {
              companyName: 'Imagine Powertree', // Company name from API
              summary: summaryText,
              features: features
            };
            
            setBusinessData(businessDataObj);
          } else {
            console.log("No business summaries found in the API response");
            // Set empty data with a message to add data in Strapi
            setBusinessData({
              companyName: 'Company',
              summary: 'No business summaries found. Please add business summary data in the Strapi admin panel.',
              features: [] // No features if not found in API
            });
          }
        } catch (error) {
          console.error("Error fetching business summary:", error);
          // Set error state data with no features and no hardcoded data
          setBusinessData({
            companyName: 'Error Loading Data',
            summary: 'There was an error loading the business summary. Please check your API connection and try again.',
            features: [] // No features if API request failed
          });
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [companyId]);
  return (
    <div className="max-w-7xl mx-auto p-1">
      <div className="flex items-center mb-8">
        <div className="w-24 h-1 bg-orange-400 mr-4"></div>
        <h1 className="text-4xl font-bold text-gray-900">Business Summary</h1>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}
      
      {!loading && businessData && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <p className="text-lg text-gray-700 mb-8">{businessData.summary}</p>
          
          {businessData.features.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {businessData.features.slice(0, 4).map((feature, index) => (
                <div key={index} className="border border-gray-100 rounded-lg p-6">
                  <h2 className="text-2xl font-semibold text-orange-500 mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-gray-700">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 text-center">
              <h3 className="text-xl font-medium text-orange-700 mb-2">No Business Features Available</h3>
              <p className="text-orange-600">
                Please add business features in the Strapi admin panel under Business Summary.
              </p>
            </div>
          )}
        </div>
      )}
      
      {!loading && !businessData && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="bg-orange-50 border border-orange-100 rounded-lg p-8 text-center">
            <h3 className="text-xl font-medium text-orange-700 mb-4">No Business Summary Available</h3>
            <p className="text-orange-600 mb-4">
              Please add business summary data in the Strapi admin panel for this company.
            </p>
            <div className="flex justify-center">
              <a 
                href="http://localhost:1337/admin/content-manager/collectionType/api::business-summary.business-summary/create"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
              >
                Add Business Summary
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}