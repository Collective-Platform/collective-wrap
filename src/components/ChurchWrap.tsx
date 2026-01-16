import React, { useRef, useEffect, useState } from "react";
import { Globe } from "lucide-react";
import { StoryViewer } from "./StoryViewer";
import { LandingPage } from "./LandingCard";

interface ChurchWrapProps {
  locale?: string;
}

const ChurchWrap: React.FC<ChurchWrapProps> = ({ locale = "en" }) => {
  const language = (locale === "cn" ? "cn" : "en") as "en" | "cn";
  const [showStories, setShowStories] = useState(false);
  const landingRef = useRef<HTMLDivElement>(null);
  const donationCardRef = useRef<HTMLDivElement>(null);

  const switchLanguageUrl = language === "en" ? "/cn/" : "/";

  const handleScrollToWrap = () => {
    setShowStories(true);
  };

  const handleCloseStories = () => {
    setShowStories(false);
  };

  const handleGiveClick = () => {
    setShowStories(false);
    setTimeout(() => {
      donationCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  // Detect scroll to trigger story viewer
  useEffect(() => {
    if (showStories) return; // Don't listen if stories already open

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Trigger stories when user scrolls within 100px of the bottom of the page
      if (scrollPosition + windowHeight >= documentHeight - 100) {
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
    <div className="relative w-full min-h-screen">
      {/* Language Toggle */}
      <a
        href={switchLanguageUrl}
        className={`absolute top-8 left-6 flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 border border-border-accent ${
          showStories ? "z-60" : "z-50"
        }`}
      >
        <Globe className="w-4 h-4 text-text-accent" />
        <span className="font-medium text-sm text-text-accent">
          {language === "en" ? "CN" : "EN"}
        </span>
      </a>

      {/* Landing Page */}
      {!showStories && (
        <div ref={landingRef}>
          <LandingPage
            lang={language}
            onScrollToWrap={handleScrollToWrap}
            donationCardRef={donationCardRef}
          />
          {/* Add extra space below to make scrolling possible */}
          <div className="h-screen" />
        </div>
      )}

      {/* Story Viewer */}
      {showStories && (
        <StoryViewer
          lang={language}
          onClose={handleCloseStories}
          onGiveClick={handleGiveClick}
        />
      )}
    </div>
  );
};

export default ChurchWrap;
