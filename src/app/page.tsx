"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/calc/TopBar";
import { Display } from "@/components/calc/Display";
import { NormalKeypad } from "@/components/calc/NormalKeypad";
import { ScientificKeypad } from "@/components/calc/ScientificKeypad";
import { HistoryPanel } from "@/components/calc/HistoryPanel";
import { SolverDrawer } from "@/components/calc/SolverDrawer";
import { SettingsSheet } from "@/components/calc/SettingsSheet";
import { ThemeSync } from "@/components/calc/ThemeSync";
import { useCalc } from "@/store/calc";

export default function Page() {
  const mode = useCalc((s) => s.mode);
  const setMode = useCalc((s) => s.setMode);
  const orientation = useCalc((s) => s.settings.orientation);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Keyboard support — desktop / physical keyboards
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const k = e.key;
      const st = useCalc.getState();
      if (/^[0-9]$/.test(k)) { st.insert(k); return; }
      if (k === ".") { st.insert("."); return; }
      if (k === "+") { st.insert("+"); return; }
      if (k === "-") { st.insert("-"); return; }
      if (k === "*") { st.insert("*"); return; }
      if (k === "/") { e.preventDefault(); st.insert("/"); return; }
      if (k === "^") { st.insert("^"); return; }
      if (k === "%") { st.insert("%"); return; }
      if (k === "(") { st.insert("("); return; }
      if (k === ")") { st.insert(")"); return; }
      if (k === "Enter" || k === "=") { e.preventDefault(); st.equals(); return; }
      if (k === "Backspace") { e.preventDefault(); st.backspace(); return; }
      if (k === "Escape") { st.clearAll(); return; }
      if (k === "u" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); st.undo(); return; }
      if (k === "y" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); st.redo(); return; }
      if (k === "h" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setHistoryOpen((v) => !v); return; }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Auto-switch mode based on viewport orientation, but only when
  // the user has chosen "auto" orientation. In portrait/landscape
  // modes the user's explicit choice wins.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (orientation !== "auto") return;

    const mq = window.matchMedia("(orientation: landscape)");
    function applyMatch(matches: boolean) {
      const wantScientific = matches;
      const current = useCalc.getState().mode;
      if (wantScientific && current === "normal") setMode("scientific");
      if (!wantScientific && current === "scientific") setMode("normal");
    }
    applyMatch(mq.matches);
    function onChange(e: MediaQueryListEvent) {
      if (useCalc.getState().settings.orientation !== "auto") return;
      applyMatch(e.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [setMode, orientation]);

  // Try to lock the device orientation via the Screen Orientation
  // API when running as an installed PWA. No-op on desktop browsers.
  useEffect(() => {
    if (typeof screen === "undefined") return;
    const lockTarget =
      orientation === "portrait"
        ? "portrait"
        : orientation === "landscape"
          ? "landscape"
          : null;
    if (!lockTarget) return;
    const so = (screen as Screen & {
      orientation?: { lock?: (o: string) => Promise<void> };
    }).orientation;
    if (so?.lock) {
      so.lock(lockTarget).catch(() => {
        /* locking requires fullscreen; silently ignore */
      });
    }
  }, [orientation]);

  return (
    <>
      <ThemeSync />
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <div className="mx-auto w-full max-w-screen-md flex flex-col flex-1">
          <TopBar
            onOpenHistory={() => setHistoryOpen(true)}
            onOpenSettings={() => setSettingsOpen(true)}
          />

          <main className="flex-1 flex flex-col">
            <Display />

            <div className="flex-1 flex flex-col justify-end">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8, scale: 0.995 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.995 }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="flex-1"
                >
                  {mode === "normal" ? <NormalKeypad /> : <ScientificKeypad />}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <footer className="safe-bottom px-4 pb-2 pt-1 text-center">
            <p className="text-[0.7rem] text-muted-foreground/70">
              OpenCalc · MIT · press{" "}
              <kbd className="rounded bg-muted px-1 py-0.5 text-[0.65rem] font-mono">
                =
              </kbd>{" "}
              to solve ·{" "}
              <kbd className="rounded bg-muted px-1 py-0.5 text-[0.65rem] font-mono">
                Esc
              </kbd>{" "}
              to clear
            </p>
          </footer>
        </div>
      </div>

      <HistoryPanel open={historyOpen} onClose={() => setHistoryOpen(false)} />
      <SolverDrawer />
      <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
