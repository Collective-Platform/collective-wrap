interface Language {
  en: string;
  cn: string;
}

interface HeroCardProps {
  title: Language;
  subtitle?: Language;
  lang: "en" | "cn";
}

export default function HeroCard({ title, subtitle, lang }: HeroCardProps) {
  return (
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
}
