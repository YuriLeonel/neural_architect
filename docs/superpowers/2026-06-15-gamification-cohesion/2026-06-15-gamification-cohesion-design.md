# Gamification Cohesion — Design Spec

Date: 2026-06-15
Status: Draft

## Overview

Improve the gamification system in Neural Architect so that the relationships between tags, backgrounds, neurons, and XP feel coherent and visible. The user should understand *how* their actions produce progression and *what* is happening inside the Mind Palace.

## Data Model Changes

### NeuronState (types/palace.ts)

```ts
export interface NeuronState {
  id: string;
  label: string;
  totalXp: number;
  level: number;
  unlocked: boolean;
  lastXpGained: number;         // XP from the most recent session that touched this neuron
  lastLeveledUpAt: string | null; // ISO timestamp of last level-up, null if never
}
```

### XpActivityEntry (types/palace.ts)

```ts
export interface XpActivityEntry {
  id: string;
  neuronLabel: string;
  neuronId: string;
  xpGained: number;
  source: 'tag' | 'category';
  sourceLabel: string;
  sessionCategory: SessionCategory;
  leveledUp: boolean;
  newLevel: number;
  occurredAt: string;
}
```

### MindPalaceState (types/palace.ts)

```ts
export interface MindPalaceState {
  categoryBackgrounds: Record<SessionCategory, EnvironmentType>;
  customBackgroundUrl: string | null;
  neurons: Record<string, NeuronState>;
  xpActivityLog: XpActivityEntry[]; // capped at 50 entries
}
```

### PalaceStore additions

New action:
- `addXpActivity(entry: XpActivityEntry): void`

`distributeXp` now:
- Returns `XpActivityEntry[]` (the entries created during distribution)
- Updates `lastXpGained` and `lastLeveledUpAt` on each touched neuron
- Still called from `setup.ts` integration

### Migration

Rehydration normalizes:
- `lastXpGained: 0` if missing
- `lastLeveledUpAt: null` if missing
- `xpActivityLog: []` if missing

## Neuron Popover

Clicking a neuron node on the NeuronMap opens a popover anchored to that node.

### Content

- **Header**: neuron label + level badge (color-coded by tier)
- **Progress bar**: `currentXp` / `xpToNextLevel` with percentage. For max-level (50), show "MAX LEVEL"
- **Last activity**: `"+{lastXpGained} XP from last session"` if any; if `lastLeveledUpAt` set, show `"Leveled up {relative time} ago"`; otherwise `"No recent activity"`
- **Close**: click outside or Escape. One popover open at a time

### Implementation

- `NeuronNode` gets `onClick` — lifts selected neuron ID to `NeuronMap`
- `NeuronMap` manages `selectedNeuronId` state
- New `NeuronPopover` component rendered at neuron position (portal, Tailwind-only)
- Close button in top-right corner of popover

## Live XP Attribution (Toast)

After a focus session completes, a toast appears bottom-left showing where XP went.

### Content

```
Focus complete!  +45 XP

  → Reading           +25 XP  ✦
  → Research          +15 XP
  → Note-taking       + 5 XP

  (View in Mind Palace)
```

`✦` indicates a level-up occurred for that entry.

### Rules

- Appears immediately after `distributeXp` runs in `setup.ts`
- Auto-dismiss after 6s, or on click
- "View in Mind Palace" link navigates to palace view
- Max 5 tag lines displayed; if more, show "and N more..."
- Only for focus completions (not breaks)

### Implementation

- New `XpToast` component in `src/components/palace/`
- Wired via `setup.ts`: `distributeXp` returns entries → callback sets toast state
- No new Zustand store — local state + event pattern

## Background Evolution

Layered on top of per-category environment backgrounds. A CSS-driven overlay that grows with the user's highest-level neuron.

### Tier effects

| Tier | Level Range | Visual Effect |
|------|-------------|---------------|
| Basic | 1–4 | Current behavior |
| Intermediate | 5–9 | Color shift toward green in radial gradient overlay |
| Advanced | 10–14 | Stronger glow + CSS pseudo-element floating orbs |
| Expert | 15–19 | Amber tint overlay + enhanced glow |
| Master | 20+ | Dual-color animated gradient + intensified glow |

### Implementation

- `BackgroundLayer` reads highest-level neuron from palace store
- Passes `progressTier` (1–5) as CSS class: `palace-bg--tier-{n}`
- Each tier adds `::after` overlay changes — pure CSS, no new images
- Effects are subtle (opacity 0.1–0.3)
- Default tier 1 when no neurons unlocked

## System Flow View

A new third view alongside Timer and Mind Palace, accessible from `ViewNavigation` (add third tab).

### Layout

Single scrolling page with connected step cards:

1. **Choose Your Session**: shows current category + tags. "Each session has a category and optional tags."
2. **Complete a Focus Session**: timer duration + XP calc. "Every completed focus session earns XP."
3. **XP Finds Its Home**: flow diagram — tags (or category) → neurons. Shows which neuron(s) receive XP with current settings, including level + progress.
4. **Neurons Grow**: neuron card with progress bar. "When a neuron accumulates enough XP, it levels up."
5. **Footer — Your Stats**: total XP, unlocked neurons, highest level.

### Interactivity

The entire page reflects the user's current config in real time — change category/tags in settings and the flow updates.

### Routing

Add `"system"` to `AppView` type. Update `ViewNavigation`, `App.tsx` switch, and `SettingsSidebar` navigation accordingly.

## Implementation Plan Summary

1. Update types (NeuronState, XpActivityEntry, MindPalaceState)
2. Update distributeXp to track lastXpGained, lastLeveledUpAt, return activity entries
3. Add addXpActivity action + xpActivityLog management
4. Wire XP toast in setup.ts (distributeXp returns → show toast)
5. Build XpToast component
6. Build NeuronPopover component (progress bar, last activity)
7. Add click handler to NeuronNode → NeuronMap
8. Implement background evolution tiers in BackgroundLayer + CSS
9. Add "system" AppView type, routing, navigation tab
10. Build SystemFlowView with live config reflection
11. Write/update tests for new store behavior and components
12. Update business-rules.md with new fields and behavior
