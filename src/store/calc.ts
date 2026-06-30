/**
 * OpenCalc global store
 * ------------------------------------------------------------------
 * A single Zustand store handles:
 *   - expression buffer + live preview LaTeX
 *   - last result + error
 *   - history (persisted to localStorage, fully searchable)
 *   - memory register (M+, M-, MR, MC)
 *   - undo / redo stacks for the expression buffer
 *   - user settings (theme, mode, haptics, sync)
 *
 * Persistence is selective: only `history`, `favorites`, `memory`, and
 * `settings` are written to disk. Transient state (the live expression)
 * stays in-memory so the app boots into a clean calculator every time.
 */

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  evaluate,
  toLatex,
  setAngleUnit,
  type SolveOutput,
  solveSteps,
} from "@/lib/calc/engine";

export type CalcMode = "normal" | "scientific";
export type ThemeMode = "light" | "dark";

export interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  latex: string;
  createdAt: number;
  mode: CalcMode;
  favorite?: boolean;
}

export interface Settings {
  haptics: boolean;
  hapticIntensity: "light" | "medium" | "heavy";
  cloudSync: boolean;
  angleUnit: "deg" | "rad";
  thousandsSeparator: boolean;
}

interface CalcState {
  // live expression
  expression: string;
  caretPos: number;
  result: string | null;
  error: string | null;
  liveLatex: string;
  liveLatexOk: boolean;
  livePreview: string | null;

  // modes & theme
  mode: CalcMode;
  theme: ThemeMode;
  settings: Settings;

  // history
  history: HistoryEntry[];
  favorites: string[]; // ids

  // memory
  memory: number;
  memoryBanner: string | null;

  // undo / redo
  undoStack: string[];
  redoStack: string[];

  // solver drawer
  solver: SolveOutput | null;
  solverOpen: boolean;

  // actions
  insert: (token: string) => void;
  backspace: () => void;
  clearEntry: () => void;
  clearAll: () => void;
  equals: () => void;
  setMode: (m: CalcMode) => void;
  toggleMode: () => void;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  setSettings: (s: Partial<Settings>) => void;
  memoryAdd: (v: number) => void;
  memorySubtract: (v: number) => void;
  memoryClear: () => void;
  memoryRecall: () => void;
  toggleFavorite: (id: string) => void;
  deleteHistory: (id: string) => void;
  clearHistory: () => void;
  reuseExpression: (expr: string) => void;
  copyResult: () => Promise<boolean>;
  shareResult: () => Promise<boolean>;
  openSolver: () => void;
  closeSolver: () => void;
  undo: () => void;
  redo: () => void;
}

function pushUndo(state: CalcState): Partial<CalcState> {
  return {
    undoStack: [...state.undoStack, state.expression].slice(-50),
    redoStack: [],
  };
}

function recompute(expression: string) {
  if (!expression.trim()) {
    return {
      liveLatex: "",
      liveLatexOk: false,
      livePreview: null,
      result: null,
      error: null,
    };
  }
  const { latex, ok } = toLatex(expression);
  const ev = evaluate(expression);
  if (ev.ok) {
    return {
      liveLatex: latex,
      liveLatexOk: ok,
      livePreview: ev.formatted,
      result: ev.formatted,
      error: null,
    };
  }
  // Don't show an error in real-time while typing — only on equals.
  return {
    liveLatex: latex,
    liveLatexOk: ok,
    livePreview: null,
    result: null,
    error: null,
  };
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useCalc = create<CalcState>()(
  persist(
    (set, get) => {
      // Sync the engine's angle unit with the default settings on first load.
      // When the persisted state rehydrates, `setSettings` is called by the
      // hydration subscriber below to pick up the user's saved choice.
      setAngleUnit("deg");
      return {
      expression: "",
      caretPos: 0,
      result: null,
      error: null,
      liveLatex: "",
      liveLatexOk: false,
      livePreview: null,

      mode: "normal",
      theme:
        typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light",
      settings: {
        haptics: true,
        hapticIntensity: "light",
        cloudSync: false,
        angleUnit: "deg",
        thousandsSeparator: true,
      },

      history: [],
      favorites: [],
      memory: 0,
      memoryBanner: null,
      undoStack: [],
      redoStack: [],
      solver: null,
      solverOpen: false,

      insert: (token) => {
        const state = get();
        const next = state.expression + token;
        set({
          expression: next,
          caretPos: next.length,
          ...pushUndo(state),
          ...recompute(next),
        });
      },

      backspace: () => {
        const state = get();
        if (!state.expression) return;
        const next = state.expression.slice(0, -1);
        set({
          expression: next,
          caretPos: next.length,
          ...pushUndo(state),
          ...recompute(next),
        });
      },

      clearEntry: () => {
        const state = get();
        set({
          expression: "",
          caretPos: 0,
          result: null,
          error: null,
          liveLatex: "",
          liveLatexOk: false,
          livePreview: null,
          ...pushUndo(state),
        });
      },

      clearAll: () => {
        const state = get();
        set({
          expression: "",
          caretPos: 0,
          result: null,
          error: null,
          liveLatex: "",
          liveLatexOk: false,
          livePreview: null,
          solver: null,
          undoStack: [],
          redoStack: [],
        });
      },

      equals: () => {
        const state = get();
        const ev = evaluate(state.expression);
        if (!ev.ok) {
          set({ error: ev.error, result: null });
          return;
        }
        const entry: HistoryEntry = {
          id: makeId(),
          expression: state.expression,
          result: ev.formatted,
          latex: ev.latex,
          createdAt: Date.now(),
          mode: state.mode,
        };
        set({
          result: ev.formatted,
          error: null,
          history: [entry, ...state.history].slice(0, 500),
          solver: solveSteps(state.expression),
        });
      },

      setMode: (m) => set({ mode: m }),
      toggleMode: () =>
        set((s) => ({ mode: s.mode === "normal" ? "scientific" : "normal" })),

      setTheme: (t) => set({ theme: t }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),

      setSettings: (s) =>
        set((state) => {
          const nextSettings = { ...state.settings, ...s };
          // Keep the engine's angle unit in sync with the user's choice.
          if (s.angleUnit) setAngleUnit(s.angleUnit);
          return { settings: nextSettings };
        }),

      memoryAdd: (v) =>
        set((s) => ({
          memory: s.memory + v,
          memoryBanner: `M+ ${v} → M = ${s.memory + v}`,
        })),
      memorySubtract: (v) =>
        set((s) => ({
          memory: s.memory - v,
          memoryBanner: `M− ${v} → M = ${s.memory - v}`,
        })),
      memoryClear: () => set({ memory: 0, memoryBanner: "MC → M = 0" }),
      memoryRecall: () => {
        const s = get();
        const next = s.expression + String(s.memory);
        set({
          expression: next,
          memoryBanner: `MR = ${s.memory}`,
          ...recompute(next),
        });
      },

      toggleFavorite: (id) =>
        set((s) => ({
          history: s.history.map((h) =>
            h.id === id ? { ...h, favorite: !h.favorite } : h,
          ),
          favorites: s.history.find((h) => h.id === id)?.favorite
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      deleteHistory: (id) =>
        set((s) => ({
          history: s.history.filter((h) => h.id !== id),
          favorites: s.favorites.filter((f) => f !== id),
        })),

      clearHistory: () => set({ history: [], favorites: [] }),

      reuseExpression: (expr) =>
        set((s) => ({
          expression: expr,
          caretPos: expr.length,
          ...pushUndo(s),
          ...recompute(expr),
        })),

      copyResult: async () => {
        const { result } = get();
        if (!result) return false;
        try {
          await navigator.clipboard.writeText(result);
          return true;
        } catch {
          return false;
        }
      },

      shareResult: async () => {
        const { expression, result } = get();
        if (!result) return false;
        const text = `${expression} = ${result}`;
        try {
          if (navigator.share) {
            await navigator.share({ title: "OpenCalc", text });
          } else {
            await navigator.clipboard.writeText(text);
          }
          return true;
        } catch {
          return false;
        }
      },

      openSolver: () => {
        const state = get();
        const solver = solveSteps(state.expression);
        set({ solver, solverOpen: true });
      },
      closeSolver: () => set({ solverOpen: false }),

      undo: () => {
        const state = get();
        if (!state.undoStack.length) return;
        const prev = state.undoStack[state.undoStack.length - 1];
        set({
          expression: prev,
          caretPos: prev.length,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, state.expression].slice(-50),
          ...recompute(prev),
        });
      },

      redo: () => {
        const state = get();
        if (!state.redoStack.length) return;
        const next = state.redoStack[state.redoStack.length - 1];
        set({
          expression: next,
          caretPos: next.length,
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, state.expression].slice(-50),
          ...recompute(next),
        });
      },
    };
    },
    {
      name: "opencalc-v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        history: state.history,
        favorites: state.favorites,
        memory: state.memory,
        settings: state.settings,
        theme: state.theme,
        mode: state.mode,
      }),
      onRehydrateStorage: () => (state) => {
        // After the persisted state is restored, push the saved angle
        // unit into the engine so trig functions evaluate correctly.
        if (state?.settings?.angleUnit) {
          setAngleUnit(state.settings.angleUnit);
        }
      },
    },
  ),
);
