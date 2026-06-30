"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: { value: T; label: string; icon?: React.ReactNode }[];
  onChange: (v: T) => void;
  className?: string;
  size?: "sm" | "md";
  "aria-label"?: string;
}

/**
 * SegmentedToggle — Material 3 Expressive style segmented control.
 *
 * - Fully rounded pill container
 * - Spring-animated thumb that slides between options
 * - Subtle scale feedback on tap
 * - Icon + label support
 * - Keyboard accessible (role="radiogroup")
 */
export function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  className,
  size = "md",
  "aria-label": ariaLabel,
}: SegmentedToggleProps<T>) {
  const activeIndex = options.findIndex((o) => o.value === value);

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center rounded-full p-1",
        "bg-muted/80 backdrop-blur",
        "ring-1 ring-border/60",
        size === "sm" ? "h-9" : "h-11",
        className,
      )}
    >
      {activeIndex >= 0 && (
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className={cn(
            "absolute inset-y-1 rounded-full bg-background",
            "shadow-sm ring-1 ring-border/40",
          )}
          style={{
            left: `calc(${(100 / options.length) * activeIndex}% + 0.25rem)`,
            width: `calc(${100 / options.length}% - 0.5rem)`,
          }}
        />
      )}
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-1.5 rounded-full",
              "no-tap-highlight transition-colors",
              size === "sm"
                ? "h-7 px-3 text-xs"
                : "h-9 px-4 text-sm",
              isActive
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span className="whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
