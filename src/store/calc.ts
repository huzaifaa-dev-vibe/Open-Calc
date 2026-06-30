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
  setDecimalPlaces,
  type SolveOutput,
  solveSteps,
} from "@/lib/calc/engine";

export type CalcMode = "normal" | "scientific" | "converter";
export type ThemeMode = "light" | "dark";
export type OrientationPref = "auto" | "portrait" | "landscape";

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
  orientation: OrientationPref;
  decimalPlaces: number | null; // null = auto
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
  insertFraction: () => void;
  insertCompoundFraction: () => void;
  moveCaret: (delta: -1 | 1) => void;
  setCaret: (pos: number) => void;
  backspace: () => void;
  clearEntry: () => void;
  clearAll: () => void;
  equals: () => void;
  setMode: (m: CalcMode) => void;
  toggleMode: () => void;
  setTheme: (t: ThemeMode) => void;
  toggleTheme: () => void;
  setSettings: (s: Partial<Settings>) => void;
  setOrientation: (o: OrientationPref) => void;
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
      // Always initialise to "light" on both server and client so SSR
      // HTML matches the first client render (prevents hydration mismatch
      // in SegmentedToggle's `aria-checked` and the sliding thumb position).
      // The real preference is applied inside ThemeSync's useEffect after mount.
      theme: "light",
      settings: {
        haptics: true,
        hapticIntensity: "light",
        cloudSync: false,
        angleUnit: "deg",
        thousandsSeparator: true,
        orientation: "auto",
        decimalPlaces: null,
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
        // Insert at the current caret position so templates like
        // fraction (which leave the caret in the middle of the
        // inserted text) actually work.
        const pos = Math.min(state.caretPos, state.expression.length);
        const next =
          state.expression.slice(0, pos) +
          token +
          state.expression.slice(pos);
        const newCaret = pos + token.length;
        set({
          expression: next,
          caretPos: newCaret,
          ...pushUndo(state),
          ...recompute(next),
        });
      },

      /**
       * Insert a fraction template: `(/)` with the caret positioned
       * between `(` and `/` so the user can type the numerator, then
       * arrow past `/` to type the denominator. KaTeX renders the
       * final `a/b` as a real stacked fraction.
       */
      insertFraction: () => {
        const state = get();
        const token = "(/)";
        const pos = Math.min(state.caretPos, state.expression.length);
        const next =
          state.expression.slice(0, pos) +
          token +
          state.expression.slice(pos);
        // Caret lands inside the parens, before the slash.
        const newCaret = pos + 1;
        set({
          expression: next,
          caretPos: newCaret,
          ...pushUndo(state),
          ...recompute(next),
        });
      },

      /**
       * Insert a compound (nested) fraction template: `(/)/(/)`.
       * Caret lands in the numerator of the outer fraction. The user
       * can fill it in, use arrow keys to move to the denominator,
       * and nest further fractions inside either slot.
       */
      insertCompoundFraction: () => {
        const state = get();
        const token = "(/)/(/)";
        const pos = Math.min(state.caretPos, state.expression.length);
        const next =
          state.expression.slice(0, pos) +
          token +
          state.expression.slice(pos);
        const newCaret = pos + 1;
        set({
          expression: next,
          caretPos: newCaret,
          ...pushUndo(state),
          ...recompute(next),
        });
      },

      moveCaret: (delta) => {
        const state = get();
        const next = Math.max(
          0,
          Math.min(state.expression.length, state.caretPos + delta),
        );
        set({ caretPos: next });
      },

      setCaret: (pos) => {
        const state = get();
        set({
          caretPos: Math.max(0, Math.min(state.expression.length, pos)),
        });
      },

      backspace: () => {
        const state = get();
        if (!state.expression) return;
        // Delete the character before the caret (or the last char if
        // caret is at the end, which matches user expectation).
        const pos =
          state.caretPos >= state.expression.length
            ? state.expression.length
            : state.caretPos;
        if (pos === 0) return;
        const next =
          state.expression.slice(0, pos - 1) +
          state.expression.slice(pos);
        set({
          expression: next,
          caretPos: pos - 1,
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
          // Keep the engine's decimal places in sync too.
          if ("decimalPlaces" in s) setDecimalPlaces(s.decimalPlaces ?? null);
          return { settings: nextSettings };
        }),

      setOrientation: (o) =>
        set((state) => {
          // The orientation preference drives mode auto-switching in
          // page.tsx via an effect that watches this value. Here we
          // just persist the choice and immediately apply the
          // corresponding mode for instant feedback — but only when
          // the user isn't in converter mode (which works in either
          // orientation).
          const nextMode: CalcMode =
            state.mode === "converter"
              ? "converter"
              : o === "portrait"
                ? "normal"
                : o === "landscape"
                  ? "scientific"
                  : state.mode;
          return {
            settings: { ...state.settings, orientation: o },
            mode: nextMode,
          };
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
        // unit and decimal places into the engine so evaluation uses
        // the correct settings from the very first keystroke.
        if (state?.settings?.angleUnit) {
          setAngleUnit(state.settings.angleUnit);
        }
        if (state?.settings && "decimalPlaces" in state.settings) {
          setDecimalPlaces(state.settings.decimalPlaces ?? null);
        }
      },
    },
  ),
);
