"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Star,
  Trash2,
  X,
  RotateCcw,
  Share2,
  Copy,
  History as HistoryIcon,
} from "lucide-react";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { Latex } from "./Latex";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HistoryPanelProps {
  open: boolean;
  onClose: () => void;
}

export function HistoryPanel({ open, onClose }: HistoryPanelProps) {
  const history = useCalc((s) => s.history);
  const toggleFavorite = useCalc((s) => s.toggleFavorite);
  const deleteHistory = useCalc((s) => s.deleteHistory);
  const clearHistory = useCalc((s) => s.clearHistory);
  const reuseExpression = useCalc((s) => s.reuseExpression);
  const haptic = useHaptics();
  const [query, setQuery] = useState("");
  const [favOnly, setFavOnly] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((h) => {
      if (favOnly && !h.favorite) return false;
      if (!q) return true;
      return (
        h.expression.toLowerCase().includes(q) ||
        h.result.toLowerCase().includes(q)
      );
    });
  }, [history, query, favOnly]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 36 }}
            className={cn(
              "fixed right-0 top-0 z-50 h-full w-full max-w-md",
              "bg-background border-l border-border",
              "flex flex-col",
            )}
            role="dialog"
            aria-label="Calculation history"
          >
            {/* header */}
            <div className="safe-top flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5 text-primary" />
                <h2 className="text-base font-semibold">History</h2>
                <span className="text-xs text-muted-foreground">
                  {history.length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Clear all history"
                  onClick={() => {
                    haptic("action");
                    if (history.length) {
                      clearHistory();
                      toast.success("History cleared");
                    }
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs",
                    "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                    "transition-colors",
                    history.length === 0 && "opacity-40 pointer-events-none",
                  )}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </button>
                <button
                  type="button"
                  aria-label="Close history"
                  onClick={onClose}
                  className="rounded-full p-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* search + filter */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search calculations…"
                  aria-label="Search history"
                  className={cn(
                    "w-full rounded-full bg-muted/60 pl-9 pr-3 py-2 text-sm",
                    "outline-none ring-1 ring-border/50 focus:ring-2 focus:ring-primary/40",
                    "placeholder:text-muted-foreground/60",
                  )}
                />
              </div>
              <button
                type="button"
                aria-label="Show favorites only"
                aria-pressed={favOnly}
                onClick={() => {
                  haptic("action");
                  setFavOnly((v) => !v);
                }}
                className={cn(
                  "rounded-full p-2.5 ring-1 ring-border/50 transition-colors",
                  favOnly
                    ? "bg-accent/20 text-accent-foreground"
                    : "bg-muted/60 text-muted-foreground hover:text-foreground",
                )}
              >
                <Star
                  className={cn("h-4 w-4", favOnly && "fill-current")}
                />
              </button>
            </div>

            {/* list */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 text-center">
                  <div className="rounded-full bg-muted/60 p-4 mb-3">
                    <HistoryIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium">
                    {history.length === 0
                      ? "No calculations yet"
                      : "No matches found"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[18rem]">
                    {history.length === 0
                      ? "Your calculations will appear here, synced across your devices when you sign in."
                      : "Try a different search or turn off the favorites filter."}
                  </p>
                </div>
              ) : (
                <ul className="flex flex-col gap-1.5">
                  {filtered.map((h) => (
                    <motion.li
                      key={h.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 24 }}
                      className={cn(
                        "group relative rounded-2xl p-3",
                        "bg-card hover:bg-accent/5 transition-colors",
                        "ring-1 ring-border/50",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          haptic("action");
                          reuseExpression(h.expression);
                          onClose();
                        }}
                        className="block w-full text-left"
                        aria-label={`Reuse expression ${h.expression}`}
                      >
                        <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-primary">
                            {h.mode}
                          </span>
                          <time
                            dateTime={new Date(h.createdAt).toISOString()}
                            className="tabular-nums"
                          >
                            {formatTime(h.createdAt)}
                          </time>
                        </div>
                        <div className="overflow-x-auto scrollbar-thin text-sm text-foreground/70 mb-1">
                          {h.latex ? <Latex>{h.latex}</Latex> : <span className="font-mono">{h.expression}</span>}
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-muted-foreground/50 text-sm">=</span>
                          <span className="text-lg font-semibold tabular-nums">
                            {h.result}
                          </span>
                        </div>
                      </button>

                      {/* row actions */}
                      <div className="absolute right-2 top-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <RowAction
                          label={h.favorite ? "Unfavorite" : "Favorite"}
                          onClick={(e) => {
                            e.stopPropagation();
                            haptic("tap");
                            toggleFavorite(h.id);
                          }}
                          active={h.favorite}
                        >
                          <Star className={cn("h-3.5 w-3.5", h.favorite && "fill-current")} />
                        </RowAction>
                        <RowAction
                          label="Copy result"
                          onClick={async (e) => {
                            e.stopPropagation();
                            haptic("action");
                            try {
                              await navigator.clipboard.writeText(h.result);
                              toast.success("Copied to clipboard");
                            } catch {
                              toast.error("Couldn't copy");
                            }
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </RowAction>
                        <RowAction
                          label="Share"
                          onClick={async (e) => {
                            e.stopPropagation();
                            haptic("action");
                            const text = `${h.expression} = ${h.result}`;
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
                          }}
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </RowAction>
                        <RowAction
                          label="Delete"
                          destructive
                          onClick={(e) => {
                            e.stopPropagation();
                            haptic("action");
                            deleteHistory(h.id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </RowAction>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* footer */}
            <div className="safe-bottom flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <RotateCcw className="h-3.5 w-3.5" />
                Tap a row to reuse
              </span>
              <span>Stored locally on this device</span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function RowAction({
  children,
  label,
  onClick,
  active,
  destructive,
}: {
  children: React.ReactNode;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  active?: boolean;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={cn(
        "rounded-full p-1.5 backdrop-blur bg-background/80",
        "transition-colors",
        active
          ? "text-accent"
          : destructive
            ? "text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
      )}
    >
      {children}
    </button>
  );
}

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
