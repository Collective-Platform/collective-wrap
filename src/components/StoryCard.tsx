import type { Story } from "@/data/storyData";
import { motion } from "framer-motion";
import { CollectiveLogo } from "./CollectiveLogo";

interface StoryCardProps {
  story: Story;
  lang: "en" | "cn";
  onQuizInteraction?: (interacting: boolean) => void;
  onGiveClick?: () => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  lang,
  onGiveClick,
}) => {
  // Wrap Title Type
  if (story.type === "wrap-title") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-9xl md:text-9xl font-gc uppercase tracking-wide"
        >
          <span className="text-text-on-dark">2025</span>
          <br />
          <span className="text-text-on-dark">WRAP</span>
        </motion.h1>
        <CollectiveLogo
          href="/"
          className="absolute bottom-4 text-text-on-dark/70"
        />
      </div>
    );
  }

  // Hero Type
  if (story.type === "hero") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-8 text-center gap-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-xl md:text-2xl leading-7 font-bold text-center text-text-on-dark text-balance ${
            lang === "cn" ? "font-chinese-body" : ""
          }`}
          dangerouslySetInnerHTML={{ __html: story.title?.[lang] ?? "" }}
        />
        {story.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-text-on-dark text-balance ${
              lang === "cn" ? "font-chinese-body" : ""
            }`}
            dangerouslySetInnerHTML={{ __html: story.subtitle[lang] }}
          />
        )}
      </div>
    );
  }

  // Video Type
  if (story.type === "video" && story.videoSrc) {
    return (
      <div className="w-full h-dvh flex items-center justify-center bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="h-full max-h-dvh aspect-9/16 object-cover"
        >
          <source src={story.videoSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  // CTA Type
  if (story.type === "cta") {
    return (
      <div className="w-full h-dvh flex flex-col items-center justify-center px-4 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-xl text-text-on-dark mb-3 max-w-xl ${
            lang === "cn" ? "font-chinese-body" : ""
          }`}
        >
          {story.title?.[lang]}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-text-on-dark mb-6"
        >
          {story.value}
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={onGiveClick}
          className={`px-12 py-2 bg-btn-primary-bg text-btn-primary-text text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 relative z-10 cursor-pointer ${
            lang === "cn" ? "font-chinese-body" : ""
          }`}
        >
          {story.label?.[lang]}
        </motion.button>
      </div>
    );
  }

  return null;
};
