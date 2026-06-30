"use client";

import { Calculator, FlaskConical, Sun, Moon, History as HistoryIcon, Settings as SettingsIcon } from "lucide-react";
import { SegmentedToggle } from "./SegmentedToggle";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";

interface TopBarProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
}

export function TopBar({ onOpenHistory, onOpenSettings }: TopBarProps) {
  const mode = useCalc((s) => s.mode);
  const setMode = useCalc((s) => s.setMode);
  const theme = useCalc((s) => s.theme);
  const setTheme = useCalc((s) => s.setTheme);
  const haptic = useHaptics();

  return (
    <header className="safe-top px-4 pt-3 pb-2">
      <div className="flex items-center justify-between gap-2">
        {/* Brand + history button */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            aria-label="Open history"
            onClick={() => {
              haptic("action");
              onOpenHistory();
            }}
            className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-muted/60 text-foreground hover:bg-foreground/5 transition-colors no-tap-highlight"
          >
            <HistoryIcon className="h-5 w-5" />
          </button>
          <div className="hidden sm:flex flex-col leading-tight min-w-0">
            <span className="text-sm font-semibold truncate">OpenCalc</span>
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Open source · MIT
            </span>
          </div>
        </div>

        {/* Mode toggle (left/center on mobile, center on desktop) */}
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
            { value: "scientific", label: "Scientific", icon: <FlaskConical className="h-3.5 w-3.5" /> },
          ]}
        />

        {/* Theme toggle + settings */}
        <div className="flex items-center gap-2">
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
    </header>
  );
}
