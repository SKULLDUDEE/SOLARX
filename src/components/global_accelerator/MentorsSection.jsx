import MentorCard from "./MentorCard";
import { mentorsData } from "./mentorData";

const MentorsSection = () => {
  return (
    <section className="investor-profiles-section bg-gradient-to-tl from-orange-700 via-orange-900 to-gray-900 text-white py-16 md:py-20">
      <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-6xl font-bold mb-12 md:mb-4 text-center text-white"
          style={{ textShadow: "0 2px 5px rgba(0,0,0,0.6)" }}
        >
          Meet the Mentors
        </h2>
        <div className="w-1/4 h-1 mx-auto bg-white rounded-full mb-10 md:mb-16"></div>
        <div className="relative">
          <div className="investor-carousel-wrapper w-full overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex space-x-4 lg:space-x-6 py-2 min-w-max">
              {mentorsData.map((mentor, index) => (
                <MentorCard key={index} {...mentor} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default MentorsSection;
