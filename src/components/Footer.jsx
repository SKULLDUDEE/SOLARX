import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaGithub 
} from 'react-icons/fa';
import logo from "/logo.svg";

const Footer = () => {
  return (
    <footer id="footer" className="orange-gradient text-white py-6 sm:py-8">
  <div className="container mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6 sm:mb-8">
      
      {/* Logo & Description */}
      <div className="text-center sm:text-left">
        <div className="flex items-center mb-3 justify-center sm:justify-start">
          <div className="flex items-center mb-3 justify-center sm:justify-start">
    <img
      src={logo}
      alt="International Solar Alliance Logo"
      className="w-9 h-9 bg-white p-1 rounded-lg mr-2 shadow-md"
    />
    <h3 className="text-lg font-bold">SolarX</h3>
  </div>
        </div>
        <p className="text-white/80 text-xs leading-relaxed">
          The SolarX Challenge is a flagship program by the International Solar Alliance to accelerate solar innovation globally.
        </p>
      </div>

      {/* Quick Links */}
      <div className="text-center sm:text-left">
        <h4 className="text-sm font-bold mb-3">Quick Links</h4>
        <ul className="space-y-2 text-xs text-white/80">
          {['Home', 'About ISA', 'Funding & Investors', 'SDG & Climate Impact', 'Global Reach', 'Success Stories', 'Apply Now'].map((link, index) => (
            <li key={index}>
              <a href={`#${link.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')}`} className="hover:text-white transition-all">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Programs */}
      <div className="text-center sm:text-left">
        <h4 className="text-sm font-bold mb-3">Programs</h4>
        <ul className="space-y-2 text-xs text-white/80">
          {['SolarX Africa', 'SolarX Asia-Pacific', 'SolarX LAC', 'SolarX MENA'].map((program, index) => (
            <li key={index}>
              <a href="#" className="hover:text-white transition-all">{program}</a>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact Us */}
      <div className="text-center sm:text-left">
        <h4 className="text-sm font-bold mb-3">Contact Us</h4>
        <ul className="space-y-2 text-xs text-white/80">
          <li className="flex items-start justify-center sm:justify-start">
            <FaMapMarkerAlt className="h-4 w-4 mr-2 text-white/60 flex-shrink-0" />
            <span>International Solar Alliance</span>
          </li>
          <li className="flex items-start justify-center sm:justify-start">
            <FaEnvelope className="h-4 w-4 mr-2 text-white/60 flex-shrink-0" />
            <span>solarx@isolaralliance.org</span>
          </li>
          <li className="flex items-start justify-center sm:justify-start">
            <FaPhone className="h-4 w-4 mr-2 text-white/60 flex-shrink-0" />
            <span>+91 120 2970 138</span>
          </li>
          <li className="flex space-x-3 mt-3 justify-center sm:justify-start">
            <SocialIcon href="#" icon={<FaFacebookF />} />
            <SocialIcon href="#" icon={<FaTwitter />} />
            <SocialIcon href="#" icon={<FaInstagram />} />
            <SocialIcon href="#" icon={<FaGithub />} />
          </li>
        </ul>
      </div>
    </div>

    {/* Copyright */}
    <div className="pt-4 border-t border-white/20 text-center">
      <p className="text-white/60 text-xs">
        © {new Date().getFullYear()} SolarX. All rights reserved.
      </p>
    </div>
  </div>
</footer>

  );
};

// Simplified SocialIcon component using React Icons
const SocialIcon = ({ href, icon }) => {
  return (
    <a href={href} className="bg-white/10 hover:bg-white/20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm">
      {icon}
    </a>
  );
};

export default Footer;
