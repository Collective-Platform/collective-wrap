import React, { useState, useEffect } from "react";
import type { Story } from "@/data/storyData";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Confetti } from "./Confetti";
import { BackgroundWorldMap } from "./BackgroundWorldMap";

interface StoryCardProps {
  story: Story;
  lang: "en" | "cn";
  onQuizInteraction?: (interacting: boolean) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  lang,
  onQuizInteraction,
}) => {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Reset quiz state when story changes
  useEffect(() => {
    setQuizAnswer(null);
    setShowReveal(false);
    setShowConfetti(false);
  }, [story.id]);

  const handleQuizAnswer = (answer: string) => {
    if (quizAnswer) return;

    onQuizInteraction?.(true);
    setQuizAnswer(answer);

    if (answer === story.correctAnswer) {
      setShowConfetti(true);
      setShowReveal(true);
      setTimeout(() => {
        onQuizInteraction?.(false);
      }, 300);
    } else {
      setShowReveal(true);
      setTimeout(() => {
        onQuizInteraction?.(false);
      }, 300);
    }
  };

  // Hero Type
  if (story.type === "hero") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-8 text-center gap-3">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold text-[hsl(var(--card-title))]"
        >
          {story.title?.[lang]}
        </motion.h2>
        {story.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[hsl(var(--card-subtitle))]"
          >
            {story.subtitle[lang]}
          </motion.p>
        )}
      </div>
    );
  }

  // Quiz Type
  if (story.type === "quiz") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-8">
        {showConfetti && <Confetti />}

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-8 text-center text-[hsl(var(--card-title))]"
        >
          {story.title?.[lang]}
        </motion.h2>

        <div className="w-full max-w-md space-y-4 relative z-10">
          {story.quizOptions?.map((option, index) => {
            const isSelected = quizAnswer === option.value;
            const isCorrect = option.value === story.correctAnswer;
            const isWrong = isSelected && !isCorrect;
            const showCorrectIndicator = showReveal && isCorrect;
            const isCorrectAndSelected = isSelected && isCorrect;

            return (
              <motion.button
                key={option.value}
                data-quiz-option="true"
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale:
                    showCorrectIndicator && !isSelected
                      ? [1, 1.05, 1, 1.05, 1]
                      : 1,
                }}
                transition={{
                  delay: index * 0.1,
                  scale: {
                    repeat: showCorrectIndicator && !isSelected ? 2 : 0,
                    duration: 0.5,
                  },
                }}
                onClick={() => handleQuizAnswer(option.value)}
                disabled={!!quizAnswer}
                className={`w-full p-4 rounded-lg border-2 text-lg transition-all relative pointer-events-auto ${
                  isWrong
                    ? "border-[hsl(var(--quiz-incorrect))] bg-white/5"
                    : showCorrectIndicator
                    ? "border-[hsl(var(--quiz-correct))] bg-[hsl(var(--quiz-correct))]/20"
                    : isCorrectAndSelected
                    ? "border-[hsl(var(--quiz-correct))] bg-[hsl(var(--quiz-correct))]/20"
                    : "border-[hsl(var(--quiz-border-default))] hover:border-[hsl(var(--card-border-hover))]"
                } ${
                  quizAnswer && !isSelected && !showCorrectIndicator
                    ? "opacity-50"
                    : ""
                }`}
              >
                <span className="flex items-center justify-between text-[hsl(var(--card-subtitle))] font-medium">
                  <span>{option.label}</span>
                  {isWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <X className="w-6 h-6 text-[hsl(var(--quiz-incorrect))]" />
                    </motion.div>
                  )}
                  {(showCorrectIndicator || isCorrectAndSelected) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring" }}
                    >
                      <Check className="w-6 h-6 text-[hsl(var(--quiz-correct))]" />
                    </motion.div>
                  )}
                </span>
              </motion.button>
            );
          })}
        </div>

        {showReveal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-[hsl(var(--quiz-correct))]/10 border border-[hsl(var(--quiz-correct))] rounded-lg relative z-10"
          >
            <p className="text-2xl md:text-3xl text-center font-bold text-[hsl(var(--quiz-correct))]">
              {story.revealText?.[lang]}
            </p>
          </motion.div>
        )}
      </div>
    );
  }

  // CTA Type
  if (story.type === "cta") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-4 text-center">
        {/* <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-[hsl(var(--text-subtitle))]"
        >
          {story.title?.[lang]}
        </motion.h1> */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[hsl(var(--text-subtitle))] mb-3 max-w-xl"
        >
          {story.title?.[lang]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-[hsl(var(--text-subtitle))] mb-6"
        >
          {story.value}
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          href="https://give.collective.my"
          target="_blank"
          rel="noopener noreferrer"
          className="px-12 py-2 bg-[hsl(var(--cta-button-bg))] text-[hsl(var(--cta-button-text))] text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 relative z-10"
        >
          {story.label?.[lang]}
        </motion.a>
      </div>
    );
  }

  return null;
};
