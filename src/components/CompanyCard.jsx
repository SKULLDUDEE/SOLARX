import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchCompanyById } from '../services/api';

export default function CompanyCard({ companyId, regionClass }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch company details when the component mounts
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        const response = await fetchCompanyById(companyId);
        
        if (response && response.data) {
          // Log the response for debugging
          console.log(`Company ${companyId} data:`, response.data);
          
          // Process the company data - direct access to fields
          const companyData = response.data;
          console.log('Company data:', companyData);
          
          setCompany({
            id: companyData.id,
            name: companyData.Name || 'Unnamed Company',
            region: companyData.Headquarters || 'other',
            regionName: getRegionName(companyData.Headquarters),
            location: companyData.Headquarters || 'Location not specified',
            description: extractDescription(companyData.introduction),
            category: 'Clean Energy', // Default category
            categoryColor: getCategoryColor('Clean Energy'),
            logo: extractImageData(companyData.Logo),
            coverImage: extractImageData(companyData.Logo)
          });
        } else {
          setError('Company data not found');
        }
      } catch (err) {
        console.error(`Error fetching company ${companyId}:`, err);
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };

    if (companyId) {
      fetchCompanyDetails();
    }
  }, [companyId]);

  // Helper function to extract description from structured content
  const extractDescription = (introduction) => {
    // Log the introduction structure for debugging
    console.log('Introduction structure:', introduction);
    
    if (!introduction) return 'No description available';
    
    // Handle different possible structures
    try {
      // If it's already a string
      if (typeof introduction === 'string') {
        return introduction;
      }
      
      // If it's an array of blocks (Strapi rich text format)
      if (Array.isArray(introduction)) {
        if (introduction[0]?.children && Array.isArray(introduction[0].children)) {
          return introduction[0].children
            .map(child => child.text || '')
            .filter(text => text)
            .join(' ');
        }
      }
      
      // If it's a nested data structure
      if (introduction.data && Array.isArray(introduction.data)) {
        return extractDescription(introduction.data);
      }
    } catch (err) {
      console.error('Error extracting description:', err);
    }
    
    return 'No description available';
  };

  // Use a consistent region name
  const getRegionName = (region) => {
    return region || 'Global';
  };

  // Helper function to extract image data from Strapi response
  const extractImageData = (logoData) => {
    // Log the logo structure for debugging
    console.log('Logo structure:', logoData);
    
    if (!logoData) return null;
    
    try {
      // Based on the API response we saw, the Logo is an array of media objects
      if (Array.isArray(logoData) && logoData.length > 0) {
        const image = logoData[0];
        
        // Return the image with its URL
        if (image && image.url) {
          return image;
        }
        
        // If the image has formats, use the medium format or the original
        if (image && image.formats) {
          const format = image.formats.medium || image.formats.small || image;
          return {
            url: format.url,
            width: format.width,
            height: format.height,
            alt: image.alternativeText || ''
          };
        }
        
        return image;
      }
    } catch (err) {
      console.error('Error extracting image data:', err);
    }
    
    return null;
  };

  // Get color for category
  const getCategoryColor = (category) => {
    const categoryColorMap = {
      'AgriTech': 'blue',
      'Clean Energy': 'green',
      'WaterTech': 'purple',
      'MicroGrid': 'orange',
      'Mobility': 'red',
      'HealthTech': 'blue',
      'Fintech': 'indigo',
      'Waste Management': 'green',
      'Education': 'yellow',
      'Food': 'emerald'
    };
    
    return categoryColorMap[category] || 'blue';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl animate-pulse">
        <div className="h-40 sm:h-48 bg-gray-200"></div>
        <div className="p-4 sm:p-6">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !company) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
        <div className="p-4 sm:p-6 text-center">
          <p className="text-red-500">Error loading company</p>
        </div>
      </div>
    );
  }

  // Log the IDs for debugging
  console.log(`CompanyCard - companyId prop: ${companyId}, company.id from API: ${company?.id}`);
  
  // Render company card
  return (
    <Link 
      to={`/startup/${companyId}`} 
      className="block bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl hover-scale transition-all company-card"
    >
      <div className="relative overflow-hidden image-container">
        {/* Use company cover image if available, otherwise use placeholder */}
        {company.coverImage ? (
          <img 
            src={`http://localhost:1337${company.coverImage.url}`} 
            alt={company.name} 
            className="w-full h-full object-cover transition-all hover:scale-110" 
          />
        ) : (
          <img 
            src={`/api/placeholder/600/400`} 
            alt={company.name} 
            className="w-full h-full object-cover transition-all hover:scale-110" 
          />
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 ${regionClass} text-white text-xs font-bold px-2 sm:px-4 py-1 rounded-full`}>
          {company.regionName}
        </div>
      </div>
      
      <div className="p-4 sm:p-6 content-container">
        <h3 className="text-lg sm:text-xl font-bold mb-1 text-gray-900 line-clamp-1">{company.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{company.location}</p>
        <p className="text-sm text-gray-700 line-clamp-3 mb-4">{company.description}</p>
        
        <div className="flex justify-between items-center">
          <span className={`inline-block px-3 py-1 text-xs font-semibold text-${company.categoryColor}-700 bg-${company.categoryColor}-100 rounded-full`}>
            {company.category}
          </span>
          <Link 
            to={`/startup/${companyId}`} 
            className="text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            View Details →
          </Link>
        </div>
      </div>
    </Link>
  );
}