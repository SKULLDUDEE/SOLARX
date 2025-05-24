import React, { useState, useEffect } from "react";
import {
  Building2,
  DollarSign,
  Zap,
  Globe,
  Shield,
  FlaskConical,
} from "lucide-react";

export default function FundingInvestorsDashboard() {
  const [fundingData, setFundingData] = useState([]);
  const [totalFunding, setTotalFunding] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [investors, setInvestors] = useState([]); // state for investors
  const [focusAreas, setFocusAreas] = useState([]); // state for focus areas

  // Function to parse funding data from rich text
  const parseFundingData = (fundingItem) => {
    const { Round, Amount_Raised, Date, Reason, investors } = fundingItem;

    const reasonText = (Reason || [])
      .map((paragraph) =>
        (paragraph.children || []).map((child) => child.text || "").join("")
      )
      .join(" ")
      .trim();

    const amount = parseFloat(Amount_Raised || 0);

    const round = {
      type: Round || "Unknown",
      amount,
      amountFormatted: `$${(amount / 1000).toFixed(1)}K`,
      date: Date || "",
      source: investors && investors.length > 0 ? investors[0].Name : "Unknown",
      reason: reasonText,
    };

    return round;
  };

  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const response = await fetch(
          "http://localhost:1337/api/fundings?populate=*"
        );
        const result = await response.json();

        if (result?.data?.length > 0) {
          let allRounds = [];
          let totalAmount = 0;
          let allInvestorsSet = new Set();

          result.data.forEach((item) => {
            const round = parseFundingData(item);
            allRounds.push(round);
            totalAmount += round.amount;

            if (round.source) {
              allInvestorsSet.add(round.source);
            }
          });

          const fundingByType = {};
          allRounds.forEach((round) => {
            if (!fundingByType[round.type]) {
              fundingByType[round.type] = 0;
            }
            fundingByType[round.type] += round.amount;
          });

          const getWidthClass = (percentage) => {
            if (percentage <= 5) return "w-[5%]";
            if (percentage <= 10) return "w-[10%]";
            if (percentage <= 15) return "w-[15%]";
            if (percentage <= 20) return "w-[20%]";
            if (percentage <= 25) return "w-1/4";
            if (percentage <= 30) return "w-[30%]";
            if (percentage <= 33) return "w-1/3";
            if (percentage <= 40) return "w-2/5";
            if (percentage <= 50) return "w-1/2";
            if (percentage <= 60) return "w-3/5";
            if (percentage <= 66) return "w-2/3";
            if (percentage <= 75) return "w-3/4";
            if (percentage <= 80) return "w-4/5";
            if (percentage <= 90) return "w-[90%]";
            return "w-full";
          };

          const aggregatedData = Object.entries(fundingByType).map(
            ([type, amount]) => {
              const percentage = (amount / totalAmount) * 100;
              return {
                type,
                amount: `$${(amount / 1000).toFixed(1)}K`,
                width: getWidthClass(percentage),
                percentage: percentage.toFixed(1),
              };
            }
          );

          const iconMap = [
            Building2,
            DollarSign,
            Zap,
            Globe,
            Shield,
            FlaskConical,
          ];
          const investorsArray = Array.from(allInvestorsSet)
            .slice(0, 6)
            .map((name, index) => ({
              name,
              icon: iconMap[index % iconMap.length],
            }));

          setFundingData(aggregatedData);
          setTotalFunding(totalAmount);
          setInvestors(investorsArray);
          setFocusAreas([]); // Update if API provides focus areas
        } else {
          setFundingData([]);
          setTotalFunding(0);
          setInvestors([]);
          setFocusAreas([]);
        }
      } catch (err) {
        console.error("Error fetching funding data:", err);
        setError("Failed to load funding data. Please try again later.");
        setInvestors([]);
        setFocusAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFundingData();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-500 mb-4">
            Funding & Investors
          </h1>
          <div className="w-16 h-1 bg-orange-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Mobilizing capital to accelerate solar innovation and deployment
            across emerging markets.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Funding Breakdown */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">
                  Funding Breakdown
                </h3>
                <div className="space-y-4">
                  {fundingData.length > 0 ? (
                    fundingData.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700 font-medium">
                              {item.type}
                            </span>
                            <span className="text-orange-600 font-semibold">
                              {item.amount}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`bg-orange-500 h-2 rounded-full ${item.width}`}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 text-right mt-1">
                            {item.percentage}%
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-4">
                      No funding data available
                    </div>
                  )}
                </div>
              </div>

              {/* Total Funding */}
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Total Funding Facilitated
                </h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-orange-500">
                    ${(totalFunding / 1000).toFixed(1)}K
                  </span>
                  {/* Growth indicator can be added when historical data is available */}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Key Investors & Partners */}
              {investors.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Key Investors & Partners
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {investors.map((investor, index) => {
                      const IconComponent = investor.icon;
                      return (
                        <div key={index} className="text-center">
                          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-gray-700 font-medium text-sm">
                            {investor.name}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Investment Focus Areas */}
              {focusAreas.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">
                    Investment Focus Areas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {focusAreas.map((area, index) => (
                      <div key={index} className="text-center">
                        <span className="inline-block border border-orange-500 text-orange-600 py-2 rounded-full text-sm font-medium bg-white w-40">
                          {area}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// limit 6 investr random show honge bs not more then this
