"use client";

import { Toaster as Sonner } from "sonner";
import { useCalc } from "@/store/calc";

/**
 * CalcToaster — Sonner toaster themed with the OpenCalc store (so it
 * follows the same dark/light state as the rest of the app, instead of
 * pulling from next-themes which we don't use).
 */
export function CalcToaster() {
  const theme = useCalc((s) => s.theme);
  return (
    <Sonner
      theme={theme}
      position="top-center"
      richColors={false}
      closeButton
      toastOptions={{
        style: {
          background: "var(--popover)",
          color: "var(--popover-foreground)",
          border: "1px solid var(--border)",
          borderRadius: "1rem",
        },
      }}
    />
  );
}
