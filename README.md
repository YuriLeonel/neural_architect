# Neural Architect

A Pomodoro web application focused on completion momentum through gamified progression.

## Overview

Neural Architect combines the Pomodoro Technique with Mind Palace progression mechanics to reinforce completing focused sessions. Each completed focus session contributes to your growth metrics and persisted stats.

## Business Rules

Product behavior rules for timer flow, session lifecycle, and Mind Palace XP attribution live in [`docs/business-rules.md`](docs/business-rules.md). Treat that document as the source of truth when implementing or verifying behavior.

## Live Demo

- Vercel: [https://neural-architect.vercel.app/](https://neural-architect.vercel.app/)

## Tech Stack

- TypeScript (strict mode)
- React + Vite
- Zustand with persistence
- Tailwind CSS

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

- `npm run dev` - start development server
- `npm run build` - generate production build
- `npm run preview` - preview production build locally
- `npm run type-check` - run TypeScript checks
- `npm run lint` - run ESLint

## Project Structure

```text
neural-architect/
├── docs/
│   └── business-rules.md # Product behavior source of truth
├── src/
│   ├── components/      # UI components
│   ├── stores/          # Zustand stores and setup
│   ├── types/           # TypeScript interfaces
│   ├── constants/       # Timer and evolution constants/formulas
│   └── utils/           # Shared utility helpers
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tailwind.config.js
└── vite.config.ts
```

## State Management

The app uses Zustand with `localStorage` persistence configured in `src/stores/setup.ts`.

## Path Alias

- `@/*` -> `./src/*`
