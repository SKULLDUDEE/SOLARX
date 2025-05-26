// src/components/global_accelerator/MediaHighlightsSection.jsx
import React from "react";
import MediaMentionCard from "./MediaMentionCard";
import { mediaMentionsData } from "./mediaData"; // Assuming you created mediaData.js
import { Rss } from "lucide-react";

const MediaHighlightsSection = () => {
  // If you want to dynamically select/shuffle, you can do it here.
  // For now, using the pre-selected 5 from mediaData.js
  const selectedMentions = mediaMentionsData; // mediaMentionsData already contains 5 items

  return (
    <section className="py-16 md:py-20 bg-gradient-to-tr from-gray-900 via-orange-900 to-orange-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Media Highlights
          </h2>
          <p className="text-md md:text-lg max-w-2xl mx-auto">
            Highlighting the impact and recognition of the SolarX Global
            Accelerator program in prominent media outlets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {selectedMentions.map((mention) => (
            <MediaMentionCard key={mention.id} {...mention} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MediaHighlightsSection;
