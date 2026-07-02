"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, FunctionSquare } from "lucide-react";
import { Latex } from "./Latex";
import { DPad } from "./DPad";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

/**
 * Display — the top half of the calculator.
 *
 * Layout (top → bottom):
 *   - memory chip + actions row
 *   - LaTeX preview (large, primary)
 *   - raw typed expression (small, muted) — shown only when the
 *     LaTeX preview rendered successfully, so the user can always
 *     see what they typed vs how it's being interpreted
 *   - large numeric result
 */
export function Display() {
  const expression = useCalc((s) => s.expression);
  const caretPos = useCalc((s) => s.caretPos);
  const result = useCalc((s) => s.result);
  const livePreview = useCalc((s) => s.livePreview);
  const liveLatex = useCalc((s) => s.liveLatex);
  const liveLatexOk = useCalc((s) => s.liveLatexOk);
  const error = useCalc((s) => s.error);
  const memory = useCalc((s) => s.memory);
  const memoryBanner = useCalc((s) => s.memoryBanner);
  const copyResult = useCalc((s) => s.copyResult);
  const shareResult = useCalc((s) => s.shareResult);
  const openSolver = useCalc((s) => s.openSolver);
  const angleUnit = useCalc((s) => s.settings.angleUnit);
  const haptic = useHaptics();

  const shown = result ?? livePreview;
  const hasResult = Boolean(result);

  async function handleCopy() {
    haptic("action");
    const ok = await copyResult();
    if (!ok) haptic("error");
  }
  async function handleShare() {
    haptic("action");
    await shareResult();
  }

  return (
    <div className="relative flex flex-col justify-end gap-2 px-5 pt-4 pb-3 min-h-[32vh]">
      {/* D-pad — floating cluster in the top-right of the display.
          Always visible (even when the expression is empty) so the
          user always knows where to find it. Sits above the LaTeX
          preview without disturbing the keypad. On mobile it's
          slightly smaller and tucked into the corner. */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="absolute right-3 top-3 z-20 scale-90 sm:scale-100 origin-top-right"
      >
        <DPad />
      </motion.div>

      {/* top row: memory chip + angle unit + actions
          On mobile, the D-pad floats in the top-right corner, so we
          add right padding to this row to keep the action buttons
          from sliding under it. */}
      <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground pr-[5.5rem] sm:pr-0">
        <div className="flex items-center gap-2 min-h-[1.5rem]">
          <AnimatePresence mode="wait">
            {memory !== 0 && (
              <motion.span
                key="memory"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[0.7rem] font-medium text-primary"
              >
                M = {Number.isInteger(memory) ? memory : memory.toFixed(4)}
              </motion.span>
            )}
            {memoryBanner && memory === 0 && (
              <motion.span
                key={memoryBanner}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-[0.7rem]"
              >
                {memoryBanner}
              </motion.span>
            )}
          </AnimatePresence>
          <span className="inline-flex items-center rounded-full bg-muted/60 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
            {angleUnit}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasResult && (
            <>
              <ActionButton label="Copy result" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </ActionButton>
              <ActionButton label="Share result" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </ActionButton>
              <ActionButton
                label="Show step-by-step solution"
                onClick={() => {
                  haptic("action");
                  openSolver();
                }}
                highlight
              >
                <FunctionSquare className="h-4 w-4" />
                <span className="text-xs">Steps</span>
              </ActionButton>
            </>
          )}
        </div>
      </div>

      {/* LaTeX preview (primary) */}
      <div className="min-h-[2.5rem] overflow-x-auto scrollbar-thin">
        {expression ? (
          liveLatexOk && liveLatex ? (
            <div className="text-2xl md:text-3xl text-foreground/90 leading-relaxed">
              <Latex>{liveLatex}</Latex>
            </div>
          ) : (
            // Parsing failed (incomplete expression) — show raw text
            // with a blinking caret at the edit position so the user
            // knows where new keystrokes will land.
            <div className="text-2xl md:text-3xl font-mono text-foreground/80 break-all">
              <RawWithCaret
                text={expression}
                caretPos={caretPos}
              />
            </div>
          )
        ) : (
          <span className="text-muted-foreground/50 text-base">
            Enter a calculation
          </span>
        )}
      </div>

      {/* Raw expression echo with a blinking caret.
          Always shown (even when LaTeX rendered) so the user can see
          exactly what they typed AND where the caret is. The caret is
          a thin blinking bar between characters at the caret position. */}
      <div className="text-xs font-mono text-muted-foreground/60 overflow-x-auto scrollbar-thin -mt-1 min-h-[1rem]">
        {expression ? (
          <RawWithCaret text={expression} caretPos={caretPos} />
        ) : (
          <span className="text-muted-foreground/30">|</span>
        )}
      </div>

      {/* result */}
      <AnimatePresence mode="wait">
        <motion.div
          key={shown ?? "empty"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ type: "spring", stiffness: 320, damping: 26 }}
          className="flex items-end justify-end gap-2"
        >
          {error ? (
            <span className="text-2xl md:text-3xl font-semibold text-destructive">
              {error}
            </span>
          ) : shown ? (
            <>
              {hasResult && (
                <span className="text-2xl text-muted-foreground/50 mb-1">=</span>
              )}
              <span
                className={cn(
                  "font-semibold tabular-nums tracking-tight",
                  "text-5xl md:text-6xl",
                  hasResult ? "text-foreground" : "text-foreground/60",
                )}
              >
                {shown}
              </span>
            </>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ActionButton({
  children,
  label,
  onClick,
  highlight,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1.5",
        "no-tap-highlight transition-colors",
        "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
        highlight &&
          "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}

/**
 * RawWithCaret — renders the raw expression string with a blinking
 * caret between characters at the caret position. Used both as a
 * fallback when KaTeX can't render the (still-incomplete) expression,
 * AND as the always-visible raw echo below the LaTeX preview.
 *
 * The caret uses a CSS keyframe animation (`opencalc-caret-blink`)
 * defined in globals.css so it stays visible and clearly blinking.
 */
function RawWithCaret({ text, caretPos }: { text: string; caretPos: number }) {
  const pos = Math.max(0, Math.min(text.length, caretPos));
  const before = text.slice(0, pos);
  const after = text.slice(pos);
  return (
    <>
      <span>{before}</span>
      <span
        aria-hidden
        className="inline-block w-[2px] h-[1.1em] -mb-[0.15em] mx-[1px] bg-primary align-middle opencalc-caret-blink"
      />
      <span>{after}</span>
    </>
  );
}
