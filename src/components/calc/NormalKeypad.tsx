"use client";

import { Delete, Undo2, Redo2 } from "lucide-react";
import { CalcKey } from "./CalcKey";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";

/**
 * NormalKeypad — portrait-style 4-column grid.
 *
 * Layout:
 *   Row 0 (slim, memory):  MC · MR · M+ · M−
 *   Row 1 (slim, utils):   undo · redo · ( · )
 *   Row 2:                 AC · ⌫ · % · ÷
 *   Row 3:                 7 · 8 · 9 · ×
 *   Row 4:                 4 · 5 · 6 · −
 *   Row 5:                 1 · 2 · 3 · +
 *   Row 6:                 0 (wide) · . · =
 *
 * Rationale: separate ( and ) buttons are more discoverable than a
 * single toggle — they match what every other calculator shows.
 */
export function NormalKeypad() {
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
  const haptic = useHaptics();

  function tap(fn: () => void, kind: "tap" | "action" | "success" = "tap") {
    return () => {
      haptic(kind);
      fn();
    };
  }

  return (
    <div className="flex flex-col gap-2 p-3">
      {/* Memory row */}
      <div className="grid grid-cols-4 gap-2">
        <CalcKey variant="memory" label="MC" ariaLabel="Memory clear" onClick={tap(memoryClear, "action")} />
        <CalcKey variant="memory" label="MR" ariaLabel="Memory recall" onClick={tap(memoryRecall, "action")} />
        <CalcKey variant="memory" label="M+" ariaLabel="Memory add" onClick={() => { haptic("action"); if (result) memoryAdd(Number(result)); }} />
        <CalcKey variant="memory" label="M−" ariaLabel="Memory subtract" onClick={() => { haptic("action"); if (result) memorySubtract(Number(result)); }} />
      </div>

      {/* Undo / Redo / Parens row */}
      <div className="grid grid-cols-4 gap-2">
        <CalcKey
          variant="action"
          ariaLabel="Undo"
          onClick={tap(undo, "action")}
          label={<Undo2 className="h-5 w-5" />}
          className={undoStack.length === 0 ? "opacity-40" : ""}
        />
        <CalcKey
          variant="action"
          ariaLabel="Redo"
          onClick={tap(redo, "action")}
          label={<Redo2 className="h-5 w-5" />}
          className={redoStack.length === 0 ? "opacity-40" : ""}
        />
        <CalcKey variant="op" label="(" ariaLabel="Open parenthesis" onClick={tap(() => insert("("))} />
        <CalcKey variant="op" label=")" ariaLabel="Close parenthesis" onClick={tap(() => insert(")"))} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-4 gap-2">
        <CalcKey variant="clear" label="AC" ariaLabel="All clear" onClick={tap(clearAll, "action")} />
        <CalcKey variant="action" ariaLabel="Backspace" onClick={tap(backspace, "action")} label={<Delete className="h-5 w-5" />} />
        <CalcKey variant="op" label="%" ariaLabel="Percent" onClick={tap(() => insert("%"))} />
        <CalcKey variant="op" label="÷" ariaLabel="Divide" onClick={tap(() => insert("/"))} />

        <CalcKey label="7" onClick={tap(() => insert("7"))} />
        <CalcKey label="8" onClick={tap(() => insert("8"))} />
        <CalcKey label="9" onClick={tap(() => insert("9"))} />
        <CalcKey variant="op" label="×" ariaLabel="Multiply" onClick={tap(() => insert("*"))} />

        <CalcKey label="4" onClick={tap(() => insert("4"))} />
        <CalcKey label="5" onClick={tap(() => insert("5"))} />
        <CalcKey label="6" onClick={tap(() => insert("6"))} />
        <CalcKey variant="op" label="−" ariaLabel="Minus" onClick={tap(() => insert("-"))} />

        <CalcKey label="1" onClick={tap(() => insert("1"))} />
        <CalcKey label="2" onClick={tap(() => insert("2"))} />
        <CalcKey label="3" onClick={tap(() => insert("3"))} />
        <CalcKey variant="op" label="+" ariaLabel="Plus" onClick={tap(() => insert("+"))} />

        <CalcKey label="0" wide onClick={tap(() => insert("0"))} />
        <CalcKey label="." ariaLabel="Decimal point" onClick={tap(() => insert("."))} />
        <CalcKey
          variant="equals"
          ariaLabel="Equals"
          onClick={() => { haptic("success"); equals(); }}
          label={<span className="text-2xl font-semibold leading-none">=</span>}
        />
      </div>
    </div>
  );
}
