"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sun,
  Moon,
  Vibrate,
  Cloud,
  Trash2,
  Info,
  Github,
  Heart,
  Smartphone,
  RotateCcw,
} from "lucide-react";
import { useCalc } from "@/store/calc";
import { useHaptics } from "@/hooks/use-haptics";
import { SegmentedToggle } from "./SegmentedToggle";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsSheet({ open, onClose }: SettingsSheetProps) {
  const settings = useCalc((s) => s.settings);
  const setSettings = useCalc((s) => s.setSettings);
  const setOrientation = useCalc((s) => s.setOrientation);
  const theme = useCalc((s) => s.theme);
  const setTheme = useCalc((s) => s.setTheme);
  const clearHistory = useCalc((s) => s.clearHistory);
  const historyCount = useCalc((s) => s.history.length);
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
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.6 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "relative w-full sm:max-w-lg",
              "bg-background rounded-t-3xl sm:rounded-3xl",
              "ring-1 ring-border shadow-2xl",
              "flex flex-col max-h-[88vh]",
            )}
            role="dialog"
            aria-label="Settings"
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h2 className="text-base font-semibold">Settings</h2>
              <button
                type="button"
                aria-label="Close settings"
                onClick={onClose}
                className="rounded-full p-2 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4 flex flex-col gap-5">
              {/* Appearance */}
              <Section title="Appearance">
                <Row
                  icon={<Sun className="h-4 w-4" />}
                  title="Theme"
                  subtitle="Switch between light and dark"
                >
                  <SegmentedToggle
                    aria-label="Theme"
                    size="sm"
                    value={theme}
                    onChange={(v) => {
                      haptic("action");
                      setTheme(v);
                    }}
                    options={[
                      { value: "light", label: "Light", icon: <Sun className="h-3.5 w-3.5" /> },
                      { value: "dark", label: "Dark", icon: <Moon className="h-3.5 w-3.5" /> },
                    ]}
                  />
                </Row>
                <Row
                  icon={<Smartphone className="h-4 w-4" />}
                  title="Orientation"
                  subtitle="Lock to portrait or landscape, or follow device"
                >
                  <SegmentedToggle
                    aria-label="Orientation preference"
                    size="sm"
                    value={settings.orientation}
                    onChange={(v) => {
                      haptic("action");
                      setOrientation(v);
                      if (v !== "auto") {
                        toast.info(
                          v === "portrait"
                            ? "Locked to portrait · Normal calculator"
                            : "Locked to landscape · Scientific calculator",
                        );
                      }
                    }}
                    options={[
                      { value: "auto", label: "Auto" },
                      { value: "portrait", label: "Port" },
                      { value: "landscape", label: "Land" },
                    ]}
                  />
                </Row>
              </Section>

              {/* Feedback */}
              <Section title="Feedback">
                <Row
                  icon={<Vibrate className="h-4 w-4" />}
                  title="Haptic feedback"
                  subtitle="Vibrate on key press"
                >
                  <Switch
                    checked={settings.haptics}
                    onCheckedChange={(v) => {
                      haptic("action");
                      setSettings({ haptics: v });
                    }}
                    aria-label="Toggle haptic feedback"
                  />
                </Row>
                <Row
                  icon={<span className="text-xs font-mono w-4 text-center">∠</span>}
                  title="Angle unit"
                  subtitle="DEG = degrees · RAD = radians"
                >
                  <SegmentedToggle
                    aria-label="Angle unit"
                    size="sm"
                    value={settings.angleUnit}
                    onChange={(v) => {
                      haptic("action");
                      setSettings({ angleUnit: v });
                    }}
                    options={[
                      { value: "deg", label: "DEG" },
                      { value: "rad", label: "RAD" },
                    ]}
                  />
                </Row>
                {settings.haptics && (
                  <Row
                    icon={<span className="text-xs font-mono w-4 text-center">···</span>}
                    title="Intensity"
                    subtitle="How strong each tap feels"
                  >
                    <SegmentedToggle
                      aria-label="Haptic intensity"
                      size="sm"
                      value={settings.hapticIntensity}
                      onChange={(v) => {
                        haptic("action");
                        setSettings({ hapticIntensity: v });
                      }}
                      options={[
                        { value: "light", label: "Light" },
                        { value: "medium", label: "Med" },
                        { value: "heavy", label: "Strong" },
                      ]}
                    />
                  </Row>
                )}
              </Section>

              {/* Sync */}
              <Section title="Cloud sync">
                <Row
                  icon={<Cloud className="h-4 w-4" />}
                  title="Sync history to cloud"
                  subtitle="Sign in to back up across devices"
                >
                  <Switch
                    checked={settings.cloudSync}
                    onCheckedChange={(v) => {
                      haptic("action");
                      setSettings({ cloudSync: v });
                      if (v) {
                        toast.info("Cloud sync is queued for the next release");
                      }
                    }}
                    aria-label="Toggle cloud sync"
                  />
                </Row>
                <div className="rounded-xl bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  Cloud sync (Supabase) is on the roadmap. Your history is currently
                  stored locally on this device, with full offline support.
                </div>
              </Section>

              {/* Data */}
              <Section title="Data">
                <Row
                  icon={<Trash2 className="h-4 w-4" />}
                  title="Clear all history"
                  subtitle={`${historyCount} calculation${historyCount === 1 ? "" : "s"} stored`}
                >
                  <button
                    type="button"
                    disabled={historyCount === 0}
                    onClick={() => {
                      haptic("action");
                      clearHistory();
                      toast.success("History cleared");
                    }}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-xs font-medium",
                      "bg-destructive/10 text-destructive hover:bg-destructive/15",
                      "disabled:opacity-40 disabled:pointer-events-none",
                      "transition-colors",
                    )}
                  >
                    Clear
                  </button>
                </Row>
              </Section>

              {/* About */}
              <Section title="About">
                <Row
                  icon={<Info className="h-4 w-4" />}
                  title="OpenCalc"
                  subtitle="Version 1.0.0 · MIT License"
                >
                  <span className="text-xs text-muted-foreground">v1.0.0</span>
                </Row>
                <Row
                  icon={<Github className="h-4 w-4" />}
                  title="Source on GitHub"
                  subtitle="Contribute, report issues, star the repo"
                >
                  <span className="text-xs text-muted-foreground">→</span>
                </Row>
                <Row
                  icon={<Heart className="h-4 w-4" />}
                  title="Made with care"
                  subtitle="Built by open-source contributors"
                >
                  <span className="text-xs text-muted-foreground">♥</span>
                </Row>
              </Section>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-2 px-1">
        {title}
      </h3>
      <div className="flex flex-col gap-1.5">{children}</div>
    </section>
  );
}

function Row({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-card ring-1 ring-border/50 px-3 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted/60 text-foreground shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm font-medium truncate">{title}</div>
          <div className="text-xs text-muted-foreground truncate">
            {subtitle}
          </div>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
