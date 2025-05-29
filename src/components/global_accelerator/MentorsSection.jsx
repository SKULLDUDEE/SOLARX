// src/components/global_accelerator/MentorsSection.jsx
import React from 'react';
import MentorCard from './MentorCard';

const mentorsData = [
  { imgSrc: '/imgs/1.png', name: 'Mr Thomas Van Halen', title: 'Head of Premium Products, VC4A', bio: "Thomas Van Halen connects African startups to opportunities at VC4A and directs the Africa Early Stage Investor Summit. He's a Google Startup Mentor, Angel Investor, and founder of Van Halen Media. With a background at Mastercard Foundation and a board role at TWIGA Foundation, Thomas holds a Masters in International Business." },
  { imgSrc: '/imgs/2.png', name: 'Mr Raiyaan Shingati', title: 'Co-founder, Transition VC', bio: "Raiyaan Shingati, Founder & Managing Partner at Transition VC, spearheads India's first energy transition-focused VC fund. He invests in early-stage startups across new energy, e-mobility, green hydrogen, and climate tech, dedicated to accelerating India's journey to Net Zero through innovative solutions." },
  { imgSrc: '/imgs/3.png', name: 'Mr Peter Damgaard Jensen', title: 'Co-Chair, Climate Investment Coalition; Chair, AIP Management', bio: "Peter Damgaard Jensen, former CEO of Danish pension fund PKA, now chairs the Climate Investment Coalition and Fonden World Climate Foundation. With extensive board experience including Axcel Ltd, he actively promotes sustainable development through the Danish SDG Investment Fund and Global Commission on Adaptation." },
  { imgSrc: '/imgs/4.png', name: 'Ms Namita Vikas', title: 'Founder and Managing Partner, AuctusESG', bio: "Namita Vikas founded AuctusESG, specializing in sustainable finance and ESG. With 30+ years in climate strategy (banking, tech, FMCG), she's a green finance leader, pivotal in launching India's first Green Bond and raising over USD 1 billion for sustainable initiatives. Recognized as 'Sustainability Leader of the Year.'" },
  { imgSrc: '/imgs/5.png', name: 'Mr Sanchayan Chakraborty', title: 'Partner and CEO, Aavishkaar Capital', bio: "Sanchayan Chakraborty is Partner at Aavishkaar Capital and CEO of Aavishkaar Carbon Platform. With over 25 years in investment banking and fund management across Asia/Middle East, he previously held roles at Standard Chartered Bank. He holds degrees from IIM Bangalore and IIT Kharagpur." },
  { imgSrc: '/imgs/6.png', name: 'Mr Kushal Agrawal', title: 'Partner, Lightrock', bio: "Kushal Agrawal, Partner and CFO at Lightrock, manages fund operations and serves on company boards like Neogrowth. A Chartered Accountant with prior roles at Zovi.com, ITC, and PwC, he focuses on strategic financial planning and enhancing portfolio company growth through efficient processes." },
  { imgSrc: '/imgs/7.png', name: 'Mr Jens Nielsen', title: 'CEO, World Climate Foundation', bio: "Jens Nielsen, founder & CEO of World Climate Foundation, is a sustainability leader with 20+ years experience (PwC, Cision PR Newswire). He co-founded the Climate Investment Coalition for multi-billion-dollar climate investments and champions the green economy via global partnerships." },
  { imgSrc: '/imgs/8.png', name: 'Ms Sreya Bhattacharya', title: 'Associate Partner, Dalberg', bio: "Sreya Bhattacharya, Associate Partner at Dalberg (Singapore), scales high-impact ventures and designs funding strategies in Asia Pacific. Her work includes prototyping social enterprises and innovating in digital health financing. She has prior experience at Dasra, KPMG, and holds a Columbia MBA." },
  { imgSrc: '/imgs/9.png', name: 'Mr Babatunde Usman', title: 'Senior Investment Associate, Acumen', bio: "Babatunde Usman, Senior Investment Associate at Acumen West Africa, has extensive impact investing experience. With a background at Aruwa Capital and Platform Capital, he focuses on equity investments in consumer goods, healthcare, and fintech, aiming to support African entrepreneurs." },
];

const MentorsSection = () => {
  return (
    <section className="investor-profiles-section bg-gradient-to-tl from-orange-700 via-orange-900 to-gray-900 text-white py-16 md:py-20">
    <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
      <h2
        className="text-4xl md:text-5xl font-bold mb-12 md:mb-16 text-center text-white"
        style={{ textShadow: '0 2px 5px rgba(0,0,0,0.6)' }}
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
