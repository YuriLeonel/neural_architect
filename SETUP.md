# Neural Architect - Setup Guide

## Project Structure

```text
neural-architect/
├── apps/
│   └── web/                    # React Web App (Vite + TypeScript)
├── packages/
│   └── shared/                 # Shared code and business logic
├── tailwind.config.js          # Global design tokens
└── tsconfig.json               # Base TypeScript config
```

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```
2. Build shared package:
   ```bash
   npm run build --workspace=packages/shared
   ```

## Development

Run the web app from repository root:

```bash
npm run dev:web
```

The Vite dev server starts at `http://localhost:5173`.

## Architecture Overview

### State Management (Zustand)

The project uses Zustand with web persistence:

- Web: `localStorage` via `apps/web/src/stores/setup.ts`

### Available Stores

1. `createTimerStore` - Pomodoro timer state and actions
2. `createEvolutionStore` - network growth and progression
3. `createUserStatsStore` - user stats, streaks, and achievements

### TypeScript Interfaces

Shared interfaces live in `packages/shared/src/types/`.

### Evolution Constants

Mathematical progression logic is in `packages/shared/src/constants/`.

### Styling (Tailwind CSS)

- Global config: `tailwind.config.js`
- Web config: `apps/web/tailwind.config.js`

## Path Aliases

All packages use `@/` aliases:

- `apps/web`: `@/*` -> `./src/*`
- `packages/shared`: `@/*` -> `./src/*`

## Next Steps

1. Install dependencies with `npm install`
2. Build shared package
3. Start development with `npm run dev:web`
4. Implement UI with shared stores and types

