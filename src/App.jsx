import { useState, useEffect } from 'react'
import './App.css'
import SolarXNavbar from './components/SolarXNavbar'
import SolarXWinners from './components/SolarXWinners'
import StatsSection from './components/StatsSection'
import Footer from './components/Footer'
import WelcomeBanner from './components/WelcomeBanner'
import HeroCarousel from './components/HeroCarousel'
import CompanyInformation from './components/CompanyInformation'

function App() {
  const [isMobile, setIsMobile] = useState(false);

  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative">
      <WelcomeBanner />
      <SolarXNavbar />
      {/* Content padding to prevent it from being hidden under the navbar */}
      <div className="relative">
        <HeroCarousel />
        <SolarXWinners />
        <StatsSection />
        <Footer />
      </div>
    </div>
  )
}

export default App
