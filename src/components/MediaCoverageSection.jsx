import React, { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";

export default function MediaCoverageSection() {
  const [mediaCoverage, setMediaCoverage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const truncate = (string, length, end = "...") => {
    return string.length < length ? string : string.substring(0, length) + end;
  };

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
              publisher: media.Source || "Unknown",
              title: media.Headline || "Untitled",
              headline: media.Headline || "Untitled",
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
    <div className="max-w-7xl min-w-full mx-auto pb-16 bg-white px-4">
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 text-center">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
          Media Coverage & Recognition
        </span>
      </h1>
      <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full mb-6"></div>
      <p className="text-lg text-gray-700 max-w-4xl mx-auto mb-12">
        SolarX and our startups have been featured in leading publications and
        received prestigious awards.
      </p>

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
        <div className="grid md:grid-cols-3 gap-8 animate-slide-in-left max-w-7xl mx-auto px-4">
          {mediaCoverage.length > 0 ? (
            mediaCoverage.map((item, index) => (
              <a
                href={item.link}
                id={item.id}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-between flex-col bg-white rounded-xl shadow-lg hover:hover:shadow-[0px_0px_20px_5px_rgba(234,88,12,1)] transition-all duration-300 ease-in-out transform hover:-translate-y-1 overflow-hidden border border-gray-200 hover:border-orange-400 group"
              >
                <div className="p-5 sm:p-6 flex flex-col justify-between">
                  <p className="text-xs text-gray-500 mb-2">
                    <span className="font-semibold text-gray-700">
                      {item.publisher}
                    </span>
                    <span className="mx-1">|</span>
                    <span>{item.date}</span>
                  </p>

                  <h3 className="text-lg sm:text-2xl font-semibold text-orange-600 mt-2 leading-tight group-hover:text-orange-600 transition-colors">
                    {item.headline}
                  </h3>
                </div>
                <div className="bg-gray-50 px-5 py-3 sm:px-6 sm:py-4 border-t border-gray-100 text-right">
                  <span className="text-xs sm:text-sm font-medium text-orange-500 group-hover:text-orange-700 transition-colors inline-flex items-center">
                    Read Full Article
                    <ExternalLink size={14} className="ml-1.5" />
                  </span>
                </div>
              </a>
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
