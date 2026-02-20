# Neural Architect - Setup Guide

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Development

Run the app from repository root:

```bash
npm run dev
```

The Vite dev server starts at `http://localhost:5173`.

## Build

```bash
npm run build
```

## Type Check and Lint

```bash
npm run type-check
npm run lint
```

## Architecture Overview

### State Management (Zustand)

The project uses Zustand with web persistence via `localStorage`.

Stores:

1. `createTimerStore` - Pomodoro timer state and actions
2. `createEvolutionStore` - progression and leveling
3. `createUserStatsStore` - user stats, streaks, and achievements

### Source Layout

- `src/components/` - React UI
- `src/stores/` - store definitions and runtime setup
- `src/types/` - application interfaces
- `src/constants/` - timer/evolution formulas and constants
- `src/utils/` - utility helpers

## Path Alias

- `@/*` -> `./src/*`
