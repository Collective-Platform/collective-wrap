import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { stories } from "@/data/storyData";
import { StoryCard } from "./StoryCard";
import { X } from "lucide-react";

interface StoryViewerProps {
  lang: "en" | "cn";
  onClose: () => void;
  onLanguageChange: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ lang, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const accumulatedWheel = useRef(0);
  const currentStory = stories[currentIndex];
  const isLastStory = currentIndex === stories.length - 1;
  const y = useMotionValue(0);

  // Background fades as you pull
  const backgroundOpacity = useTransform(y, [0, 200], [1, 0.6]);

  // Slight scale-down while pulling
  const scale = useTransform(y, [0, 200], [1, 0.95]);

  // Auto-advance progress
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (!isLastStory) {
            setCurrentIndex((i) => i + 1);
            return 0;
          }
          return 100;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds per story (100 * 50ms = 5000ms)

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, isLastStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  };

  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Math.abs(y.get()) > 20) return; // Ignore taps while dragging

    const clickX = e.clientX;
    const screenWidth = window.innerWidth;

    if (clickX < screenWidth / 2) {
      handlePrev();
    } else {
      handleNext();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      style={{ opacity: backgroundOpacity }}
    >
      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-4 z-10">
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

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-10 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-all cursor-pointer"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      {/* Story Content */}
      <motion.div
        className="w-full h-full max-w-2xl mx-auto relative"
        drag="y"
        dragConstraints={{ top: 0, bottom: 300 }}
        style={{ y, scale }}
        dragElastic={0.2}
        onDragStart={() => setIsPaused(true)}
        onDragEnd={(_, info) => {
          setIsPaused(false);

          // Close if pulled down far enough
          if (info.offset.y > 120) {
            onClose();
          }
        }}
        onClick={handleTap}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <StoryCard story={currentStory} lang={lang} />
          </motion.div>
        </AnimatePresence>

        {/* Tap Areas for Navigation (invisible) */}
        <div className="absolute inset-0 flex">
          <div className="w-1/2 h-full" /> {/* Left tap area */}
          <div className="w-1/2 h-full" /> {/* Right tap area */}
        </div>
      </motion.div>

      {/* Story Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full">
        {currentIndex + 1} / {stories.length}
      </div>
    </motion.div>
  );
};
