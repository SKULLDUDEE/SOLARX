import { useState, useEffect } from 'react';

import { fetchCompanyTeam } from '../services/api';

export default function MentorCarousel({ darkMode = false, companyId }) {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      if (companyId) {
        try {
          setLoading(true);
          const data = await fetchCompanyTeam(companyId);
          setTeamData(data);
        } catch (error) {
          console.error("Error fetching team data:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchData();
  }, [companyId]);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex % 6) + 1);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // Mentor data
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Clean Energy Investor",
      description: "Former VP at GreenTech Ventures with 15+ years experience funding renewable energy startups across Africa and Asia.",
      image: "https://placehold.co/400x400/orange/white?text=Sarah+Johnson"
    },
    {
      id: 2,
      name: "David Osei",
      title: "Solar Technology Expert",
      description: "Former CTO of SunTech with expertise in developing solar solutions for challenging environments and emerging markets.",
      image: "https://placehold.co/400x400/orange/white?text=David+Osei"
    },
    {
      id: 3,
      name: "Amina Patel",
      title: "Scaling Strategist",
      description: "Helped scale 20+ energy startups across emerging markets. Expert in navigating regulatory environments and building local partnerships.",
      image: "https://placehold.co/400x400/orange/white?text=Amina+Patel"
    },
    {
      id: 4,
      name: "Michael Chen",
      title: "Financial Strategist",
      description: "Former investment banker specializing in renewable energy financing. Expert in structuring deals and securing funding for early-stage startups.",
      image: "https://placehold.co/400x400/orange/white?text=Michael+Chen"
    },
    {
      id: 5,
      name: "Elena Rodriguez",
      title: "Marketing Specialist",
      description: "Digital marketing expert who has helped clean energy startups build their brand and reach global audiences. Specializes in impact storytelling.",
      image: "https://placehold.co/400x400/orange/white?text=Elena+Rodriguez"
    },
    {
      id: 6,
      name: "James Kimani",
      title: "Policy & Regulatory Expert",
      description: "Former energy policy advisor with deep knowledge of renewable energy regulations across Africa. Helps startups navigate complex regulatory landscapes.",
      image: "https://placehold.co/400x400/orange/white?text=James+Kimani"
    }
  ];

  // Function to determine card position classes
  const getCardClasses = (mentorId) => {
    const baseClasses = "absolute transition-all duration-700 transform w-64 md:w-80 filter";
    
    if (mentorId === activeIndex) {
      return `${baseClasses} scale-100 z-30 opacity-100 blur-none`;
    }
    
    const nextIndex = (activeIndex % 6) + 1;
    const prevIndex = activeIndex === 1 ? 6 : activeIndex - 1;
    
    if (mentorId === prevIndex || mentorId === ((activeIndex + 4) % 6 || 6)) {
      return `${baseClasses} scale-75 -translate-x-32 md:-translate-x-64 z-20 opacity-70 blur-sm`;
    }
    
    if (mentorId === nextIndex || mentorId === ((activeIndex + 2) % 6 || 6)) {
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
        
        {/* Mentors Carousel */}
        <div className="relative">
          <div className="flex justify-center items-center h-[500px]">
            {mentors.map(mentor => (
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
                      <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 text-white hover:bg-orange-500' 
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                        </svg>
                      </a>
                      <a href="#" className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        darkMode 
                          ? 'bg-gray-800 text-white hover:bg-orange-500' 
                          : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                      }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {mentors.map(mentor => (
              <button 
                key={`dot-${mentor.id}`}
                onClick={() => setActiveIndex(mentor.id)} 
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  activeIndex === mentor.id 
                    ? 'bg-orange-500 scale-125' 
                    : (darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-300 hover:bg-gray-400')
                }`}
                aria-label={`Go to mentor ${mentor.name}`}
              ></button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}