# Neural Architect

A simple but functional Pomodoro web application with gamified progression.

## Overview

Neural Architect combines the Pomodoro Technique with progression mechanics. Each completed work session contributes to your growth metrics and persisted stats.

## Tech Stack

- TypeScript (strict mode)
- React + Vite
- Zustand with persistence
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

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Type checking and linting

```bash
npm run type-check
npm run lint
```

## Project Structure

```text
neural-architect/
├── src/
│   ├── components/      # UI components
│   ├── stores/          # Zustand stores and setup
│   ├── types/           # TypeScript interfaces
│   ├── constants/       # Timer and evolution constants/formulas
│   └── utils/           # Shared utility helpers
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## State Management

The app uses Zustand with `localStorage` persistence configured in `src/stores/setup.ts`.
