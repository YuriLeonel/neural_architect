# Neural Architect

A gamified Pomodoro application with cross-platform support (Web & Mobile). Transform your productivity sessions into a neural network that grows and evolves as you complete work sessions.

## Overview

Neural Architect combines the proven Pomodoro Technique with gamification elements, representing your productivity journey as an evolving neural network. As you complete work sessions, your network gains experience, levels up, and unlocks new architecture tiers.

## Architecture

This is a monorepo containing:

- **apps/web**: React web application (Vite + TypeScript)
- **apps/mobile**: React Native mobile application (Expo + TypeScript)
- **packages/shared**: Shared TypeScript code, Zustand stores, and business logic

### Monorepo Structure

```
neural-architect/
├── apps/
│   ├── web/                    # React Web App (Vite)
│   │   ├── src/
│   │   │   ├── stores/         # Platform-specific store setup (localStorage)
│   │   │   └── ...
│   │   └── ...
│   └── mobile/                 # React Native App (Expo)
│       ├── src/
│       │   ├── stores/         # Platform-specific store setup (MMKV)
│       │   └── ...
│       └── ...
├── packages/
│   └── shared/                 # Shared Code Package
│       ├── src/
│       │   ├── stores/         # Zustand store factories
│       │   ├── types/          # TypeScript interfaces
│       │   └── constants/      # Evolution formulas & constants
│       └── ...
├── package.json                # Workspace definitions
├── tailwind.config.js          # Global design tokens
└── tsconfig.json               # Base TypeScript config
```

## Tech Stack

- **TypeScript** (Strict mode) - Type-safe development
- **React** (Web/Vite) - Modern web framework
- **React Native** (Expo) - Cross-platform mobile development
- **Zustand** - Lightweight state management with persist middleware
- **NativeWind v4** / **Tailwind CSS** - Utility-first styling

## Key Concepts

### Gamification System

- **Experience Points (XP)**: Earned by completing work sessions, breaks, and tasks
- **Leveling System**: Progress through levels with exponential experience requirements
- **Neural Network Growth**: Your network's neurons and connections grow with each level
- **Architecture Tiers**: Unlock new tiers (basic → intermediate → advanced → expert → master → legendary) as you progress
- **Achievements**: Unlock achievements for various milestones and accomplishments
- **Streaks**: Maintain daily streaks to boost your progress

### Evolution Formulas

The evolution system uses mathematical models to calculate progression:

- **Experience to Next Level**: `100 × (level ^ 1.5)`
- **Neuron Count**: `3 × (1.15 ^ (level - 1))`
- **Connection Count**: `neuronCount × 1.5 × (level ^ 0.3)`

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Build Shared Package

The shared package must be built before the apps can use it:

```bash
npm run build --workspace=packages/shared
```

### Development

```bash
# Start web app (runs on http://localhost:5173)
npm run dev:web

# Start mobile app (Expo development server)
npm run dev:mobile
```

### Build

```bash
# Build web app
npm run build:web

# Build mobile app
npm run build:mobile
```

### Type Checking

```bash
# Type check all packages
npm run type-check
```

## State Management

The project uses Zustand with platform-specific persistence:

- **Web**: Uses `localStorage` for persistence (configured in `apps/web/src/stores/setup.ts`)
- **Mobile**: Uses `MMKV` for high-performance persistence (configured in `apps/mobile/src/stores/setup.tsx`)

### Available Stores

1. **Timer Store** - Manages Pomodoro timer state, phases, and session tracking
2. **Evolution Store** - Tracks neural network growth, experience, and leveling
3. **User Stats Store** - Manages user statistics, streaks, achievements, and preferences

## Styling

The project uses a centralized Tailwind configuration with Neural Architect brand colors:

- **Global Config**: `tailwind.config.js` (root)
- **Brand Colors**: Primary (indigo), Accent (purple), and semantic colors (success, warning, error)
- **Web**: Extends global config via presets
- **Mobile**: Uses NativeWind v4 with the same global config

## Path Aliases

All packages use `@/` alias for clean imports:

- `apps/web`: `@/*` → `./src/*`
- `apps/mobile`: `@/*` → `./src/*`
- `packages/shared`: `@/*` → `./src/*`

## TypeScript Configuration

- **Strict Mode**: Enabled across all packages
- **Base Config**: `tsconfig.json` (root)
- **Package Configs**: Extend base with package-specific settings

## Documentation

- [Web App Documentation](apps/web/README.md) - Web-specific setup and configuration
- [Mobile App Documentation](apps/mobile/README.md) - Mobile-specific setup and configuration
- [Shared Package Documentation](packages/shared/README.md) - Shared code and API reference

## Contributing

1. Follow TypeScript strict mode guidelines
2. Keep business logic in `packages/shared`
3. Use absolute path aliases (`@/`) for imports
4. Maintain immutability in state updates
5. Follow the established naming conventions (PascalCase for components/types, camelCase for functions/variables)

## License

[Add your license here]
