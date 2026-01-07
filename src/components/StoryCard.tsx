import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Story } from "@/data/storyData";

interface StoryCardProps {
  story: Story;
  lang: "en" | "cn";
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, lang }) => {
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [showReveal, setShowReveal] = useState(false);

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswer(answer);
    if (answer === story.correctAnswer) {
      setTimeout(() => setShowReveal(true), 500);
    } else {
      // Show correct answer after wrong selection
      setTimeout(() => setShowReveal(true), 1000);
    }
  };

  // Hero Type
  if (story.type === "hero") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-bold mb-6 bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent"
        >
          {story.title?.[lang]}
        </motion.h1>
        {story.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-[hsl(var(--card-subtitle))]"
          >
            {story.subtitle[lang]}
          </motion.p>
        )}
      </div>
    );
  }

  // Stat Type
  if (story.type === "stat") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-8 text-center">
        {story.title && (
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-bold mb-4 text-[hsl(var(--card-title))]"
          >
            {story.title[lang]}
          </motion.h2>
        )}
        {story.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[hsl(var(--card-subtitle))] mb-8"
          >
            {story.subtitle[lang]}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mb-6"
        >
          <p className="text-8xl md:text-9xl font-bold bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
            {story.value}
          </p>
        </motion.div>
        {story.label && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl text-[hsl(var(--card-subtitle))]"
          >
            {story.label[lang]}
          </motion.p>
        )}
        {story.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-[hsl(var(--card-subtitle))] mt-4 max-w-lg"
          >
            {story.description[lang]}
          </motion.p>
        )}
      </div>
    );
  }

  // Quiz Type
  if (story.type === "quiz") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-bold mb-8 text-center text-[hsl(var(--card-title))]"
        >
          {story.title?.[lang]}
        </motion.h2>

        <div className="w-full max-w-md space-y-4">
          {story.quizOptions?.map((option, index) => {
            const isSelected = quizAnswer === option.value;
            const isCorrect = option.value === story.correctAnswer;
            const isWrong = isSelected && !isCorrect;
            const showCorrectIndicator = showReveal && isCorrect;

            return (
              <motion.button
                key={option.value}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => !quizAnswer && handleQuizAnswer(option.value)}
                disabled={!!quizAnswer}
                className={`w-full p-4 rounded-lg border-2 text-lg transition-all relative ${
                  isWrong
                    ? "border-[hsl(var(--quiz-incorrect))] bg-[hsl(var(--quiz-incorrect))]/10"
                    : showCorrectIndicator
                    ? "border-[hsl(var(--quiz-correct))] bg-[hsl(var(--quiz-correct))]/10"
                    : "border-[hsl(var(--card-border))] hover:border-[hsl(var(--card-border-hover))]"
                } ${
                  quizAnswer && !isSelected && !showCorrectIndicator
                    ? "opacity-50"
                    : ""
                }`}
              >
                <span className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {isWrong && (
                    <X className="w-6 h-6 text-[hsl(var(--quiz-incorrect))]" />
                  )}
                  {showCorrectIndicator && (
                    <Check className="w-6 h-6 text-[hsl(var(--quiz-correct))]" />
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
            className="mt-8 p-6 bg-[hsl(var(--quiz-correct))]/10 border border-[hsl(var(--quiz-correct))] rounded-lg"
          >
            <p className="text-3xl font-bold text-[hsl(var(--quiz-correct))]">
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
      <div className="w-full h-full flex flex-col items-center justify-center px-8 text-center bg-linear-to-br from-[hsl(var(--cta-bg-from))] to-[hsl(var(--cta-bg-to))]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold mb-4 text-white"
        >
          {story.title?.[lang]}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-300 mb-8 max-w-xl"
        >
          {story.subtitle?.[lang]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold text-white mb-12"
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
          className="px-12 py-4 bg-white text-[hsl(var(--cta-button-text))] text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105"
        >
          {story.label?.[lang]}
        </motion.a>
      </div>
    );
  }

  return null;
};
