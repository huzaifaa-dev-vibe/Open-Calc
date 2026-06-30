"use client";

import { useEffect } from "react";
import { useCalc } from "@/store/calc";

/**
 * ThemeSync — a no-op component that lives at the top of the tree
 * and keeps <html>'s classList in sync with the persisted theme
 * preference. Mounted once in page.tsx.
 */
export function ThemeSync() {
  const theme = useCalc((s) => s.theme);
  const setTheme = useCalc((s) => s.setTheme);

  // On first mount, respect the system preference if nothing was restored.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("opencalc-v1");
    if (!stored || !stored.includes('"theme"')) {
      const dark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
      setTheme(dark ? "dark" : "light");
    }
  }, [setTheme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = theme;
  }, [theme]);

  return null;
}
