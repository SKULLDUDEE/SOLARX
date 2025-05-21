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

const Footer = () => {
  return (
    <footer id="footer" className="orange-gradient text-white py-10 sm:py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 sm:mb-12">
          
          {/* Logo & Description */}
          <div className="text-center sm:text-left">
            <div className="flex items-center mb-4 sm:mb-6 justify-center sm:justify-start">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-2 sm:mr-3 shadow-lg">
                <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white rounded-lg"></div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold">SolarX</h3>
            </div>
            <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
              The SolarX Challenge is a flagship program by the International Solar Alliance designed to accelerate solar innovation globally and transform energy access in developing regions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-6">Quick Links</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
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
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-6">Programs</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
              {['SolarX Africa', 'SolarX Asia-Pacific', 'SolarX LAC', 'SolarX MENA'].map((program, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-white transition-all">{program}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div className="text-center sm:text-left">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-6">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-white/80">
              {/* Address */}
              <li className="flex items-start justify-center sm:justify-start">
                <FaMapMarkerAlt className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-white/60 flex-shrink-0" />
                <span>International Solar Alliance</span>
              </li>

              {/* Email */}
              <li className="flex items-start justify-center sm:justify-start">
                <FaEnvelope className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-white/60 flex-shrink-0" />
                <span>solarx@isolaralliance.org</span>
              </li>

              {/* Phone */}
              <li className="flex items-start justify-center sm:justify-start">
                <FaPhone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 mt-0.5 text-white/60 flex-shrink-0" />
                <span>+91 120 2970 138</span>
              </li>

              {/* Social Links */}
              <li className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-6 justify-center sm:justify-start">
                <SocialIcon href="#" icon={<FaFacebookF />} />
                <SocialIcon href="#" icon={<FaTwitter />} />
                <SocialIcon href="#" icon={<FaInstagram />} />
                <SocialIcon href="#" icon={<FaGithub />} />
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright - Added for completeness */}
        <div className="pt-6 border-t border-white/20 text-center">
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
