import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp } from "lucide-react";
import { CountingNumber } from "./ui/shadcn-io/counting-number";
import CircularProgress from "./ui/progress-09";
import { CollectiveLogo } from "./CollectiveLogo";
import { DonationCard } from "./ui/donation-card";
import { FAQSection } from "./FAQSection";

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
  const raised = 1269910;
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
    <div className="min-h-[200vh]">
      {/* Video Background */}
      <div className="relative w-full aspect-video h-screen overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        >
          <source src="https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/running-compressed.mp4" type="video/mp4" />
        </video>
        {/* Collective Logo */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
          <CollectiveLogo href="/" className="text-text-accent" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1
            className={`text-text-accent drop-shadow-lg text-center ${
              lang === "cn"
                ? "font-chinese-heading text-7xl md:text-[8rem]"
                : "font-gc text-9xl md:text-[14rem]"
            }`}
          >
            {lang === "en" ? "FUTURE" : "未来认献"}
          </h1>
        </div>
        {/* Give Button - Bottom of Video */}
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20">
          <button
            onClick={scrollToDonationCard}
            className={`px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? "Give Now" : "奉献"}
          </button>
        </div>
      </div>

      {/* Big Title*/}
      <section className="w-full bg-bg-page">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 justify-center px-6 md:px-12 py-16 md:py-24">
          <h1
            className={`text-5xl md:text-8xl leading-[1.1] text-text-accent tracking-wide text-left ${
              lang === "cn" ? "font-chinese-heading" : "font-gc uppercase"
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
              <>建堂。植堂。宣教。</>
            )}
          </h1>
          <p className="text-2xl md:text-2xl text-text-accent max-w-2xl">
            {lang === "en"
              ? "Next year, we pay off our building loan. Join us to cross the finish line and fuel what's next: more churches, more missions, more lives reached."
              : "明年，我们将还清建堂贷款。加入我们一起跨越终点线，为未来注入动力：建立更多教会、拓展更多宣教、触动更多生命。"}
          </p>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center gap-4 mx-auto w-full mt-2"
          >
            <div className="inline-flex w-full items-center justify-center gap-4">
              <CircularProgress
                value={displayPercentage}
                size={60}
                strokeWidth={6}
                showLabel
                labelClassName="text-sm font-bold text-text-accent"
                renderLabel={(progress) => `${progress.toFixed(0)}%`}
                progressClassName="stroke-text-accent"
                className="stroke-text-primary/25"
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-5xl md:text-7xl text-text-accent font-anton">
                  RM{" "}
                  <CountingNumber
                    number={displayRaised}
                    decimalPlaces={0}
                    useThousandsSeparator={true}
                    locale="en-MY"
                    className="text-text-accent tabular-nums"
                  />
                </h2>
                <p className="text-lg text-text-primary/60">
                  raised of RM 1,500,000
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <TrendingUp className="w-6 h-6 text-text-accent" />
              <p
                className={`text-sm text-text-primary/70 ${
                  lang === "cn" ? "font-chinese-body" : "font-bold"
                }`}
              >
                {lang === "en"
                  ? "117 people have just pledged"
                  : "已有117人认献"}
              </p>
            </div>
            <button
              onClick={scrollToDonationCard}
              className={`text-center px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 cursor-pointer ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en" ? "Give Now" : "立即奉献"}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Section 3: The Math */}
      <section className="w-full bg-bg-inverse">
        <div className="max-w-3xl mx-auto flex flex-col gap-8 justify-center px-6 md:px-12 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-start text-left gap-4"
          >
            <p className="text-3xl md:text-4xl text-left font-anton text-text-accent leading-[1.2]">
              300 people × RM 5,000 <br></br> = RM 1.5M
            </p>
            <p
              className={`text-base md:text-lg text-text-on-dark text-left ${
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
            <h1
              className={`leading-[1.1] text-text-accent tracking-wide text-left ${
                lang === "cn"
                  ? "font-chinese-heading text-4xl md:text-6xl"
                  : "font-gc uppercase text-4xl md:text-6xl"
              }`}
            >
              {lang === "en" ? (
                <>
                  Every gift counts. <br></br>Every giver matters.
                </>
              ) : (
                <>
                  每一份奉献都重要。<br></br>每一位奉献者都重要。
                </>
              )}
            </h1>
          </motion.div>

          <motion.div ref={effectiveRef}>
            <DonationCard />
          </motion.div>
        </div>
      </section>

      {/* Last Year Stats Section */}
      <section className="w-full bg-blue-950">
        <div className="max-w-3xl mx-auto space-y-8 px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-start text-left gap-4 py-8"
          >
            <h2 className="font-gc uppercase text-5xl md:text-6xl leading-[1.1] text-text-on-dark text-left">
              LAST YEAR, TOGETHER WE:
            </h2>
            <div className="flex flex-col gap-2 text-lg md:text-xl text-text-on-dark">
              <p className="font-bold text-3xl md:text-4xl">
                <span className="text-lg md:text-xl">raised</span> RM 1,082,842
              </p>
              <p className="font-bold text-3xl md:text-4xl">
                <span className="text-lg md:text-xl">reached</span> 20,000+
                lives
              </p>
              <p className="text-base md:text-lg text-text-on-dark">
                RM50 = 1 life impacted
              </p>
            </div>
            <p
              className={`text-lg md:text-xl text-text-on-dark mt-4 ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en"
                ? "This year, we continue the mission."
                : "今年，我们继续使命。"}
            </p>

            <button
              onClick={scrollToDonationCard}
              className={`px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en" ? "Give Now" : "奉献"}
            </button>
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
              className={`text-sm text-text-on-dark ${
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
              <ChevronDown className="w-8 h-8 text-text-accent" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
