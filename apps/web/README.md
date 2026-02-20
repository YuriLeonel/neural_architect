# Neural Architect - Web App

React web application for Neural Architect, built with Vite and TypeScript.

## Overview

The web application provides a full-featured Pomodoro timer with gamification elements, accessible through any modern web browser. It uses localStorage for data persistence and leverages the shared package for business logic.

## Tech Stack

- **React 18** - UI framework
- **Vite 7** - Build tool and dev server
- **TypeScript 5.3** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **Zustand 4.4** - State management
- **ESLint** - Code linting

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Install dependencies from the project root:

```bash
npm install
```

Build the shared package (required before development):

```bash
npm run build --workspace=packages/shared
```

### Running the Development Server

From the project root:

```bash
npm run dev:web
```

Or from this directory:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Hot Module Replacement (HMR)

Vite provides instant HMR for a fast development experience. Changes to React components and styles will update immediately without a full page reload.

## Build and Deployment

### Production Build

From the project root:

```bash
npm run build:web
```

Or from this directory:

```bash
npm run build
```

The production build will be output to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing.

## Project Structure

```
apps/web/
├── src/
│   ├── stores/
│   │   └── setup.ts          # Zustand store setup with localStorage
│   ├── App.tsx                # Root component
│   ├── main.tsx               # Application entry point
│   ├── index.css              # Global styles
│   └── vite-env.d.ts          # Vite type definitions
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies and scripts
```

## Configuration

### Vite Configuration

The Vite config (`vite.config.ts`) includes:

- React plugin for JSX support
- Path alias `@/` pointing to `./src/`
- Optimized build settings

### Tailwind Configuration

Extends the global Tailwind config from the project root, inheriting Neural Architect brand colors and design tokens.

### TypeScript Configuration

Extends the base TypeScript config with React-specific settings and path aliases.

## State Management

The web app uses Zustand stores configured with localStorage persistence:

```typescript
import { useTimerStore, useEvolutionStore, useUserStatsStore } from '@/stores/setup';
```

### Available Stores

- **useTimerStore** - Timer state and controls
- **useEvolutionStore** - Neural network evolution and leveling
- **useUserStatsStore** - User statistics, streaks, and achievements

All stores persist data to localStorage automatically, ensuring user progress is saved across sessions.

## Styling

The app uses Tailwind CSS with the global design system:

- Brand colors (primary, accent, semantic colors)
- Consistent spacing and typography
- Responsive design utilities
- Dark theme by default

## Key Features

- **Pomodoro Timer**: Work sessions, short breaks, and long breaks
- **Neural Network Visualization**: Watch your network grow as you level up
- **Experience System**: Earn XP and progress through levels
- **Achievements**: Unlock achievements for milestones
- **Streak Tracking**: Maintain daily streaks for bonus rewards
- **Persistent State**: All progress saved to localStorage

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Type check without emitting files

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Considerations

- Code splitting via Vite's automatic route-based splitting
- Tree shaking for optimal bundle size
- Optimized asset handling
- Fast HMR for development

## Troubleshooting

### Build Errors

If you encounter build errors, ensure:

1. The shared package is built: `npm run build --workspace=packages/shared`
2. All dependencies are installed: `npm install`
3. TypeScript types are up to date: `npm run type-check`

### localStorage Issues

If localStorage is not working:

- Check browser console for errors
- Ensure localStorage is enabled in browser settings
- Check for storage quota limits

## Related Documentation

- [Project Root README](../../README.md) - Overall project documentation
- [Shared Package README](../../packages/shared/README.md) - Shared code reference
