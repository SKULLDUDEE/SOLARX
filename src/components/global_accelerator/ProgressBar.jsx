import { useState, useEffect } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stickyParentNode = document.querySelector(".sticky-parent");
    if (!stickyParentNode) {
      console.warn("ProgressBar: '.sticky-parent' element not found.");
      return;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const start = stickyParentNode.offsetTop;
      const viewportHeight =
        window.innerHeight || document.documentElement.clientHeight;
      // The scrollable height is the total height of the sticky parent minus one viewport height
      // (because the effect ends when the bottom of sticky-parent reaches bottom of viewport)
      const scrollableHeight = stickyParentNode.offsetHeight - viewportHeight;

      if (scrollableHeight <= 0) {
        // Cannot scroll if sticky parent isn't taller than viewport
        setIsVisible(false);
        setProgress(scrollY > start ? 100 : 0); // Show full if past, 0 if before
        return;
      }

      if (scrollY >= start && scrollY <= start + scrollableHeight) {
        const currentProgress = ((scrollY - start) / scrollableHeight) * 100;
        setProgress(Math.min(100, Math.max(0, currentProgress)));
        setIsVisible(true);
      } else {
        setIsVisible(false);
        if (scrollY < start) setProgress(0);
        if (scrollY > start + scrollableHeight) setProgress(100);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Also listen for resize to recalculate if stickyParentNode's dimensions change
    const resizeObserver = new ResizeObserver(handleScroll);
    resizeObserver.observe(stickyParentNode);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      className="progress-bar-wrapper fixed bottom-0 left-0 w-full h-2 bg-black/60 z-[1000] pointer-events-none transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="progress-bar h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-width duration-100 ease-out rounded-r-md"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
