# Neural Architect

A Pomodoro web application focused on completion momentum through gamified progression.

## Overview

Neural Architect combines the Pomodoro Technique with Mind Palace progression mechanics to reinforce completing focused sessions. Each completed focus session contributes to your growth metrics and persisted stats.

## Business Rules

Product behavior rules for timer flow, session lifecycle, and Mind Palace XP attribution live in [`docs/business-rules.md`](docs/business-rules.md). Treat that document as the source of truth when implementing or verifying behavior.

## Live Demo

- Vercel: [https://neural-architect.vercel.app/](https://neural-architect.vercel.app/)

## Tech Stack

- TypeScript (strict mode, `noUncheckedIndexedAccess`)
- React 18 + Vite
- Zustand with `localStorage` persistence
- Tailwind CSS (dark mode via CSS custom properties)
- MUI (Material UI) icons
- Biome (linting)
- Vitest (testing)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The Vite dev server starts at `http://localhost:5173`.

### Build

```bash
npm run build
```

### Type checking and linting

```bash
npm run type-check
npm run lint
```

## NPM Scripts

- `npm run dev` - start Vite dev server
- `npm run build` - type-check then build (`tsc --noEmit && vite build`)
- `npm run preview` - preview production build locally
- `npm run type-check` - run TypeScript checks (`tsc --noEmit`)
- `npm run lint` - run Biome linter (not ESLint)
- `npm run test` - run Vitest tests
- `npm run test:watch` - run Vitest in watch mode
- `npm run coverage` - run tests with v8 coverage
- `npm run optimize-images` - optimize WebP images via sharp

## Project Structure

```text
neural-architect/
├── docs/
│   └── business-rules.md   # Product behavior source of truth
├── public/
│   └── backgrounds/        # Responsive WebP backgrounds (library, coffee-shop, house)
├── scripts/
│   └── optimize-images.js  # Sharp-based WebP optimization
├── src/
│   ├── __tests__/          # Vitest unit tests (pure functions only)
│   ├── components/         # UI components (header, timer, palace, settings, navigation)
│   ├── constants/          # Timer phases, evolution formulas, level milestones
│   ├── hooks/              # useTheme, useWakeLock, useBackgroundImage
│   ├── stores/             # Zustand stores + setup.ts wiring layer
│   ├── types/              # TypeScript interfaces
│   └── utils/              # formatTime, rewards, IDs, background images, notifications
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
└── tsconfig.node.json
```

## State Management

4 Zustand stores, each persisted to its own `localStorage` key via a custom JSON adapter in `src/stores/setup.ts`:

| Store | localStorage key | File |
|-------|-----------------|------|
| Timer | `neural-architect-timer` | `timerStore.ts` |
| Mind Palace | `neural-architect-palace` | `palaceStore.ts` |
| Session | `neural-architect-session` | `sessionStore.ts` |
| User Stats | `neural-architect-user-stats` | `userStatsStore.ts` |

`setup.ts` wires the stores together: when a focus session completes, it records the session, distributes XP to Mind Palace neurons, and fires a browser notification.

## Path Alias

- `@/*` → `./src/*`

## Theming

Dark mode is controlled via `class="dark"` on `<html>`, toggled by the `useTheme` hook. Colors are defined as CSS custom properties in `src/index.css` under `:root` (light) and `.dark` (overrides). Tailwind `darkMode: 'class'` resolves these variables.
