import { useState, useEffect } from "react";
import "./App.css";
import SolarXNavbar from "./components/SolarXNavbar";
import SolarXWinners from "./components/SolarXWinners";
import StatsSection from "./components/StatsSection";
import Footer from "./components/Footer";
import WelcomeBanner from "./components/WelcomeBanner";
import HeroCarousel from "./components/HeroCarousel";
import FundingInvestorsDashboard from "./components/FundingInvestorsDashboard";
import SuccessStories from "./components/SuccessStories";
import MediaCoverageSection from "./components/MediaCoverageSection";
import SolarXPromotionalSlider from "./components/SolarXPromotionalSlider";
// import SolarXApplicationSection from './components/SolarXApplicationSection'
import AboutSolarXChallenge from "./components/AboutSolarXChallenge";
import GlobalImpactSection from "./components/GlobalImpactSection";
// import ProjectTimeline from './components/ProjectTimeline'
import SolarXGlobalReach from "./components/SolarXGlobalReach";

export default function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="relative">
      {/* <WelcomeBanner /> */}
      <SolarXNavbar isMobile={isMobile} />

      <div className="relative">
        <HeroCarousel />
        <SolarXWinners isMobile={isMobile} />
        <StatsSection isMobile={isMobile} />
        <FundingInvestorsDashboard isMobile={isMobile} />
        <SolarXGlobalReach isMobile={isMobile} />
        <SuccessStories isMobile={isMobile} />
        <MediaCoverageSection isMobile={isMobile} />
        {/* <SolarXPromotionalSlider isMobile={isMobile} /> */}
        {/* <SolarXApplicationSection isMobile={isMobile} /> */}
        <GlobalImpactSection isMobile={isMobile} />
        <AboutSolarXChallenge isMobile={isMobile} />
        {/* <ProjectTimeline isMobile={isMobile} /> */}
        <Footer />
      </div>
    </div>
  );
}
