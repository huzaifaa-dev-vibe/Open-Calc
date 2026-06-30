/**
 * OpenCalc math engine
 * ------------------------------------------------------------------
 * Wraps mathjs with a small, typed surface that the UI can rely on:
 *   - `evaluate(expr)`        — safe evaluation, returns a Result
 *   - `toLatex(expr)`         — pretty LaTeX rendering of an expression
 *   - `solveSteps(expr)`      — produces a step-by-step explanation
 *   - `formatResult(value)`   — human friendly numeric formatting
 *
 * Design notes
 * ------------
 * - All public functions are pure and side-effect free (other than
 *   reading the current angle unit).
 * - Errors are returned, never thrown, so the UI never has to wrap
 *   calls in try/catch.
 * - Custom functions cot, sec, csc, acot, asec, acsc are registered
 *   with mathjs so they round-trip through parse/toTex/evaluate.
 * - The standard trig functions are wrapped so they respect the
 *   user's angle-unit preference (DEG vs RAD). The expression text
 *   is never mutated — only the evaluation honours the unit.
 */

import { create, all, type MathJsInstance } from "mathjs";

const math: MathJsInstance = create(all, {});

/* ----------------------------------------------------------------
 * Angle unit handling
 * ----------------------------------------------------------------
 * A module-level variable is updated by the store whenever the user
 * changes the DEG/RAD setting. Trig wrappers read it at evaluation
 * time so the same expression yields different results in each mode.
 */
let angleUnit: "deg" | "rad" = "deg";
export function setAngleUnit(u: "deg" | "rad") {
  angleUnit = u;
}
export function getAngleUnit() {
  return angleUnit;
}

const toRad = (x: number) =>
  angleUnit === "deg" ? (x * Math.PI) / 180 : x;
const fromRad = (x: number) =>
  angleUnit === "deg" ? (x * 180) / Math.PI : x;

/* ----------------------------------------------------------------
 * Decimal places
 * ----------------------------------------------------------------
 * The user can choose how many decimal places to round to (or "auto"
 * for the default trim-trailing-zeros behaviour). The store calls
 * `setDecimalPlaces` whenever the setting changes.
 */
let decimalPlaces: number | null = null; // null = auto
export function setDecimalPlaces(n: number | null) {
  decimalPlaces = n;
}
export function getDecimalPlaces() {
  return decimalPlaces;
}

/* ----------------------------------------------------------------
 * Custom + overridden functions
 * ----------------------------------------------------------------
 * Override sin/cos/tan/asin/acos/atan to respect the angle unit,
 * and add cot/sec/csc + their inverses which mathjs lacks.
 *
 * `math.import(..., { override: true })` replaces the built-ins,
 * which is exactly what we want for `evaluate`. `toTex` still emits
 * the standard `\sin`, `\cos`, `\tan`, `\cot`, `\sec`, `\csc` macros
 * — KaTeX understands all of them.
 */
math.import(
  {
    sin: (x: number) => Math.sin(toRad(x)),
    cos: (x: number) => Math.cos(toRad(x)),
    tan: (x: number) => Math.tan(toRad(x)),
    cot: (x: number) => 1 / Math.tan(toRad(x)),
    sec: (x: number) => 1 / Math.cos(toRad(x)),
    csc: (x: number) => 1 / Math.sin(toRad(x)),
    asin: (x: number) => fromRad(Math.asin(x)),
    acos: (x: number) => fromRad(Math.acos(x)),
    atan: (x: number) => fromRad(Math.atan(x)),
    acot: (x: number) => fromRad(Math.PI / 2 - Math.atan(x)),
    asec: (x: number) => fromRad(Math.acos(1 / x)),
    acsc: (x: number) => fromRad(Math.asin(1 / x)),
    // friendlier aliases
    ncr: (n: number, r: number) =>
      math.combinations(n, r),
    npr: (n: number, r: number) =>
      math.permutations(n, r),
    root: (x: number, n: number = 2) => Math.pow(x, 1 / n),
  },
  { override: true },
);

export type EvalResult =
  | { ok: true; value: number; latex: string; formatted: string }
  | { ok: false; error: string };

export interface SolveStep {
  title: string;
  explanation: string;
  latex: string;
  numeric?: string;
}

export interface SolveOutput {
  inputLatex: string;
  steps: SolveStep[];
  finalLatex: string;
  finalValue?: string;
  topic: string;
}

const ALLOWED_UNITS = new Set<string>([
  "sin", "cos", "tan", "asin", "acos", "atan",
  "cot", "sec", "csc", "acot", "asec", "acsc",
  "sinh", "cosh", "tanh", "asinh", "acosh", "atanh",
  "log", "log2", "log10", "ln", "exp",
  "sqrt", "cbrt", "root", "abs", "sign", "round", "floor", "ceil",
  "pi", "e", "tau", "phi", "rand",
  "fact", "gamma",
  "mod", "gcd", "lcm", "ncr", "npr",
]);

/** Normalise decorative characters the user might type or tap. */
function normalize(input: string): string {
  let s = input.trim();
  if (!s) return "";
  s = s
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-")
    .replace(/√/g, "sqrt")
    .replace(/∛/g, "cbrt")
    .replace(/π/g, "pi")
    .replace(/τ/g, "tau")
    .replace(/φ/g, "phi")
    .replace(/∞/g, "Infinity")
    .replace(/\^/g, "^")
    // Calc convention: bare "log(" = base-10, "ln(" = natural
    .replace(/\blog\(/g, "log10(")
    .replace(/\bln\(/g, "log(");
  // Auto-close trailing open parens — friendlier UX
  const opens = (s.match(/\(/g) || []).length;
  const closes = (s.match(/\)/g) || []).length;
  if (opens > closes) s += ")".repeat(opens - closes);
  return s;
}

function isSafe(normalized: string): boolean {
  if (/[;=]/.test(normalized)) return false;
  const identifiers = normalized.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  for (const id of identifiers) {
    if (!ALLOWED_UNITS.has(id)) return false;
  }
  return true;
}

export function evaluate(input: string): EvalResult {
  const normalized = normalize(input);
  if (!normalized) return { ok: false, error: "Empty expression" };
  if (!isSafe(normalized)) {
    return { ok: false, error: "Expression contains unsupported symbols." };
  }
  try {
    const value = math.evaluate(normalized);
    if (typeof value === "number" && Number.isFinite(value)) {
      return {
        ok: true,
        value,
        latex: math.parse(String(value)).toTex({ parenthesis: "auto" }),
        formatted: formatResult(value),
      };
    }
    if (typeof value === "boolean") {
      return {
        ok: true,
        value: value ? 1 : 0,
        latex: value ? "1" : "0",
        formatted: value ? "1" : "0",
      };
    }
    if (value && typeof value.toString === "function") {
      const str = value.toString();
      const num = Number(str);
      if (Number.isFinite(num)) {
        return {
          ok: true,
          value: num,
          latex: math.parse(str).toTex(),
          formatted: formatResult(num),
        };
      }
    }
    return { ok: false, error: "Result is not a finite number." };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: simplifyError(msg) };
  }
}

function simplifyError(msg: string): string {
  const first = msg.split(/\.(?:\s|$)/)[0];
  return first.length > 0 && first.length < msg.length
    ? `${first}.`
    : msg;
}

/**
 * Format a number for display.
 *
 * - If the user has chosen a fixed number of decimal places, round
 *   to that and pad with zeros (so 1.5 with 4 places → "1.5000").
 * - Otherwise (auto), trim trailing zeros but keep up to 10 sig digits.
 * - Very large / very small numbers always use scientific notation.
 */
export function formatResult(value: number): string {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  if (Number.isInteger(value) && decimalPlaces === null) return value.toString();

  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }

  if (decimalPlaces !== null) {
    return value.toFixed(decimalPlaces);
  }

  const fixed = value.toFixed(10);
  return fixed.replace(/\.?0+$/, "");
}

/**
 * Render the user's expression to LaTeX.
 *
 * Returns `{ latex, ok }` so the caller can decide what to show when
 * parsing fails (e.g. while the user is mid-typing an incomplete
 * expression). The `latex` string is always non-empty on success.
 *
 * To make the fraction template `(/)` render as a real stacked
 * fraction while the user is still filling it in, we patch empty
 * slots with a placeholder variable, parse, then replace the
 * placeholder with `\square` (an empty box KaTeX understands).
 */
export function toLatex(input: string): { latex: string; ok: boolean } {
  const normalized = normalize(input);
  if (!normalized) return { latex: "", ok: false };

  // First try a direct parse — fast path for complete expressions.
  try {
    const tex = math
      .parse(normalized)
      .toTex({ parenthesis: "auto", implicit: "hide" });
    return { latex: tex, ok: true };
  } catch {
    /* fall through to placeholder patching */
  }

  // Patch empty fraction slots so mathjs can parse the expression.
  // We use a long, distinctive variable name so it doesn't collide
  // with anything the user might type.
  const PH = "opencalcph";
  let patched = normalized;
  // Empty parens: `()` → `(ph)`
  patched = patched.replace(/\(\s*\)/g, `(${PH})`);
  // Open numerator: `(/` → `(ph/`
  patched = patched.replace(/\(\/g/g, `(${PH}/`).replace(/\(\s*\//g, `(${PH}/`);
  // Empty denominator: `/)` → `/ph)`
  patched = patched.replace(/\/\s*\)/g, `/${PH})`);
  // Trailing operator with nothing after, e.g. `7+` → `7+ph` so it parses
  patched = patched.replace(/[+\-*/^](?=\s*$|\s*\))/g, (m) => m + PH);
  // Trailing function name with no args, e.g. `sin` → `sin(ph)`
  patched = patched.replace(/\b(sin|cos|tan|cot|sec|csc|asin|acos|atan|log|log10|log2|ln|exp|sqrt|cbrt|abs|fact|gamma)\b(?!\s*\()/g, "$1(" + PH + ")");

  try {
    const tex = math
      .parse(patched)
      .toTex({ parenthesis: "auto", implicit: "hide" });
    // Replace the placeholder variable with \square for visual cue.
    // mathjs renders bare variables as \mathit{ph} — strip the wrapping too.
    const cleaned = tex
      .replace(/\\mathit\{opencalcph\}/g, "\\square")
      .replace(/opencalcph/g, "\\square");
    return { latex: cleaned, ok: true };
  } catch {
    return { latex: "", ok: false };
  }
}

function detectTopic(normalized: string): string {
  if (/\b(cot|sec|csc|sin|cos|tan|asin|acos|atan|acot|asec|acsc)\b/.test(normalized))
    return "Trigonometry";
  if (/\b(log|log2|log10|ln|exp)\b/.test(normalized)) return "Logarithms";
  if (/\b(sqrt|cbrt|root|\^|√)\b/.test(normalized)) return "Roots & powers";
  if (/\b(fact|ncr|npr|mod|gcd|lcm)\b/.test(normalized)) return "Combinatorics";
  if (/\//.test(normalized) && !/\b(log|exp|sqrt|sin|cos|tan|cot|sec|csc)\b/.test(normalized))
    return "Fractions";
  return "Arithmetic";
}

export function solveSteps(input: string): SolveOutput | null {
  const normalized = normalize(input);
  if (!normalized) return null;
  const topic = detectTopic(normalized);
  let inputLatex = "";
  try {
    inputLatex = math.parse(normalized).toTex({ parenthesis: "auto" });
  } catch {
    return null;
  }

  const steps: SolveStep[] = [];
  steps.push({
    title: "Expression",
    explanation: "Here is the expression you entered, formatted in mathematical notation.",
    latex: inputLatex,
  });

  try {
    const simplified = math.simplify(normalized);
    const simplifiedTex = simplified.toTex({ parenthesis: "auto" });
    if (simplifiedTex !== inputLatex) {
      steps.push({
        title: "Simplify",
        explanation: "Combine like terms and reduce the expression using algebraic rules.",
        latex: simplifiedTex,
      });
    }
  } catch {
    /* not applicable */
  }

  try {
    const rationalized = math.rationalize(normalized);
    const ratTex = rationalized.toTex({ parenthesis: "auto" });
    const last = steps[steps.length - 1];
    if (!last || last.latex !== ratTex) {
      steps.push({
        title: "Rational form",
        explanation: "Rewrite the expression as a single rational term where possible (numerator / denominator).",
        latex: ratTex,
      });
    }
  } catch {
    /* not applicable */
  }

  const result = evaluate(input);
  if (result.ok) {
    steps.push({
      title: "Evaluate",
      explanation: `Substitute constants and evaluate ${angleUnit === "deg" ? "using degrees" : "using radians"}.`,
      latex: math.parse(String(result.value)).toTex(),
      numeric: result.formatted,
    });
    return {
      inputLatex,
      steps,
      finalLatex: math.parse(String(result.value)).toTex(),
      finalValue: result.formatted,
      topic,
    };
  }

  steps.push({
    title: "Evaluation",
    explanation: result.error,
    latex: "\\text{Error}",
  });
  return {
    inputLatex,
    steps,
    finalLatex: "\\text{Could not evaluate}",
    topic,
  };
}

export const memoryOps = {
  clear: () => 0,
  add: (m: number, v: number) => m + v,
  subtract: (m: number, v: number) => m - v,
  recall: (m: number) => m,
};

export { math };
