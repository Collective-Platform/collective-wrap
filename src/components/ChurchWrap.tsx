import React, { useRef, useEffect, useState } from "react";
import { track } from "@vercel/analytics";
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
  const scrollTriggerRef = useRef<HTMLDivElement>(null);

  const switchLanguageUrl = language === "en" ? "/cn/" : "/";

  const handleScrollToWrap = () => {
    track("Story Triggered", { lang: language, trigger: "button" });
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
    if (showStories) return;

    const handleScroll = () => {
      if (!scrollTriggerRef.current) return;

      const rect = scrollTriggerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Trigger when the element is in the top 20% of the viewport
      // rect.top will be small/negative when scrolled up
      if (rect.top <= windowHeight * 0.5 && rect.top > -rect.height) {
        track("Story Triggered", { lang: language, trigger: "scroll" });
        setShowStories(true);
        window.scrollTo(0, 0);
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
            scrollTriggerRef={scrollTriggerRef}
          />
          {/* Add extra space below to make scrolling possible */}
          <div className="h-screen bg-bg-inverse" />
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
