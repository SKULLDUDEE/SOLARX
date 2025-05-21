import { Link, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import { getApiId } from '../utils/strapiHelper';
import SolarXNavbar from '../components/SolarXNavbar';
import SolarFlowHero from '../components/SolarFlowHero';
import MentorCarousel from '../components/MentorCarousel';
import CompanyInfoSection from '../components/CompanyInformation';
import BusinessSummary from '../components/BusinessSummary';
import TechnologySection from '../components/TechnologySection';
import ImpactMetrics from '../components/ImpactMetrics';
import Footer from '../components/Footer';

export default function StartupDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  console.log("StartupDetail - Company ID from URL:", id);
  
  // Log the ID to make sure it's being passed correctly
  useEffect(() => {
    console.log("StartupDetail - Using company ID:", id);
  }, [id]);
  
  // Check if the company exists
  useEffect(() => {
    const checkCompany = async () => {
      if (id) {
        try {
          setLoading(true);
          console.log(`StartupDetail - Checking if company exists with ID: ${id}`);
          
          // First get all companies to see what's available
          try {
            const allCompaniesResponse = await fetch(`http://localhost:1337/api/companies`);
            const allCompanies = await allCompaniesResponse.json();
            console.log("StartupDetail - All available companies:", allCompanies);
            
            if (allCompanies && allCompanies.data) {
              console.log(`StartupDetail - Available company IDs: ${allCompanies.data.map(c => c.id).join(', ')}`);
            }
          } catch (listError) {
            console.error("StartupDetail - Error fetching company list:", listError);
          }
          
          const response = await fetch(`http://localhost:1337/api/companies?filters[id][$eq]=${id}&populate=*`);
          const data = await response.json();
          
          if (!(data && data.data && data.data.length > 0)) {
            setError("Company not found");
          }
        } catch (err) {
          console.error("Error checking company:", err);
          setError("Error loading company data");
        } finally {
          setLoading(false);
        }
      }
    };
    
    checkCompany();
  }, [id]);
  
  if (loading) {
    return (
      <div className="relative">
        <SolarXNavbar />
        <div className="container mx-auto px-4 pt-20 pb-6 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Loading company details...</h2>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="relative">
        <SolarXNavbar />
        <div className="container mx-auto px-4 pt-20 pb-6 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500 mb-4">{error}</p>
           
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative">
      <SolarXNavbar />
      <div className="container mx-auto px-4 pt-20 pb-6">
       
      </div>
      {/* Pass the company ID as a number if possible */}
      <SolarFlowHero companyId={id} key={`hero-${id}`} />
      <MentorCarousel companyId={id} />
      <CompanyInfoSection companyId={id} />
      <BusinessSummary companyId={id} />
      <TechnologySection companyId={id} />
      <ImpactMetrics companyId={id} />
      <Footer />

      
    </div>
  );
}