import { useState, useEffect } from "react";
import { fetchMentors, getMediaUrl } from "../services/api";

export default function MentorCarousel({ darkMode = false, companyId }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // console.log("MentorCarousel: Fetching mentors data...");
        const response = await fetchMentors(companyId);

        // console.log("MentorCarousel: Raw API response:", response);

        if (response && response.data) {
          // console.log(
          //   "MentorCarousel: Found mentors/founders data:",
          //   response.data
          // );

          // Log the entire response structure to understand the data format
          // console.log(
          //   "MentorCarousel: Full response structure:",
          //   JSON.stringify(response, null, 2)
          // );

          // Process the founders data from Strapi as mentors
          const processedMentors = response.data.map((founder) => {
            // console.log("MentorCarousel: Raw founder data:", founder);

            // Direct access to properties without assuming attributes structure
            const mentorData = {
              id: founder.id,
              name: founder.Name || "",
              title: founder.Designation || "",
              description: founder.Short_Description[0].children[0].text || "",
              image: founder.Profile_Picture
                ? getMediaUrl(founder.Profile_Picture)
                : `https://placehold.co/400x400/orange/white?text=${encodeURIComponent(
                    founder.name || "Mentor"
                  )}`,
              // linkedin: founder.linkedin || '',
              // twitter: founder.twitter || '',
              // status: founder.publishedAt ? 'Published' : 'Draft'
            };

            // console.log("MentorCarousel: Processed mentor data:", mentorData);
            return mentorData;
          });

          // console.log(
          //   "MentorCarousel: Final processed mentors:",
          //   processedMentors
          // );
          setMentors(processedMentors);

          // Set active index to first mentor if available
          if (processedMentors.length > 0) {
            // console.log(
            //   "MentorCarousel: Setting active index to first mentor ID:",
            //   processedMentors[0].id
            // );
            setActiveIndex(processedMentors[0].id);
          }
        } else {
          console.error("MentorCarousel: No mentor data received from API");
          setMentors([]);
        }
      } catch (error) {
        console.error("MentorCarousel: Error fetching mentors data:", error);
        console.error(
          "MentorCarousel: Error details:",
          error.message,
          error.response?.data
        );
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
      const activeMentorPosition = mentors.findIndex(
        (mentor) => mentor.id === activeIndex
      );
      // console.log(
      //   "MentorCarousel: Active mentor ID:",
      //   activeIndex,
      //   "Position:",
      //   activeMentorPosition
      // );

      if (activeMentorPosition !== -1) {
        setActivePosition(activeMentorPosition);
      } else {
        // If not found, default to first mentor
        setActivePosition(0);
      }
    }
  }, [activeIndex, mentors]);

  // Function to determine card position classes
  const getCardClasses = (mentorId) => {
    const baseClasses =
      "absolute transition-all duration-700 transform w-64 md:w-80 filter";

    // If this is the active mentor
    if (mentorId === activeIndex) {
      // console.log("MentorCarousel: Rendering active mentor:", mentorId);
      return `${baseClasses} scale-100 z-30 opacity-100 blur-none`;
    }

    if (mentors.length === 0) return baseClasses;

    // Find position of this mentor
    const mentorPosition = mentors.findIndex((m) => m.id === mentorId);
    if (mentorPosition === -1) return `${baseClasses} opacity-0`;

    const totalMentors = mentors.length;

    // Calculate next and previous positions
    const nextPosition = (activePosition + 1) % totalMentors;
    const prevPosition =
      activePosition === 0 ? totalMentors - 1 : activePosition - 1;

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
    <section
      className={`py-16 relative overflow-hidden ${
        darkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2
            className={`text-3xl md:text-4xl font-bold mb-4 animate-fade-in ${
              darkMode ? "text-white text-gradient" : "text-gray-900"
            }`}
          >
            Meet Our Founders
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Mentors Carousel */}
            <div className="relative">
              <div className="flex flex-wrap justify-center gap-6">
                {mentors.length > 0 ? (
                  mentors.map((mentor) => (
                    <div key={mentor.id} className="w-64 md:w-80">
                      <div
                        className={`bg-gradient-to-b rounded-xl overflow-hidden shadow-2xl ${
                          darkMode
                            ? "from-black to-gray-800 border border-orange-500/20"
                            : "from-white to-orange-50 border border-orange-200"
                        }`}
                      >
                        <div className="relative">
                          <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent h-1/2"></div>
                        </div>
                        <div className="p-6">
                          <h3
                            className={`text-xl font-bold mb-1 ${
                              darkMode ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {mentor.name}
                          </h3>
                          <p className="text-orange-500 font-medium mb-3">
                            {mentor.title}
                          </p>
                          <div className="max-h-48 overflow-y-auto mb-4">
                            <p
                              className={`text-sm ${
                                darkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {mentor.description}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            {/* Social links */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center">
                    <p
                      className={`text-lg ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      No mentors found. Please add mentors in the Strapi admin
                      panel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
