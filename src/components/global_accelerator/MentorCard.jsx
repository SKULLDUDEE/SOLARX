// src/components/global_accelerator/MentorCard.jsx
import React from "react";

const MentorCard = ({ imgSrc, name, title, bio, id }) => {
  return (
    <div id={`${id}`} className="bg-white flex flex-col rounded-xl shadow-xl hover:shadow-2xl overflow-hidden w-full max-w-[20rem] h-[39rem] flex-shrink-0 transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-200 hover:border-orange-500 focus:border-orange-500">
      <div className="bg-gradient-to-b from-gray-50 to-white rounded-t-xl overflow-hidden">
        <div className="relative h-[17.5rem]">
          <img
            src={imgSrc}
            alt={name}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-1 text-gray-900">{name}</h3>
        <p className="text-sm font-semibold text-orange-600 mb-3">{title}</p>
        <div className="text-xs md:text-sm leading-relaxed text-gray-700 bio-scrollbar overflow-y-auto flex-grow">
          {bio}
        </div>
      </div>
    </div>
  );
};

export default MentorCard;
