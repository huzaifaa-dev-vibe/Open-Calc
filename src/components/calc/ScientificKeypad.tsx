"use client";

import { Delete, Undo2, Redo2 } from "lucide-react";
import { CalcKey } from "./CalcKey";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

/**
 * ScientificKeypad — 8-column landscape-style grid.
 *
 * Rows:
 *   1 (top, actions): undo · redo · MC · MR · M+ · M− · AC · ⌫
 *   2 (trig):         sin · cos · tan · cot · sec · csc · π · e
 *   3 (inverse+log):  sin⁻¹ · cos⁻¹ · tan⁻¹ · ln · log · eˣ · 10ˣ · DEG/RAD
 *   4 (powers+roots): x² · x³ · xʸ · √ · ∛ · ʸ√x · 1/x · n!
 *   5 (utils):        |x| · mod · ( · ) · , · τ · φ · %
 *   6 (numeric):      7 · 8 · 9 · ÷ · 4 · 5 · 6 · ×
 *   7 (numeric):      1 · 2 · 3 · − · 0 · . · = · +
 *
 * The DEG/RAD key is a stateful toggle (cycles the angle unit setting)
 * — every other key simply inserts a token into the expression buffer.
 */
export function ScientificKeypad() {
  const insert = useCalc((s) => s.insert);
  const backspace = useCalc((s) => s.backspace);
  const clearAll = useCalc((s) => s.clearAll);
  const equals = useCalc((s) => s.equals);
  const undo = useCalc((s) => s.undo);
  const redo = useCalc((s) => s.redo);
  const memoryAdd = useCalc((s) => s.memoryAdd);
  const memorySubtract = useCalc((s) => s.memorySubtract);
  const memoryRecall = useCalc((s) => s.memoryRecall);
  const memoryClear = useCalc((s) => s.memoryClear);
  const result = useCalc((s) => s.result);
  const undoStack = useCalc((s) => s.undoStack);
  const redoStack = useCalc((s) => s.redoStack);
  const angleUnit = useCalc((s) => s.settings.angleUnit);
  const setSettings = useCalc((s) => s.setSettings);
  const haptic = useHaptics();

  function tap(fn: () => void, kind: "tap" | "action" | "success" = "tap") {
    return () => {
      haptic(kind);
      fn();
    };
  }
  function wrap(token: string) {
    return tap(() => insert(token));
  }
  function wrapFn(fn: string) {
    return tap(() => insert(`${fn}(`));
  }

  function toggleAngle() {
    haptic("action");
    setSettings({ angleUnit: angleUnit === "deg" ? "rad" : "deg" });
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Top: actions + memory */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey variant="action" ariaLabel="Undo" onClick={tap(undo, "action")} label={<Undo2 className="h-4 w-4" />} className={undoStack.length === 0 ? "opacity-40" : ""} />
        <CalcKey variant="action" ariaLabel="Redo" onClick={tap(redo, "action")} label={<Redo2 className="h-4 w-4" />} className={redoStack.length === 0 ? "opacity-40" : ""} />
        <CalcKey variant="memory" label="MC" ariaLabel="Memory clear" onClick={tap(memoryClear, "action")} />
        <CalcKey variant="memory" label="MR" ariaLabel="Memory recall" onClick={tap(memoryRecall, "action")} />
        <CalcKey variant="memory" label="M+" ariaLabel="Memory add" onClick={() => { haptic("action"); if (result) memoryAdd(Number(result)); }} />
        <CalcKey variant="memory" label="M−" ariaLabel="Memory subtract" onClick={() => { haptic("action"); if (result) memorySubtract(Number(result)); }} />
        <CalcKey variant="clear" label="AC" ariaLabel="All clear" onClick={tap(clearAll, "action")} />
        <CalcKey variant="action" ariaLabel="Backspace" onClick={tap(backspace, "action")} label={<Delete className="h-4 w-4" />} />
      </div>

      {/* Trig + constants */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey variant="fn" label="sin" onClick={wrapFn("sin")} />
        <CalcKey variant="fn" label="cos" onClick={wrapFn("cos")} />
        <CalcKey variant="fn" label="tan" onClick={wrapFn("tan")} />
        <CalcKey variant="fn" label="cot" onClick={wrapFn("cot")} />
        <CalcKey variant="fn" label="sec" onClick={wrapFn("sec")} />
        <CalcKey variant="fn" label="csc" onClick={wrapFn("csc")} />
        <CalcKey variant="fn" label="π" onClick={wrap("pi")} />
        <CalcKey variant="fn" label="e" onClick={wrap("e")} />
      </div>

      {/* Inverse trig + logs + angle unit */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey variant="fn" label="sin⁻¹" onClick={wrapFn("asin")} />
        <CalcKey variant="fn" label="cos⁻¹" onClick={wrapFn("acos")} />
        <CalcKey variant="fn" label="tan⁻¹" onClick={wrapFn("atan")} />
        <CalcKey variant="fn" label="ln" onClick={wrapFn("log")} />
        <CalcKey variant="fn" label="log" onClick={wrapFn("log10")} />
        <CalcKey variant="fn" label="eˣ" onClick={wrapFn("exp")} />
        <CalcKey variant="fn" label="10ˣ" onClick={tap(() => insert("10^("))} />
        <CalcKey
          variant="action"
          label={angleUnit === "deg" ? "DEG" : "RAD"}
          ariaLabel={`Angle unit: ${angleUnit}. Tap to toggle.`}
          onClick={toggleAngle}
          className={cn(
            "font-semibold tracking-wide",
            angleUnit === "deg"
              ? "bg-[var(--calc-key-op)] text-[var(--calc-key-op-fg)] ring-[var(--calc-key-op-fg)]/30"
              : "bg-[var(--calc-key-fn)] text-[var(--calc-key-fn-fg)] ring-[var(--calc-key-fn-fg)]/30",
          )}
        />
      </div>

      {/* Powers + roots */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey variant="fn" label="x²" onClick={tap(() => insert("^2"))} />
        <CalcKey variant="fn" label="x³" onClick={tap(() => insert("^3"))} />
        <CalcKey variant="fn" label="xʸ" onClick={wrap("^")} />
        <CalcKey variant="fn" label="√" onClick={wrapFn("sqrt")} />
        <CalcKey variant="fn" label="∛" onClick={wrapFn("cbrt")} />
        <CalcKey variant="fn" label="ʸ√x" onClick={tap(() => insert("root("))} />
        <CalcKey variant="fn" label="1/x" onClick={tap(() => insert("^-1"))} />
        <CalcKey variant="fn" label="n!" onClick={wrapFn("fact")} />
      </div>

      {/* Utils */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey variant="fn" label="|x|" onClick={wrapFn("abs")} />
        <CalcKey variant="fn" label="mod" onClick={tap(() => insert(" mod "))} />
        <CalcKey variant="op" label="(" ariaLabel="Open parenthesis" onClick={wrap("(")} />
        <CalcKey variant="op" label=")" ariaLabel="Close parenthesis" onClick={wrap(")")} />
        <CalcKey variant="op" label="," ariaLabel="Argument separator" onClick={wrap(",")} />
        <CalcKey variant="fn" label="τ" onClick={wrap("tau")} />
        <CalcKey variant="fn" label="φ" onClick={wrap("phi")} />
        <CalcKey variant="op" label="%" ariaLabel="Modulo / percent" onClick={wrap("%")} />
      </div>

      {/* Numeric — 4 cols arithmetic on left, 4 on right */}
      <div className="grid grid-cols-8 gap-2">
        <CalcKey label="7" onClick={wrap("7")} />
        <CalcKey label="8" onClick={wrap("8")} />
        <CalcKey label="9" onClick={wrap("9")} />
        <CalcKey variant="op" label="÷" ariaLabel="Divide" onClick={wrap("/")} />
        <CalcKey label="4" onClick={wrap("4")} />
        <CalcKey label="5" onClick={wrap("5")} />
        <CalcKey label="6" onClick={wrap("6")} />
        <CalcKey variant="op" label="×" ariaLabel="Multiply" onClick={wrap("*")} />

        <CalcKey label="1" onClick={wrap("1")} />
        <CalcKey label="2" onClick={wrap("2")} />
        <CalcKey label="3" onClick={wrap("3")} />
        <CalcKey variant="op" label="−" ariaLabel="Minus" onClick={wrap("-")} />
        <CalcKey label="0" onClick={wrap("0")} />
        <CalcKey label="." onClick={wrap(".")} />
        <CalcKey
          variant="equals"
          ariaLabel="Equals"
          onClick={() => { haptic("success"); equals(); }}
          label={<span className="text-xl font-semibold leading-none">=</span>}
        />
        <CalcKey variant="op" label="+" ariaLabel="Plus" onClick={wrap("+")} />
      </div>
    </div>
  );
}
