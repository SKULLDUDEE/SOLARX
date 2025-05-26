import { useState, useEffect } from "react";

// Helper function to format currency
const formatCurrency = (amount) => {
  if (isNaN(parseFloat(amount))) return "$0"; // Ensure amount is a number
  const numericAmount = parseFloat(amount);
  if (numericAmount >= 1000000) {
    return `$${(numericAmount / 1000000).toFixed(1)}M`;
  } else if (numericAmount >= 1000) {
    return `$${(numericAmount / 1000).toFixed(1)}K`;
  } else {
    return `$${numericAmount.toFixed(0)}`;
  }
};

// Helper function to generate a consistent color based on investor name
const getRandomColor = (name) => {
  const colors = [
    "bg-orange-500",
    "bg-orange-600",
    "bg-orange-400",
    "bg-orange-700",
    "bg-orange-800",
    "bg-orange-300",
  ];
  if (!name || typeof name !== "string") return colors[0]; // Default color if name is invalid
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[sum % colors.length];
};

export default function FundingJourney({ companyId }) {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredInvestor, setHoveredInvestor] = useState(null);
  const [fundingRounds, setFundingRounds] = useState([]);
  const [investors, setInvestors] = useState([]); // Stores aggregated unique investors
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
      if (!companyId) {
        setError("Company ID is required to fetch funding data.");
        setLoading(false);
        setFundingRounds([]);
        setInvestors([]);
        setTotalRaised("$0");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const apiUrl = `http://localhost:1337/api/startups?populate[0]=funding&populate[1]=funding.investors&filters[id][$eq]=${companyId}`;

        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const errorMessage =
            errorData?.error?.message ||
            `API request failed: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }
        const result = await response.json();

        console.log("API Response for funding data:", result);

        if (result && result.data && result.data.length > 0) {
          const startupData = result.data[0];
          if (startupData.funding && startupData.funding.length > 0) {
            processFundingData(startupData.funding);
          } else {
            console.log("No funding rounds found for this startup.");
            setFundingRounds([]);
            setInvestors([]);
            setTotalRaised("$0");
          }
        } else {
          console.log(`No startup data found for companyId: ${companyId}.`);
          setFundingRounds([]);
          setInvestors([]);
          setTotalRaised("$0");
          setError(
            `Startup with ID ${companyId} not found or has no funding information.`
          );
        }
      } catch (err) {
        console.error("Error fetching funding data:", err);
        setError(
          err.message || "An unknown error occurred while fetching data."
        );
        setFundingRounds([]);
        setInvestors([]);
        setTotalRaised("$0");
      } finally {
        setLoading(false);
      }
    };

    fetchFundingData();
  }, [companyId]);

  // Process the funding data from API
  const processFundingData = (apiFundingRounds) => {
    try {
      if (!apiFundingRounds || apiFundingRounds.length === 0) {
        setFundingRounds([]);
        setInvestors([]);
        setTotalRaised("$0");
        return;
      }

      const extractedRounds = [];
      let currentTotalAmount = 0;
      const uniqueInvestorsMap = new Map();

      apiFundingRounds.forEach((roundData, index) => {
        const type = roundData.Round || "N/A";
        const amountNum = Number(roundData.Amount_Raised) || 0;
        const date = roundData.Date || "";

        let description = "No description provided.";
        if (
          roundData.Reason &&
          Array.isArray(roundData.Reason) &&
          roundData.Reason.length > 0 &&
          roundData.Reason[0].children &&
          Array.isArray(roundData.Reason[0].children) &&
          roundData.Reason[0].children.length > 0 &&
          roundData.Reason[0].children[0].text
        ) {
          description = roundData.Reason[0].children[0].text;
        }

        const roundInvestorNames = [];
        if (
          roundData.investors &&
          Array.isArray(roundData.investors) &&
          roundData.investors.length > 0
        ) {
          roundData.investors.forEach((inv) => {
            const investorName = inv.Name || "Unknown Investor";
            roundInvestorNames.push(investorName);

            if (!uniqueInvestorsMap.has(investorName)) {
              uniqueInvestorsMap.set(investorName, {
                name: investorName,
                role: inv.role || "", // Assuming 'role' might come from investor object itself, otherwise default to ""
                letter: investorName.charAt(0).toUpperCase(),
                color: getRandomColor(investorName),
              });
            }
          });
        }

        const source =
          roundInvestorNames.length > 0
            ? roundInvestorNames.join(", ")
            : "Undisclosed";
        currentTotalAmount += amountNum;

        extractedRounds.push({
          type,
          amount: formatCurrency(amountNum),
          date,
          source,
          description,
          delay: `delay-${index * 100}`,
          isGrant: type.toLowerCase().includes("grant"),
          isLoan: type.toLowerCase().includes("loan"),
        });
      });

      setFundingRounds(extractedRounds);
      setTotalRaised(formatCurrency(currentTotalAmount));
      setInvestors(Array.from(uniqueInvestorsMap.values()));
    } catch (err) {
      console.error("Error processing funding data:", err);
      setError(err.message || "Error processing data");
      setFundingRounds([]);
      setInvestors([]);
      setTotalRaised("$0");
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-orange-300 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-10 left-10 w-96 h-96 bg-orange-200 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-20 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between md:justify-start mb-8 space-y-3 md:space-y-0 md:space-x-3 w-full">
            <div className="w-1/5 md:w-16 hidden md:block h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
            <h1 className="text-3xl md:text-5xl font-bold mb-1">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-red-600">
                Funding Journey
              </span>
            </h1>
            <div className="block md:hidden w-1/3 md:w-16 h-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            <p className="mt-4 text-gray-700">Loading funding information...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative max-w-2xl mx-auto"
            role="alert"
          >
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && fundingRounds.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Funding Data Available
            </h3>
            <p className="text-gray-500">
              This company hasn't added any funding information, or we couldn't
              find any records.
            </p>
          </div>
        )}

        {/* Content when data is available */}
        {!loading && !error && fundingRounds.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
            {/* Left Side - Funding Received */}
            <div
              className={`transform transition-all duration-1000 delay-200 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-10 opacity-0"
              }`}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                Funding Received
              </h3>

              <div className="space-y-8 relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-200 via-orange-300 to-orange-400 rounded-full"></div>
                {fundingRounds.map((round, index) => (
                  <div
                    key={index} // Using index as key is acceptable if list items don't reorder/get deleted often
                    className={`relative pl-12 transform transition-all duration-700 ${
                      round.delay
                    } ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    } group hover:scale-105`}
                  >
                    <div
                      className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125 ${
                        round.isGrant
                          ? "bg-blue-500"
                          : round.isLoan
                          ? "bg-green-500"
                          : "bg-orange-500"
                      }`}
                    >
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-orange-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xl font-bold text-gray-800">
                          {round.type}
                        </h4>
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
                          {!round.isGrant && !round.isLoan && round.type && (
                            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                              Funding
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="flex flex-wrap items-baseline">
                          <span className="text-2xl font-bold text-orange-600 mr-2">
                            {round.amount}
                          </span>
                          {round.date && (
                            <span className="text-gray-500 text-sm">
                              ({round.date})
                            </span>
                          )}
                        </div>
                        {round.source && round.source !== "Undisclosed" && (
                          <div className="text-sm text-gray-700 mt-2">
                            <span className="font-medium">From: </span>
                            <span className="text-blue-600">
                              {round.source}
                            </span>
                          </div>
                        )}
                        {round.source === "Undisclosed" && (
                          <div className="text-sm text-gray-500 italic mt-2">
                            Source undisclosed
                          </div>
                        )}
                      </div>
                      {round.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-gray-600 leading-relaxed text-sm">
                            {round.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className={`mt-12 transform transition-all duration-1000 delay-700 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
              >
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-2xl shadow-xl text-white transform hover:scale-105 transition-all duration-300">
                  <h4 className="text-lg font-medium mb-2 opacity-90">
                    Total Funding Raised:
                  </h4>
                  <div className="text-3xl font-bold">{totalRaised}+</div>
                </div>
              </div>
            </div>

            {/* Right Side - Funding Impact or Investors */}
            <div
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-10 opacity-0"
              }`}
            >
              {investors.length === 0 ? (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                    Funding Overview
                  </h3>
                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Funding Rounds Summary
                      </h4>
                      <div className="space-y-3">
                        {fundingRounds.map((round, index) => (
                          <div key={index} className="flex items-start">
                            <div
                              className={`w-3 h-3 ${
                                round.isGrant
                                  ? "bg-blue-500"
                                  : round.isLoan
                                  ? "bg-green-500"
                                  : "bg-orange-500"
                              } rounded-full mr-3 mt-1.5 flex-shrink-0`}
                            ></div>
                            <div>
                              <p className="text-gray-800 font-medium">
                                {round.type}
                              </p>
                              <p className="text-gray-600 text-sm">
                                {round.amount}{" "}
                                {round.date ? `- ${round.date}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="text-lg font-semibold text-gray-800 mb-3">
                        Key Milestones
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-orange-50 p-4 rounded-lg text-center sm:text-left">
                          <div className="text-orange-600 font-bold text-xl">
                            {fundingRounds.length}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Funding Event{fundingRounds.length === 1 ? "" : "s"}
                          </div>
                        </div>
                        <div className="bg-orange-50 p-4 rounded-lg text-center sm:text-left">
                          <div className="text-orange-600 font-bold text-xl">
                            {totalRaised}
                          </div>
                          <div className="text-gray-600 text-sm">
                            Total Raised
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-8 transform transition-all duration-1000 delay-700 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6 rounded-xl shadow-lg text-white">
                      <h4 className="font-semibold mb-2">Further Insights</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        For more detailed financial information or investment
                        opportunities, please reach out.
                      </p>
                      <button className="bg-white text-gray-700 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors duration-300">
                        Contact Us
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                    <div className="w-1 h-8 bg-orange-500 rounded-full mr-4"></div>
                    Our Investors & Partners
                  </h3>
                  <div className="space-y-4">
                    {investors.map((investor, index) => (
                      <div
                        key={investor.name + "-" + index} // More robust key
                        className={`transform transition-all duration-700 delay-${
                          (index % 5) * 100 + 300
                        } ${
                          isVisible
                            ? "translate-y-0 opacity-100"
                            : "translate-y-8 opacity-0"
                        }`}
                        onMouseEnter={() => setHoveredInvestor(index)}
                        onMouseLeave={() => setHoveredInvestor(null)}
                      >
                        <div
                          className={`flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group cursor-pointer ${
                            hoveredInvestor === index
                              ? "scale-105 shadow-2xl ring-2 ring-orange-300"
                              : ""
                          }`}
                        >
                          <div
                            className={`w-12 h-12 ${investor.color} rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md transition-all duration-300 group-hover:scale-110 flex-shrink-0`}
                          >
                            {investor.letter}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300 break-words">
                              {investor.name}
                            </h5>
                            {investor.role && (
                              <span className="text-orange-500 font-medium text-xs mt-1 block">
                                {investor.role}
                              </span>
                            )}
                          </div>
                          <div
                            className={`ml-auto transition-all duration-300 ${
                              hoveredInvestor === index
                                ? "translate-x-0 opacity-100"
                                : "-translate-x-1 opacity-0 group-hover:opacity-50"
                            }`}
                          >
                            <svg
                              className="w-5 h-5 text-orange-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className={`mt-12 transform transition-all duration-1000 delay-1000 ${
                      isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-8 opacity-0"
                    }`}
                  >
                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-102 flex items-center justify-center group">
                      <span className="mr-2">Connect with Our Network</span>
                      <svg
                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
