# Neural Architect - Shared Package

Shared TypeScript code, Zustand stores, and business logic used across web and mobile applications.

## Overview

This package contains all shared business logic, state management, types, and constants that are used by both the web and mobile applications. It ensures consistency across platforms and follows the DRY (Don't Repeat Yourself) principle.

## Purpose

The shared package provides:

- **State Management**: Zustand store factories for timer, evolution, and user stats
- **Type Definitions**: TypeScript interfaces and types used across platforms
- **Business Logic**: Evolution formulas, calculations, and constants
- **Platform-Agnostic Code**: Code that works identically on web and mobile

## Installation

This package is part of the monorepo workspace and is automatically linked. No separate installation is required.

## Build

Build the package before using it in apps:

```bash
npm run build
```

Or from the project root:

```bash
npm run build --workspace=packages/shared
```

Watch mode for development:

```bash
npm run dev
```

## Package Structure

```
packages/shared/
├── src/
│   ├── stores/
│   │   ├── timerStore.ts       # Timer store factory
│   │   ├── evolutionStore.ts   # Evolution store factory
│   │   ├── userStatsStore.ts   # User stats store factory
│   │   └── index.ts            # Store exports
│   ├── types/
│   │   ├── timer.ts            # Timer-related types
│   │   ├── evolution.ts        # Evolution-related types
│   │   ├── user.ts             # User-related types
│   │   └── index.ts            # Type exports
│   ├── constants/
│   │   ├── evolution.ts        # Evolution formulas and constants
│   │   └── index.ts            # Constant exports
│   └── index.ts                # Main entry point
├── package.json
└── tsconfig.json
```

## Exports

### Main Export

```typescript
import { ... } from '@neural-architect/shared';
```

### Subpath Exports

```typescript
// Stores only
import { createTimerStore, ... } from '@neural-architect/shared/stores';

// Types only
import { TimerState, EvolutionState, ... } from '@neural-architect/shared/types';

// Constants only
import { EXPERIENCE_REWARDS, ... } from '@neural-architect/shared/constants';
```

## Store Factories

All stores are factory functions that accept a storage adapter, allowing platform-specific persistence implementations.

### Timer Store

Manages Pomodoro timer state and controls.

```typescript
import { createTimerStore } from '@neural-architect/shared/stores';

const useTimerStore = createTimerStore(storageAdapter);
```

**State:**
- `timeRemaining`: Current time remaining in seconds
- `totalDuration`: Total duration of current session
- `isRunning`: Whether timer is running
- `isPaused`: Whether timer is paused
- `phase`: Current phase ('work' | 'shortBreak' | 'longBreak')
- `completedSessions`: Number of completed work sessions
- `startedAt`: Timestamp when timer started
- `pausedAt`: Timestamp when timer was paused

**Actions:**
- `start()`: Start the timer
- `pause()`: Pause the timer
- `resume()`: Resume a paused timer
- `reset()`: Reset timer to initial state
- `tick()`: Update timer (called periodically)
- `setPhase(phase)`: Change timer phase
- `setConfig(config)`: Update timer configuration
- `completeSession()`: Mark current session as complete

### Evolution Store

Tracks neural network evolution, experience, and leveling.

```typescript
import { createEvolutionStore } from '@neural-architect/shared/stores';

const useEvolutionStore = createEvolutionStore(storageAdapter);
```

**State:**
- `level`: Current level
- `experience`: Current experience points
- `experienceToNextLevel`: XP needed for next level
- `totalExperience`: Total XP accumulated
- `neuronCount`: Number of neurons in network
- `connectionCount`: Number of connections in network
- `architectureTier`: Current tier ('basic' | 'intermediate' | 'advanced' | 'expert' | 'master' | 'legendary')
- `unlockedFeatures`: Array of unlocked feature IDs
- `networkState`: Network visualization state

**Actions:**
- `addExperience(amount)`: Add experience points
- `levelUp()`: Handle level up event
- `unlockFeature(featureId)`: Unlock a feature
- `updateNetworkState(state)`: Update network visualization state

### User Stats Store

Manages user statistics, streaks, and achievements.

```typescript
import { createUserStatsStore } from '@neural-architect/shared/stores';

const useUserStatsStore = createUserStatsStore(storageAdapter);
```

**State:**
- `totalWorkTime`: Total work time in seconds
- `totalSessions`: Total completed sessions
- `currentStreak`: Current daily streak
- `longestStreak`: Longest streak achieved
- `lastSessionDate`: Date of last completed session
- `tasksCompleted`: Total tasks completed
- `achievements`: Array of unlocked achievements
- `preferences`: User preferences

**Actions:**
- `addWorkTime(seconds)`: Add work time
- `incrementSessions()`: Increment session count
- `updateStreak()`: Update streak based on last session date
- `completeTask()`: Mark a task as complete
- `unlockAchievement(achievement)`: Unlock an achievement
- `updatePreferences(preferences)`: Update user preferences

## Type Definitions

### Timer Types

```typescript
import { TimerState, TimerPhase, TimerConfig } from '@neural-architect/shared/types';
```

- `TimerState`: Timer state interface
- `TimerPhase`: 'work' | 'shortBreak' | 'longBreak'
- `TimerConfig`: Timer configuration interface

### Evolution Types

```typescript
import { EvolutionState, ArchitectureTier, NetworkState, Neuron, Connection } from '@neural-architect/shared/types';
```

- `EvolutionState`: Evolution state interface
- `ArchitectureTier`: Architecture tier type
- `NetworkState`: Network visualization state
- `Neuron`: Neuron representation
- `Connection`: Connection representation

### User Types

```typescript
import { UserStats, Achievement, UserPreferences } from '@neural-architect/shared/types';
```

- `UserStats`: User statistics interface
- `Achievement`: Achievement interface
- `UserPreferences`: User preferences interface

## Evolution Constants

### Formulas

The evolution system uses mathematical models:

**Experience to Next Level:**
```
100 × (level ^ 1.5)
```

**Neuron Count:**
```
3 × (1.15 ^ (level - 1))
```

**Connection Count:**
```
neuronCount × 1.5 × (level ^ 0.3)
```

### Constants

```typescript
import { EXPERIENCE_REWARDS, LEVEL_MILESTONES } from '@neural-architect/shared/constants';
```

**EXPERIENCE_REWARDS:**
- `WORK_SESSION`: 50 XP
- `SHORT_BREAK`: 10 XP
- `LONG_BREAK`: 25 XP
- `TASK_COMPLETION`: 20 XP
- `DAILY_STREAK`: 15 XP
- `MILESTONE`: 100 XP

**LEVEL_MILESTONES:**
Array of level milestones that unlock features at specific levels (5, 10, 15, 20, 25, 30, 35, 40, 50).

### Calculation Functions

```typescript
import {
  calculateLevel,
  calculateExperienceToNextLevel,
  calculateTotalExperienceForLevel,
  calculateNeuronCount,
  calculateConnectionCount,
} from '@neural-architect/shared/constants';
```

## Platform-Specific Storage Adapters

Stores require a storage adapter that implements the Zustand `Storage` interface:

```typescript
interface Storage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}
```

### Web Implementation

```typescript
const storage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};
```

### Mobile Implementation

```typescript
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const mmkvStorage = {
  getItem: (name: string) => {
    const value = storage.getString(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    storage.set(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    storage.delete(name);
  },
};
```

## Usage Examples

### Creating a Store (Web)

```typescript
import { createTimerStore } from '@neural-architect/shared/stores';

const storage = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

export const useTimerStore = createTimerStore(storage);
```

### Using a Store

```typescript
import { useTimerStore } from '@/stores/setup';

function TimerComponent() {
  const { timeRemaining, isRunning, start, pause, reset } = useTimerStore();
  
  return (
    <div>
      <p>Time: {timeRemaining}s</p>
      <button onClick={start} disabled={isRunning}>Start</button>
      <button onClick={pause} disabled={!isRunning}>Pause</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### Using Types

```typescript
import type { TimerState, EvolutionState } from '@neural-architect/shared/types';

function processTimerState(state: TimerState) {
  // Type-safe state processing
}
```

### Using Constants

```typescript
import { EXPERIENCE_REWARDS, calculateLevel } from '@neural-architect/shared/constants';

const xpGained = EXPERIENCE_REWARDS.WORK_SESSION;
const newLevel = calculateLevel(totalExperience);
```

## Development

### Type Checking

```bash
npm run type-check
```

### Building

```bash
npm run build
```

### Watch Mode

```bash
npm run dev
```

## Best Practices

1. **Keep Business Logic Here**: All business logic, calculations, and state management should be in this package
2. **Platform-Agnostic**: Code should work identically on web and mobile
3. **Type Safety**: Use TypeScript strictly - no `any` types
4. **Immutability**: State updates should be immutable
5. **Pure Functions**: Calculation functions should be pure (no side effects)

## Related Documentation

- [Project Root README](../../README.md) - Overall project documentation
- [Web App README](../../apps/web/README.md) - Web app documentation
- [Mobile App README](../../apps/mobile/README.md) - Mobile app documentation
