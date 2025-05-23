import React, { useState, useEffect } from 'react';

export default function CompanyTimelineSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const timelineData = [
    {
      title: "Founded",
      date: "January 2019",
      description: "SolarFlow was founded in Nairobi, Kenya by a team of engineers and social entrepreneurs with a vision to revolutionize renewable energy access in developing regions."
    },
    {
      title: "MVP Built",
      date: "August 2019",
      description: "Our team developed the first prototype of SolarCell™ technology, achieving 40% higher efficiency than traditional solar panels while reducing manufacturing costs by 30%."
    },
    {
      title: "First Deployment",
      date: "March 2020",
      description: "Successfully deployed our first community-scale solar grid in rural Kenya, providing reliable electricity to 200+ households and a local healthcare clinic."
    },
    {
      title: "Seed Funding",
      date: "November 2020",
      description: "Secured initial investment from African Innovation Trust and Berlin Energy Accelerator to expand operations and refine our technology."
    },
    {
      title: "Series A",
      date: "June 2021",
      description: "Led by GreenTech Ventures with participation from Climate Capital Partners and Sustainable Future Fund, enabling expansion to 5 new countries."
    },
    {
      title: "Major Partnership",
      date: "April 2022",
      description: "Formed strategic partnership with international development agencies and tech companies to scale our solution across East Africa and South Asia."
    }
  ];

  const detailsData = [
    {
      title: "Company Founded",
      description: "SolarFlow was founded in Nairobi, Kenya by a team of engineers and social entrepreneurs with a vision to revolutionize renewable energy access in developing regions."
    },
    {
      title: "Minimum Viable Product",
      description: "Our team developed the first prototype of SolarCell™ technology, achieving 40% higher efficiency than traditional solar panels while reducing manufacturing costs by 30%."
    },
    {
      title: "First Field Deployment",
      description: "Successfully deployed our first community-scale solar grid in rural Kenya, providing reliable electricity to 200+ households and a local healthcare clinic."
    },
    {
      title: "$1.2M Seed Round",
      description: "Secured initial investment from African Innovation Trust and Berlin Energy Accelerator to expand operations and refine our technology."
    },
    {
      title: "$8.5M Series A",
      description: "Led by GreenTech Ventures with participation from Climate Capital Partners and Sustainable Future Fund, enabling expansion to 5 new countries."
    },
    {
      title: "Global Partnership",
      description: "Formed strategic partnership with international development agencies and tech companies to scale our solution across East Africa and South Asia."
    }
  ];

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(() => {
        setActiveIndex(prevIndex => prevIndex >= 5 ? 0 : prevIndex + 1);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
    setAutoplay(false);
  };

  const handleMouseLeave = () => {
    setAutoplay(true);
  };

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
            Our Journey
          </span>
        </h2>
        
        {/* Horizontal Timeline - Desktop */}
        <div className="relative max-w-4xl mx-auto hidden md:block">
          {/* Timeline Line Background */}
          <div className="absolute h-2 bg-orange-100 top-1/2 transform -translate-y-1/2 left-0 right-0 z-0 rounded-full"></div>
          
          {/* Timeline Progress Line (animated) */}
          <div 
            className="absolute h-2 bg-gradient-to-r from-orange-400 to-orange-600 top-1/2 transform -translate-y-1/2 left-0 z-0 rounded-full transition-all duration-1000 ease-in-out"
            style={{ width: `${(activeIndex * 20)}%` }}
          ></div>
          
          {/* Timeline Points */}
          <div className="relative z-10 flex justify-between items-center">
            {timelineData.map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center cursor-pointer transition-transform duration-500 ${
                  activeIndex === index ? 'scale-125' : ''
                }`}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <div 
                  className={`w-8 h-8 rounded-full bg-white border-4 border-orange-400 mb-2 shadow-lg transition-all duration-300 ${
                    activeIndex === index ? 'bg-orange-400 shadow-xl' : ''
                  }`}
                ></div>
                <div className="text-center">
                  <p className="font-bold text-gray-800 text-sm animate-pulse">{item.title}</p>
                  <p className="text-orange-500 text-xs">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Timeline Details */}
          <div className="mt-10 bg-white p-6 rounded-xl shadow-lg border border-orange-100 min-h-32">
            <div className="animate-pulse">
              <h3 className="text-xl font-bold text-orange-500 mb-2">
                {detailsData[activeIndex].title}
              </h3>
              <p className="text-gray-600">
                {detailsData[activeIndex].description}
              </p>
            </div>
          </div>
        </div>
        
        {/* Mobile Timeline (Vertical) */}
        <div className="md:hidden mt-12">
          <div className="relative border-l-2 border-orange-300 pl-6 ml-4">
            {timelineData.map((item, index) => (
              <div 
                key={index}
                className={`mb-8 relative opacity-0 animate-fade-in`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                <div className="absolute w-4 h-4 bg-white border-2 border-orange-400 rounded-full -left-7 top-1 shadow-md"></div>
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-orange-500 text-sm">{item.date}</p>
                <p className="text-gray-600 mt-2">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.4s ease-out;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-400 {
          animation-delay: 0.4s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        /* Timeline specific styles */
        .active-dot {
          background-color: #fb923c;
          box-shadow: 0 0 20px rgba(251, 146, 60, 0.6);
        }

        .timeline-progress {
          transition: width 1s ease-in-out;
        }
      `}</style>
    </section>
  );
}