import React, { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { LandingPage } from "./LandingCard";

const ChurchWrap = () => {
  const [language, setLanguage] = useState<"en" | "cn">("en");
  const [showStories, setShowStories] = useState(false);
  const landingRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "cn" : "en"));
  };

  const handleScrollToWrap = () => {
    setShowStories(true);
  };

  const handleCloseStories = () => {
    setShowStories(false);
  };

  // Detect scroll to trigger story viewer
  useEffect(() => {
    if (showStories) return; // Don't listen if stories already open

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Trigger stories when user scrolls down more than 50% of viewport
      if (scrollPosition > windowHeight * 0.5) {
        setShowStories(true);
        window.scrollTo(0, 0); // Reset scroll position
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showStories]);

  useEffect(() => {
    // Prevent body scroll when stories are open
    if (showStories) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showStories]);

  return (
    <div className="relative w-full min-h-screen bg-black text-white">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className={`fixed top-8 right-6 flex items-center gap-2 bg-[hsl(var(--card-bg-from))] hover:bg-[hsl(var(--card-bg-to))] px-4 py-2 rounded-full transition-all duration-300 border border-[hsl(var(--card-border))] ${
          showStories ? "z-60" : "z-50"
        }`}
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{language.toUpperCase()}</span>
      </button>

      {/* Landing Page */}
      {!showStories && (
        <div ref={landingRef}>
          <LandingPage lang={language} onScrollToWrap={handleScrollToWrap} />
          {/* Add extra space below to make scrolling possible */}
          <div className="h-screen" />
        </div>
      )}

      {/* Story Viewer */}
      {showStories && (
        <StoryViewer
          lang={language}
          onClose={handleCloseStories}
          onLanguageChange={toggleLanguage}
        />
      )}
    </div>
  );
};

export default ChurchWrap;
