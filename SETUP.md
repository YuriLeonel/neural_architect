# Neural Architect - Setup Guide

## Project Structure

```
neural-architect/
├── apps/
│   ├── web/                    # React Web App (Vite + TypeScript)
│   │   ├── src/
│   │   │   ├── stores/         # Platform-specific store setup (localStorage)
│   │   │   └── ...
│   │   └── ...
│   └── mobile/                 # React Native App (Expo + TypeScript)
│       ├── src/
│       │   ├── stores/         # Platform-specific store setup (MMKV)
│       │   └── ...
│       └── ...
├── packages/
│   └── shared/                 # Shared Code Package
│       ├── src/
│       │   ├── stores/         # Zustand store factories
│       │   ├── types/         # TypeScript interfaces
│       │   └── constants/     # Evolution formulas & constants
│       └── ...
├── tailwind.config.js          # Global design tokens
└── tsconfig.json               # Base TypeScript config
```

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build shared package:**
   ```bash
   npm run build --workspace=packages/shared
   ```

## Development

### Web App
```bash
npm run dev:web
```
Starts the Vite dev server at `http://localhost:5173`

### Mobile App
```bash
npm run dev:mobile
```
Starts the Expo development server

## Architecture Overview

### State Management (Zustand)

The project uses Zustand with platform-specific persistence:

- **Web**: Uses `localStorage` (configured in `apps/web/src/stores/setup.ts`)
- **Mobile**: Uses `MMKV` (configured in `apps/mobile/src/stores/setup.tsx`)

#### Available Stores

1. **Timer Store** (`createTimerStore`)
   - Manages Pomodoro timer state
   - Tracks work/break phases
   - Handles start/pause/reset actions

2. **Evolution Store** (`createEvolutionStore`)
   - Tracks neural network growth
   - Manages experience points and leveling
   - Handles architecture tier progression

3. **User Stats Store** (`createUserStatsStore`)
   - Tracks user statistics
   - Manages streaks and achievements
   - Stores user preferences

### TypeScript Interfaces

All shared types are defined in `packages/shared/src/types/`:

- `TimerState` - Timer configuration and state
- `EvolutionState` - Neural network evolution state
- `UserStats` - User statistics and achievements

### Evolution Constants

Mathematical models for progression are in `packages/shared/src/constants/evolution.ts`:

- `calculateLevel()` - Calculate level from total experience
- `calculateExperienceToNextLevel()` - Experience needed for next level
- `calculateNeuronCount()` - Neurons at a given level
- `calculateConnectionCount()` - Connections at a given level

### Styling (NativeWind v4 / Tailwind CSS)

- **Global Config**: `tailwind.config.js` (root)
- **Brand Colors**: Neural Architect theme with primary, accent, and semantic colors
- **Web**: Extends global config via `presets`
- **Mobile**: Uses NativeWind v4 with same global config

## Path Aliases

All packages use `@/` alias for clean imports:

- `apps/web`: `@/*` → `./src/*`
- `apps/mobile`: `@/*` → `./src/*`
- `packages/shared`: `@/*` → `./src/*`

## TypeScript Configuration

- **Strict Mode**: Enabled across all packages
- **Base Config**: `tsconfig.json` (root)
- **Package Configs**: Extend base with package-specific settings

## Next Steps

1. **Install dependencies**: Run `npm install` in the root
2. **Build shared package**: Required before using in apps
3. **Start development**: Use `npm run dev:web` or `npm run dev:mobile`
4. **Implement UI**: Begin building components using the established stores and types

## Notes

- The shared package must be built before the apps can use it
- Store factories require platform-specific storage adapters
- All TypeScript configurations use strict mode
- Tailwind config is centralized for consistent theming
