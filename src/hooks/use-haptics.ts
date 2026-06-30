"use client";

import { useCallback } from "react";
import { useCalc } from "@/store/calc";

/**
 * useHaptics — wraps the Vibration API with a fallback to nothing on
 * platforms that don't support it. Honors the user's setting and
 * chosen intensity.
 */
export function useHaptics() {
  const enabled = useCalc((s) => s.settings.haptics);
  const intensity = useCalc((s) => s.settings.hapticIntensity);

  return useCallback(
    (pattern: "tap" | "action" | "success" | "error" = "tap") => {
      if (!enabled) return;
      if (typeof navigator === "undefined" || !navigator.vibrate) return;

      const base = {
        tap: 8,
        action: 15,
        success: [10, 30, 10],
        error: [30, 50, 30],
      }[pattern];

      const scale =
        intensity === "light" ? 1 : intensity === "medium" ? 1.5 : 2.2;

      const scaled = Array.isArray(base)
        ? base.map((d) => Math.round(d * scale))
        : Math.round(base * scale);

      try {
        navigator.vibrate(scaled);
      } catch {
        /* no-op */
      }
    },
    [enabled, intensity],
  );
}
