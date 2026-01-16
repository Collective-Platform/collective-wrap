"use client";

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
          "rounded-2xl bg-[#0a0a0a] text-white p-8 space-y-6",
          className
        )}
      >
        <div className="space-y-1">
          <p className="text-2xl text-white font-gc tracking-wide uppercase">
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
                "px-4 py-3 rounded-full text-sm font-gc tracking-wide transition-all",
                selectedPreset === amount
                  ? "bg-white text-black"
                  : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
              )}
            >
              RM {formatAmount(amount)}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-neutral-500">{currency}</span>
          <input
            type="number"
            min="0"
            step="1"
            placeholder="0"
            value={customAmount}
            onChange={handleCustomAmountChange}
            className={cn(
              "flex-1 bg-transparent border-b border-neutral-700 py-2 text-2xl font-light",
              "placeholder:text-neutral-600 text-white",
              "focus:outline-none focus:border-white transition-colors",
              "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            )}
          />
        </div>

        {/* Total Amount Display */}
        <div className="pt-4 border-t border-neutral-800">
          <div className="flex justify-between items-center">
            <span className="text-sm text-neutral-500">total amount</span>
            <span className="text-xl font-gc tracking-wide">
              {currency}{" "}
              {currentAmount !== null ? formatAmount(currentAmount) : "0.00"}
            </span>
          </div>
        </div>

        <p>This fund is overseen by the Board of Elders.</p>

        {/* Give Button */}
        <button
          type="button"
          onClick={handleGiveClick}
          disabled={currentAmount === null || currentAmount <= 0}
          className={cn(
            "w-full py-4 rounded-full text-sm tracking-wide uppercase transition-all",
            currentAmount !== null && currentAmount > 0
              ? "bg-white text-black hover:bg-neutral-200"
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
          )}
        >
          Continue
        </button>
      </div>
    );
  }
);

DonationCard.displayName = "DonationCard";

export { DonationCard };
