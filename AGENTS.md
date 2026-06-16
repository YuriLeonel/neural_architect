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

## Development Methodology

### Spec-Driven Development

Understand requirements before writing code. Read `docs/business-rules.md` and existing specs in `docs/superpowers/specs/`. Design the approach first, then implement.

### TDD — Mandatory

Invoke `superpowers:test-driven-development` for every implementation. Red-Green-Refactor. No production code without a failing test first. This is not optional.

### Clean Code

- Meaningful, intention-revealing names for variables, functions, and types.
- Small focused functions — extract instead of inlining. If a function does more than one thing, split it.
- DRY — don't repeat yourself. Duplication is the root of most maintenance problems.
- No comments that restate what the code already says. Comments explain *why*, not *what*.
- Prefer immutability and pure functions. Avoid mutable state leaks.
- Favor composition over inheritance.

### Security-First Mindset

- Treat all user input as untrusted. Validate at boundaries.
- Never commit secrets (API keys, tokens, passwords) in code, tests, or config.
- No `dangerouslySetInnerHTML` without explicit security review and sanitization.
- Review diffs for accidentally committed secrets before every commit.
- Run `npm audit` before introducing new dependencies. Prefer well-maintained libraries.

## Git Workflow — GitHub Flow

- **Branch naming**: `feature/<short-desc>`, `fix/<short-desc>`, `refactor/<short-desc>`, `docs/<short-desc>`, `chore/<short-desc>`.
- **Commits**: Conventional Commits format — `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`, `style:`. Imperative mood, capitalized, no trailing period.
- **PRs**: Small, focused, single concern. Self-review the diff before requesting review. Squash-merge to `main`. Delete branch after merge.
- **Code review**: Use `superpowers:requesting-code-review` before merging. Review for correctness, clarity, test coverage, and security.

## Code Quality Standards

- TypeScript strict mode enabled. No `any` without an explicit justification comment.
- Biome for linting and formatting (`npm run lint`). Fix all warnings before committing.
- No dead or commented-out code. Delete it, don't comment it out.
- No `console.log` in production code. Use proper logging if needed.
- Error handling: use React error boundaries for UI errors, handle async rejections, never swallow exceptions with empty `catch` blocks.
- Test coverage: Vitest unit tests for pure functions. Follow the testing pyramid (unit > integration > e2e). Tests must pass before commit.

## Security Practices

- **Secrets**: API keys, tokens, and passwords go in environment variables, never in source. If a secret is accidentally committed, rotate it immediately.
- **XSS**: React escapes by default. Never bypass with `dangerouslySetInnerHTML` unless sanitized via DOMPurify or equivalent.
- **Dependencies**: `npm audit` before adding new packages. Vet for maintenance status, security history, and bundle size.
- **localStorage**: All persisted data is client-side and user-tamperable. Treat it as convenience state, not trusted proof (see `docs/business-rules.md`).
- **CSP**: Respect Content Security Policy headers. No inline scripts unless properly nonced.

## Skill Orchestration

| Task Type | Required Skill Sequence |
|---|---|
| New feature | `brainstorming` (if creative/design) → `writing-plans` (if multi-step) → `subagent-driven-development` (each sub-task uses TDD) → `verification-before-completion` → `requesting-code-review` |
| Bug fix | `systematic-debugging` → TDD → `verification-before-completion` → `requesting-code-review` |
| Refactoring | TDD → `verification-before-completion` → `requesting-code-review` |
| Documentation | `writing-skills` if creating or editing skills |
| Wrapping up | `finishing-a-development-branch` |

## Workflow Rules (Kanban-Inspired)

- Task lifecycle: `To Do → In Progress → Review → Done`.
- Scope each task to a single concern and a single PR.
- Pre-commit gates: tests pass, lint passes, type-check passes.
- Definition of Done: tests written and green, lint + type-check clean, PR reviewed, branch merged to `main`, branch deleted.
