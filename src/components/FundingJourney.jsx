import { useState, useEffect } from 'react';

export default function FundingJourney({ companyId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredInvestor, setHoveredInvestor] = useState(null);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRaised, setTotalRaised] = useState("$0");

  // Animation effect
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Fetch funding data from Strapi
  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        setLoading(true);
        
        // Construct the API URL
        let apiUrl = 'http://localhost:1337/api/fundings?populate=*';
        
        // Add company filter if companyId is provided
        if (companyId) {
          apiUrl += `&filters[company][id][$eq]=${companyId}`;
        }
        
        const response = await fetch(apiUrl);
        const result = await response.json();
        
        console.log("Funding data from API:", result);
        
        if (result && result.data && result.data.length > 0) {
          // Process the funding data to extract structured information
          processFundingData(result.data);
        } else {
          // If no data found, set empty arrays
          setFundingRounds([]);
          setInvestors([]);
          console.log("No funding data found in API");
        }
      } catch (err) {
        console.error("Error fetching funding data:", err);
        setError(err.message);
        setFundingRounds([]);
        setInvestors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFundingData();
  }, [companyId]);

  // Process the funding data from Strapi
  const processFundingData = (data) => {
    try {
      // We'll extract funding rounds from the text content
      const fundingItem = data[0]; // Assuming we're working with the first funding item
      
      if (!fundingItem || !fundingItem.reason) {
        return;
      }
      
      // Extract funding rounds from the rich text content
      const extractedRounds = [];
      let totalAmount = 0;
      
      // Process each paragraph in the reason field
      fundingItem.reason.forEach((paragraph, index) => {
        if (paragraph.type === 'paragraph' && paragraph.children && paragraph.children.length > 0) {
          const text = paragraph.children[0].text;
          
          // Skip empty paragraphs
          if (!text.trim()) {
            return;
          }
          
          // Check if this is a funding round (contains "Funding" or specific patterns)
          if (text.includes('Funding') || text.includes('USD') || text.includes('$')) {
            // Try to extract the funding details
            const parts = text.split('-').map(part => part.trim());
            
            if (parts.length >= 3) {
              const type = parts[0];
              const amount = parts[1];
              const date = parts[2];
              
              // Process the source to avoid duplication and make it more readable
              let source = '';
              let description = '';
              
              if (parts.length > 3) {
                // Get the source part
                source = parts[3];
                
                // If there's additional information in parentheses, extract it as the description
                const parenthesesMatch = source.match(/\((.*?)\)/);
                if (parenthesesMatch) {
                  description = parenthesesMatch[1];
                  // Remove the parentheses part from the source
                  source = source.replace(/\s*\(.*?\)\s*/, '').trim();
                }
                
                // If there are more parts, add them to the description
                if (parts.length > 4) {
                  const additionalInfo = parts.slice(4).join(' - ');
                  if (description) {
                    description += ` - ${additionalInfo}`;
                  } else {
                    description = additionalInfo;
                  }
                }
              }
              
              // If description is still empty, use the source
              if (!description && source) {
                description = `Funding from ${source}`;
              }
              
              // Extract the numeric amount for total calculation
              const numericAmount = extractNumericAmount(amount);
              if (numericAmount) {
                totalAmount += numericAmount;
              }
              
              extractedRounds.push({
                type,
                amount,
                date,
                source,
                description,
                delay: `delay-${index * 100}`,
                isGrant: type.toLowerCase().includes('grant')
              });
            }
          } else if (text.includes('Bank Loans') || text.includes('Working Capital')) {
            // Handle bank loans
            const loanMatch = text.match(/\$([0-9,.]+)\s*USD/);
            if (loanMatch) {
              const loanAmount = loanMatch[1];
              const numericAmount = extractNumericAmount('$' + loanAmount);
              if (numericAmount) {
                totalAmount += numericAmount;
              }
              
              extractedRounds.push({
                type: 'Bank Loan',
                amount: '$' + loanAmount,
                date: '',
                source: text.replace(/\$([0-9,.]+)\s*USD/, '').trim(),
                description: 'Working capital and operational funding',
                delay: `delay-${index * 100}`,
                isLoan: true
              });
            }
          }
        }
      });
      
      // Update the state with the extracted rounds
      setFundingRounds(extractedRounds);
      
      // Format the total amount
      setTotalRaised(formatCurrency(totalAmount));
      
      // Try to get investors from the API data
      try {
        // Check if we have investors data in the API response
        if (fundingItem.attributes && fundingItem.attributes.investors && fundingItem.attributes.investors.data && fundingItem.attributes.investors.data.length > 0) {
          // Extract investors from the API data
          const apiInvestors = fundingItem.attributes.investors.data;
          const formattedInvestors = apiInvestors.map(investor => {
            const name = investor.attributes.name || '';
            const firstLetter = name.charAt(0).toUpperCase();
            return {
              name,
              role: investor.attributes.role || '',
              letter: firstLetter,
              color: getRandomColor(name)
            };
          });
          
          setInvestors(formattedInvestors);
        } else if (fundingItem.investors && typeof fundingItem.investors === 'string') {
          // Try to parse investors from the string field
          try {
            // Try to parse as JSON
            const parsedInvestors = JSON.parse(fundingItem.investors);
            if (Array.isArray(parsedInvestors) && parsedInvestors.length > 0) {
              const formattedInvestors = parsedInvestors.map(investor => {
                const name = typeof investor === 'string' ? investor : investor.name || '';
                const firstLetter = name.charAt(0).toUpperCase();
                return {
                  name,
                  letter: firstLetter,
                  role: investor.role || '',
                  color: getRandomColor(name)
                };
              });
              setInvestors(formattedInvestors);
            } else {
              // Fallback to extracting from funding sources
              extractInvestorsFromSources();
            }
          } catch (e) {
            // If not valid JSON, try to parse as comma-separated list
            const investorNames = fundingItem.investors.split(',').map(name => name.trim()).filter(name => name);
            if (investorNames.length > 0) {
              const formattedInvestors = investorNames.map(name => ({
                name,
                letter: name.charAt(0).toUpperCase(),
                role: '',
                color: getRandomColor(name)
              }));
              setInvestors(formattedInvestors);
            } else {
              // Fallback to extracting from funding sources
              extractInvestorsFromSources();
            }
          }
        } else {
          // Fallback to extracting from funding sources
          extractInvestorsFromSources();
        }
      } catch (err) {
        console.error("Error processing investors data:", err);
        // Fallback to extracting from funding sources
        extractInvestorsFromSources();
      }
      
      // Helper function to extract investors from funding sources
      function extractInvestorsFromSources() {
        const extractedInvestors = [];
        const uniqueSources = new Set();
        
        extractedRounds.forEach(round => {
          if (round.source && !uniqueSources.has(round.source)) {
            uniqueSources.add(round.source);
            
            // Create an investor entry
            const name = round.source.replace(/\(.*?\)/g, '').trim();
            const firstLetter = name.charAt(0).toUpperCase();
            
            extractedInvestors.push({
              name,
              role: round.type.includes('Lead') ? '(Lead)' : '',
              letter: firstLetter,
              color: getRandomColor(name)
            });
          }
        });
        
        if (extractedInvestors.length > 0) {
          setInvestors(extractedInvestors);
        } else {
          setInvestors([]);
        }
      }
    } catch (err) {
      console.error("Error processing funding data:", err);
      setFundingRounds([]);
      setInvestors([]);
    }
  };
  
  // Helper function to extract numeric amount from string
  const extractNumericAmount = (amountStr) => {
    if (!amountStr) return 0;
    
    // Remove currency symbols and commas, then parse as float
    const numericStr = amountStr.replace(/[$,]/g, '');
    const match = numericStr.match(/([0-9.]+)/);
    
    if (match) {
      return parseFloat(match[1]);
    }
    
    return 0;
  };
  
  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `$${amount.toFixed(0)}`;
    }
  };
  
  // Helper function to generate a consistent color based on investor name
  const getRandomColor = (name) => {
    const colors = [
      'bg-orange-500', 'bg-orange-600', 'bg-orange-400', 
      'bg-orange-700', 'bg-orange-800', 'bg-orange-300'
    ];
    
    // Use the sum of character codes to pick a color
    const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[sum % colors.length];
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-300 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex items-center mb-8">
            <div className="w-24 h-1 bg-orange-400 mr-4"></div>
            <h1 className="text-4xl font-bold text-gray-900">Funding Journey</h1>
          </div>
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
            <p className="font-medium">Error loading funding data:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && fundingRounds.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Funding Data Available</h3>
            <p className="text-gray-500">This company hasn't added any funding information yet.</p>
          </div>
        )}

        {/* Content when data is available */}
        {!loading && !error && fundingRounds.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Left Side - Funding Received */}
            <div className={`transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                Funding Received
              </h3>

              <div className="space-y-8 relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-400 rounded-full"></div>

                {fundingRounds.map((round, index) => (
                  <div
                    key={index}
                    className={`relative pl-12 transform transition-all duration-700 ${round.delay} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} group hover:scale-105`}
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125 ${
                      round.isGrant ? 'bg-blue-500' : (round.isLoan ? 'bg-green-500' : 'bg-orange-500')
                    }`}>
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>

                    {/* Content card */}
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-800">{round.type}</h4>
                        <div className="flex-shrink-0 ml-2">
                          {round.isGrant && (
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                              Grant
                            </span>
                          )}
                          {round.isLoan && (
                            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                              Loan
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex flex-wrap items-baseline">
                          <span className="text-2xl font-bold text-orange-600 mr-2">{round.amount}</span>
                          {round.year && (
                            <span className="text-gray-500">{round.year}</span>
                          )}
                          {round.date && !round.year && (
                            <span className="text-gray-500">({round.date})</span>
                          )}
                        </div>
                        
                        {round.source && (
                          <div className="text-blue-600 font-medium mt-2 text-sm">
                            <span className="inline-block bg-blue-50 px-2 py-1 rounded">
                              {round.source}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {round.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed text-sm">{round.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Raised */}
              <div className={`mt-12 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
                  <h4 className="text-lg font-medium mb-2 opacity-90">Total Raised:</h4>
                  <div className="text-3xl font-bold">{totalRaised}+</div>
                </div>
              </div>
            </div>

            {/* Right Side - Funding Details or Investors */}
            <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
              {investors.length === 0 ? (
                /* When no investors, show funding details and impact */
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                    Funding Impact
                  </h3>
                  
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Funding Summary</h4>
                      <div className="space-y-3">
                        {fundingRounds.length > 0 ? (
                          fundingRounds.map((round, index) => (
                            <div key={index} className="flex items-start">
                              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3 mt-1.5"></div>
                              <div>
                                <p className="text-gray-800 font-medium">{round.type}</p>
                                <p className="text-gray-600 text-sm">{round.amount} - {round.date || ''}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 italic">No funding rounds available</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">Funding Milestones</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-orange-600 font-bold text-xl">{fundingRounds.length}</div>
                          <div className="text-gray-600 text-sm">Funding Rounds</div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="text-orange-600 font-bold text-xl">{totalRaised}</div>
                          <div className="text-gray-600 text-sm">Total Raised</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {fundingRounds.length > 0 && (
                    <div className={`mt-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl shadow-lg text-white">
                        <h4 className="font-semibold mb-2">Funding Details</h4>
                        <p className="text-sm text-orange-100 mb-4">View complete funding information and history.</p>
                        <button className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-orange-50 transition-colors duration-300">
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* When investors are available, show them */
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                    Our Investors & Partners
                  </h3>
                
                  <div className="space-y-4">
                    {investors.map((investor, index) => (
                      <div
                        key={index}
                        className={`transform transition-all duration-700 delay-${(index + 1) * 100 % 1000} ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        onMouseEnter={() => setHoveredInvestor(index)}
                        onMouseLeave={() => setHoveredInvestor(null)}
                      >
                        <div className={`flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-orange-200 group cursor-pointer ${hoveredInvestor === index ? 'scale-105 shadow-2xl' : ''}`}>
                          {/* Avatar */}
                          <div className={`w-12 h-12 ${investor.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-lg transition-all duration-300 group-hover:scale-110`}>
                            {investor.letter}
                          </div>
                          
                          {/* Investor info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center">
                              <h5 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 break-words w-full">
                                {investor.name}
                              </h5>
                              {investor.role && (
                                <span className="text-orange-600 font-medium text-sm mt-1">{investor.role}</span>
                              )}
                            </div>
                          </div>

                          {/* Hover arrow */}
                          <div className={`transition-all duration-300 ${hoveredInvestor === index ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`}>
                            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Connect Button - Only show if there are investors */}
                  <div className={`mt-12 transform transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center group">
                      <span className="mr-2">Connect with Investors</span>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Floating elements for extra visual appeal */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-orange-300 rounded-full opacity-20 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-orange-500 rounded-full opacity-25 animate-bounce" style={{ animationDelay: '2s' }}></div>
      </div>
    </section>
  );
}