# Neural Architect — Agent Guide

Product behavior source of truth: `docs/business-rules.md`.

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Vite dev server (localhost:5173) |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run preview` | Preview production build |
| `npm run type-check` | `tsc --noEmit` |
| `npm run lint` | Biome (not ESLint) on `src/**/*.ts src/**/*.tsx` |
| `npm run test` | Vitest run |
| `npm run test:watch` | Vitest watch mode |
| `npm run coverage` | Vitest with v8 coverage |

Build includes type-check already.

## Architecture

- Single-page React 18 + Vite + TypeScript SPA.
- Entry: `src/main.tsx`. Path alias `@/*` → `./src/*`.
- 4 Zustand stores, each persisted to its own `localStorage` key via a custom JSON adapter in `src/stores/setup.ts`:
  - `neural-architect-timer` (timerStore.ts)
  - `neural-architect-palace` (palaceStore.ts)
  - `neural-architect-session` (sessionStore.ts)
  - `neural-architect-user-stats` (userStatsStore.ts)
- `setup.ts` is the wiring layer: it instantiates stores with integrations (focus completion → record session + distribute XP + fire notification).
- Timer rehydration always clears `isRunning`, `isPaused`, `startedAt`, `pausedAt`, `resetPending` — no stale runtime after page load.

## State & Persistence

- All data is client-side (`localStorage`), user-tamperable.
- Custom `createJsonStorageAdapter` parses defensively; invalid JSON is silently dropped.
- The store integration boundary (`setup.ts`) is where timer → session + palace + notification wiring happens.

## Theming

- Dark mode via `class="dark"` on `<html>`, toggled in `useTheme` hook (`src/hooks/useTheme.ts`).
- All colors are CSS custom properties in `src/index.css` under `:root` (light) and `.dark` (overrides).
- Tailwind `darkMode: 'class'` in config.

## Testing

- Vitest with `globals: true`, `environment: "node"`.
- Tests in `src/__tests__/`, use `@/` path alias.
- Pure-function unit tests only (evolution, rewards, formatTime, timer constants). No integration or browser tests.
- Coverage: v8 provider, excludes `src/main.tsx` and `src/vite-env.d.ts`.

## Notable Quirks

- Linter is **Biome** (`@biomejs/biome`), not ESLint.
- Timer phases are normalized on hydration: `shortBreak`/`longBreak` → `break`.
- Session records are created only for completed focus phases (never breaks).
- XP distribution: tag neurons first, category fallback second, `custom` category with no tags → no XP.
- `npm run optimize-images` uses sharp via `scripts/optimize-images.js`.
- Background images are responsive WebP files under `public/backgrounds/`.
- Wake Lock API integration in `useWakeLock` hook keeps screen on during focus.
