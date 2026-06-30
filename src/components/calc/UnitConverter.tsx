"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeftRight, Copy, Share2, Search } from "lucide-react";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import {
  CATEGORIES,
  convertUnit,
  type UnitCategory,
  type UnitDef,
} from "@/lib/calc/units";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * UnitConverter — the third calculator mode.
 *
 * Layout:
 *   - Category chips (horizontal scroll)
 *   - From card: input + unit picker
 *   - Swap button (centre)
 *   - To card: output + unit picker
 *   - Numeric keypad (compact)
 *
 * Picks up the user's haptic + theme settings automatically. The
 * numeric keypad mirrors the Normal calculator's layout so muscle
 * memory transfers, but omits memory/paren rows since they're not
 * needed for a single numeric input.
 */
export function UnitConverter() {
  const [categoryId, setCategoryId] = useState<string>("length");
  const [inputValue, setInputValue] = useState<string>("");
  const [fromSymbol, setFromSymbol] = useState<string>("m");
  const [toSymbol, setToSymbol] = useState<string>("km");
  const [pickerOpen, setPickerOpen] = useState<null | "from" | "to">(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const haptic = useHaptics();
  const decimalPlaces = useCalc((s) => s.settings.decimalPlaces);

  const category = useMemo<UnitCategory>(
    () => CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[0],
    [categoryId],
  );

  // When the category changes, reset the selected units to the first
  // two units in that category so the conversion is always valid.
  function selectCategory(id: string) {
    haptic("action");
    setCategoryId(id);
    const cat = CATEGORIES.find((c) => c.id === id);
    if (cat && cat.units.length >= 2) {
      setFromSymbol(cat.units[0].symbol);
      setToSymbol(cat.units[1].symbol);
    } else if (cat && cat.units.length === 1) {
      setFromSymbol(cat.units[0].symbol);
      setToSymbol(cat.units[0].symbol);
    }
    setInputValue("");
  }

  function tap(key: string) {
    haptic("tap");
    if (key === "backspace") {
      setInputValue((v) => v.slice(0, -1));
      return;
    }
    if (key === "clear") {
      setInputValue("");
      return;
    }
    if (key === ".") {
      // Prevent multiple decimal points
      if (inputValue.includes(".")) return;
      setInputValue((v) => (v === "" ? "0." : v + "."));
      return;
    }
    if (key === "negate") {
      setInputValue((v) => (v.startsWith("-") ? v.slice(1) : "-" + v));
      return;
    }
    setInputValue((v) => (v === "0" ? key : v + key));
  }

  const numericValue = parseFloat(inputValue || "0");
  const result = useMemo(() => {
    if (inputValue === "" || inputValue === "-") {
      return { ok: false, error: "Enter a value to convert" };
    }
    return convertUnit(numericValue, fromSymbol, toSymbol);
  }, [inputValue, fromSymbol, toSymbol, decimalPlaces, numericValue]);

  function swap() {
    haptic("action");
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    // If we have a result, feed it back as the new input for a nice
    // round-trip UX.
    if (result.ok && result.formatted) {
      const clean = result.formatted.replace(/,/g, "");
      if (Number.isFinite(Number(clean))) setInputValue(clean);
    }
  }

  async function handleCopy() {
    if (!result.ok || !result.formatted) return;
    haptic("action");
    try {
      await navigator.clipboard.writeText(`${inputValue} ${fromSymbol} = ${result.formatted} ${toSymbol}`);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Couldn't copy");
    }
  }

  async function handleShare() {
    if (!result.ok || !result.formatted) return;
    haptic("action");
    const text = `${inputValue} ${fromSymbol} = ${result.formatted} ${toSymbol}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "OpenCalc", text });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied share text");
    }
  }

  const fromUnit = category.units.find((u) => u.symbol === fromSymbol);
  const toUnit = category.units.find((u) => u.symbol === toSymbol);

  return (
    <div className="flex flex-col gap-3 p-3">
      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1 -mx-1 px-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => selectCategory(c.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap",
              "no-tap-highlight transition-colors ring-1",
              c.id === categoryId
                ? "bg-primary text-primary-foreground ring-primary"
                : "bg-muted/60 text-muted-foreground ring-border/50 hover:text-foreground",
            )}
          >
            <span className="text-sm">{c.icon}</span>
            {c.label}
          </button>
        ))}
      </div>

      {/* From / Swap / To stack */}
      <div className="flex flex-col gap-2">
        {/* From */}
        <ConverterCard
          label="From"
          value={inputValue || ""}
          unit={fromUnit}
          onPickUnit={() => {
            haptic("action");
            setPickerQuery("");
            setPickerOpen("from");
          }}
          editable
        />

        {/* Swap button */}
        <div className="flex justify-center -my-1 relative z-10">
          <button
            type="button"
            aria-label="Swap units"
            onClick={swap}
            className={cn(
              "inline-flex items-center justify-center h-10 w-10 rounded-full",
              "bg-primary text-primary-foreground shadow-md shadow-primary/30",
              "ring-1 ring-primary/30 no-tap-highlight",
              "hover:brightness-105 active:brightness-95",
              "transition-[filter]",
            )}
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>
        </div>

        {/* To */}
        <ConverterCard
          label="To"
          value={
            result.ok && result.formatted
              ? result.formatted
              : result.error ?? "—"
          }
          unit={toUnit}
          onPickUnit={() => {
            haptic("action");
            setPickerQuery("");
            setPickerOpen("to");
          }}
          editable={false}
          error={!result.ok}
          actions={
            result.ok && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Copy result"
                  onClick={handleCopy}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <Copy className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Share result"
                  onClick={handleShare}
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          }
        />
      </div>

      {/* Compact numeric keypad */}
      <ConverterKeypad onTap={tap} />

      {/* Unit picker sheet */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setPickerOpen(null)}
            />
            <motion.div
              initial={{ y: "100%", opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0.6 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className={cn(
                "relative w-full sm:max-w-md",
                "bg-background rounded-t-3xl sm:rounded-3xl",
                "ring-1 ring-border shadow-2xl",
                "flex flex-col max-h-[80vh]",
              )}
              role="dialog"
              aria-label="Choose a unit"
            >
              <div className="flex justify-center pt-2.5 pb-1">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="text-base font-semibold">
                  {category.icon} {category.label} units
                </h2>
                <button
                  type="button"
                  aria-label="Close picker"
                  onClick={() => setPickerOpen(null)}
                  className="rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  Done
                </button>
              </div>
              <div className="px-4 py-2 border-b border-border">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    value={pickerQuery}
                    onChange={(e) => setPickerQuery(e.target.value)}
                    placeholder="Search units…"
                    aria-label="Search units"
                    className={cn(
                      "w-full rounded-full bg-muted/60 pl-9 pr-3 py-2 text-sm",
                      "outline-none ring-1 ring-border/50 focus:ring-2 focus:ring-primary/40",
                    )}
                    autoFocus
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
                <ul className="flex flex-col gap-1">
                  {category.units
                    .filter((u) => {
                      const q = pickerQuery.trim().toLowerCase();
                      if (!q) return true;
                      return (
                        u.label.toLowerCase().includes(q) ||
                        u.short.toLowerCase().includes(q) ||
                        u.symbol.toLowerCase().includes(q)
                      );
                    })
                    .map((u) => {
                      const selected =
                        pickerOpen === "from"
                          ? u.symbol === fromSymbol
                          : u.symbol === toSymbol;
                      return (
                        <li key={u.symbol}>
                          <button
                            type="button"
                            onClick={() => {
                              haptic("action");
                              if (pickerOpen === "from") setFromSymbol(u.symbol);
                              else setToSymbol(u.symbol);
                              setPickerOpen(null);
                            }}
                            className={cn(
                              "w-full flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left",
                              "no-tap-highlight transition-colors",
                              selected
                                ? "bg-primary/15 text-foreground"
                                : "hover:bg-foreground/5",
                            )}
                          >
                            <span className="text-sm font-medium">{u.label}</span>
                            <span className="text-xs font-mono text-muted-foreground">
                              {u.short}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ConverterCard({
  label,
  value,
  unit,
  onPickUnit,
  editable,
  error,
  actions,
}: {
  label: string;
  value: string;
  unit?: UnitDef;
  onPickUnit: () => void;
  editable: boolean;
  error?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card ring-1 ring-border/60 p-4",
        "flex flex-col gap-2",
      )}
    >
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="uppercase tracking-wider">{label}</span>
        {actions}
      </div>
      <div className="flex items-center justify-between gap-3">
        <div
          className={cn(
            "flex-1 min-w-0 text-3xl font-semibold tabular-nums truncate",
            error ? "text-destructive text-xl" : "text-foreground",
          )}
        >
          {value || (editable ? "" : "—")}
        </div>
        <button
          type="button"
          onClick={onPickUnit}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
            "bg-muted/60 ring-1 ring-border/50 text-sm font-medium",
            "hover:bg-foreground/5 transition-colors no-tap-highlight",
            "shrink-0",
          )}
        >
          <span className="text-base">{unit?.short ?? "?"}</span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {unit?.label ?? "Pick"}
          </span>
        </button>
      </div>
    </div>
  );
}

function ConverterKeypad({ onTap }: { onTap: (key: string) => void }) {
  const haptic = useHaptics();
  function k(key: string, kind: "tap" | "action" = "tap") {
    return () => {
      haptic(kind);
      onTap(key);
    };
  }
  return (
    <div className="grid grid-cols-4 gap-2">
      <NumKey label="7" onClick={k("7")} />
      <NumKey label="8" onClick={k("8")} />
      <NumKey label="9" onClick={k("9")} />
      <NumKey label="C" variant="clear" onClick={k("clear", "action")} />

      <NumKey label="4" onClick={k("4")} />
      <NumKey label="5" onClick={k("5")} />
      <NumKey label="6" onClick={k("6")} />
      <NumKey label="⌫" variant="action" onClick={k("backspace", "action")} />

      <NumKey label="1" onClick={k("1")} />
      <NumKey label="2" onClick={k("2")} />
      <NumKey label="3" onClick={k("3")} />
      <NumKey label="±" variant="action" onClick={k("negate", "action")} />

      <NumKey label="0" wide onClick={k("0")} />
      <NumKey label="." onClick={k(".")} />
      <NumKey label="00" onClick={k("00")} />
    </div>
  );
}

function NumKey({
  label,
  onClick,
  variant = "num",
  wide,
}: {
  label: React.ReactNode;
  onClick: () => void;
  variant?: "num" | "action" | "clear";
  wide?: boolean;
}) {
  const variantCls = {
    num: "bg-[var(--calc-key-num)] text-[var(--calc-key-num-fg)] ring-1 ring-inset ring-black/5 dark:ring-white/8",
    action:
      "bg-[var(--calc-key-action)] text-[var(--calc-key-action-fg)] ring-1 ring-inset ring-black/5 dark:ring-white/8",
    clear:
      "bg-[var(--calc-key-clear)] text-[var(--calc-key-clear-fg)] ring-1 ring-inset ring-black/10 dark:ring-white/15",
  }[variant];
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: "spring", stiffness: 600, damping: 30 }}
      className={cn(
        "relative inline-flex items-center justify-center rounded-2xl calc-key-shadow no-tap-highlight",
        "min-h-[3rem] text-base font-medium",
        "transition-[filter] duration-100",
        "hover:brightness-[0.97] active:brightness-[0.94]",
        wide && "col-span-2",
        variantCls,
      )}
    >
      {label}
    </motion.button>
  );
}
