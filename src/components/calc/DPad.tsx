"use client";

import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

/**
 * DPad — a compact 4-directional navigation pad.
 *
 * Layout (plus-shaped cluster):
 *
 *        ↑
 *      ←   →
 *        ↓
 *
 * - Moves the caret left / right within the current expression
 * - Up / down jump to the start / end of the expression (and in the
 *   future will navigate history entries when the buffer is empty)
 * - Renders as a small floating cluster so it doesn't disturb the
 *   existing keypad layout
 * - Every tap fires haptic feedback
 */
export function DPad({ className }: { className?: string }) {
  const moveCaret = useCalc((s) => s.moveCaret);
  const setCaret = useCalc((s) => s.setCaret);
  const expression = useCalc((s) => s.expression);
  const haptic = useHaptics();

  function tap(fn: () => void) {
    return () => {
      haptic("tap");
      fn();
    };
  }

  function goStart() {
    haptic("action");
    setCaret(0);
  }
  function goEnd() {
    haptic("action");
    setCaret(expression.length);
  }

  const btnCls = cn(
    "inline-flex items-center justify-center rounded-full",
    "bg-[var(--calc-key-action)] text-[var(--calc-key-action-fg)]",
    "ring-1 ring-inset ring-black/5 dark:ring-white/8",
    "hover:brightness-[0.98] active:brightness-[0.95]",
    "no-tap-highlight transition-[filter]",
    "h-9 w-9",
  );

  return (
    <div
      role="group"
      aria-label="Navigation pad"
      className={cn(
        "relative grid grid-cols-3 grid-rows-3 gap-0.5",
        "w-[6.5rem] h-[6.5rem]",
        className,
      )}
    >
      {/* Up — row 1, col 2 */}
      <motion.button
        type="button"
        aria-label="Move caret to start"
        onClick={tap(goStart)}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(btnCls, "col-start-2 row-start-1")}
      >
        <ChevronUp className="h-4 w-4" />
      </motion.button>

      {/* Left — row 2, col 1 */}
      <motion.button
        type="button"
        aria-label="Move caret left"
        onClick={tap(() => moveCaret(-1))}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(btnCls, "col-start-1 row-start-2")}
      >
        <ChevronLeft className="h-4 w-4" />
      </motion.button>

      {/* Center — row 2, col 2 (decorative dot) */}
      <div
        aria-hidden
        className="col-start-2 row-start-2 flex items-center justify-center"
      >
        <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
      </div>

      {/* Right — row 2, col 3 */}
      <motion.button
        type="button"
        aria-label="Move caret right"
        onClick={tap(() => moveCaret(1))}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(btnCls, "col-start-3 row-start-2")}
      >
        <ChevronRight className="h-4 w-4" />
      </motion.button>

      {/* Down — row 3, col 2 */}
      <motion.button
        type="button"
        aria-label="Move caret to end"
        onClick={tap(goEnd)}
        whileTap={{ scale: 0.9 }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        className={cn(btnCls, "col-start-2 row-start-3")}
      >
        <ChevronDown className="h-4 w-4" />
      </motion.button>
    </div>
  );
}
