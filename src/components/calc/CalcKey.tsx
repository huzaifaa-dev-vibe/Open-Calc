"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type KeyVariant =
  | "num"
  | "op"
  | "fn"
  | "action"
  | "equals"
  | "clear"
  | "memory";

interface CalcKeyProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: KeyVariant;
  wide?: boolean;
  tall?: boolean;
  label: React.ReactNode;
  sublabel?: string;
  ariaLabel?: string;
}

/**
 * Every variant has its own background + ring so keys are visually
 * distinct, not flat. Rings are subtle in light mode and crisper in
 * dark mode for parity.
 */
const variantClasses: Record<KeyVariant, string> = {
  num: cn(
    "bg-[var(--calc-key-num)] text-[var(--calc-key-num-fg)]",
    "ring-1 ring-inset ring-black/5 dark:ring-white/8",
    "hover:brightness-[0.97] active:brightness-[0.94]",
  ),
  op: cn(
    "bg-[var(--calc-key-op)] text-[var(--calc-key-op-fg)]",
    "ring-1 ring-inset ring-[var(--calc-key-op-fg)]/15",
    "hover:brightness-[0.98] active:brightness-[0.95]",
  ),
  fn: cn(
    "bg-[var(--calc-key-fn)] text-[var(--calc-key-fn-fg)]",
    "ring-1 ring-inset ring-[var(--calc-key-fn-fg)]/15",
    "hover:brightness-[0.98] active:brightness-[0.95]",
  ),
  action: cn(
    "bg-[var(--calc-key-action)] text-[var(--calc-key-action-fg)]",
    "ring-1 ring-inset ring-black/5 dark:ring-white/8",
    "hover:brightness-[0.98] active:brightness-[0.95]",
  ),
  equals: cn(
    "bg-[var(--calc-key-equals)] text-[var(--calc-key-equals-fg)]",
    "ring-1 ring-inset ring-black/10 dark:ring-white/15",
    "hover:brightness-[1.05] active:brightness-[0.96]",
    "shadow-md shadow-[var(--calc-key-equals)]/25",
  ),
  clear: cn(
    "bg-[var(--calc-key-clear)] text-[var(--calc-key-clear-fg)]",
    "ring-1 ring-inset ring-black/10 dark:ring-white/15",
    "hover:brightness-[1.05] active:brightness-[0.95]",
  ),
  memory: cn(
    "bg-[var(--calc-key-action)] text-[var(--calc-key-action-fg)]",
    "ring-1 ring-inset ring-black/5 dark:ring-white/8",
    "hover:brightness-[0.98] active:brightness-[0.95]",
  ),
};

export function CalcKey({
  variant = "num",
  wide,
  tall,
  label,
  sublabel,
  ariaLabel,
  className,
  onClick,
  ...rest
}: CalcKeyProps) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel ?? (typeof label === "string" ? label : undefined)}
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={cn(
        "relative inline-flex flex-col items-center justify-center",
        "rounded-2xl calc-key-shadow no-tap-highlight",
        "min-h-[3rem] text-base font-medium",
        "transition-[filter] duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        wide && "col-span-2",
        tall && "row-span-2",
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      <span className="leading-none">{label}</span>
      {sublabel && (
        <span className="mt-0.5 text-[0.6rem] uppercase tracking-wide opacity-70">
          {sublabel}
        </span>
      )}
    </motion.button>
  );
}
