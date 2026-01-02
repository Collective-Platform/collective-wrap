import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExpandableCard } from "@/components/ui/expandable-card";
import { HorizontalBarChart } from "@/components/cards/HorizontalBarChart";
import { WorldMapDemo } from "./test";
import { CountingNumber } from "../ui/shadcn-io/counting-number";

interface Language {
  en: string;
  cn: string;
}

// Hero Card
export const HeroCard: React.FC<{
  title: Language;
  subtitle?: Language;
  lang: "en" | "cn";
}> = ({ title, subtitle, lang }) => (
  <div className="py-12 text-left">
    <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent">
      {title[lang]}
    </h2>
    {subtitle && (
      <p className="text-2xl text-[hsl(var(--card-subtitle))]">
        {subtitle[lang]}
      </p>
    )}
  </div>
);

// Stat Card
export const StatCard: React.FC<{
  title?: Language;
  subtitle?: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, subtitle, content, lang }) => (
  <Card className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]">
    <CardHeader>
      {title && (
        <CardTitle className="text-2xl text-[hsl(var(--card-title))]">
          {title[lang]}
        </CardTitle>
      )}
      {subtitle && (
        <p className="text-sm text-[hsl(var(--card-subtitle))] mt-2">
          {subtitle[lang]}
        </p>
      )}
    </CardHeader>
    <CardContent>
      <p className="text-6xl font-bold bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent mb-2">
        <CountingNumber
          number={content.value}
          decimalSeparator=","
          transition={{ stiffness: 100, damping: 30 }}
        />
        {/* {content.value} */}
      </p>
      <p className="text-[hsl(var(--card-subtitle))]">{content.label[lang]}</p>
      {content.progress && (
        <div className="mt-4">
          <Progress value={content.progress} className="h-2" />
          <p className="text-sm text-[hsl(var(--card-subtitle))] mt-2">
            {content.progress}% Complete
          </p>
        </div>
      )}
      {content.description && (
        <p className="text-sm text-[hsl(var(--card-subtitle))] mt-4">
          {content.description[lang]}
        </p>
      )}
    </CardContent>
  </Card>
);

// Multi-Stat Card
export const MultiStatCard: React.FC<{
  content: any;
  lang: "en" | "cn";
}> = ({ content, lang }) => (
  <div className="grid grid-cols-1 gap-4">
    {content.stats.map((stat: any, index: number) => (
      <Card
        key={index}
        className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]"
      >
        <CardContent className="pt-6">
          <p className="text-5xl font-bold bg-linear-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-transparent mb-2">
            {stat.value}
          </p>
          <p className="text-[hsl(var(--card-subtitle))]">{stat.label[lang]}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Bar Chart Card (NEW)
export const BarChartCard: React.FC<{
  title?: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => {
  const chartData = content.bars.map((bar: any) => ({
    label: bar.label[lang],
    value: bar.value,
    percentage: bar.percentage,
  }));

  return (
    <Card className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]">
      {title && (
        <CardHeader>
          <CardTitle className="text-2xl text-[hsl(var(--card-title))]">
            {title[lang]}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <HorizontalBarChart data={chartData} />
      </CardContent>
    </Card>
  );
};

// World Map Card (NEW)
export const WorldMapCard: React.FC<{
  title?: Language;
  subtitle?: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, subtitle, content, lang }) => {
  return (
    <div className="space-y-4">
      {title && (
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[hsl(var(--card-title))] mb-2">
            {title[lang]}
          </h3>
          {subtitle && (
            <p className="text-lg text-[hsl(var(--card-subtitle))]">
              {subtitle[lang]}
            </p>
          )}
        </div>
      )}
      {/* <WorldMapDemo /> */}
    </div>
  );
};

// Quiz Card
export const QuizCard: React.FC<{
  title: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    if (value === content.correct) {
      setTimeout(() => setRevealed(true), 500);
    }
  };

  return (
    <Card className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]">
      <CardHeader>
        <CardTitle className="text-2xl text-[hsl(var(--card-title))]">
          {title[lang]}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3">
          {content.options.map((option: any, index: number) => (
            <button
              key={index}
              onClick={() => handleSelect(option.value)}
              className={`p-4 text-[hsl(var(--card-title))] rounded-lg border-2 transition-all ${
                selected === option.value
                  ? option.value === content.correct
                    ? "border-[hsl(var(--quiz-correct))] bg-[hsl(var(--quiz-correct))]/10"
                    : "border-[hsl(var(--quiz-incorrect))] bg-[hsl(var(--quiz-incorrect))]/10"
                  : "border-[hsl(var(--card-border))] hover:border-[hsl(var(--card-border-hover))]"
              }`}
            >
              <span className="text-lg">{option.label}</span>
            </button>
          ))}
        </div>
        {revealed && (
          <div className="mt-6 p-4 bg-[hsl(var(--quiz-correct))]/10 border border-[hsl(var(--quiz-correct))] rounded-lg">
            <p className="text-2xl font-bold text-[hsl(var(--quiz-correct))]">
              {content.reveal[lang]}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Expandable Story Card
export const ExpandableStoryCard: React.FC<{
  title: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => {
  const cards = [
    {
      title: title[lang],
      src: content.thumbnail,
      ctaText: lang === "en" ? "Read More" : "阅读更多",
      content: (
        <div>
          <p className="text-[hsl(var(--card-subtitle))] mb-4">
            {content.description[lang]}
          </p>
          <p className="text-[hsl(var(--card-title))] leading-relaxed">
            {content.fullStory[lang]}
          </p>
        </div>
      ),
    },
  ];

  return <ExpandableCard cards={cards} />;
};

// Expandable List Card (for mission trips)
export const ExpandableListCard: React.FC<{
  title: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => {
  const cards = content.items.map((item: any) => ({
    title: item.name[lang],
    src: item.image,
    ctaText: lang === "en" ? "Read More" : "阅读更多",
    content: (
      <p className="text-[hsl(var(--card-title))] leading-relaxed whitespace-pre-line">
        {item.description[lang]}
        {item.fullStory && (
          <>
            <br />
            <br />
            {item.fullStory[lang]}
          </>
        )}
      </p>
    ),
  }));

  return (
    <div>
      <h3 className="text-2xl font-bold text-[hsl(var(--card-title))] mb-4">
        {title[lang]}
      </h3>
      <ExpandableCard cards={cards} />
    </div>
  );
};

// List Card (simple version for non-expandable lists)
export const ListCard: React.FC<{
  title: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => (
  <Card className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]">
    <CardHeader>
      <CardTitle className="text-2xl text-[hsl(var(--card-title))]">
        {title[lang]}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {content.items.map((item: any, index: number) => (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-[hsl(var(--list-item-bg))] rounded-lg"
          >
            <span className="text-3xl">{item.icon}</span>
            <span className="text-[hsl(var(--card-title))]">
              {item.name[lang]}
            </span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// People Card
export const PeopleCard: React.FC<{
  title: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, content, lang }) => (
  <Card className="bg-linear-to-br from-[hsl(var(--card-bg-from))] to-[hsl(var(--card-bg-to))] border-[hsl(var(--card-border))]">
    <CardHeader>
      <CardTitle className="text-2xl text-[hsl(var(--card-title))]">
        {title[lang]}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
        {content.people.map((person: any, index: number) => (
          <div
            key={index}
            className="text-center p-4 bg-[hsl(var(--list-item-bg))] rounded-lg"
          >
            <div className="mb-2 w-25 aspect-square flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[hsl(var(--card-title))] font-medium">
              {person.name}
            </p>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// CTA Card
export const CTACard: React.FC<{
  title: Language;
  subtitle: Language;
  content: any;
  lang: "en" | "cn";
}> = ({ title, subtitle, content, lang }) => (
  <Card className="bg-linear-to-br from-[hsl(var(--cta-bg-from))] to-[hsl(var(--cta-bg-to))] border-[hsl(var(--cta-border))]">
    <CardHeader>
      <CardTitle className="text-3xl text-white">{title[lang]}</CardTitle>
      <p className="text-xl text-gray-300 mt-2">{subtitle[lang]}</p>
    </CardHeader>
    <CardContent>
      <p className="text-5xl font-bold text-white mb-6">{content.target}</p>
      <button className="w-full py-4 bg-[hsl(var(--cta-button-bg))] text-[hsl(var(--cta-button-text))] rounded-lg font-bold text-xl hover:opacity-90 transition-all">
        {content.cta[lang]}
      </button>
    </CardContent>
  </Card>
);
