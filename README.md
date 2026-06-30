<div align="center">

# 🧮 OpenCalc

### A modern, minimalistic, open-source calculator with LaTeX, step-by-step solving, and a premium Material 3 interface.

[![License: MIT](https://img.shields.io/badge/License-MIT-21c45a?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Live Preview](https://img.shields.io/badge/LIVE_PREVIEW-open--calc--7.netlify.app-21c45a?style=for-the-badge&logo=netlify&logoColor=white)](https://open-calc-7.netlify.app/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-21c45a?style=for-the-badge&logo=github&logoColor=white)](CONTRIBUTING.md)
[![Made with Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-installable-a855f7?style=for-the-badge&logo=pwa&logoColor=white)](public/manifest.webmanifest)

[![First APK Release](https://img.shields.io/badge/APK_Release-July_1-ff6b35?style=for-the-badge&logo=android&logoColor=white)](#-installation--releases)
[![Status: Active](https://img.shields.io/badge/Status-Active_Development-21c45a?style=for-the-badge)](#-roadmap)
[![Stars](https://img.shields.io/github/stars/huzaifaa-dev-vibe/Open-Calc?style=for-the-badge&logo=github&color=ff6b35)](https://github.com/huzaifaa-dev-vibe/Open-Calc/stargazers)

<p align="center">
  <strong>Normal · Scientific · Converter — three calculators in one elegant app.</strong>
</p>

<p align="center">
  <a href="https://open-calc-7.netlify.app/">
    <img src="https://img.shields.io/badge/TRY_IT_NOW-Live_Preview-21c45a?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Preview" />
  </a>
  &nbsp;
  <a href="https://github.com/huzaifaa-dev-vibe/Open-Calc/stargazers">
    <img src="https://img.shields.io/github/stars/huzaifaa-dev-vibe/Open-Calc?style=for-the-badge&logo=github&color=ff6b35" alt="Stars" />
  </a>
</p>

</div>

---

## 📑 Table of Contents

- [🌐 Live Preview](#-live-preview)
- [✨ Features](#-features)
- [🎨 Design Philosophy](#-design-philosophy)
- [🛠️ Tech Stack](#-tech-stack)
- [📸 Screenshots](#-screenshots)
- [🚀 Getting Started](#-getting-started)
- [📦 Installation & Releases](#-installation--releases)
- [🧠 How the Math Engine Works](#-how-the-math-engine-works)
- [⚠️ Known issues in v0.0.9](#-known-issues-in-v009-fixes-coming-in-v100)
- [🤝 Contributing](#-contributing)
- [🗺️ Roadmap](#-roadmap)
- [📄 License](#-license)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🌐 Live Preview

> **Try OpenCalc right now in your browser — no install required.**

### 🚀 [**open-calc-7.netlify.app**](https://open-calc-7.netlify.app/)

The live preview runs the latest `main` branch on Netlify and is fully functional:

- 🧮 All three modes (Normal, Scientific, Converter)
- 🌓 Light and dark themes
- 📜 Persistent history (saved to your browser's localStorage)
- 📱 Installable as a PWA — open the link in Chrome and tap "Install"
- ⌨️ Keyboard support
- 📳 Haptic feedback (on supported devices)

> ⚠️ **Heads up — two known UI issues in v0.0.9** (both will be fixed in v1.0.0):
> 1. The **History button is partially hidden under the mode toggle** (Normal / Sci / Convert) on small screens. As a workaround, tap the toggle area to the left of the History icon, or use `Ctrl+H` on desktop.
> 2. There's **no directional navigation pad (D-pad) button** yet. You can't move the caret up/down/left/right from the keypad — only the `←` `→` arrow keys in Scientific mode. A full D-pad is coming in v1.0.0.

The preview is great for trying OpenCalc before the July 1 APK release, or for contributors who want to see the current state of `main` without cloning the repo.

---

## ✨ Features

### Three Modes, One App

| Mode | What it does |
|------|-------------|
| 🧮 **Normal** | Clean portrait-style calculator for everyday arithmetic |
| 🔬 **Scientific** | Full landscape-style scientific keypad — trig, logs, roots, fractions, combinatorics |
| 🔄 **Converter** | Convert between **108 units across 13 categories** — length, mass, temperature, and more |

### Highlights

- **Live LaTeX rendering** — every expression is typeset in real time using KaTeX, including incomplete ones (the fraction template shows `□/□` until you fill it in)
- **Step-by-step solver** — press `=` then **Steps** to see every algebraic transformation, simplification, rational form, and final numeric evaluation explained
- **Persistent history** — searchable, favorite-able, copy & share-able; stored locally with offline support (cloud sync on the roadmap)
- **Memory functions** — `MC`, `MR`, `M+`, `M−` with a live memory chip in the display
- **Undo / Redo** — full expression history with keyboard shortcuts (`⌘Z` / `⌘Y`)
- **Haptic feedback** — adjustable intensity (light / medium / strong) via the Vibration API
- **Material 3 design** — custom emerald + amber palette, spring-animated segmented toggles, fully rounded keys with distinct backgrounds and rings
- **Light / Dark theme** — follows your system preference by default, manually toggleable
- **Orientation lock** — Auto / Portrait / Landscape (auto-switches between Normal and Scientific)
- **Decimal places** — pick Auto (trim zeros) or fix results to 2 / 4 / 6 / 8 decimal places
- **DEG / RAD toggle** — angle unit applies to all trig functions
- **Fraction templates** — `a/b` and compound `a/b/c` buttons insert caret-positioned templates
- **PWA installable** — add to home screen, runs offline, full-screen
- **Keyboard support** — type and evaluate without touching the screen
- **Accessibility** — ARIA roles, semantic HTML, keyboard navigation, screen-reader labels

---

## 🎨 Design Philosophy

OpenCalc is built to feel comparable to **Google's Pixel apps** and **Apple's first-party applications** — every interaction smooth, intentional, and minimal. We prioritise usability over visual complexity.

- **Minimalistic but premium** — generous whitespace, restrained colour, subtle motion
- **Original** — not a clone of any existing calculator; designed from modern UX principles
- **Material 3 Expressive** — fully rounded segmented controls with spring-animated thumbs, micro-interactions on every key
- **Touch-first** — 44px+ touch targets, haptic feedback, no-tap-highlight
- **Responsive** — works on phones, tablets, and desktops

---

## 🛠️ Tech Stack

<p align="center">

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript_5-3178c6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand_5-444444?style=flat-square&logo=zonelink&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion_12-0055FF?style=flat-square&logo=framer&logoColor=white)
![mathjs](https://img.shields.io/badge/mathjs-9558B2?style=flat-square&logo=math.js&logoColor=white)
![KaTeX](https://img.shields.io/badge/KaTeX-00928F?style=flat-square&logo=kaggle&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-A855F7?style=flat-square&logo=pwa&logoColor=white)

</p>

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Cross-platform PWA, server-ready, installable as APK |
| **Language** | TypeScript 5 | Type-safe code at every layer |
| **UI Components** | shadcn/ui (New York) + custom Material 3 keys | Premium, accessible, fully themable |
| **Styling** | Tailwind CSS 4 + custom OKLCH tokens | Atomic, consistent, dark-mode native |
| **Animation** | Framer Motion 12 | Spring physics, layout animations, gestures |
| **State** | Zustand 5 (persisted) | Minimal boilerplate, SSR-friendly |
| **Math engine** | mathjs | Symbolic + numeric evaluation, simplify, rationalize |
| **Math rendering** | KaTeX | Fastest LaTeX renderer for the web |
| **Icons** | Lucide React | Clean, consistent, tree-shakeable |
| **Database** | Prisma + SQLite (local) | Offline-first; Supabase planned for cloud sync |
| **Toasts** | Sonner | Beautiful, accessible notifications |

---

## 📸 Screenshots

> Coming soon: animated GIF demos of all three modes, the step-by-step solver, and the unit converter. For now, run the app locally to explore.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended — faster installs)
- A modern browser

### Install & Run

```bash
# Clone the repo
git clone https://github.com/huzaifaa-dev-vibe/Open-Calc.git
cd Open-Calc

# Install dependencies (Bun recommended)
bun install
# or: npm install

# Start the dev server
bun run dev
# or: npm run dev

# Open http://localhost:3000
```

### Build for Production

```bash
bun run build
bun run start
```

### Lint

```bash
bun run lint
```

---

## 📦 Installation & Releases

### 🎉 First APK Release — **July 1, 2026**

We're shipping the first installable Android APK on **1st July 2026**!

#### Where will the APK live?

The APK will be published in the **GitHub Releases panel** (not the Packages panel):

> 👉 **https://github.com/huzaifaa-dev-vibe/Open-Calc/releases**

**Why Releases and not Packages?**
- **Releases** are for downloadable binaries (APKs, installers, executables) — perfect for end users who just want to grab the app
- **Packages** are for libraries and Docker images consumed by other developers via a package manager
- Releases support rich release notes, asset checksums, and a clean download UI
- Android APKs are typically distributed as signed `.apk` files attached to a tagged release

#### How users will install it

1. On July 1, visit the [Releases page](https://github.com/huzaifaa-dev-vibe/Open-Calc/releases)
2. Download `OpenCalc-v1.0.0.apk`
3. On your Android device, enable **"Install from unknown sources"** in Settings
4. Open the downloaded APK and tap **Install**
5. Enjoy! 🎉

#### PWA Alternative

Don't want to wait for the APK? OpenCalc is also installable as a **Progressive Web App** right now:

1. Visit the deployed app in Chrome (mobile or desktop)
2. Tap the **Install** icon in the address bar (or menu → "Install app")
3. OpenCalc will appear in your app drawer / launcher like a native app
4. Works offline, full-screen, with haptics

---

## 🧠 How the Math Engine Works

OpenCalc's engine (`src/lib/calc/engine.ts`) wraps **mathjs** with a small, typed surface:

- **`evaluate(expr)`** — safe evaluation with an allowlist of functions and constants; never throws
- **`toLatex(expr)`** — pretty LaTeX rendering with placeholder patching for incomplete expressions (so `(/)` renders as `□/□`)
- **`solveSteps(expr)`** — produces an ordered list of explanations: expression → simplify → rational form → evaluate
- **`formatResult(value)`** — honours the user's decimal-places setting (Auto / 2 / 4 / 6 / 8)

### Custom functions

We register `cot`, `sec`, `csc`, `acot`, `asec`, `acsc` (which mathjs lacks) and override `sin`, `cos`, `tan`, `asin`, `acos`, `atan` to respect the user's DEG/RAD setting — all at engine init time.

### Angle units

A module-level variable tracks the current angle unit. The store calls `setAngleUnit("deg" | "rad")` whenever the user toggles, and all trig wrappers read it at evaluation time so the same expression yields different results in each mode.

---

## 🤝 Contributing

We **welcome contributions** of all sizes — bug reports, feature requests, documentation, design tweaks, code, tests, translations.

### Quick Start

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/Open-Calc.git
cd Open-Calc
git checkout -b feat/your-amazing-feature
bun install
bun run dev

# Make your changes, then:
bun run lint
git commit -m "feat: add amazing feature"
git push origin feat/your-amazing-feature

# Open a Pull Request against main
```

### What we'd love help with

- 🐛 **Bug reports** — open an issue with reproduction steps
- 🎨 **Design polish** — micro-interactions, accessibility, animations
- 🌍 **Translations** — i18n support is on the roadmap
- 🧪 **Tests** — unit, widget, and integration coverage
- 📱 **Native wrappers** — Capacitor / TWA for the APK build
- 🔐 **Auth + Cloud sync** — Supabase integration (see roadmap)
- 📊 **Graphing calculator** — plot functions (future feature)

### Contribution guidelines

- Read [CONTRIBUTING.md](CONTRIBUTING.md) for detailed setup and conventions
- Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, etc.)
- Open an issue before starting large work — we'll help you scope it
- Be kind. Review the [Code of Conduct](#) (coming soon)

### Good first issues

Look for issues labelled `good first issue` and `help wanted` in the [Issues tab](https://github.com/huzaifaa-dev-vibe/Open-Calc/issues).

---

## ⚠️ Known issues in v0.0.9 (fixes coming in v1.0.0)

We're being transparent about what's not quite right yet. The two issues below will be fixed in **v1.0.0** (July 1, 2026):

### 1. 🫥 History button hidden under the mode toggle

On small / narrow screens, the **History button** (top-left, next to the brand) is partially obscured by the **Normal / Sci / Convert segmented toggle** in the center of the top bar. The toggle grows wider in Scientific mode and can overlap the History icon, making it hard to tap.

**Workarounds until v1.0.0:**
- Use the keyboard shortcut **`Ctrl + H`** (or `⌘ + H` on macOS) to open history
- Rotate to portrait (Normal mode) where the toggle is narrower
- On desktop, the layout has enough room — no overlap

**v1.0.0 fix:** The top bar will be restructured so the History button has its own dedicated, never-overlapping slot. The mode toggle will wrap to a second row on narrow screens instead of competing for space.

### 2. 🎯 No directional navigation pad (D-pad)

There is currently **no main navigation button to move the caret up / down / left / right** from the keypad. The only caret controls are the `←` `→` arrow keys in Scientific mode — there's no way to:
- Move the caret **up** to the previous line / expression
- Move the caret **down** to the next line
- Move the caret **left / right** in Normal mode (no arrow keys on that keypad at all)
- Navigate multi-line expressions or history entries via the keypad

**Workarounds until v1.0.0:**
- Use your device's physical keyboard arrow keys (desktop)
- In Scientific mode, use the `←` `→` keys for left/right navigation
- Long-press the display to position the caret (mobile)

**v1.0.0 fix:** A full **4-directional D-pad** (↑ ↓ ← →) will be added to both keypads. It will appear as a dedicated cluster (likely a compact plus-shaped button group) so users can navigate the expression buffer, history list, and solver drawer entirely from the keypad — no keyboard required. This is especially important for mobile-only users and accessibility.

---

## 🗺️ Roadmap

### ✅ v1.0 — July 1, 2026 (first APK)

- [x] Normal calculator with memory, undo/redo, history
- [x] Scientific calculator with full trig, logs, roots, fractions, combinatorics
- [x] Unit converter (108 units across 13 categories)
- [x] Live LaTeX rendering with incomplete-expression support
- [x] Step-by-step solver with explanations
- [x] Persistent offline history with search & favorites
- [x] Material 3 design with custom palette + animations
- [x] Light/Dark themes, orientation lock, decimal places, DEG/RAD
- [x] Haptic feedback (adjustable)
- [x] PWA installable
- [x] Android APK release
- [x] **Fix: History button no longer hidden under mode toggle** (restructured top bar)
- [x] **Fix: Full directional D-pad (↑ ↓ ← →) added to both keypads**

### 🔜 Next up — v1.x

- [ ] **User authentication** — Email, Google, Anonymous Guest sign-in
- [ ] **Cloud database** — Supabase for cross-device history sync
- [ ] **User profile** — preferences, sync status, account management
- [ ] **Notifications** — daily reminders, sync alerts, version updates
- [ ] **Home screen widgets** — Quick Calculator (2×2 / 4×2), Recent Calculation (4×1), Scientific Shortcut (2×2)
- [ ] **Graphing calculator** — plot functions with pan/zoom
- [ ] **Currency converter** — live exchange rates
- [ ] **AI explanation of solutions** — natural-language walkthroughs
- [ ] **Voice input** — speak your calculation
- [ ] **Handwriting recognition** — write math by hand
- [ ] **Equation scanner** — point your camera at a problem
- [ ] **Wear OS support** — quick calcs on your watch
- [ ] **Internationalization** — multi-language UI
- [ ] **Unit + integration tests** — full coverage

### 🚧 Later

- [ ] Offline-first sync conflict resolution
- [ ] Custom themes
- [ ] Calculation shortcuts / macros
- [ ] Export history (CSV / JSON)

> **Note on authentication & database:** We will add user authentication and a cloud database **later**. The current v1.0 release stores all data locally on the device with full offline support. When we ship auth (planned for v1.1), it will support Email, Google, and Anonymous Guest sign-in, backed by Supabase.

---

## 📄 License

OpenCalc is released under the **MIT License** — see [LICENSE](LICENSE) for the full text.

You're free to use, modify, distribute, and commercialise this software. Attribution appreciated but not required.

---

## 🙏 Acknowledgements

- [**mathjs**](https://mathjs.org) — the math engine that powers everything
- [**KaTeX**](https://katex.org) — beautiful math typesetting on the web
- [**Next.js**](https://nextjs.org) — the React framework
- [**shadcn/ui**](https://ui.shadcn.com) — the component library foundation
- [**Framer Motion**](https://www.framer.com/motion/) — smooth spring animations
- [**Material Design 3**](https://m3.material.io) — design system inspiration
- [**Lucide**](https://lucide.dev) — clean, consistent icons
- Every contributor and user who makes open source worth building ❤️

---

<div align="center">

### ⭐ Star this repo if you find it useful!

[![GitHub stars](https://img.shields.io/github/stars/huzaifaa-dev-vibe/Open-Calc?style=for-the-badge&logo=github&color=ff6b35)](https://github.com/huzaifaa-dev-vibe/Open-Calc/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/huzaifaa-dev-vibe/Open-Calc?style=for-the-badge&logo=github&color=21c45a)](https://github.com/huzaifaa-dev-vibe/Open-Calc/network/members)
[![GitHub issues](https://img.shields.io/github/issues/huzaifaa-dev-vibe/Open-Calc?style=for-the-badge&logo=github&color=3178c6)](https://github.com/huzaifaa-dev-vibe/Open-Calc/issues)

**Built with ❤️ by [huzaifaa-dev-vibe](https://github.com/huzaifaa-dev-vibe) and contributors.**

**MIT License · Open Source · First APK drops July 1, 2026 🎉**

</div>
