import React, { useState, useEffect } from "react";

export default function MediaCoverageSection() {
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "http://localhost:1337/api/startups?populate=Media"
        );
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const json = await res.json();

        const coverage = [];

        json.data?.forEach((startup) => {
          const name = startup.Name || "Unknown";
          startup.Media?.forEach((media) => {
            coverage.push({
              id: media.id,
              source: media.Source || "Media",
              title: media.Headline || "Untitled",
              date: media.Date || "",
              link: media.URL || "",
              startupName: name,
              initials: (media.Source || "M").substring(0, 2),
            });
          });
        });

        setMediaCoverage(coverage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-10 py-16 bg-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-4 animate-fade-in">
          Media Coverage
        </h1>
        <p className="text-gray-600 text-lg animate-fade-in-delay">
          We’re proud to be featured by leading publications on our journey.
        </p>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg max-w-2xl mx-auto">
          <p className="font-medium">Error loading content:</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid md:grid-cols-2 gap-8 animate-slide-in-left">
          {mediaCoverage.length > 0 ? (
            mediaCoverage.map((item, index) => (
              <div
                key={item.id}
                className="flex items-start space-x-4 group hover:bg-orange-50 hover:shadow-lg transition-all duration-300 p-6 rounded-xl border border-transparent hover:border-orange-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                  {item.initials}
                </div>
                <div className="flex-1">
                  <div className="text-sm text-orange-600 mb-1 font-medium flex items-center">
                    {item.source}
                    {item.date && (
                      <>
                        <span className="mx-2 w-1 h-1 bg-orange-400 rounded-full inline-block"></span>
                        {item.date}
                      </>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-700">
                    {item.title}
                  </h3>
                  {item.startupName && (
                    <p className="text-gray-500 text-sm mb-2 italic">
                      By {item.startupName}
                    </p>
                  )}
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-600 hover:text-orange-700 font-medium inline-flex items-center hover:underline"
                    >
                      Read Article
                      <svg
                        className="ml-1 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center bg-gray-50 border border-gray-200 p-10 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-700">
                No Media Coverage Available
              </h3>
              <p className="text-gray-500 mt-2">
                Media stories will appear here once available.
              </p>
            </div>
          )}
        </div>
      )}

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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slideInLeft 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}
