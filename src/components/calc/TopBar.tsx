"use client";

import {
  Calculator,
  FlaskConical,
  ArrowLeftRight,
  Sun,
  Moon,
  History as HistoryIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { SegmentedToggle } from "./SegmentedToggle";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";

interface TopBarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

/**
 * TopBar — two-row layout to guarantee the History button is never
 * obscured by the mode toggle.
 *
 *   Row 1 (always):  [History] [brand]      [Theme] [Settings]
 *   Row 2 (always):              [Mode toggle (Normal/Sci/Convert)]
 *
 * On wide screens (md+), both rows are still rendered but the
 * second row is centred and tight, so the layout looks like a
 * single cohesive header. This avoids the previous bug where the
 * 3-option mode toggle grew wide enough on small screens to slide
 * under the History icon.
 */
export function TopBar({ onOpenHistory, onOpenSettings }: TopBarProps) {
  const mode = useCalc((s) => s.mode);
  const setMode = useCalc((s) => s.setMode);
  const theme = useCalc((s) => s.theme);
  const setTheme = useCalc((s) => s.setTheme);
  const historyCount = useCalc((s) => s.history.length);
  const haptic = useHaptics();

  return (
    <header className="safe-top px-3 pt-3 pb-2 flex flex-col gap-2">
      {/* Row 1: History + brand on left, Theme + Settings on right */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            aria-label={`Open history${historyCount > 0 ? ` (${historyCount} calculation${historyCount === 1 ? "" : "s"})` : ""}`}
            onClick={() => {
              haptic("action");
              onOpenHistory();
            }}
            className="relative inline-flex items-center justify-center rounded-full h-10 w-10 bg-muted/60 text-foreground hover:bg-foreground/5 transition-colors no-tap-highlight shrink-0"
          >
            <HistoryIcon className="h-5 w-5" />
            {historyCount > 0 && (
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[0.6rem] font-semibold flex items-center justify-center ring-2 ring-background"
              >
                {historyCount > 99 ? "99+" : historyCount}
              </span>
            )}
          </button>
          <div className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold truncate">OpenCalc</span>
            <span className="hidden sm:inline text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Open source · MIT
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SegmentedToggle
            aria-label="Theme"
            size="sm"
            value={theme}
            onChange={(v) => {
              haptic("action");
              setTheme(v);
            }}
            options={[
              { value: "light", label: "", icon: <Sun className="h-4 w-4" /> },
              { value: "dark", label: "", icon: <Moon className="h-4 w-4" /> },
            ]}
          />
          <button
            type="button"
            aria-label="Settings"
            onClick={() => {
              haptic("action");
              onOpenSettings();
            }}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-muted/60 text-foreground hover:bg-foreground/5 transition-colors no-tap-highlight"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Row 2: mode toggle, centred */}
      <div className="flex justify-center">
        <SegmentedToggle
          aria-label="Calculator mode"
          size="sm"
          value={mode}
          onChange={(v) => {
            haptic("action");
            setMode(v);
          }}
          options={[
            { value: "normal", label: "Normal", icon: <Calculator className="h-3.5 w-3.5" /> },
            { value: "scientific", label: "Sci", icon: <FlaskConical className="h-3.5 w-3.5" /> },
            { value: "converter", label: "Convert", icon: <ArrowLeftRight className="h-3.5 w-3.5" /> },
          ]}
        />
      </div>
    </header>
  );
}
