"use client";

import { useEffect } from "react";
import { useCalc } from "@/store/calc";

/**
 * ThemeSync — a no-op component that lives at the top of the tree and:
 *   1. Waits for Zustand's persist middleware to finish rehydrating from
 *      localStorage (so we don't clobber a saved "dark" choice with the
 *      system preference).
 *   2. If no saved theme exists, falls back to the OS colour-scheme
 *      preference.
 *   3. Reflects the chosen theme onto <html> by toggling the `dark`
 *      class and setting `color-scheme`.
 *
 * Mounted once in page.tsx. Renders nothing.
 *
 * Note: the store always initialises `theme` to "light" so the SSR HTML
 * matches the first client paint (no hydration mismatch). This effect
 * then runs after mount and applies the real preference.
 */
export function ThemeSync() {
  const theme = useCalc((s) => s.theme);
  const setTheme = useCalc((s) => s.setTheme);

  // Apply the system preference once on mount if no persisted theme
  // exists. The `setTheme` call here is fine because it only runs when
  // there's no stored theme — it's a deliberate user-preference default
  // being read from the browser, not a derived state update.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("opencalc-v1");
    const hasStoredTheme = stored && stored.includes('"theme"');
    if (!hasStoredTheme) {
      const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(dark ? "dark" : "light");
    }
    // Intentionally run only once on mount.
  }, [setTheme]);

  // Reflect theme onto <html>. Runs whenever theme changes (after
  // rehydration, after user toggle, etc.) but the first paint already
  // matches SSR because the store defaults to "light".
  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}
