/**
 * OpenCalc unit converter
 * ------------------------------------------------------------------
 * A small, self-contained unit catalogue covering 13 common physical
 * categories (~80 units total). Conversions go through mathjs, which
 * already knows how to convert within and across compatible units.
 *
 * Temperature is special-cased because it uses offsets (°C ↔ °F) in
 * addition to ratios, but mathjs handles that too via `degC`, `degF`,
 * and `K` — we just expose friendlier aliases.
 */

import { math } from "./engine";

export interface UnitDef {
  /** mathjs symbol, e.g. "km" — what we pass to `math.unit()` */
  symbol: string;
  /** Display label, e.g. "Kilometre" */
  label: string;
  /** Short symbol shown in chips, e.g. "km" */
  short: string;
}

export interface UnitCategory {
  id: string;
  label: string;
  icon: string; // emoji for compact display
  units: UnitDef[];
}

export const CATEGORIES: UnitCategory[] = [
  {
    id: "length",
    label: "Length",
    icon: "📏",
    units: [
      { symbol: "nm", label: "Nanometre", short: "nm" },
      { symbol: "um", label: "Micrometre", short: "µm" },
      { symbol: "mm", label: "Millimetre", short: "mm" },
      { symbol: "cm", label: "Centimetre", short: "cm" },
      { symbol: "m", label: "Metre", short: "m" },
      { symbol: "km", label: "Kilometre", short: "km" },
      { symbol: "in", label: "Inch", short: "in" },
      { symbol: "ft", label: "Foot", short: "ft" },
      { symbol: "yd", label: "Yard", short: "yd" },
      { symbol: "mi", label: "Mile", short: "mi" },
      { symbol: "nmi", label: "Nautical mile", short: "nmi" },
      { symbol: "angstrom", label: "Ångström", short: "Å" },
      { symbol: "lightyear", label: "Light-year", short: "ly" },
    ],
  },
  {
    id: "mass",
    label: "Mass",
    icon: "⚖️",
    units: [
      { symbol: "ug", label: "Microgram", short: "µg" },
      { symbol: "mg", label: "Milligram", short: "mg" },
      { symbol: "g", label: "Gram", short: "g" },
      { symbol: "kg", label: "Kilogram", short: "kg" },
      { symbol: "tonne", label: "Tonne (metric)", short: "t" },
      { symbol: "ton", label: "US ton", short: "ton" },
      { symbol: "grain", label: "Grain", short: "gr" },
      { symbol: "oz", label: "Ounce", short: "oz" },
      { symbol: "lb", label: "Pound", short: "lb" },
      { symbol: "stone", label: "Stone", short: "st" },
      { symbol: "ct", label: "Carat", short: "ct" },
    ],
  },
  {
    id: "temperature",
    label: "Temperature",
    icon: "🌡️",
    units: [
      { symbol: "degC", label: "Celsius", short: "°C" },
      { symbol: "degF", label: "Fahrenheit", short: "°F" },
      { symbol: "K", label: "Kelvin", short: "K" },
      { symbol: "degR", label: "Rankine", short: "°R" },
    ],
  },
  {
    id: "area",
    label: "Area",
    icon: "🟧",
    units: [
      { symbol: "mm2", label: "Square millimetre", short: "mm²" },
      { symbol: "cm2", label: "Square centimetre", short: "cm²" },
      { symbol: "m2", label: "Square metre", short: "m²" },
      { symbol: "ha", label: "Hectare", short: "ha" },
      { symbol: "km2", label: "Square kilometre", short: "km²" },
      { symbol: "in2", label: "Square inch", short: "in²" },
      { symbol: "ft2", label: "Square foot", short: "ft²" },
      { symbol: "yd2", label: "Square yard", short: "yd²" },
      { symbol: "acre", label: "Acre", short: "ac" },
      { symbol: "mi2", label: "Square mile", short: "mi²" },
    ],
  },
  {
    id: "volume",
    label: "Volume",
    icon: "🧊",
    units: [
      { symbol: "mm3", label: "Cubic millimetre", short: "mm³" },
      { symbol: "cm3", label: "Cubic centimetre", short: "cm³" },
      { symbol: "ml", label: "Millilitre", short: "mL" },
      { symbol: "cl", label: "Centilitre", short: "cL" },
      { symbol: "l", label: "Litre", short: "L" },
      { symbol: "m3", label: "Cubic metre", short: "m³" },
      { symbol: "tsp", label: "Teaspoon (US)", short: "tsp" },
      { symbol: "tbsp", label: "Tablespoon (US)", short: "tbsp" },
      { symbol: "floz", label: "Fluid ounce (US)", short: "fl oz" },
      { symbol: "cup", label: "Cup (US)", short: "cup" },
      { symbol: "pt", label: "Pint (US)", short: "pt" },
      { symbol: "qt", label: "Quart (US)", short: "qt" },
      { symbol: "gal", label: "Gallon (US)", short: "gal" },
      { symbol: "bbl", label: "Barrel (oil)", short: "bbl" },
    ],
  },
  {
    id: "time",
    label: "Time",
    icon: "⏱️",
    units: [
      { symbol: "ns", label: "Nanosecond", short: "ns" },
      { symbol: "us", label: "Microsecond", short: "µs" },
      { symbol: "ms", label: "Millisecond", short: "ms" },
      { symbol: "s", label: "Second", short: "s" },
      { symbol: "min", label: "Minute", short: "min" },
      { symbol: "h", label: "Hour", short: "h" },
      { symbol: "day", label: "Day", short: "d" },
      { symbol: "week", label: "Week", short: "wk" },
      { symbol: "month", label: "Month", short: "mo" },
      { symbol: "year", label: "Year", short: "yr" },
      { symbol: "decade", label: "Decade", short: "dec" },
      { symbol: "century", label: "Century", short: "c" },
    ],
  },
  {
    id: "speed",
    label: "Speed",
    icon: "💨",
    units: [
      { symbol: "m/s", label: "Metre / second", short: "m/s" },
      { symbol: "km/h", label: "Kilometre / hour", short: "km/h" },
      { symbol: "mi/h", label: "Mile / hour", short: "mph" },
      { symbol: "ft/s", label: "Foot / second", short: "ft/s" },
      { symbol: "knot", label: "Knot", short: "kn" },
      { symbol: "mach", label: "Mach (at sea level)", short: "Ma" },
      { symbol: "c", label: "Speed of light", short: "c" },
    ],
  },
  {
    id: "digital",
    label: "Digital storage",
    icon: "💾",
    units: [
      { symbol: "bits", label: "Bit", short: "bit" },
      { symbol: "bytes", label: "Byte", short: "B" },
      { symbol: "Kbits", label: "Kilobit", short: "kb" },
      { symbol: "Kbytes", label: "Kilobyte", short: "KB" },
      { symbol: "Mbits", label: "Megabit", short: "Mb" },
      { symbol: "Mbytes", label: "Megabyte", short: "MB" },
      { symbol: "Gbits", label: "Gigabit", short: "Gb" },
      { symbol: "Gbytes", label: "Gigabyte", short: "GB" },
      { symbol: "Tbytes", label: "Terabyte", short: "TB" },
      { symbol: "Pbytes", label: "Petabyte", short: "PB" },
    ],
  },
  {
    id: "energy",
    label: "Energy",
    icon: "⚡",
    units: [
      { symbol: "J", label: "Joule", short: "J" },
      { symbol: "kJ", label: "Kilojoule", short: "kJ" },
      { symbol: "cal", label: "Calorie", short: "cal" },
      { symbol: "kcal", label: "Kilocalorie", short: "kcal" },
      { symbol: "Wh", label: "Watt-hour", short: "Wh" },
      { symbol: "kWh", label: "Kilowatt-hour", short: "kWh" },
      { symbol: "BTU", label: "British thermal unit", short: "BTU" },
      { symbol: "eV", label: "Electronvolt", short: "eV" },
      { symbol: "therm", label: "Therm", short: "therm" },
    ],
  },
  {
    id: "power",
    label: "Power",
    icon: "🔌",
    units: [
      { symbol: "mW", label: "Milliwatt", short: "mW" },
      { symbol: "W", label: "Watt", short: "W" },
      { symbol: "kW", label: "Kilowatt", short: "kW" },
      { symbol: "MW", label: "Megawatt", short: "MW" },
      { symbol: "GW", label: "Gigawatt", short: "GW" },
      { symbol: "hp", label: "Horsepower (mechanical)", short: "hp" },
      { symbol: "BTU/h", label: "BTU / hour", short: "BTU/h" },
    ],
  },
  {
    id: "pressure",
    label: "Pressure",
    icon: "🎈",
    units: [
      { symbol: "Pa", label: "Pascal", short: "Pa" },
      { symbol: "kPa", label: "Kilopascal", short: "kPa" },
      { symbol: "MPa", label: "Megapascal", short: "MPa" },
      { symbol: "bar", label: "Bar", short: "bar" },
      { symbol: "atm", label: "Atmosphere", short: "atm" },
      { symbol: "psi", label: "Pound / inch²", short: "psi" },
      { symbol: "mmHg", label: "Millimetre of mercury", short: "mmHg" },
      { symbol: "torr", label: "Torr", short: "Torr" },
    ],
  },
  {
    id: "angle",
    label: "Angle",
    icon: "📐",
    units: [
      { symbol: "rad", label: "Radian", short: "rad" },
      { symbol: "deg", label: "Degree", short: "°" },
      { symbol: "grad", label: "Gradian", short: "grad" },
      { symbol: "arcmin", label: "Arcminute", short: "′" },
      { symbol: "arcsec", label: "Arcsecond", short: "″" },
      { symbol: "cycle", label: "Cycle / turn", short: "cyc" },
    ],
  },
  {
    id: "frequency",
    label: "Frequency",
    icon: "📻",
    units: [
      { symbol: "Hz", label: "Hertz", short: "Hz" },
      { symbol: "kHz", label: "Kilohertz", short: "kHz" },
      { symbol: "MHz", label: "Megahertz", short: "MHz" },
      { symbol: "GHz", label: "Gigahertz", short: "GHz" },
      { symbol: "THz", label: "Terahertz", short: "THz" },
      { symbol: "rpm", label: "Revolutions / minute", short: "rpm" },
    ],
  },
];

/** Count total units across all categories. */
export const TOTAL_UNITS = CATEGORIES.reduce(
  (sum, c) => sum + c.units.length,
  0,
);

export interface ConversionResult {
  ok: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

/** Convert a numeric value from one unit to another. */
export function convertUnit(
  value: number,
  from: string,
  to: string,
): ConversionResult {
  if (!Number.isFinite(value)) {
    return { ok: false, error: "Enter a valid number to convert." };
  }
  try {
    const u = math.unit(value, from);
    const converted = u.to(to);
    const num = converted.toNumber();
    if (!Number.isFinite(num)) {
      return { ok: false, error: "Conversion produced an invalid number." };
    }
    return {
      ok: true,
      value: num,
      formatted: formatConverted(num),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      error: msg.includes("to: unit")
        ? "These units can't be converted between each other."
        : msg,
    };
  }
}

/** Format a converted value — trims trailing zeros but keeps 6 sig digits. */
function formatConverted(value: number): string {
  if (!Number.isFinite(value)) return value > 0 ? "∞" : "-∞";
  if (Number.isInteger(value) && Math.abs(value) < 1e15) return value.toString();
  const abs = Math.abs(value);
  if (abs !== 0 && (abs < 1e-6 || abs >= 1e15)) {
    return value.toExponential(6).replace(/\.?0+e/, "e");
  }
  const fixed = value.toFixed(8);
  return fixed.replace(/\.?0+$/, "");
}
