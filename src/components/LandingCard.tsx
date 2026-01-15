import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";
import { CountingNumber } from "./ui/shadcn-io/counting-number";
import CircularProgress from "./ui/progress-09";
import { DonationCard } from "./ui/donation-card";
import { CollectiveLogo } from "./CollectiveLogo";

interface LandingPageProps {
  lang: "en" | "cn";
  onScrollToWrap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onScrollToWrap,
}) => {
  const totalTarget = 1500000;
  const raised = 1002310;
  const percentage = (raised / totalTarget) * 100;
  const [displayRaised, setDisplayRaised] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);

  useEffect(() => {
    // Small delay before animation starts
    const timer = setTimeout(() => {
      const duration = 1.2; // 1.2 seconds animation (faster)
      const steps = 60; // 60 frames
      const stepDuration = (duration * 1000) / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        setDisplayRaised(Math.floor(raised * progress));
        setDisplayPercentage(percentage * progress);

        if (progress === 1) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, 300); // 300ms delay before animation

    return () => clearTimeout(timer);
  }, [raised, percentage]);

  return (
    <div className="flex flex-col min-h-[200vh] items-center bg-[hsl(var(--background))]">
      {/* Video Background */}
      <div className="relative w-full aspect-video h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-screen object-cover"
        >
          <source src="/video/running.mp4" type="video/mp4" />
        </video>
        {/* Collective Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <CollectiveLogo href="/" className="text-[hsl(var(--text-title))]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-sm text-center md:text-xl text-[hsl(var(--text-title))] font-bold">
            {lang === "en" ? (
              <>Plant new churches. Build God's house. Send missionaries.</>
            ) : (
              <h1>
                植堂建造。
                <br />
                差派宣教。
              </h1>
            )}
          </h1>
          <h1 className="text-9xl md:text-[14rem] font-anton text-[hsl(var(--text-title))] drop-shadow-lg">
            {lang === "en" ? "FUTURE" : "未来认献"}
          </h1>
        </div>
        {/* Give Button - Bottom of Video */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <a
            href="https://give.collective.my"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 bg-[hsl(var(--text-title))] text-white text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            {lang === "en" ? "Give" : "奉献"}
          </a>
        </div>
      </div>

      <div className="max-w-2xl w-full space-y-8  px-6 mt-22">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-0.5 space-y-4"
        >
          <h1 className="text-xl text-center md:text-2xl text-[hsl(var(--text-subtitle))] font-bold">
            {lang === "en" ? (
              <>Plant new churches. Build God's house. Send missionaries.</>
            ) : (
              <>
                植堂建造。
                <br />
                差派宣教。
              </>
            )}
          </h1>
          <div className="flex items-center justify-center gap-4">
            <div className="shrink-0">
              <CircularProgress
                value={displayPercentage}
                size={140}
                strokeWidth={8}
                showLabel
                labelClassName="text-xl font-bold text-[hsl(var(--text-subtitle))]"
                renderLabel={(progress) => `${progress.toFixed(0)}%`}
                progressClassName="stroke-[hsl(var(--text-title))]"
                className="stroke-[hsl(var(--text-subtitle))]/25"
              />
            </div>
            <div className="flex flex-col gap-2 min-w-fit">
              <h2 className="text-5xl text-[hsl(var(--text-subtitle))] md:text-6xl font-anton">
                RM{" "}
                <CountingNumber
                  number={displayRaised}
                  decimalPlaces={0}
                  useThousandsSeparator={true}
                  locale="en-MY"
                  className="text-[hsl(var(--text-subtitle))] tabular-nums"
                />
              </h2>
              <p className="text-[hsl(var(--text-subtitle))]/60">
                raised of RM1,500,000
              </p>
              <p className="text-sm text-center text-[hsl(var(--card-subtitle))]/60">
                *This funds are managed by the board of elders.
              </p>
            </div>
          </div>
        </motion.div>

        <DonationCard />

        {/* Give Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col justify-center"
        >
          <a
            href="https://give.collective.my"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-2 bg-[hsl(var(--text-title))] text-white text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105"
          >
            {lang === "en" ? "Give" : "奉献"}
          </a>
          <div className="flex items-center justify-center gap-2">
            <TrendingUp className="text-[hsl(var(--text-title))]" />
            <p className="text-[hsl(var(--card-subtitle))] mb-2 text-center">
              {lang === "en" ? "117 people have just pledged" : "已有117人认献"}
            </p>
          </div>
        </motion.div>
        {/* Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col items-center gap-4 pt-8 cursor-pointer"
          onClick={onScrollToWrap}
        >
          <p className="text-sm text-[hsl(var(--card-subtitle))]">
            {lang === "en"
              ? "Scroll to see what we've done in 2025"
              : "滚动查看我们在2025年所做的"}
          </p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-[hsl(var(--text-title))]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
