import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";

interface LandingPageProps {
  lang: "en" | "cn";
  onScrollToWrap: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  lang,
  onScrollToWrap,
}) => {
  const totalTarget = 1500000;
  const raised = 1455244.5;
  const percentage = (raised / totalTarget) * 100;

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center px-6 bg-black text-white">
      <div className="max-w-2xl w-full space-y-8">
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-[hsl(var(--card-title))] leading-tight">
            {lang === "en"
              ? "We're raising funds for church planting, building and mission"
              : "我们正在为植堂、建造和宣教筹集资金"}
          </h1>
        </motion.div>

        {/* Amount Raised */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <p className="text-sm text-[hsl(var(--card-subtitle))] mb-2">
            {lang === "en" ? "Raised so far" : "目前筹集"}
          </p>
          <h2 className="text-6xl md:text-7xl font-bold bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
            RM{" "}
            {raised.toLocaleString("en-MY", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
          <p className="text-sm text-[hsl(var(--card-subtitle))] mt-2">
            {lang === "en"
              ? `of RM ${totalTarget.toLocaleString("en-MY")} goal`
              : `目标 RM ${totalTarget.toLocaleString("en-MY")}`}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full"
        >
          <Progress value={percentage} className="h-3" />
          <p className="text-center text-sm text-[hsl(var(--card-subtitle))] mt-2">
            {percentage.toFixed(1)}%{" "}
            {lang === "en" ? "of goal reached" : "已达成目标"}
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
            className="px-12 py-4 bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] text-white text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105"
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
            <ChevronDown className="w-8 h-8 text-[hsl(var(--card-subtitle))]" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
