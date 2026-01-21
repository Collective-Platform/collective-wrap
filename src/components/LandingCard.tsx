import React, { useEffect, useState, useRef } from "react";
import { track } from "@vercel/analytics/react";
import { motion } from "framer-motion";
import { ChevronDown, TrendingUp, User } from "lucide-react";
import { CountingNumber } from "./ui/shadcn-io/counting-number";
import CircularProgress from "./ui/progress-09";
import { CollectiveLogo } from "./CollectiveLogo";
import { DonationCard } from "./ui/donation-card";
import { FAQSection } from "./FAQSection";

interface LandingPageProps {
  lang: "en" | "cn";
  onScrollToWrap: () => void;
  donationCardRef?: React.RefObject<HTMLDivElement | null>;
  scrollTriggerRef?: React.RefObject<HTMLDivElement | null>;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onScrollToWrap,
  donationCardRef,
  scrollTriggerRef,
}) => {
  const localDonationCardRef = useRef<HTMLDivElement>(null);
  const effectiveRef = donationCardRef || localDonationCardRef;
  const videoRef = useRef<HTMLVideoElement>(null);
  const totalTarget = 1500000;
  const [displayRaised, setDisplayRaised] = useState(0);
  const [displayPercentage, setDisplayPercentage] = useState(0);
  const [isMd, setIsMd] = useState(false);

  const [stats, setStats] = useState({
    totalRaised: 0,
    contributorCount: 0,
  });

  const raised = stats.totalRaised / 100;
  const percentage = (raised / totalTarget) * 100;

  useEffect(() => {
    fetch("https://give.collective.my/api/stats/future")
      .then((res) => res.json())
      .then((data) =>
        setStats({
          totalRaised: Number(data.totalRaised) || 0,
          contributorCount: data.contributorCount || 0,
        }),
      );
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsMd(window.innerWidth >= 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    video.play().catch(() => {
      const events = ["click", "touchstart", "keydown", "scroll"];
      const handleInteraction = () => {
        tryPlay();
        events.forEach((e) =>
          document.removeEventListener(e, handleInteraction),
        );
      };
      events.forEach((e) =>
        document.addEventListener(e, handleInteraction, {
          once: false,
          passive: true,
        }),
      );
    });
  }, []);

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
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          src="https://mqyxc4xvodvuodmx.public.blob.vercel-storage.com/running-compressed.mp4"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
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
            onClick={() => {
              track("Hero Give Now Clicked", { lang });
              scrollToDonationCard();
            }}
            className={`px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? "Give Now" : "立即奉献"}
          </button>
        </div>
      </div>

      {/* Section: Big Title */}
      <section className="w-full bg-bg-page">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 justify-center px-6 md:px-12 py-16 md:py-24">
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
          <p
            className={`text-lg md:text-2xl text-text-primary max-w-2xl ${
              lang === "cn" ? "font-chinese-body tracking-widest" : ""
            }`}
          >
            {lang === "en"
              ? "Next year, we pay off our building loan. Join us to cross the finish line and fuel what's next: more churches, more missions, more lives reached."
              : "明年，我们将还清建筑的贷款。诚邀你与我们共同跨过终点，助力未来：建立更多教会、拓展更多宣教、接触更多生命。"}
          </p>
        </div>
      </section>

      {/* Section: Progress Bar */}
      <section className="w-full bg-bg-page">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 justify-center items-center px-6 md:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center items-center gap-4 mx-auto w-full"
          >
            <CircularProgress
              value={displayPercentage}
              size={isMd ? 150 : 100}
              strokeWidth={isMd ? 14 : 10}
              showLabel
              labelClassName="text-xl md:text-4xl font-bold text-text-accent"
              renderLabel={(progress) => `${progress.toFixed(0)}%`}
              progressClassName="stroke-text-accent"
              className="stroke-text-primary/25"
            />
            <div className="flex w-full items-center justify-center text-center gap-4 mt-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-5xl md:text-8xl text-text-accent font-anton">
                  RM{" "}
                  <CountingNumber
                    number={displayRaised}
                    decimalPlaces={0}
                    useThousandsSeparator={true}
                    locale="en-MY"
                    className="text-text-accent tabular-nums"
                  />
                </h2>
                <p className="text-sm text-text-primary/60 mt-1">
                  {lang === "en"
                    ? "raised of RM 1,500,000"
                    : "已筹 RM 1,500,000"}
                </p>
              </div>
            </div>
          </motion.div>

          {stats.contributorCount > 0 && (
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-text-accent" />
              <p
                className={`text-lg md:text-2xl text-text-primary ${
                  lang === "cn" ? "font-chinese-body" : ""
                }`}
              >
                {lang === "en"
                  ? `${stats.contributorCount} people have contributed`
                  : `已有 ${stats.contributorCount} 人认献`}
              </p>
            </div>
          )}

          <button
            onClick={scrollToDonationCard}
            className={`text-center px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
          >
            {lang === "en" ? "Give Now" : "立即奉献"}
          </button>
        </div>
      </section>

      {/* Section: Last Year Stats */}
      <section className="w-full bg-bg-page">
        <div className="max-w-3xl mx-auto flex flex-col gap-6 justify-center items-center px-6 md:px-12 py-16 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <p
              className={`text-lg md:text-2xl text-text-primary text-center ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en" ? "Last year, together we:" : "去年，我们共同："}
            </p>
            <div className="flex flex-col text-lg text-center md:text-xl text-text-accent">
              <p
                className={`text-sm md:text-base text-text-primary mt-4 ${
                  lang === "cn" ? "font-chinese-body" : ""
                }`}
              >
                {lang === "en" ? "raised" : "筹募了"}
              </p>
              <h4 className="font-anton text-text-primary/80 text-5xl md:text-7xl mt-1">
                RM{" "}
                <CountingNumber
                  number={1082842}
                  decimalPlaces={0}
                  useThousandsSeparator={true}
                  locale="en-MY"
                  className="tabular-nums"
                />
              </h4>

              <p
                className={`text-sm md:text-base text-text-primary mt-9 ${
                  lang === "cn" ? "font-chinese-body" : ""
                }`}
              >
                {lang === "en" ? "and reached" : "和接触了"}
              </p>
              <h4 className="font-anton text-text-primary/80 text-5xl md:text-7xl mt-1">
                <CountingNumber
                  number={20000}
                  decimalPlaces={0}
                  useThousandsSeparator={true}
                  locale="en-MY"
                  className="tabular-nums"
                />
                +
              </h4>
              <p
                className={`text-sm md:text-base text-text-primary mt-1 ${
                  lang === "cn" ? "font-chinese-body" : ""
                }`}
              >
                {lang === "en" ? "lives." : "生命。"}
              </p>

              {/* <div className="flex items-center justify-center gap-2 mt-8">
                <span className="text-5xl md:text-7xl text-text-accent font-anton">
                  RM 50 = 1 <span className="text-4xl align-middle">x</span>
                </span>
                <User className="w-14 h-14 md:w-14 md:h-14 text-text-accent fill-text-accent" />
              </div> */}
              {/* <p
                className={`text-sm text-text-primary/80 mt-1 ${
                  lang === "cn" ? "font-chinese-body" : ""
                }`}
              >
                {lang === "en" ? "life impacted" : "生命被影响"}
              </p> */}
            </div>
            <p
              className={`text-lg md:text-2xl text-text-primary mt-4 ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en"
                ? "This year, we continue the mission."
                : "今年，让我们延续这使命。"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 3: Donation Card */}
      <section className="w-full bg-bg-inverse">
        <div className="max-w-3xl mx-auto flex flex-col gap-20 justify-center px-6 md:px-12 py-16 md:py-24">
          <motion.div ref={effectiveRef}>
            <DonationCard lang={lang} />
          </motion.div>

          {/* FAQ Section */}
          <FAQSection lang={lang} />

          {/* Scroll Prompt */}
          <motion.div
            ref={scrollTriggerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col items-center gap-4 pt-8 cursor-pointer"
            onClick={onScrollToWrap}
          >
            <p
              className={`text-lg text-text-on-dark font-bold ${
                lang === "cn" ? "font-chinese-body" : ""
              }`}
            >
              {lang === "en"
                ? "Scroll to see what we've done in 2025"
                : "往下滑，看看2025年我们都做了什么"}
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
