import React, { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { stories } from "@/data/storyData";
import { StoryCard } from "./StoryCard";
import { Pause, Play, X } from "lucide-react";

interface StoryViewerProps {
  lang: "en" | "cn";
  onClose: () => void;
  onLanguageChange: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ lang, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [quizInteractionPause, setQuizInteractionPause] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentStory = stories[currentIndex];
  const isLastStory = currentIndex === stories.length - 1;
  const isQuizStory = currentStory.type === "quiz";
  const y = useMotionValue(0);

  // Background fades as you pull
  const backgroundOpacity = useTransform(y, [0, 200], [1, 0.6]);

  // Slight scale-down while pulling
  const scale = useTransform(y, [0, 200], [1, 0.95]);

  // Auto-pause on quiz story
  useEffect(() => {
    if (isQuizStory) {
      setQuizInteractionPause(true);
    }
  }, [isQuizStory, currentIndex]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        togglePause();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, isPaused]);

  // Auto-advance progress
  useEffect(() => {
    if (isPaused || quizInteractionPause || isDragging) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!isLastStory) {
            setCurrentIndex((i) => i + 1);
            setQuizInteractionPause(false);
            return 0;
          }
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per story (100 * 50ms = 5000ms)

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, quizInteractionPause, isLastStory, isDragging]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
      setQuizInteractionPause(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
      setQuizInteractionPause(false);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't handle tap if dragging
    if (isDragging || Math.abs(y.get()) > 20) return;

    const target = e.target as HTMLElement;

    // Don't navigate if clicking on buttons, links, or quiz options
    if (
      target.closest("button:not([data-nav-area])") ||
      target.closest("a") ||
      target.closest("[data-quiz-option]")
    ) {
      return;
    }

    const clickX = e.clientX;
    const screenWidth = window.innerWidth;

    if (clickX < screenWidth / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const handleQuizInteraction = (interacting: boolean) => {
    setQuizInteractionPause(interacting);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      style={{ opacity: backgroundOpacity }}
    >
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-4 z-10 pointer-events-none">
        {stories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{
                width:
                  index < currentIndex
                    ? "100%"
                    : index === currentIndex
                    ? `${progress}%`
                    : "0%",
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 left-6 right-6 z-60 flex items-center pointer-events-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all cursor-pointer pointer-events-auto"
        >
          <X className="w-8 h-8 text-white" />
        </button>

        {/* Pause Button */}
        <button
          onClick={togglePause}
          className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all pointer-events-auto"
        >
          {isPaused ? (
            <Play className="w-6 h-6 text-white fill-white" />
          ) : (
            <Pause className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Story Content - Full width container */}
      <div className="w-full h-full relative">
        <motion.div
          className="w-full h-full max-w-2xl mx-auto relative"
          drag="y"
          dragConstraints={{ top: 0, bottom: 300 }}
          style={{ y, scale }}
          dragElastic={0.2}
          onDragStart={() => {
            setIsPaused(true);
            setIsDragging(true);
          }}
          onDragEnd={(_, info) => {
            setIsDragging(false);

            // Close if pulled down far enough
            if (info.offset.y > 120) {
              onClose();
            } else {
              setIsPaused(false);
            }
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full relative"
            >
              <StoryCard
                story={currentStory}
                lang={lang}
                onQuizInteraction={handleQuizInteraction}
              />

              {/* Tap Areas for Navigation - Only for non-quiz stories */}
              {!isQuizStory && (
                <div className="absolute inset-0 flex" onClick={handleTap}>
                  <button
                    data-nav-area
                    className="w-1/2 h-full cursor-pointer"
                    style={{ background: "transparent", border: "none" }}
                    aria-label="Previous story"
                  />
                  <button
                    data-nav-area
                    className="w-1/2 h-full cursor-pointer"
                    style={{ background: "transparent", border: "none" }}
                    aria-label="Next story"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Story Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full pointer-events-none z-10">
        {currentIndex + 1} / {stories.length}
      </div>

      {/* Pause Indicator - Hide for quiz */}
      {isPaused && !isDragging && !isQuizStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-6 py-3 rounded-full pointer-events-none z-10"
        >
          <p className="text-white text-sm font-medium">
            {lang === "en" ? "Paused" : "已暂停"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};
