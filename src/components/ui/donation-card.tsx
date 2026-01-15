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
      presetAmounts = [5000, 3000, 1000, 500],
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

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4",
          className
        )}
      >
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Select Amount</h3>
          <p className="text-sm text-muted-foreground">
            Choose a preset amount or enter a custom value
          </p>
        </div>

        {/* Preset Amount Buttons */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handlePresetClick(amount)}
              className={cn(
                "px-4 py-3 rounded-md border text-sm font-medium transition-all",
                "hover:border-primary hover:bg-primary/5",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                selectedPreset === amount
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background"
              )}
            >
              {currency} {amount.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom Amount Input */}
        <div className="space-y-2">
          <label
            htmlFor="custom-amount"
            className="text-sm font-medium text-muted-foreground"
          >
            Or enter custom amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {currency}
            </span>
            <input
              id="custom-amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className={cn(
                "w-full rounded-md border border-input bg-background px-3 py-2 pl-12 text-sm",
                "placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            />
          </div>
        </div>

        {/* Selected Amount Display */}
        {currentAmount !== null && (
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Selected amount:
              </span>
              <span className="text-lg font-bold">
                {currency} {currentAmount.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DonationCard.displayName = "DonationCard";

export { DonationCard };
