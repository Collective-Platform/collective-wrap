import React, { useState } from "react";
import { Globe } from "lucide-react";
import { wrapData } from "@/data/wrapData";
import { Timeline } from "@/components/ui/timeline";
import {
  HeroCard,
  StatCard,
  MultiStatCard,
  BarChartCard,
  WorldMapCard,
  QuizCard,
  ExpandableStoryCard,
  ExpandableListCard,
  ListCard,
  PeopleCard,
  CTACard,
} from "@/components/cards/CardComponents";
import { BackgroundGradientAnimation } from "./ui/background-gradient-animation";

const translations = {
  en: {
    scrollToExplore: "Scroll to explore",
    chapter: "Chapter",
  },
  cn: {
    scrollToExplore: "滚动探索",
    chapter: "章节",
  },
};

const ChurchWrap = () => {
  const [language, setLanguage] = useState<"en" | "cn">("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "cn" : "en"));
  };

  const renderCard = (card: any) => {
    switch (card.type) {
      case "hero":
        return (
          <HeroCard
            title={card.title}
            subtitle={card.subtitle}
            lang={language}
          />
        );
      case "stat":
        return (
          <StatCard
            title={card.title}
            subtitle={card.subtitle}
            content={card.content}
            lang={language}
          />
        );
      case "multistat":
        return <MultiStatCard content={card.content} lang={language} />;
      case "barchart":
        return (
          <BarChartCard
            title={card.title}
            content={card.content}
            lang={language}
          />
        );
      case "worldmap":
        return (
          <WorldMapCard
            title={card.title}
            subtitle={card.subtitle}
            content={card.content}
            lang={language}
          />
        );
      case "quiz":
        return (
          <QuizCard title={card.title} content={card.content} lang={language} />
        );
      case "expandable-story":
        return (
          <ExpandableStoryCard
            title={card.title}
            content={card.content}
            lang={language}
          />
        );
      case "expandable-list":
        return (
          <ExpandableListCard
            title={card.title}
            content={card.content}
            lang={language}
          />
        );
      case "list":
        return (
          <ListCard title={card.title} content={card.content} lang={language} />
        );
      case "people":
        return (
          <PeopleCard
            title={card.title}
            content={card.content}
            lang={language}
          />
        );
      case "cta":
        return (
          <CTACard
            title={card.title}
            subtitle={card.subtitle}
            content={card.content}
            lang={language}
          />
        );
      default:
        return null;
    }
  };

  // Prepare timeline data
  const timelineData = wrapData.chapters.map((chapter, index) => ({
    title: index === 0 ? "2025" : chapter.title[language],
    content: (
      <div className="space-y-6">
        {chapter.cards.map((card) => (
          <div key={card.id}>{renderCard(card)}</div>
        ))}
      </div>
    ),
  }));

  return (
    <div className="relative w-screen min-h-screen bg-black text-white">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 z-50 flex items-center gap-2 bg-[hsl(var(--card-bg-from))] hover:bg-[hsl(var(--card-bg-to))] px-4 py-2 rounded-full transition-all duration-300 border border-[hsl(var(--card-border))]"
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{language.toUpperCase()}</span>
      </button>

      {/* Hero Section */}
      <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-7xl font-bold mb-4 bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
          2025
        </h1>
        <p className="text-4xl text-[hsl(var(--card-title))] mb-2">
          {language === "en" ? "Year in Review" : "年度回顾"}
        </p>
        <div className="animate-bounce mt-12">
          <div className="w-8 h-12 border-2 border-[hsl(var(--card-border))] rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-linear-to-b from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] rounded-full animate-pulse"></div>
          </div>
        </div>
        <p className="text-sm text-[hsl(var(--card-subtitle))] mt-4">
          {translations[language].scrollToExplore}
        </p>
      </div>

      {/* Timeline Content */}
      <div className="px-4 md:px-8 lg:px-16">
        <Timeline data={timelineData} />
      </div>

      {/* Final Section */}
      <div className="h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
          {language === "en" ? "Thank You" : "谢谢"}
        </h2>
        <p className="text-[hsl(var(--card-subtitle))] max-w-md text-xl">
          {language === "en"
            ? "God is doing amazing things through our community"
            : "上帝在我们的社区中成就奇妙的事"}
        </p>
      </div>
    </div>
  );
};

export default ChurchWrap;
