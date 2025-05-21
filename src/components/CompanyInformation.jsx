import { useState, useEffect } from 'react';
import { Building, Calendar, MapPin, DollarSign, Users, Shield, Target, ArrowLeft, Globe } from "lucide-react";
import { fetchCompanyWithRelationships } from '../services/api';
import { Link, useParams } from 'react-router-dom';

export default function CompanyInformation({ companyId }) {
  // If companyId is not passed as prop, try to get it from URL params
  const params = useParams();
  const id = companyId || params.id;
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        setLoading(true);
        console.log('CompanyInformation - Fetching company details for ID:', id);
        
        // Get all companies first
        const response = await fetch(`http://localhost:1337/api/companies`);
        const result = await response.json();
        
        console.log("CompanyInformation - All companies response:", result);
        
        // Find the company with the matching ID
        const companyData = result.data.find(c => c.id.toString() === id.toString());
        
        if (companyData) {
          console.log("CompanyInformation - Found company:", companyData);
          
          // Parse the introduction manually
          const parsedIntro = parseRichText(companyData.introduction);
          console.log("CompanyInformation - Parsed introduction:", parsedIntro);
          
          // Create a clean company object
          const cleanCompany = {
            id: companyData.id,
            Name: companyData.Name || 'Unnamed Company',
            introduction: companyData.introduction,
            parsedIntroduction: parsedIntro,
            Website: companyData.Website || '',
            ContactEmail: companyData.ContactEmail || '',
            FoundingYear: companyData.FoundingYear || '',
            Headquarters: companyData.Headquarters || '',
            TeamSize: companyData.TeamSize || '',
            // Add any other fields needed
          };
          
          console.log('CompanyInformation - Clean company data:', cleanCompany);
          setCompany(cleanCompany);
        } else {
          console.warn('CompanyInformation - Company not found with ID:', id);
          setError('Company data not found');
        }
      } catch (err) {
        console.error('CompanyInformation - Error fetching company details:', err);
        setError('Failed to load company details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCompanyDetails();
    }
  }, [id]);
  return (
    <div className="p-6 md:p-12 lg:p-20 font-sans">

     
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8 text-center">
          {error}
        </div>
      )}

      {!loading && company && (
        <>
          <div className="flex items-center mb-8">
            <div className="w-24 h-1 bg-orange-400 mr-4"></div>
            <h1 className="text-4xl font-bold text-gray-900">{company.Name || 'Company Information'}</h1>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <div className="bg-orange-500 rounded-lg p-2 mr-3">
                <Building className="text-white" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Startup Details</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Founded */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Founded</p>
                  <p className="text-gray-800 text-xl font-medium">{company.FoundingYear || 'Not specified'}</p>
                </div>
              </div>

              {/* SDG Alignment */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <Target className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">SDG Alignment</p>
                  <p className="text-gray-800 text-xl font-medium">
                    {company.sdgs && company.sdgs.length > 0 
                      ? company.sdgs.map(sdg => sdg.name).join(', ') 
                      : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Location</p>
                  <p className="text-gray-800 text-xl font-medium">{company.Headquarters || 'Not specified'}</p>
                </div>
              </div>

              {/* Team Size */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Team Size</p>
                  <p className="text-gray-800 text-xl font-medium">
                    {company.TeamSize ? `${company.TeamSize} employees` : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Website */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <Globe className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Website</p>
                  <p className="text-gray-800 text-xl font-medium">
                    {company.Website ? (
                      <a 
                        href={company.Website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        {company.Website}
                      </a>
                    ) : 'Not specified'}
                  </p>
                </div>
              </div>

              {/* Contact Email */}
              <div className="border border-gray-200 rounded-lg p-4 flex items-start">
                <div className="bg-orange-500 rounded-full p-3 mr-4">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Contact</p>
                  <p className="text-gray-800 text-xl font-medium">
                    {company.ContactEmail ? (
                      <a 
                        href={`mailto:${company.ContactEmail}`} 
                        className="text-orange-600 hover:text-orange-700 hover:underline"
                      >
                        {company.ContactEmail}
                      </a>
                    ) : 'Not specified'}
                  </p>
                </div>
              </div>
            </div>

            {/* Company Description section removed as requested */}
            
            {/* Company Milestones */}
            {company.milestones && company.milestones.data && company.milestones.data.length > 0 && (
              <div className="mt-8 border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Key Milestones</h3>
                <div className="space-y-4">
                  {company.milestones.data.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-orange-100 text-orange-600 rounded-full p-2 mr-4 mt-1">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{milestone.attributes.date}</p>
                        <p className="text-gray-700">{milestone.attributes.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}