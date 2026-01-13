import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import { CountingNumber } from "./ui/shadcn-io/counting-number";

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

  return (
    <div className="flex flex-col items-center h-dvh bg-[hsl(var(--background))]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center flex w-full flex-col justify-center items-center aspect-video min-h-auto md:aspect-21/9 md:max-h-[40%] bg-[url(/public/missions/camp-sandakan.jpg)] bg-cover bg-center bg-no-repeat"
      >
        <h1 className="text-8xl font-anton text-[hsl(var(--text-title))]">
          {lang === "en" ? "FUTURE" : "未来认献 2026"}
        </h1>
      </motion.div>
      <div className="max-w-2xl w-full space-y-8  px-6 mt-22">
        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-0.5 space-y-4"
        >
          <h2 className="text-5xl text-[hsl(var(--text-subtitle))] md:text-7xl font-anton">
            RM {raised.toLocaleString("en-MY")}{" "}
            <span className="text-[hsl(var(--text-subtitle))]/60 text-3xl font-bold">
              raised
            </span>
          </h2>
          <Progress value={percentage} className="h-3" />
          {/* <span className="text-sm text-[hsl(var(--card-subtitle))]">
            {percentage.toFixed(2)}%
          </span> */}
          <p className="text-sm text-[hsl(var(--card-subtitle))] mb-2 text-center">
            {lang === "en"
              ? "Raising RM1,500,000 for church planting, building and missions."
              : "我们正在为植堂、建造和宣教筹集资金"}
          </p>
        </motion.div>

        {/* Give Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex justify-center"
        >
          <a
            href="https://give.collective.my"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-2 bg-[hsl(var(--text-title))] text-white text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105"
          >
            {lang === "en" ? "Give" : "奉献"}
          </a>
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
