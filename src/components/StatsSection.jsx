export default function StatsSection() {
  // TODO: Cumulative
  const stats = [
    {
      id: 1,
      value: "50+",
      label: "Innovative Startups",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      value: "4",
      label: "Global Regions",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      value: "$25M",
      label: "Funding Facilitated",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 4,
      value: "500K+",
      label: "Lives Impacted",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section
      id="stats"
      className="bg-white pb-12 sm:pb-16 md:pb-20 relative min-h-[60vh] max-w-screen-2xl mx-auto"
    >
      {/* Background Blurs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-orange-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-40 right-5 sm:right-10 w-40 sm:w-60 md:w-80 h-40 sm:h-60 md:h-80 bg-orange-100/30 rounded-full filter blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-orange-600 text-shadow">
            Our Reach and Impact
          </h2>
          <div className="w-16 sm:w-24 h-1 bg-orange-500 mx-auto rounded-full mt-4 sm:mt-4"></div>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto pt-4">
            Transforming the solar energy landscape with innovative solutions
            across the globe
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg sm:shadow-xl hover:scale-105 transition-all text-center border border-orange-100 hover:border-orange-300"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 orange-gradient rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <div className="scale-75 sm:scale-90 md:scale-100">
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-600 mb-2 sm:mb-3">
                {stat.value}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center my-10 sm:my-12 md:my-16">
          <a
            href="#global-reach"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm sm:text-base py-2 sm:py-3 px-6 sm:px-8 rounded-full shadow-md sm:shadow-lg transition-all hover:scale-105"
          >
            Explore Our Global Reach
          </a>
        </div>
      </div>
    </section>
  );
}
