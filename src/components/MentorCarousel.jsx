import { useState, useEffect } from 'react';
import { fetchMentors, getMediaUrl } from '../services/api';

export default function MentorCarousel({ darkMode = false }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("MentorCarousel: Fetching mentors data...");
        const response = await fetchMentors();
        
        console.log("MentorCarousel: Raw API response:", response);
        
        if (response && response.data) {
          console.log("MentorCarousel: Found mentors/founders data:", response.data);
          
          // Log the entire response structure to understand the data format
          console.log("MentorCarousel: Full response structure:", JSON.stringify(response, null, 2));
          
          // Process the founders data from Strapi as mentors
          const processedMentors = response.data.map((founder) => {
            console.log("MentorCarousel: Raw founder data:", founder);
            
            // Direct access to properties without assuming attributes structure
            const mentorData = {
              id: founder.id,
              name: founder.name || '',
              title: founder.designation || '', 
              description: founder.description || '',
              image: founder.image ? getMediaUrl(founder.image) : 
                     `https://placehold.co/400x400/orange/white?text=${encodeURIComponent(founder.name || 'Mentor')}`,
              linkedin: founder.linkedin || '',
              twitter: founder.twitter || '',
              status: founder.publishedAt ? 'Published' : 'Draft'
            };
            
            console.log("MentorCarousel: Processed mentor data:", mentorData);
            return mentorData;
          });
          
          console.log("MentorCarousel: Final processed mentors:", processedMentors);
          setMentors(processedMentors);
          
          // Set active index to first mentor if available
          if (processedMentors.length > 0) {
            console.log("MentorCarousel: Setting active index to first mentor ID:", processedMentors[0].id);
            setActiveIndex(processedMentors[0].id);
          }
        } else {
          console.error("MentorCarousel: No mentor data received from API");
          setMentors([]);
        }
      } catch (error) {
        console.error("MentorCarousel: Error fetching mentors data:", error);
        console.error("MentorCarousel: Error details:", error.message, error.response?.data);
        setMentors([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Create a state to track the active mentor index (0, 1, 2...) instead of ID
  const [activePosition, setActivePosition] = useState(0);
  
  useEffect(() => {
    if (mentors.length > 0) {
      // Find the position of the active mentor by ID
      const activeMentorPosition = mentors.findIndex(mentor => mentor.id === activeIndex);
      console.log("MentorCarousel: Active mentor ID:", activeIndex, "Position:", activeMentorPosition);
      
      if (activeMentorPosition !== -1) {
        setActivePosition(activeMentorPosition);
      } else {
        // If not found, default to first mentor
        setActivePosition(0);
      }
    }
  }, [activeIndex, mentors]);
  
  useEffect(() => {
    if (mentors.length > 0) {
      const interval = setInterval(() => {
        // Rotate through positions (0, 1, 2...) not IDs
        const nextPosition = (activePosition + 1) % mentors.length;
        console.log("MentorCarousel: Auto-rotating to position:", nextPosition);
        // Set the actual mentor ID from the position
        setActiveIndex(mentors[nextPosition].id);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [mentors, activePosition]);

  // Function to determine card position classes
  const getCardClasses = (mentorId) => {
    const baseClasses = "absolute transition-all duration-700 transform w-64 md:w-80 filter";
    
    // If this is the active mentor
    if (mentorId === activeIndex) {
      console.log("MentorCarousel: Rendering active mentor:", mentorId);
      return `${baseClasses} scale-100 z-30 opacity-100 blur-none`;
    }
    
    if (mentors.length === 0) return baseClasses;
    
    // Find position of this mentor
    const mentorPosition = mentors.findIndex(m => m.id === mentorId);
    if (mentorPosition === -1) return `${baseClasses} opacity-0`;
    
    const totalMentors = mentors.length;
    
    // Calculate next and previous positions
    const nextPosition = (activePosition + 1) % totalMentors;
    const prevPosition = activePosition === 0 ? totalMentors - 1 : activePosition - 1;
    
    // If this is the previous mentor
    if (mentorPosition === prevPosition) {
      return `${baseClasses} scale-75 -translate-x-32 md:-translate-x-64 z-20 opacity-70 blur-sm`;
    }
    
    // If this is the next mentor
    if (mentorPosition === nextPosition) {
      return `${baseClasses} scale-75 translate-x-32 md:translate-x-64 z-10 opacity-70 blur-sm`;
    }
    
    return `${baseClasses} opacity-0`;
  };

  return (
    <section className={`py-16 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 animate-fade-in ${darkMode ? 'text-white text-gradient' : 'text-gray-900'}`}>
            Meet Our Mentors
          </h2>
          <p className={`text-lg max-w-3xl mx-auto animate-fade-in delay-100 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Our experienced mentors guide startups through every stage of growth, providing expertise and industry connections.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Mentors Carousel */}
            <div className="relative">
              <div className="flex justify-center items-center h-[500px]">
                {mentors.length > 0 ? (
                  mentors.map(mentor => (
                    <div key={mentor.id} className={getCardClasses(mentor.id)}>
                      <div className={`bg-gradient-to-b rounded-xl overflow-hidden shadow-2xl ${
                        darkMode 
                          ? 'from-black to-gray-800 border border-orange-500/20' 
                          : 'from-white to-orange-50 border border-orange-200'
                      }`}>
                        <div className="relative">
                          <img src={mentor.image} alt={mentor.name} className="w-full h-64 object-cover" />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
                        </div>
                        <div className="p-6">
                          <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                            {mentor.name}
                          </h3>
                          <p className="text-orange-500 font-medium mb-3">{mentor.title}</p>
                          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {mentor.description}
                          </p>
                          <div className="flex space-x-3">
                            {mentor.linkedin && (
                              <a 
                                href={mentor.linkedin} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-800 text-white hover:bg-orange-500' 
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                                </svg>
                              </a>
                            )}
                            {mentor.twitter && (
                              <a 
                                href={mentor.twitter} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                  darkMode 
                                    ? 'bg-gray-800 text-white hover:bg-orange-500' 
                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                }`}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      No mentors found. Please add mentors in the Strapi admin panel.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Navigation dots */}
              {mentors.length > 0 && (
                <div className="flex justify-center mt-8 space-x-3">
                  {mentors.map((mentor, index) => (
                    <button 
                      key={`dot-${mentor.id}`}
                      onClick={() => {
                        console.log("MentorCarousel: Dot clicked for mentor:", mentor.id);
                        setActiveIndex(mentor.id);
                      }} 
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activePosition
                          ? 'bg-orange-500 scale-125' 
                          : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400')
                      }`}
                      aria-label={`Go to mentor ${mentor.name}`}
                    ></button>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}