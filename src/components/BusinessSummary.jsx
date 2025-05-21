import React, { useState, useEffect } from 'react';
import { fetchCompanyBusinessSummary } from '../services/api';
import { getApiId } from '../utils/strapiHelper';

export default function BusinessSummary({ companyId }) {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          console.log(`BusinessSummary: Fetching data for company ID ${companyId}`);
          setLoading(true);
          
          // Try the regular API service first
          const data = await fetchCompanyBusinessSummary(companyId);
          console.log(`BusinessSummary: Received data from API service:`, data);
          
          // If we got data with some content, use it
          if (data && (data.summary || data.overview || data.description || Object.keys(data).length > 1)) {
            setBusinessData(data);
          } 
          // Otherwise, try to fetch the company data and use its introduction
          else {
            console.log("Trying to fetch company data for introduction");
            try {
              // Convert Strapi admin ID to API ID if needed
              const apiId = getApiId(companyId);
              console.log(`Fetching company data for ID: ${companyId} (API ID: ${apiId})`);
              
              // Get the company data with introduction field using filter query
              const response = await fetch(`http://localhost:1337/api/companies?filters[id][$eq]=${apiId}`);
              const result = await response.json();
              console.log("Company data result:", result);
              
              if (result && result.data && result.data.length > 0) {
                const companyData = result.data[0].attributes;
                
                // Extract introduction content from the rich text field
                let introText = '';
                if (companyData.introduction && Array.isArray(companyData.introduction)) {
                  // Handle rich text format (array of blocks)
                  introText = companyData.introduction
                    .map(block => {
                      if (block.children) {
                        return block.children.map(child => child.text).join('');
                      }
                      return '';
                    })
                    .join('\n');
                } else if (typeof companyData.introduction === 'string') {
                  // Handle plain text format
                  introText = companyData.introduction;
                }
                
                const directData = {
                  companyName: companyData.Name || 'Company Name',
                  summary: introText || 'Our company is revolutionizing renewable energy access in developing regions.'
                };
                console.log("Using company introduction data:", directData);
                setBusinessData(directData);
              } else {
                // Use the original data as fallback
                setBusinessData(data);
              }
            } catch (directError) {
              console.error("Error with direct fetch:", directError);
              // Use the original data as fallback
              setBusinessData(data);
            }
          }
        } catch (error) {
          console.error("Error fetching business summary:", error);
          // Set default data
          setBusinessData({
            companyName: 'Our Company',
            summary: 'Our company is revolutionizing renewable energy access in developing regions.'
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
        (() => {
          console.log("BusinessSummary: Available fields:", Object.keys(businessData));
          
          // Extract data from different possible structures
          let summary = "";
          
          // Check if businessData is a string
          if (typeof businessData === 'string') {
            summary = businessData;
          } 
          // Check if it's an object with expected fields
          else if (typeof businessData === 'object') {
            summary = businessData.overview || businessData.summary || businessData.description || 
              `${businessData.companyName || 'Our company'} is revolutionizing renewable energy access in developing regions through innovative solar panel technology that's more efficient and less expensive than traditional solutions.`;
          }
          // Fallback
          else {
            summary = `Our company is revolutionizing renewable energy access in developing regions through innovative solar panel technology that's more efficient and less expensive than traditional solutions.`;
          }
          
          // Try to extract features from different possible structures
          let features = [];
          
          // If we have specific feature fields
          if (businessData.efficiency || businessData.costEffectiveness || 
              businessData.sustainability || businessData.additionalFeature) {
            features = [
              {
                title: businessData.efficiency?.title || "Efficiency",
                description: businessData.efficiency?.description || 
                  "Our innovative technology maximizes output even in challenging conditions."
              },
              {
                title: businessData.costEffectiveness?.title || "Cost Effectiveness",
                description: businessData.costEffectiveness?.description || 
                  "Our solutions are designed to be cost-effective, making them more accessible."
              },
              {
                title: businessData.sustainability?.title || "Sustainability",
                description: businessData.sustainability?.description || 
                  "Our approach prioritizes sustainability and environmental responsibility."
              },
              {
                title: businessData.additionalFeature?.title || "Carbon Footprint",
                description: businessData.additionalFeature?.description || 
                  "We're committed to reducing carbon footprint and contributing to climate change mitigation."
              }
            ];
          } 
          // If we have a features array
          else if (Array.isArray(businessData.features) && businessData.features.length > 0) {
            features = businessData.features.map(feature => ({
              title: feature.title || feature.name || "Feature",
              description: feature.description || feature.text || "Feature description"
            }));
          }
          // If we have key_points array
          else if (Array.isArray(businessData.key_points) && businessData.key_points.length > 0) {
            features = businessData.key_points.map(point => ({
              title: point.title || point.name || "Key Point",
              description: point.description || point.text || "Key point description"
            }));
          }
          // Default features if none found
          else {
            features = [
              { title: "Efficiency", description: "Our innovative technology maximizes output even in challenging conditions." },
              { title: "Cost Effectiveness", description: "Our solutions are designed to be cost-effective, making them more accessible." },
              { title: "Sustainability", description: "Our approach prioritizes sustainability and environmental responsibility." },
              { title: "Carbon Footprint", description: "We're committed to reducing carbon footprint and contributing to climate change mitigation." }
            ];
          }
          
          return (
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              <p className="text-lg text-gray-700 mb-8">{summary}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.slice(0, 4).map((feature, index) => (
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
            </div>
          );
        })()
      )}
      
      {!loading && (!businessData || (typeof businessData === 'object' && Object.keys(businessData).length === 0)) && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <p className="text-lg text-gray-700 mb-8">
            Our company is revolutionizing renewable energy access in developing regions through innovative solar panel technology that's more efficient and less expensive than traditional solutions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Efficiency</h2>
              <p className="text-gray-700">
                Our innovative technology maximizes output even in challenging conditions.
              </p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Cost Effectiveness</h2>
              <p className="text-gray-700">
                Our solutions are designed to be cost-effective, making them more accessible.
              </p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Sustainability</h2>
              <p className="text-gray-700">
                Our approach prioritizes sustainability and environmental responsibility.
              </p>
            </div>
            
            <div className="border border-gray-100 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-orange-500 mb-4">Carbon Footprint</h2>
              <p className="text-gray-700">
                We're committed to reducing carbon footprint and contributing to climate change mitigation.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}