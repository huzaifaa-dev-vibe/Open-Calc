# Contributing to OpenCalc 🤝

First off — **thank you** for taking the time to contribute! 🎉

OpenCalc is a community-driven project. Whether you're fixing a typo, reporting a bug, proposing a feature, or rewriting the math engine, your help is welcome.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Pull Requests](#pull-requests)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Project Structure](#project-structure)

---

## Code of Conduct

Be kind, be respectful, be inclusive. We're all here to build something cool together. Harassment, discrimination, or toxicity of any kind will not be tolerated.

---

## Ways to Contribute

- 🐛 **Report bugs** — open an issue with reproduction steps
- 💡 **Suggest features** — open an issue with the `enhancement` label
- 📝 **Improve docs** — README, code comments, this file
- 🎨 **Polish design** — micro-interactions, accessibility, animations
- 🌍 **Translate** — i18n support is on the roadmap, help us get there
- 🧪 **Write tests** — unit, widget, and integration coverage
- 📱 **Build native wrappers** — Capacitor / TWA for the APK
- 🔐 **Implement auth + sync** — Supabase integration
- 💬 **Help in issues** — answer questions, triage bugs

---

## Getting Started

### Prerequisites

- **Node.js 18+** or **Bun** (recommended)
- A GitHub account
- A modern browser

### Setup

```bash
# Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Open-Calc.git
cd Open-Calc

# Add the upstream remote to stay in sync
git remote add upstream https://github.com/huzaifaa-dev-vibe/Open-Calc.git

# Install dependencies
bun install

# Start the dev server
bun run dev

# Open http://localhost:3000
```

### Keep your fork in sync

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feat/your-feature
   # or: fix/your-bugfix, docs/your-docs, chore/your-chore
   ```

2. **Make your changes**. Keep commits focused and atomic.

3. **Lint your code**:
   ```bash
   bun run lint
   ```

4. **Test your changes** manually in the browser. Try:
   - All three modes (Normal, Scientific, Converter)
   - Light and dark themes
   - History, solver, settings panels
   - Keyboard input

5. **Commit** with a [conventional commit message](#commit-messages).

6. **Push** to your fork:
   ```bash
   git push origin feat/your-feature
   ```

7. **Open a Pull Request** against `main`. Fill in the PR template.

---

## Coding Standards

### TypeScript

- Strict typing everywhere — no `any` unless absolutely necessary (and document why)
- Use `interface` for object shapes, `type` for unions and intersections
- Prefer named exports over default exports

### React / Next.js

- **App Router** only — no Pages Router code
- `"use client"` directive at the top of every file that uses hooks or browser APIs
- Compose with shadcn/ui components whenever possible — don't reinvent
- Keep components small and focused — if it's >150 lines, consider splitting

### Styling

- **Tailwind CSS 4** with the project's OKLCH design tokens (see `src/app/globals.css`)
- Use semantic tokens (`bg-primary`, `text-muted-foreground`) — never hardcode hex colors
- **No indigo or blue** as primary colors (we use emerald + amber)
- Mobile-first: design for phone, then enhance for tablet/desktop

### State Management

- **Zustand** for global state (`src/store/`)
- React's `useState` / `useReducer` for local component state
- **TanStack Query** for server state (when we add auth + sync)

### Math Engine

- Pure functions in `src/lib/calc/engine.ts` — no side effects
- Errors are **returned**, never thrown
- Always go through the `evaluate()` / `toLatex()` / `solveSteps()` surface — never call mathjs directly from components

### File Naming

- Components: `PascalCase.tsx` (e.g. `SegmentedToggle.tsx`)
- Hooks: `use-kebab-case.ts` (e.g. `use-haptics.ts`)
- Utilities: `camelCase.ts` (e.g. `engine.ts`)
- Stores: `camelCase.ts` (e.g. `calc.ts`)

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Use for |
|------|---------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace, semicolons — no code change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `perf` | Performance improvement |
| `test` | Adding or correcting tests |
| `chore` | Build, deps, tooling — nothing user-facing |
| `ci` | CI/CD changes |
| `revert` | Reverting a previous commit |

### Examples

```
feat(converter): add temperature category with offset support
fix(engine): handle empty parens in LaTeX rendering
docs(readme): add APK release date and badges
style(keypad): increase touch target to 44px minimum
refactor(store): split insert action into caret-aware version
```

---

## Pull Requests

### Before opening a PR

- [ ] Your branch is up to date with `main`
- [ ] `bun run lint` passes with no errors
- [ ] You've manually tested the affected features
- [ ] Your commit messages follow Conventional Commits
- [ ] You haven't accidentally committed `node_modules`, `.env`, `.next/`, etc.

### PR template

When you open a PR, you'll see a template. Fill it in:

```
## Description
What does this PR do? Why?

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation
- [ ] Refactor

## How to test
Steps to reproduce / verify the change.

## Screenshots (if applicable)
Before / after

## Checklist
- [ ] Lint passes
- [ ] Manually tested
- [ ] Docs updated (if needed)
```

### Review process

- A maintainer will review your PR within a few days
- We may request changes — please be responsive
- Once approved, we'll squash-merge into `main`

---

## Reporting Bugs

Open an issue with the `bug` label and include:

1. **Description** — what happened, what you expected
2. **Reproduction steps** — numbered, minimal
3. **Environment**:
   - OS / browser / version
   - OpenCalc version (or commit hash)
   - Mode (Normal / Scientific / Converter)
4. **Screenshots / screen recordings** — if visual
5. **Console errors** — open DevTools → Console, copy any red text

---

## Suggesting Features

Open an issue with the `enhancement` label and include:

1. **The problem** — what are you trying to do that OpenCalc doesn't support?
2. **The proposed solution** — what would you like to see?
3. **Alternatives considered** — what else could work?
4. **Mockups / sketches** — if you have them

---

## 📱 Building the Android APK

OpenCalc ships as a Next.js PWA wrapped in an Android APK via **Capacitor**. The build runs automatically on GitHub Actions when you push a `v*` tag, but you can also build locally.

### Prerequisites

- **Android Studio** (or just the Android SDK command-line tools)
- **JDK 17**
- **Bun** (for building the web assets)
- A release keystore (see below)

### Generating a release keystore (one-time)

```bash
keytool -genkey -v -keystore opencalc-release.keystore \
  -alias opencalc \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass YOUR_PASSWORD \
  -keypass YOUR_PASSWORD  # MUST match storepass for PKCS12 keystore
```

**Back this file up safely** — if you lose it, you cannot publish app updates.

### Building locally

```bash
# 1. Build the web assets
bun install
bun run build

# 2. Sync to the Android project
npx cap sync android

# 3. Build the APK
cd android
./gradlew assembleRelease \
  -PRELEASE_STORE_FILE=/path/to/opencalc-release.keystore \
  -PRELEASE_STORE_PASSWORD=YOUR_PASSWORD \
  -PRELEASE_KEY_ALIAS=opencalc \
  -PRELEASE_KEY_PASSWORD=YOUR_PASSWORD

# 4. Find your APK at:
#    android/app/build/outputs/apk/release/app-release.apk
```

### Building via GitHub Actions (recommended for releases)

1. Add these repository secrets (Settings → Secrets and variables → Actions):
   - `KEYSTORE_BASE64` — `base64 opencalc-release.keystore | tr -d '\n'`
   - `KEYSTORE_PASSWORD` — your keystore password
   - `KEY_ALIAS` — `opencalc`
   - `KEY_PASSWORD` — same as `KEYSTORE_PASSWORD` (PKCS12 requires them to match)

2. Push a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

3. The workflow at `.github/workflows/build-apk.yml` will:
   - Build the web assets
   - Sync to Android
   - Decode the keystore from the secret
   - Build a signed release APK
   - Generate a SHA256 checksum
   - Attach both to a new GitHub Release

---

## Project Structure

```
Open-Calc/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (fonts, metadata, PWA manifest)
│   │   ├── page.tsx            # Main calculator page
│   │   └── globals.css         # Tailwind + custom OKLCH design tokens
│   ├── components/
│   │   ├── calc/               # OpenCalc-specific components
│   │   │   ├── TopBar.tsx
│   │   │   ├── Display.tsx
│   │   │   ├── NormalKeypad.tsx
│   │   │   ├── ScientificKeypad.tsx
│   │   │   ├── UnitConverter.tsx
│   │   │   ├── HistoryPanel.tsx
│   │   │   ├── SolverDrawer.tsx
│   │   │   ├── SettingsSheet.tsx
│   │   │   ├── SegmentedToggle.tsx
│   │   │   ├── CalcKey.tsx
│   │   │   ├── Latex.tsx
│   │   │   ├── ThemeSync.tsx
│   │   │   └── CalcToaster.tsx
│   │   └── ui/                 # shadcn/ui primitives
│   ├── lib/
│   │   ├── calc/
│   │   │   ├── engine.ts       # Math engine (mathjs wrapper)
│   │   │   └── units.ts        # Unit converter catalogue
│   │   ├── db.ts               # Prisma client
│   │   └── utils.ts            # cn() helper
│   ├── hooks/
│   │   ├── use-haptics.ts      # Vibration API wrapper
│   │   ├── use-mobile.ts
│   │   └── use-toast.ts
│   └── store/
│       └── calc.ts             # Zustand store (persisted)
├── prisma/
│   └── schema.prisma
├── public/
│   ├── icon.svg                # App icon (also used as PWA icon)
│   ├── manifest.webmanifest    # PWA manifest
│   └── robots.txt
├── .github/                    # Issue templates, PR template, Actions
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Questions?

- Open a [Discussion](https://github.com/huzaifaa-dev-vibe/Open-Calc/discussions) (coming soon)
- Open an [Issue](https://github.com/huzaifaa-dev-vibe/Open-Calc/issues)
- Mention `@huzaifaa-dev-vibe` in your PR

Happy hacking! 🚀
