"use client";

import { Delete, Undo2, Redo2, ChevronLeft, ChevronRight } from "lucide-react";
import { CalcKey } from "./CalcKey";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { cn } from "@/lib/utils";

/**
 * ScientificKeypad — 8-column landscape grid.
 *
 * Visual grouping (each "section" is a row band separated by slightly
 * tighter vertical rhythm; function families share color so the eye
 * can chunk them quickly):
 *
 *   § Actions   undo · redo · MC · MR · M+ · M− · AC · ⌫
 *   § Trig      sin · cos · tan · cot · sec · csc · π · e
 *   § Inv+log   sin⁻¹ · cos⁻¹ · tan⁻¹ · ln · log · eˣ · 10ˣ · DEG/RAD
 *   § Powers    x² · x³ · xʸ · √ · ∛ · ʸ√x · 1/x · n!
 *   § Frac+util a/b · a/b/c · |x| · mod · ( · ) · τ · φ
 *   § Arrow+sep ← · → · , · % · frac · cf · cf · DEG   ←  omitted; merged above
 *   § Numeric   7 · 8 · 9 · ÷ · 4 · 5 · 6 · ×
 *   § Numeric   1 · 2 · 3 · − · 0 · . · = · +
 *
 * Layout rationale: keys are kept at a uniform size and rounded the
 * same way; function families are colour-coded rather than separated
 * by whitespace, which keeps the grid dense and cohesive.
 */
export function ScientificKeypad() {
  const insert = useCalc((s) => s.insert);
  const insertFraction = useCalc((s) => s.insertFraction);
  const insertCompoundFraction = useCalc((s) => s.insertCompoundFraction);
  const moveCaret = useCalc((s) => s.moveCaret);
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

  // Compact sizing for scientific mode so all keys fit comfortably.
  const keyCls = "min-h-[2.75rem] text-sm";
  const fnCls = cn(keyCls, "text-[0.8rem]");

  return (
    <div className="flex flex-col gap-1.5 p-2.5">
      {/* § Actions */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey variant="action" className={keyCls} ariaLabel="Undo" onClick={tap(undo, "action")} label={<Undo2 className="h-4 w-4" />} />
        <CalcKey variant="action" className={keyCls} ariaLabel="Redo" onClick={tap(redo, "action")} label={<Redo2 className="h-4 w-4" />} />
        <CalcKey variant="memory" className={keyCls} label="MC" ariaLabel="Memory clear" onClick={tap(memoryClear, "action")} />
        <CalcKey variant="memory" className={keyCls} label="MR" ariaLabel="Memory recall" onClick={tap(memoryRecall, "action")} />
        <CalcKey variant="memory" className={keyCls} label="M+" ariaLabel="Memory add" onClick={() => { haptic("action"); if (result) memoryAdd(Number(result)); }} />
        <CalcKey variant="memory" className={keyCls} label="M−" ariaLabel="Memory subtract" onClick={() => { haptic("action"); if (result) memorySubtract(Number(result)); }} />
        <CalcKey variant="clear" className={keyCls} label="AC" ariaLabel="All clear" onClick={tap(clearAll, "action")} />
        <CalcKey variant="action" className={keyCls} ariaLabel="Backspace" onClick={tap(backspace, "action")} label={<Delete className="h-4 w-4" />} />
      </div>

      {/* § Trig + constants */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey variant="fn" className={fnCls} label="sin" onClick={wrapFn("sin")} />
        <CalcKey variant="fn" className={fnCls} label="cos" onClick={wrapFn("cos")} />
        <CalcKey variant="fn" className={fnCls} label="tan" onClick={wrapFn("tan")} />
        <CalcKey variant="fn" className={fnCls} label="cot" onClick={wrapFn("cot")} />
        <CalcKey variant="fn" className={fnCls} label="sec" onClick={wrapFn("sec")} />
        <CalcKey variant="fn" className={fnCls} label="csc" onClick={wrapFn("csc")} />
        <CalcKey variant="fn" className={fnCls} label="π" onClick={wrap("pi")} />
        <CalcKey variant="fn" className={fnCls} label="e" onClick={wrap("e")} />
      </div>

      {/* § Inverse trig + logs + angle unit */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey variant="fn" className={fnCls} label="sin⁻¹" onClick={wrapFn("asin")} />
        <CalcKey variant="fn" className={fnCls} label="cos⁻¹" onClick={wrapFn("acos")} />
        <CalcKey variant="fn" className={fnCls} label="tan⁻¹" onClick={wrapFn("atan")} />
        <CalcKey variant="fn" className={fnCls} label="ln" onClick={wrapFn("log")} />
        <CalcKey variant="fn" className={fnCls} label="log" onClick={wrapFn("log10")} />
        <CalcKey variant="fn" className={fnCls} label="eˣ" onClick={wrapFn("exp")} />
        <CalcKey variant="fn" className={fnCls} label="10ˣ" onClick={tap(() => insert("10^("))} />
        <CalcKey
          variant="action"
          className={cn(fnCls, "font-semibold tracking-wide")}
          label={angleUnit === "deg" ? "DEG" : "RAD"}
          ariaLabel={`Angle unit: ${angleUnit}. Tap to toggle.`}
          onClick={toggleAngle}
        />
      </div>

      {/* § Powers + roots */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey variant="fn" className={fnCls} label="x²" onClick={tap(() => insert("^2"))} />
        <CalcKey variant="fn" className={fnCls} label="x³" onClick={tap(() => insert("^3"))} />
        <CalcKey variant="fn" className={fnCls} label="xʸ" onClick={wrap("^")} />
        <CalcKey variant="fn" className={fnCls} label="√" onClick={wrapFn("sqrt")} />
        <CalcKey variant="fn" className={fnCls} label="∛" onClick={wrapFn("cbrt")} />
        <CalcKey variant="fn" className={fnCls} label="ʸ√x" onClick={tap(() => insert("root("))} />
        <CalcKey variant="fn" className={fnCls} label="1/x" onClick={tap(() => insert("^-1"))} />
        <CalcKey variant="fn" className={fnCls} label="n!" onClick={wrapFn("fact")} />
      </div>

      {/* § Fraction templates + utils */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey
          variant="fn"
          className={cn(fnCls, "font-semibold")}
          label={<>a<b className="text-[0.6rem] align-super">/</b>b</>}
          ariaLabel="Fraction template: a over b"
          onClick={tap(insertFraction, "action")}
        />
        <CalcKey
          variant="fn"
          className={cn(fnCls, "font-semibold")}
          label={<span className="text-[0.7rem]">a/b/c</span>}
          ariaLabel="Compound fraction template"
          onClick={tap(insertCompoundFraction, "action")}
        />
        <CalcKey variant="fn" className={fnCls} label="|x|" onClick={wrapFn("abs")} />
        <CalcKey variant="fn" className={fnCls} label="mod" onClick={tap(() => insert(" mod "))} />
        <CalcKey variant="op" className={fnCls} label="(" ariaLabel="Open parenthesis" onClick={wrap("(")} />
        <CalcKey variant="op" className={fnCls} label=")" ariaLabel="Close parenthesis" onClick={wrap(")")} />
        <CalcKey variant="fn" className={fnCls} label="τ" onClick={wrap("tau")} />
        <CalcKey variant="fn" className={fnCls} label="φ" onClick={wrap("phi")} />
      </div>

      {/* § Caret + percent */}
      <div className="grid grid-cols-8 gap-1.5">
        <CalcKey variant="action" className={keyCls} ariaLabel="Move caret left" onClick={tap(() => moveCaret(-1), "tap")} label={<ChevronLeft className="h-4 w-4" />} />
        <CalcKey variant="action" className={keyCls} ariaLabel="Move caret right" onClick={tap(() => moveCaret(1), "tap")} label={<ChevronRight className="h-4 w-4" />} />
        <CalcKey variant="op" className={fnCls} label="," ariaLabel="Argument separator" onClick={wrap(",")} />
        <CalcKey variant="op" className={fnCls} label="%" ariaLabel="Modulo / percent" onClick={wrap("%")} />
        <CalcKey variant="op" className={fnCls} label="÷" ariaLabel="Divide" onClick={wrap("/")} />
        <CalcKey variant="op" className={fnCls} label="×" ariaLabel="Multiply" onClick={wrap("*")} />
        <CalcKey variant="op" className={fnCls} label="−" ariaLabel="Minus" onClick={wrap("-")} />
        <CalcKey variant="op" className={fnCls} label="+" ariaLabel="Plus" onClick={wrap("+")} />
      </div>

      {/* § Numeric pad — 5 cols × 4 rows.
          Layout:
            7 8 9  ÷  ×
            4 5 6  −  +
            1 2 3  .  =   (equals spans rows 3-4)
            0 0 0  00 =
      */}
      <div className="grid grid-cols-5 gap-1.5">
        <CalcKey className={keyCls} label="7" onClick={wrap("7")} />
        <CalcKey className={keyCls} label="8" onClick={wrap("8")} />
        <CalcKey className={keyCls} label="9" onClick={wrap("9")} />
        <CalcKey variant="op" className={keyCls} label="÷" ariaLabel="Divide" onClick={wrap("/")} />
        <CalcKey variant="op" className={keyCls} label="×" ariaLabel="Multiply" onClick={wrap("*")} />

        <CalcKey className={keyCls} label="4" onClick={wrap("4")} />
        <CalcKey className={keyCls} label="5" onClick={wrap("5")} />
        <CalcKey className={keyCls} label="6" onClick={wrap("6")} />
        <CalcKey variant="op" className={keyCls} label="−" ariaLabel="Minus" onClick={wrap("-")} />
        <CalcKey variant="op" className={keyCls} label="+" ariaLabel="Plus" onClick={wrap("+")} />

        <CalcKey className={keyCls} label="1" onClick={wrap("1")} />
        <CalcKey className={keyCls} label="2" onClick={wrap("2")} />
        <CalcKey className={keyCls} label="3" onClick={wrap("3")} />
        <CalcKey className={keyCls} label="." ariaLabel="Decimal point" onClick={wrap(".")} />
        <CalcKey
          variant="equals"
          className={cn(keyCls, "row-span-2")}
          tall
          ariaLabel="Equals"
          onClick={() => { haptic("success"); equals(); }}
          label={<span className="text-2xl font-semibold leading-none">=</span>}
        />

        <CalcKey className={keyCls} label="0" wide onClick={wrap("0")} />
        <CalcKey className={keyCls} label="00" onClick={wrap("00")} />
      </div>
    </div>
  );
}
