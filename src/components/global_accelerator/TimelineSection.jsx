// src/components/global_accelerator/TimelineSection.jsx
import React, { useEffect, useRef, useState } from 'react';

// --- Data Transformation Logic ---
const TODAY = { month: "May", day: 26, year: 2025 }; // Example: Today is May 26, 2025
const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthDay(dateString) {
  if (!dateString) return null;
  // Try to match "Day, Mon Day (Time)" e.g., "Fri, Mar 14 (11:00-12:30 PM IST)"
  const fullMatch = dateString.match(/(\w{3}),\s*(\w{3})\s*(\d{1,2})/i);
  if (fullMatch) {
    return { monthStr: fullMatch[2], day: parseInt(fullMatch[3], 10), monthIndex: monthOrder.indexOf(fullMatch[2]) };
  }
  // Try to match "Day, Mon Day" e.g., "Thurs, Aug 7"
  const partialMatch = dateString.match(/(\w{3}),\s*(\w{3})\s*(\d{1,2})/i); // Less strict, for "Thurs, Aug 7"
   if (partialMatch) {
    return { monthStr: partialMatch[2], day: parseInt(partialMatch[3], 10), monthIndex: monthOrder.indexOf(partialMatch[2]) };
  }
  // Try to match simpler "Mon Day" e.g. "Aug 7" if some dates are very short
  const simplerMatch = dateString.match(/(\w{3})\s*(\d{1,2})/i);
  if (simplerMatch) {
     return { monthStr: simplerMatch[1], day: parseInt(simplerMatch[2], 10), monthIndex: monthOrder.indexOf(simplerMatch[1]) };
  }
  console.warn("Could not parse date for timeline:", dateString);
  return null;
}

const webinarSeriesData = {
  type: 'webinarSeries', // To identify this special event
  // Generic image for the "Webinar Series Overview" slide if we make one,
  // or this img won't be used if each session becomes its own slide with its own image.
  img: "https://images.unsplash.com/photo-1556761175-4b4132ba2790?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0",
  sessions: [
    { month: "March", sessionNum: "1A", date: "Fri, Mar 14 (11:00-12:30 PM IST)", topic: "Masterclass on Fundraising", speakersVCA: "Sanchayan Chakraborty (Aavishkaar Capital)", speakersLocal: "" },
    { month: "March", sessionNum: "1B", date: "Tues, Mar 18 (11:00-12:30 PM IST)", topic: "Masterclass on Fundraising", speakersVCA: "Sanchayan Chakraborty (Aavishkaar Capital)", speakersLocal: "" },
    { month: "April", sessionNum: "2A", date: "Mon, May 5 (03:00-05:30 PM IST)", topic: "What Do VCs Look for in a Startup? A Masterclass on Securing Investment", speakersVCA: "Raiyaan Shingati (Transition VC)", speakersLocal: "" },
    { month: "April", sessionNum: "2B", date: "Thurs, May 8 (03:00-05:30 PM IST)", topic: "What Do VCs Look for in a Startup? A Masterclass on Securing Investment", speakersVCA: "Raiyaan Shingati (Transition VC)", speakersLocal: "" },
    { month: "May", sessionNum: "3A", date: "Wed, May 21 (02:00-03:30 PM IST)", topic: "Crafting a compelling narrative and pitch, Problem-solution fit, User centric design/ rapid prototyping approaches.", speakersVCA: "Sreya Bhattacharya (Dalberg)", speakersLocal: "" },
    { month: "May", sessionNum: "3B", date: "Wed, May 28 (02:00-03:30 PM IST)", topic: "Crafting a compelling narrative and pitch, Problem-solution fit, User centric design/ rapid prototyping approaches.", speakersVCA: "Sreya Bhattacharya (Dalberg)", speakersLocal: "" },
    { month: "June", sessionNum: "4A", date: "Thurs, June 5 (01:30-03:00 PM IST)", topic: "Fundraising with the exit in mind.", speakersVCA: "Thomas Van Halen (VC4A)", speakersLocal: "" },
    { month: "June", sessionNum: "4B", date: "Thurs, July 19 (01:30-03:00 PM IST)", topic: "Fundraising with the exit in mind.", speakersVCA: "Thomas Van Halen (VC4A)", speakersLocal: "" }, // Original had July date in June month
    { month: "July", sessionNum: "5A", date: "Thurs, July 17 (10:00-11:30 PM IST)", topic: "Investor readiness, selection, and key considerations", speakersVCA: "Babatunde Usman (Acumen)", speakersLocal: "" },
    { month: "July", sessionNum: "5B", date: "Thurs, July 24 (10:00-11:30 PM IST)", topic: "Investor readiness, selection, and key considerations", speakersVCA: "Babatunde Usman (Acumen)", speakersLocal: "" },
    { month: "August", sessionNum: "6A", date: "Thurs, Aug 7", topic: "ESG and climate risks for the RE sector. Sustainable finance and innovative financing mechanisms for RE", speakersVCA: "Namita Vikas (AuctusESG)", speakersLocal: "" },
    { month: "August", sessionNum: "6B", date: "Thurs, Aug 21", topic: "ESG and climate risks for the RE sector. Sustainable finance and innovative financing", speakersVCA: "Namita Vikas (AuctusESG)", speakersLocal: "" },
  ]
};

const transformedTimelineEvents = webinarSeriesData.sessions.map((session, index) => {
  const parsedDateInfo = getMonthDay(session.date);
  let isUpcoming = false;
  const todayMonthIndex = monthOrder.indexOf(TODAY.month);

  if (parsedDateInfo && parsedDateInfo.monthIndex !== -1) { // Ensure month was found
    if (parsedDateInfo.monthIndex > todayMonthIndex) {
      isUpcoming = true;
    } else if (parsedDateInfo.monthIndex === todayMonthIndex && parsedDateInfo.day >= TODAY.day) {
      isUpcoming = true;
    }
  } else if (parsedDateInfo) { // Month string might be different, fallback to comparing month string directly if index failed
    // This basic fallback might not be perfectly chronological if month strings are inconsistent
    if (session.month.toLowerCase() > TODAY.month.toLowerCase()) isUpcoming = true;
    else if (session.month.toLowerCase() === TODAY.month.toLowerCase() && parsedDateInfo.day >= TODAY.day) isUpcoming = true;
  }


  const imagePool = [
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1556761175-b4132ba2790?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1497493292307-31c376b6e479?q=80&w=600&auto=format&fit=crop"
  ];

  let descriptionContent = `<strong>Speakers VCA:</strong> ${session.speakersVCA || 'N/A'}`;
  if (session.speakersLocal) {
    descriptionContent += `<br/><strong>Speakers (Local):</strong> ${session.speakersLocal}`;
  }
  // Add the topic to the description if it's long, or keep it in title.
  // For this example, the topic is the title.
  // descriptionContent += `<br/><br/><i>This session is part of the ${session.month} webinar series (Session ${session.sessionNum}).</i>`;


  return {
    img: imagePool[index % imagePool.length],
    // For the timeline slide 'date' field, use the session's full date string
    date: `${isUpcoming ? "Upcoming: " : ""}${session.date.split('(')[0].trim()}`, // E.g., "Upcoming: Fri, Mar 14"
    title: session.topic, // The topic of the webinar session is the title of the timeline event
    description: descriptionContent,
    isUpcoming: isUpcoming,
    key: `webinar-${session.month}-${session.sessionNum}-${index}` // More specific key
  };
});

const conceptualEvents = [ // Renamed to avoid conflict
    {
        img: "https://images.unsplash.com/photo-1551731409-43eb3e517a1a?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "Phase: Q1 2025",
        title: "Investor Readiness Program",
        description: "Intensive workshops and mentorship to prepare startups for successful fundraising rounds, focusing on pitch refinement and investor engagement strategies.",
        isUpcoming: monthOrder.indexOf("Mar") >= monthOrder.indexOf(TODAY.month), // Example: March is Q1
        key: "conceptual-investor-readiness"
    },
    {
        img: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        date: "Future Plan (Q3 2025)",
        title: "SolarX LAC Leg Launch",
        description: "Opening call for applications for the Latin America & Caribbean leg of the SolarX program, extending ISA's innovation footprint globally.",
        isUpcoming: true,
        key: "conceptual-lac-launch"
    },
];

// Combine and sort all events by date to ensure chronological order
const allEventsRaw = [...conceptualEvents, ...transformedTimelineEvents];

const sortedTimelineEventsData = allEventsRaw.sort((a, b) => {
    const dateA = getMonthDay(a.date.replace("Upcoming: ","").replace("Phase: ",""));
    const dateB = getMonthDay(b.date.replace("Upcoming: ","").replace("Phase: ",""));

    // Handle cases where parsing might fail or for non-date specific titles
    if (!dateA && !dateB) return 0; // Keep original order if both unparsable
    if (!dateA) return 1;  // Put unparsable ones (like "Future Plan") at the end
    if (!dateB) return -1; // Put unparsable ones at the end

    if (dateA.monthIndex !== dateB.monthIndex) {
        return dateA.monthIndex - dateB.monthIndex;
    }
    return dateA.day - dateB.day;
});


// --- TimelineSection Component ---
const TimelineSection = () => {
  const scrollSectionRef = useRef(null);
  const stickyParentRef = useRef(null);

  const [dimensions, setDimensions] = useState({
    scrollWidth: 0,
    viewportWidth: 0,
    stickyParentOffsetTop: 0,
    stickyParentHeight: 0,
    viewportHeight: 0,
  });

  useEffect(() => {
    const calculateDimensions = () => {
      if (scrollSectionRef.current && stickyParentRef.current) {
        setDimensions({
          scrollWidth: scrollSectionRef.current.scrollWidth,
          viewportWidth: window.innerWidth,
          stickyParentOffsetTop: stickyParentRef.current.offsetTop,
          stickyParentHeight: stickyParentRef.current.offsetHeight,
          viewportHeight: window.innerHeight,
        });
      }
    };

    // Debounce calculateDimensions to avoid excessive calls during resize storm
    let resizeTimer;
    const debouncedCalculateDimensions = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(calculateDimensions, 100);
    };

    calculateDimensions(); // Initial calculation
    const resizeObserver = new ResizeObserver(debouncedCalculateDimensions);
    if (scrollSectionRef.current) resizeObserver.observe(scrollSectionRef.current);
    if (stickyParentRef.current) resizeObserver.observe(stickyParentRef.current);
    window.addEventListener('resize', debouncedCalculateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedCalculateDimensions);
      clearTimeout(resizeTimer);
    };
  }, []);

  useEffect(() => {
    const scrollSectionNode = scrollSectionRef.current;
    if (!scrollSectionNode || dimensions.scrollWidth === 0 || dimensions.viewportWidth === 0) return;

    const updateScrollAnimation = () => {
      const scrollY = window.scrollY;
      const {
        stickyParentOffsetTop,
        stickyParentHeight,
        viewportHeight,
        scrollWidth,
        viewportWidth,
      } = dimensions;

      const start = stickyParentOffsetTop;
      // Ensure end calculation is valid
      const scrollableDistance = stickyParentHeight - viewportHeight;
      if (scrollableDistance <= 0) { // Not enough space to scroll sticky parent
        scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        return;
      }
      const end = start + scrollableDistance;


      if (scrollWidth <= viewportWidth) {
        scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        return;
      }
      const maxTranslate = scrollWidth - viewportWidth;

      if (scrollY >= start && scrollY <= end) {
        const progress = Math.max(0, Math.min(1, (scrollY - start) / scrollableDistance));
        const translateX = -progress * maxTranslate;
        scrollSectionNode.style.transform = `translate3d(${translateX}px, 0, 0)`;
      } else {
        if (scrollY < start) {
          scrollSectionNode.style.transform = `translate3d(0px, 0, 0)`;
        } else { // scrollY > end
          scrollSectionNode.style.transform = `translate3d(${-maxTranslate}px, 0, 0)`;
        }
      }
    };

    window.addEventListener('scroll', updateScrollAnimation, { passive: true });
    updateScrollAnimation(); // Initial call to set position

    return () => window.removeEventListener('scroll', updateScrollAnimation);
  }, [dimensions]); // Re-run this effect when dimensions change

  return (
    <section className="timeline-section-container bg-gradient-to-tr from-gray-900 via-orange-900 to-orange-700 text-white py-16 md:py-20">
      <div
        className="relative w-full h-[400vh]" // This height drives the scroll duration of the effect
        ref={stickyParentRef}
      >
        <div className="overflow-hidden sticky top-0 h-screen w-screen">
          <div
            className="absolute top-0 left-0 h-full flex items-center" // scroll-section
            ref={scrollSectionRef}
            style={{ willChange: 'transform' }}
          >
            {sortedTimelineEventsData.map((event) => ( // Use sorted data
              <div
                className="flex flex-row justify-center items-center w-screen flex-shrink-0 h-full box-border px-6 sm:px-12 md:px-20 lg:px-24" // timeline-event
                key={event.key || event.title} // Use the key property or fallback
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-[450px] max-w-[40%] xl:max-w-[35%] h-[80vh] max-h-[600px] object-cover object-center shadow-[0_20px_40px_-10px_rgba(0,0,0,0.35)] rounded-2xl mr-8 xl:mr-12 border-2 border-white/10 transition-all duration-400 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)]"
                />
                <div className="w-full md:w-[55%] xl:w-[60%] max-w-[650px] flex flex-col justify-center items-start md:pl-4"> {/* content */}
                  <div className="flex flex-col items-start mb-6 relative"> {/* content-header */}
                    <h2 className={`text-3xl lg:text-4xl font-bold pb-2.5 relative mb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-[60px] after:h-[3px] after:rounded-sm ${event.isUpcoming ? 'text-amber-400 after:bg-amber-400' : 'text-white after:bg-orange-500'}`}> {/* date */}
                      {event.date}
                    </h2>
                    <h3 className={`text-xl lg:text-2xl font-semibold tracking-wide leading-tight ${event.isUpcoming ? 'text-amber-200' : 'text-gray-100'}`}> {/* title */}
                      {event.title}
                    </h3>
                  </div>
                  <div // description
                    className="text-sm lg:text-base text-slate-300 font-light leading-relaxed w-full max-h-[40vh] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-700/50 pr-2 [&_ul]:list-outside [&_ul]:mt-3 [&_ul]:pl-5 [&_li]:mb-1.5 [&_li]:text-slate-300"
                    dangerouslySetInnerHTML={{ __html: event.description }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
