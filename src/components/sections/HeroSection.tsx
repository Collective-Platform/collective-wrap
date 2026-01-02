// sections/WelcomeSection.tsx
import { Chapter } from "@/data/wrapData";
import HeroCard from "../cards/HeroCard";

export function WelcomeSection({
  chapter,
  lang,
}: {
  chapter: Chapter;
  lang: "en" | "cn";
}) {
  const heroCards = chapter.cards.filter((c) => c.type === "hero");

  return (
    <>
      {heroCards.map((card) => (
        <HeroCard
          key={card.id}
          title={card.title!}
          subtitle={card.subtitle}
          lang={lang}
        />
      ))}
    </>
  );
}
