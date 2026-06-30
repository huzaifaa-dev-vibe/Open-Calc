"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown, Sigma, Lightbulb } from "lucide-react";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { Latex } from "./Latex";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function SolverDrawer() {
  const open = useCalc((s) => s.solverOpen);
  const close = useCalc((s) => s.closeSolver);
  const solver = useCalc((s) => s.solver);
  const haptic = useHaptics();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              haptic("tap");
              close();
            }}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "relative w-full sm:max-w-2xl",
              "bg-background rounded-t-3xl sm:rounded-3xl",
              "ring-1 ring-border shadow-2xl",
              "flex flex-col max-h-[88vh]",
            )}
            role="dialog"
            aria-label="Step-by-step solution"
          >
            {/* grabber */}
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Sigma className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold leading-tight">
                    Step-by-step solution
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {solver ? `Topic · ${solver.topic}` : "Working…"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close solver"
                onClick={() => {
                  haptic("tap");
                  close();
                }}
                className="rounded-full p-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              {!solver || solver.steps.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-12">
                  Enter an expression and press <kbd className="rounded bg-muted px-1.5 py-0.5 text-xs">=</kbd> to see a full breakdown.
                </div>
              ) : (
                <ol className="relative flex flex-col gap-3">
                  {/* vertical rail */}
                  <div className="absolute left-[0.95rem] top-3 bottom-3 w-px bg-border" />
                  {solver.steps.map((step, i) => (
                    <StepItem
                      key={i}
                      index={i + 1}
                      step={step}
                      isLast={i === solver.steps.length - 1}
                    />
                  ))}
                </ol>
              )}
            </div>

            {/* footer with final answer */}
            {solver?.finalValue && (
              <div className="border-t border-border px-5 py-4 safe-bottom bg-muted/30">
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Final answer
                </div>
                <div className="flex items-baseline justify-between gap-3">
                  <div className="overflow-x-auto scrollbar-thin text-xl">
                    <Latex>{solver.finalLatex}</Latex>
                  </div>
                  <div className="text-2xl font-semibold tabular-nums text-primary shrink-0">
                    {solver.finalValue}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StepItem({
  index,
  step,
  isLast,
}: {
  index: number;
  step: import("@/lib/calc/engine").SolveStep;
  isLast: boolean;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <li className="relative pl-8">
      <div
        className={cn(
          "absolute left-0 top-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-full",
          "bg-background ring-1 ring-border text-xs font-semibold",
          isLast ? "text-primary ring-primary/40" : "text-muted-foreground",
        )}
      >
        {index}
      </div>

      <div className="rounded-2xl bg-card ring-1 ring-border/60 p-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left"
          aria-expanded={expanded}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{step.title}</span>
            {step.numeric && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary tabular-nums">
                {step.numeric}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              expanded && "rotate-180",
            )}
          />
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="overflow-hidden"
            >
              <div className="pt-2.5 flex flex-col gap-2">
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <Lightbulb className="h-3.5 w-3.5 mt-0.5 shrink-0 text-accent" />
                  <span>{step.explanation}</span>
                </div>
                <div className="rounded-xl bg-muted/40 px-3 py-2.5 overflow-x-auto scrollbar-thin">
                  <Latex display>{step.latex}</Latex>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </li>
  );
}
