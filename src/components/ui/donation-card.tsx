import * as React from "react";

import { cn } from "@/lib/utils";
import { track } from "@vercel/analytics/react";

interface DonationCardProps {
  presetAmounts?: number[];
  currency?: string;
  onAmountChange?: (amount: number | null) => void;
  className?: string;
  lang?: "en" | "cn";
}

const DonationCard = React.forwardRef<HTMLDivElement, DonationCardProps>(
  (
    {
      presetAmounts = [20000, 10000, 5000, 500],
      currency = "RM",
      onAmountChange,
      className,
      lang = "en",
    },
    ref,
  ) => {
    const [selectedPreset, setSelectedPreset] = React.useState<number | null>(
      null,
    );
    const [customAmount, setCustomAmount] = React.useState<string>("");

    const handlePresetClick = (amount: number) => {
      setSelectedPreset(amount);
      setCustomAmount(amount.toString());
      onAmountChange?.(amount);
    };

    const handleCustomAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const rawValue = e.target.value.replace(/,/g, "");
      if (rawValue === "" || /^\d*$/.test(rawValue)) {
        setCustomAmount(rawValue);
        setSelectedPreset(null);
        const numValue = parseInt(rawValue, 10);
        onAmountChange?.(isNaN(numValue) ? null : numValue);
      }
    };

    const currentAmount =
      selectedPreset ?? (parseInt(customAmount, 10) || null);

    const formatAmount = (amount: number) => {
      return amount.toLocaleString("en-MY");
    };

    const formattedCustomAmount = customAmount
      ? parseInt(customAmount, 10).toLocaleString("en-MY")
      : "";

    const handleGiveClick = () => {
      if (currentAmount !== null && currentAmount > 0) {
        track("Donation Give Now Clicked", { amount: currentAmount, lang });
        window.location.href = `https://give.collective.my/?future=${currentAmount}`;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-subtle/20 bg-bg-card text-text-on-dark p-8 space-y-3",
          className,
        )}
      >
        <p
          className={cn(
            "text-lg md:text-2xl text-text-on-dark tracking-wide  font-normal text-center text-balance",
            lang === "cn" && "font-chinese-body",
          )}
        >
          {lang === "en" ? "I would love to give" : "我想奉献"}
        </p>

        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePresetClick(amount)}
              className={cn(
                "px-4 py-4 rounded-md border border-border-subtle/20 text-sm transition-all",
                selectedPreset === amount
                  ? "bg-text-on-dark text-text-primary"
                  : "text-btn-secondary-text hover:bg-btn-secondary-hover",
              )}
            >
              RM {formatAmount(amount)}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center gap-3 border border-border-subtle/20 rounded-md px-4 py-3">
          <span className="text-sm text-text-muted">{currency}</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0"
            value={formattedCustomAmount}
            onChange={handleCustomAmountChange}
            className={cn(
              "flex-1 min-w-0 bg-transparent text-sm font-light text-right",
              "placeholder:text-text-muted text-text-on-dark",
              "focus:outline-none",
            )}
          />
        </div>

        {/* Give Button */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGiveClick}
            disabled={currentAmount === null || currentAmount <= 0}
            className={cn(
              "px-8 py-3 mt-6 bg-btn-primary-bg text-btn-primary-text text-lg font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 shadow-lg cursor-pointer",
              currentAmount !== null && currentAmount > 0
                ? "bg-text-accent text-text-on-dark hover:bg-text-accent/90"
                : "bg-text-accent/60 text-text-on-dark/60 cursor-not-allowed",
              lang === "cn" && "font-chinese-body",
            )}
          >
            {lang === "en" ? "Give Now" : "立即奉献"}
          </button>
        </div>

        <p
          className={cn(
            "text-center text-[12px] md:text-base text-text-on-dark/80 mt-6",
            lang === "cn" && "font-chinese-body",
          )}
        >
          {lang === "en"
            ? "This fund is overseen by the Board of Elders."
            : "此基金由长老会监督。"}
        </p>

        <div className="mt-8 pt-6 border-t border-border-subtle/10">
          <p
            className={cn(
              "text-xs md:text-sm text-text-on-dark/60 tracking-wide text-center font-bold",
              lang === "cn" && "font-chinese-body",
            )}
          >
            {lang === "en" ? "Giving more than RM20,000?" : "奉献超过RM20,000?"}
          </p>

          <p
            className={cn(
              "text-center text-[10px] md:text-xs text-text-on-dark/50 whitespace-pre-line leading-relaxed",
              lang === "cn" && "font-chinese-body",
            )}
          >
            {lang === "en"
              ? `For larger contributions, please transfer directly to:`
              : "此基金由长老会监督。"}
          </p>

          <p
            className={cn(
              "text-center text-[10px] md:text-xs text-text-on-dark/50 mt-3 whitespace-pre-line leading-relaxed",
              lang === "cn" && "font-chinese-body",
            )}
          >
            {lang === "en"
              ? `Bank Name: Public Bank\nAccount Name: Collective\nAccount No: 3128732036`
              : "Bank: Public Bank\nAccount Name: Collective\nAccount No: 3128732036"}
          </p>
        </div>
      </div>
    );
  },
);

DonationCard.displayName = "DonationCard";

export { DonationCard };
