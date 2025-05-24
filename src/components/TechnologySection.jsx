import React, { useEffect, useState } from "react";

export default function TechnologySection({ companyId }) {
  const [techData, setTechData] = useState([]);
  const [loading, setLoading] = useState(true);

  const parseRichText = (content) => {
    if (!content || !Array.isArray(content)) return "";
    return content
      .map((block) => block.children?.map((child) => child.text).join("") || "")
      .join("\n")
      .trim();
  };

  useEffect(() => {
    const fetchTechData = async () => {
      if (!companyId) return;

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:1337/api/startups?filters[id][$eq]=${companyId}&populate=Technology`
        );
        const data = await response.json();

        const startup = data?.data?.[0];
        if (!startup || !startup.Technology) {
          setTechData([]);
          return;
        }

        const technologies = startup.Technology.map((tech) => ({
          title: tech.Name,
          description: parseRichText(tech.Description),
          tags: tech.Technology_Tags || [],
        }));

        setTechData(technologies);
      } catch (err) {
        console.error("Error fetching technology data:", err);
        setTechData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTechData();
  }, [companyId]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center mb-6">
        <div className="w-16 h-1 bg-orange-400 mr-3" />
        <h1 className="text-3xl font-bold text-gray-900">Technologies</h1>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {!loading && techData.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <p className="text-gray-700 text-center">
            No technology data available for this company.
          </p>
        </div>
      )}

      {!loading && techData.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techData.map((item, index) => (
              <div
                key={index}
                className="bg-orange-50 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-orange-200 pb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 mb-3">{item.description}</p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
