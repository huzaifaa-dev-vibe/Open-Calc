"use client";

import { useRef } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

interface LatexProps {
  children: string;
  display?: boolean;
  className?: string;
  fallbackClassName?: string;
}

/**
 * Latex — renders a string of TeX using KaTeX.
 *
 * Implementation note: we use a ref + manual innerHTML assignment
 * instead of state + useEffect so we don't trigger an extra render
 * cycle on every keystroke. KaTeX throws on malformed input, which
 * we catch and use to fall back to a styled monospace rendering.
 */
export function Latex({
  children,
  display = false,
  className,
  fallbackClassName,
}: LatexProps) {
  const ref = useRef<HTMLSpanElement>(null);
  let html: string | null = null;
  let failed = false;

  if (children) {
    try {
      html = katex.renderToString(children, {
        displayMode: display,
        throwOnError: true,
        output: "html",
        strict: false,
        trust: false,
        macros: {
          "\\deg": "^{\\circ}",
        },
      });
    } catch {
      failed = true;
      html = null;
    }
  }

  // Keep the ref attached to the DOM node for callers that need it,
  // but we render via dangerouslySetInnerHTML to avoid an extra state.
  if (!children) return null;

  if (failed) {
    return (
      <span
        ref={ref}
        className={cn(
          "font-mono whitespace-pre-wrap break-words",
          display && "block py-1",
          fallbackClassName,
          className,
        )}
        aria-label={children.replace(/\\/g, " ").replace(/[{}]/g, "")}
      >
        {children}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={className}
      aria-label={children.replace(/\\/g, " ").replace(/[{}]/g, "")}
      dangerouslySetInnerHTML={{ __html: html ?? "" }}
    />
  );
}
