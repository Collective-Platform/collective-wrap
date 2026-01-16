import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";
import { CountingNumber } from "./ui/shadcn-io/counting-number";
import CircularProgress from "./ui/progress-09";
import { CollectiveLogo } from "./CollectiveLogo";
import { DonationCard } from "./ui/donation-card";
import { FAQSection } from "./FAQSection";
import MuxPlayer from "@mux/mux-player-react";

interface LandingPageProps {
  lang: "en" | "cn";
  onScrollToWrap: () => void;
  donationCardRef?: React.RefObject<HTMLDivElement | null>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onScrollToWrap,
  donationCardRef,
}) => {
  const localDonationCardRef = useRef<HTMLDivElement>(null);
  const effectiveRef = donationCardRef || localDonationCardRef;
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

  const scrollToDonationCard = () => {
    effectiveRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="flex flex-col min-h-[200vh] items-center bg-[hsl(var(--background))]">
      {/* Video Background */}
      <div className="relative w-full aspect-video h-screen overflow-hidden">
        <MuxPlayer
          playbackId="b5RcNqdRxMubPN8yKS1znYYFKM8dV6q9OEGEw1aAdWs"
          autoPlay="muted"
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full pointer-events-none [&::part(video)]:object-cover"
          style={{
            "--controls": "none",
            "--media-object-fit": "cover",
            "--media-object-position": "center",
          }}
          streamType="on-demand"
        />
        {/* Collective Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <CollectiveLogo href="/" className="text-[hsl(var(--text-title))]" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1
            className={`text-9xl md:text-[14rem] text-[hsl(var(--text-title))] drop-shadow-lg text-center ${
              lang === "cn" ? "font-chinese-heading" : "font-gc"
            }`}
          >
            {lang === "en" ? "FUTURE" : "未来认献"}
          </h1>
        </div>
        {/* Give Button - Bottom of Video */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={scrollToDonationCard}
            className={`px-8 py-3 bg-[hsl(var(--text-title))] text-white text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? "Give Now" : "奉献"}
          </button>
        </div>
      </div>

      {/* Big Title*/}
      <section className="w-full max-w-5xl mx-auto flex flex-col justify-center px-6 md:px-12 py-16 md:py-24">
        <h1
          className={`text-6xl md:text-8xl lg:text-9xl  text-[hsl(var(--text-title))] tracking-wide text-left capitalize ${
            lang === "cn" ? "font-chinese-heading" : "font-gc"
          }`}
        >
          {lang === "en" ? (
            <>
              Building.
              <br />
              Church Planting.
              <br />
              Missions.
            </>
          ) : (
            <>
              建堂。
              <br />
              植堂。
              <br />
              宣教。
            </>
          )}
        </h1>
        <p className="text-base md:text-lg text-[hsl(var(--text-subtitle))] max-w-2xl">
          {lang === "en"
            ? "Next year, we pay off our building loan. Join us to cross the finish line and fuel what's next: more churches, more missions, more lives reached."
            : "明年，我们将还清建堂贷款。加入我们一起跨越终点线，为未来注入动力：建立更多教会、拓展更多宣教、触动更多生命。"}
        </p>
      </section>

      <div className="md:max-w-2xl w-full space-y-8 px-6 py-12 bg-cyan-200">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center justify-center">
            <CircularProgress
              value={displayPercentage}
              size={100}
              strokeWidth={12}
              showLabel
              labelClassName="text-xl font-bold text-[hsl(var(--text-subtitle))]"
              renderLabel={(progress) => `${progress.toFixed(0)}%`}
              progressClassName="stroke-[hsl(var(--text-title))]"
              className="stroke-[hsl(var(--text-subtitle))]/25"
            />

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
              <p className="text-xl text-[hsl(var(--text-subtitle))]/60">
                raised of RM 1,500,000
              </p>
            </div>
          </div>
          <div className="flex items-left justify-center gap-2">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--text-title))]" />
            <p
              className={`text-sm text-[hsl(var(--card-subtitle))]/70 ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en" ? "117 people have just pledged" : "已有117人认献"}
            </p>
          </div>
          <button
            onClick={scrollToDonationCard}
            className={`w-full text-center px-8 py-3 bg-[hsl(var(--text-title))] text-white text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 cursor-pointer ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? "Give Now" : "立即奉献"}
          </button>
        </motion.div>

        {/* Section 3: The Math */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col items-center text-center gap-4"
        >
          <p className="text-4xl md:text-5xl font-anton text-[hsl(var(--text-title))]">
            300 × RM 5,000 = RM 1.5M
          </p>
          <p
            className={`text-base md:text-lg text-[hsl(var(--text-subtitle))] ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? (
              <>
                Some give RM 500. Some give RM 50,000.
                <br />
                Together, we average RM 5,000 per person.
                <br />
                That's how 300 people reach RM 1.5 million.
              </>
            ) : (
              <>
                有人奉献 RM 500，有人奉献 RM 50,000。
                <br />
                我们平均每人 RM 5,000。
                <br />
                这就是 300 人如何达到 RM 150 万。
              </>
            )}
          </p>
          <h2
            className={`text-2xl md:text-3xl font-gc text-[hsl(var(--text-title))] mt-4 ${
              lang === "cn" ? "font-chinese-heading" : ""
            }`}
          >
            {lang === "en"
              ? "Every gift counts. Every giver matters."
              : "每一份奉献都重要。每一位奉献者都重要。"}
          </h2>
        </motion.div>

        <motion.div ref={effectiveRef}>
          <DonationCard />
        </motion.div>

        {/* Last Year Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center text-center gap-4 py-8"
        >
          <h2 className="text-2xl md:text-3xl font-gc text-[hsl(var(--text-title))] tracking-wide">
            LAST YEAR, TOGETHER WE:
          </h2>
          <div className="w-48 h-[2px] bg-[hsl(var(--text-title))]" />
          <div className="flex flex-col gap-2 text-lg md:text-xl text-[hsl(var(--text-subtitle))]">
            <p className="font-anton text-3xl md:text-4xl text-[hsl(var(--text-title))]">
              RM 1,082,842 raised
            </p>
            <p className="font-anton text-3xl md:text-4xl text-[hsl(var(--text-title))]">
              20,000+ lives reached
            </p>
            <p className="text-base md:text-lg text-[hsl(var(--text-subtitle))]">
              RM50 = 1 life impacted
            </p>
          </div>
          <p
            className={`text-lg md:text-xl text-[hsl(var(--text-subtitle))] mt-4 ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en"
              ? "This year, we continue the mission."
              : "今年，我们继续使命。"}
          </p>
        </motion.div>

        {/* FAQ Section */}
        <FAQSection lang={lang} />

        {/* Scroll Prompt */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col items-center gap-4 pt-8 cursor-pointer"
          onClick={onScrollToWrap}
        >
          <p
            className={`text-sm text-[hsl(var(--card-subtitle))] ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
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
