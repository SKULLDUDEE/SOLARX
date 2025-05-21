import { useState, useEffect } from 'react';
import { Bolt, DollarSign } from 'lucide-react';

// import { fetchCompanyHeroData } from '../services/api';

const SolarFlowHero = ({ companyId }) => {
  console.log("SolarFlowHero - Received company ID:", companyId);
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
        const response = await fetch(`http://localhost:1337/api/companies`);
        const result = await response.json();
        
        // Find the company with the matching ID
        const company = result.data.find(c => c.id.toString() === companyId.toString());
        
        if (company) {
          // The data structure is different than expected - the fields are directly on the company object
          // Parse the introduction manually
          const parsedIntro = parseRichText(company.introduction);
          
          // Create a clean data object with only the necessary fields for SolarFlowHero
          const data = {
            id: company.id,
            name: company.Name || 'Company Name',
            description: parsedIntro || '',
            rawIntroduction: company.introduction,
            // We're not displaying these fields in SolarFlowHero anymore
            // but keeping them in the data object for potential future use
            website: company.Website || '',
            contactEmail: company.ContactEmail || '',
            foundingYear: company.FoundingYear || '',
            headquarters: company.Headquarters || '',
            teamSize: company.TeamSize || '',
            imageUrl: null,
            logo: null,
            coverImage: null
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
          <h2 className="text-2xl font-bold text-gray-800">Loading company data...</h2>
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
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-100 flex items-center justify-center p-4 mt-[40px]">
      <div className="max-w-6xl w-full flex flex-col lg:flex-row items-center gap-8">
        {/* Left content */}
        <div className={`w-full lg:w-1/2 transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-5xl md:text-6xl font-bold mb-6">
            {companyData && companyData.name ? (
              <span className="text-gray-800">{companyData.name}</span>
            ) : (
              <>
                <span className="text-orange-500">Solar</span>
                <span className="text-gray-800">Flow</span>
              </>
            )}
          </div>
          
          {/* Company description */}
          <p className="text-gray-700 text-lg mb-4">
            {companyData && companyData.description ? (
              <span>{companyData.description}</span>
            ) : (
              <>
                Transforming renewable energy access in developing regions with cutting-edge technology that's{' '}
                <span className="text-orange-500 font-semibold">40% more efficient</span> and{' '}
                <span className="text-orange-500 font-semibold">30% less expensive</span>
              </>
            )}
          </p>
          
          {/* Company details section removed as requested */}
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a 
              href="#request-demo" 
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-md transition-all hover:shadow-lg hover:scale-105 text-center"
            >
              Request Demo
            </a>
            <a 
              href="#learn-more"
              className="border-2 border-gray-800 text-gray-800 hover:bg-gray-100 font-medium py-3 px-6 rounded-md transition-all hover:shadow-lg hover:scale-105 text-center"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Right side showcase */}
        <div className="w-full lg:w-1/2 relative">
          <div className={`bg-orange-400 rounded-xl h-64 md:h-96 shadow-xl flex items-center justify-center overflow-hidden transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            {/* Solar panel image */}
            <img 
              src={companyData && companyData.imageUrl ? 
                companyData.imageUrl : 
                `https://placehold.co/600x400/orange/white?text=${companyData ? encodeURIComponent(companyData.name) : 'Solar+Energy'}`
              } 
              alt={companyData && companyData.name ? companyData.name : "Solar panel technology"} 
              className="w-full h-full object-cover opacity-30"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://placehold.co/600x400/orange/white?text=${companyData ? encodeURIComponent(companyData.name) : 'Solar+Energy'}`;
              }}
            />
            
            {/* Overlay text/logo */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-white text-5xl md:text-7xl font-bold text-center px-4">
                {companyData && companyData.name ? companyData.name : "SolarFlow"}
              </div>
              {companyData && companyData.headquarters && (
                <div className="text-white text-xl mt-4 bg-black bg-opacity-50 px-4 py-1 rounded">
                  {companyData.headquarters}
                </div>
              )}
            </div>
            
            {/* Efficiency badge */}
            <div 
              className={`absolute -top-4 right-4 bg-white text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-500 ${showEfficiency ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}
            >
              <Bolt className="text-orange-500" size={20} />
              <span className="font-bold">40% More Efficient</span>
            </div>
            
            {/* Cost badge */}
            <div 
              className={`absolute -bottom-0 left-8 bg-black text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transition-all duration-500 ${showCost ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <DollarSign className="text-orange-400" size={20} />
              <span className="font-bold">30% Cost Reduction</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarFlowHero;