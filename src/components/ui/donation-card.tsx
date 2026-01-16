import * as React from "react";
import { cn } from "@/lib/utils";

interface DonationCardProps {
  presetAmounts?: number[];
  currency?: string;
  onAmountChange?: (amount: number | null) => void;
  className?: string;
}

const DonationCard = React.forwardRef<HTMLDivElement, DonationCardProps>(
  (
    {
      presetAmounts = [50000, 5000, 500, 50],
      currency = "RM",
      onAmountChange,
      className,
    },
    ref
  ) => {
    const [selectedPreset, setSelectedPreset] = React.useState<number | null>(
      null
    );
    const [customAmount, setCustomAmount] = React.useState<string>("");

    const handlePresetClick = (amount: number) => {
      setSelectedPreset(amount);
      setCustomAmount(amount.toString());
      onAmountChange?.(amount);
    };

    const handleCustomAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
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
        window.location.href = `https://give.collective.my/?future=${currentAmount}`;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-subtle/20 bg-bg-card text-text-on-dark p-8 space-y-3",
          className
        )}
      >
        <p className="text-xl font-bold text-text-on-dark text-center text-balance">
          I want to give to Future Funds
        </p>

        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePresetClick(amount)}
              className={cn(
                "px-4 py-4 rounded-md border border-border-subtle/20 text-sm transition-all font-bold",
                selectedPreset === amount
                  ? "bg-text-on-dark text-text-primary"
                  : "text-btn-secondary-text hover:bg-btn-secondary-hover"
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
              "flex-1 min-w-0 bg-transparent text-2xl font-light text-right",
              "placeholder:text-text-muted text-text-on-dark",
              "focus:outline-none"
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
              "text-center px-8 py-3 mt-6 bg-btn-primary-bg text-btn-primary-text text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 cursor-pointer",
              currentAmount !== null && currentAmount > 0
                ? "bg-text-on-dark text-text-primary hover:bg-text-on-dark/90"
                : "bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed"
            )}
          >
            Give Now
          </button>
        </div>

        <p className="text-center text-[12px] text-text-on-dark">
          This fund is overseen by the Board of Elders.
        </p>
      </div>
    );
  }
);

DonationCard.displayName = "DonationCard";

export { DonationCard };
