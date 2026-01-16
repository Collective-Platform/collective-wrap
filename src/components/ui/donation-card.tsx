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
      setCustomAmount("");
      onAmountChange?.(amount);
    };

    const handleCustomAmountChange = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const value = e.target.value;
      setCustomAmount(value);
      setSelectedPreset(null);

      const numValue = parseFloat(value);
      onAmountChange?.(isNaN(numValue) ? null : numValue);
    };

    const currentAmount = selectedPreset ?? (parseFloat(customAmount) || null);

    const formatAmount = (amount: number) => {
      return amount.toLocaleString("en-MY");
    };

    const handleGiveClick = () => {
      if (currentAmount !== null && currentAmount > 0) {
        window.location.href = `https://give.collective.my/?future=${currentAmount}`;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border border-border-subtle/20 bg-bg-card text-text-on-dark p-8 space-y-6",
          className
        )}
      >
        <div className="space-y-1">
          <p className="text-2xl text-text-on-dark font-gc tracking-wide text-center uppercase">
            Future
          </p>
        </div>

        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePresetClick(amount)}
              className={cn(
                "px-4 py-3 rounded-sm border border-border-subtle/20 text-sm tracking-wide transition-all",
                selectedPreset === amount
                  ? "bg-text-on-dark text-text-primary"
                  : "bg-btn-secondary-bg text-btn-secondary-text hover:bg-btn-secondary-hover"
              )}
            >
              RM {formatAmount(amount)}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">{currency}</span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className={cn(
              "flex-1 bg-transparent border-b border-btn-secondary-hover py-2 text-2xl font-light",
              "placeholder:text-text-muted text-text-on-dark",
              "focus:outline-none focus:border-text-on-dark transition-colors",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
        </div>

        {/* Total Amount Display */}
        <div className="pt-4 border-t border-btn-secondary-bg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text-muted capitalize">
              total amount
            </span>
            <span className="text-xl tracking-wide">
              {currency}{" "}
              {currentAmount !== null ? formatAmount(currentAmount) : "0.00"}
            </span>
          </div>
        </div>

        {/* Give Button */}
        <button
          type="button"
          onClick={handleGiveClick}
          disabled={currentAmount === null || currentAmount <= 0}
          className={cn(
            "text-center px-8 py-3 bg-btn-primary-bg text-btn-primary-text text-xl font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 cursor-pointer",
            currentAmount !== null && currentAmount > 0
              ? "bg-text-on-dark text-text-primary hover:bg-text-on-dark/90"
              : "bg-btn-disabled-bg text-btn-disabled-text cursor-not-allowed"
          )}
        >
          Give Now
        </button>

        <p className="text-center text-[12px] text-text-on-dark">
          This fund is overseen by the Board of Elders.
        </p>
      </div>
    );
  }
);

DonationCard.displayName = "DonationCard";

export { DonationCard };
