# Neural Architect

A gamified Pomodoro web application. Transform productivity sessions into a neural network that grows as you complete focused work.

## Overview

Neural Architect combines the Pomodoro Technique with progression mechanics. Each completed session grants experience, levels your network, and unlocks features over time.

## Architecture

This monorepo contains:

- `apps/web`: React web application (Vite + TypeScript)
- `packages/shared`: Shared TypeScript code, Zustand stores, types, and business logic

### Monorepo Structure

```text
neural-architect/
├── apps/
│   └── web/
├── packages/
│   └── shared/
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## Tech Stack

- TypeScript (strict mode)
- React + Vite
- Zustand with persist middleware
- Tailwind CSS

## Evolution Formulas

- Experience to next level: `100 * (level ^ 1.5)`
- Reward: `(t * 10) * m`

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
npm install
```

### Build shared package

```bash
npm run build --workspace=packages/shared
```

### Development

```bash
npm run dev:web
```

### Build

```bash
npm run build:web
```

### Type checking and linting

```bash
npm run type-check
npm run lint
```

## State Management

The app uses Zustand with `localStorage` persistence configured in `apps/web/src/stores/setup.ts`.

## Documentation

- [Web App Documentation](apps/web/README.md)
- [Shared Package Documentation](packages/shared/README.md)

