# Gamification Cohesion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the gamification system cohesive by adding neuron progress visibility, live XP attribution, background evolution, and a system flow view.

**Architecture:** Extend existing store types minimally, update `distributeXp` to track per-neuron deltas and return activity entries, then build UI components (popover, toast, system view) on top. Background evolution uses pure CSS tier classes. No new Zustand stores — reuse MindPalaceState.

**Tech Stack:** React 18 + TypeScript (strict), Zustand, Tailwind CSS, Vitest

---

## File Map

**Modified:**
- `src/types/palace.ts`
- `src/stores/palaceStore.ts`
- `src/stores/setup.ts`
- `src/components/palace/NeuronNode.tsx`
- `src/components/palace/NeuronMap.tsx`
- `src/components/palace/index.ts`
- `src/components/palace/BackgroundLayer.tsx`
- `src/components/navigation/ViewNavigation.tsx`
- `src/App.tsx`
- `src/index.css`
- `src/constants/evolution.ts`
- `docs/business-rules.md`

**Created:**
- `src/components/palace/NeuronPopover.tsx`
- `src/components/palace/XpToast.tsx`
- `src/components/system/SystemFlowView.tsx`
- `src/components/system/index.ts`
- `src/__tests__/palaceStore.test.ts`

---

### Task 1: Update Type Definitions

**Files:**
- Modify: `src/types/palace.ts`

- [ ] **Step 1: Read current `src/types/palace.ts`**

- [ ] **Step 2: Extend NeuronState, add XpActivityEntry, add xpActivityLog to MindPalaceState**

Changes:
1. Add `lastXpGained: number` and `lastLeveledUpAt: string | null` to `NeuronState`
2. Add `XpActivityEntry` interface
3. Add `xpActivityLog: XpActivityEntry[]` to `MindPalaceState`

```typescript
export interface NeuronState {
  id: string;
  label: string;
  totalXp: number;
  level: number;
  unlocked: boolean;
  lastXpGained: number;
  lastLeveledUpAt: string | null;
}

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

export interface MindPalaceState {
  categoryBackgrounds: Record<SessionCategory, EnvironmentType>;
  customBackgroundUrl: string | null;
  neurons: Record<string, NeuronState>;
  xpActivityLog: XpActivityEntry[];
}
```

- [ ] **Step 3: Run type-check**

Run: `npm run type-check`
Expected: errors only in palaceStore.ts (not updated yet)

- [ ] **Step 4: Commit**

```bash
git add src/types/palace.ts
git commit -m "feat(gamification): extend NeuronState and add XpActivityEntry types"
```

---

### Task 2: Update Palace Store

**Files:**
- Modify: `src/stores/palaceStore.ts`

- [ ] **Step 1: Read current `src/stores/palaceStore.ts`**

- [ ] **Step 2: Add `createId` import and update type imports**

Edit imports to add `XpActivityEntry` to the type import and add `createId` from utils:

```ts
import { calculateLevel } from '../constants/evolution';
import { createId } from '../utils';
import type { EnvironmentType, MindPalaceState, NeuronState, SessionCategory, XpActivityEntry } from '../types';
```

- [ ] **Step 3: Update `ensureNeuron` to include new default fields**

In the new neuron creation inside `ensureNeuron`, add:
```ts
lastXpGained: 0,
lastLeveledUpAt: null,
```

- [ ] **Step 4: Rewrite `distributeXp` to return `XpActivityEntry[]` and track deltas**

Signature changes from `() => void` to `() => XpActivityEntry[]`.

Inside the tag branch, for each tag:
```ts
const gainedXp = baseXp + (index < remainder ? 1 : 0);
const existing = updatedNeurons[tagId];
const neuron = existing ?? {
  id: tagId,
  label: getTagLabelFromId(tagId),
  totalXp: 0, level: 1, unlocked: false,
  lastXpGained: 0, lastLeveledUpAt: null,
};
const nextTotalXp = neuron.totalXp + gainedXp;
const newLevel = calculateLevel(nextTotalXp);
const leveledUp = newLevel > neuron.level;
const now = new Date().toISOString();

updatedNeurons[tagId] = {
  ...neuron,
  totalXp: nextTotalXp,
  level: newLevel,
  unlocked: nextTotalXp > 0,
  lastXpGained: gainedXp,
  lastLeveledUpAt: leveledUp ? now : (neuron.lastLeveledUpAt ?? null),
};

entries.push({
  id: createId('xp_activity'),
  neuronLabel: neuron.label,
  neuronId: tagId,
  xpGained: gainedXp,
  source: 'tag',
  sourceLabel: neuron.label,
  sessionCategory: category,
  leveledUp,
  newLevel,
  occurredAt: now,
});
```

For the category fallback branch, create similar entry with `source: 'category'` and `sourceLabel: categoryLabel`.

After all entries built (before `return`), append to activity log:
```ts
set((state) => ({
  xpActivityLog: [...state.xpActivityLog, ...entries].slice(-50),
}));
```

Return `entries`.

- [ ] **Step 5: Add `onRehydrateStorage` to normalize new fields**

Add persist config with `onRehydrateStorage`:

```ts
onRehydrateStorage: () => (state) => {
  if (state) {
    state.neurons = Object.fromEntries(
      Object.entries(state.neurons).map(([id, neuron]) => [
        id,
        {
          ...neuron,
          lastXpGained: typeof neuron.lastXpGained === 'number' ? neuron.lastXpGained : 0,
          lastLeveledUpAt: typeof neuron.lastLeveledUpAt === 'string' ? neuron.lastLeveledUpAt : null,
        },
      ]),
    );
    state.xpActivityLog = Array.isArray(state.xpActivityLog)
      ? state.xpActivityLog.slice(-50)
      : [];
  }
},
```

- [ ] **Step 6: Run type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/stores/palaceStore.ts
git commit -m "feat(gamification): update distributeXp to track deltas and activity log"
```

---

### Task 3: Write Store Tests

**Files:**
- Create: `src/__tests__/palaceStore.test.ts`

- [ ] **Step 1: Create test file**

Create `src/__tests__/palaceStore.test.ts` with a helper to build a fresh in-memory store:

```ts
import { createPalaceStore } from '@/stores/palaceStore';
import type { PalaceStore } from '@/stores/palaceStore';

function createTestStore() {
  const storage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  };
  const useStore = createPalaceStore(storage);
  return useStore;
}
```

Tests to write:
1. `distributeXp` returns `XpActivityEntry[]` with correct XP split across tags
2. `lastXpGained` is set on the neuron after distribution
3. Level-up sets `leveledUp: true` in entry and `lastLeveledUpAt` timestamp
4. Non-finite or non-positive XP returns empty array
5. Category fallback (no tags, non-custom) produces category-sourced entries
6. Custom category with no tags returns empty array
7. Activity log caps at 50 entries (push 60, expect 50)
8. `ensureNeuron` creates neurons with `lastXpGained: 0` and `lastLeveledUpAt: null`

- [ ] **Step 2: Run tests**

Run: `npm run test -- src/__tests__/palaceStore.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/__tests__/palaceStore.test.ts
git commit -m "test(gamification): add palaceStore distributeXp and activity log tests"
```

---

### Task 4: Neuron Popover Component

**Files:**
- Create: `src/components/palace/NeuronPopover.tsx`
- Modify: `src/components/palace/index.ts`

- [ ] **Step 1: Create NeuronPopover component**

Create `src/components/palace/NeuronPopover.tsx`:

```tsx
import { useCallback, useEffect, useRef } from 'react';
import { calculateExperienceToNextLevel } from '@/constants/evolution';
import type { NeuronState } from '@/types';

interface NeuronPopoverProps {
  neuron: NeuronState;
  x: number;
  y: number;
  onClose: () => void;
}

export function NeuronPopover({ neuron, x, y, onClose }: NeuronPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const xpToNext = calculateExperienceToNextLevel(neuron.level);
  const pct = Math.min(100, Math.round((neuron.totalXp / xpToNext) * 100));
  const maxLevel = neuron.level >= 50;

  return (
    <div
      ref={ref}
      role="dialog"
      className="absolute z-50 w-64 -translate-x-1/2 -translate-y-full -mt-4 rounded-xl border border-white/20 bg-black/80 p-4 shadow-2xl backdrop-blur-xl"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-white">{neuron.label}</span>
        <span className="text-xs font-medium text-white/70 bg-white/10 rounded-full px-2 py-0.5">Lv {neuron.level}</span>
      </div>
      <div className="mb-3">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>{neuron.totalXp.toLocaleString()} XP</span>
          {maxLevel ? <span>MAX LEVEL</span> : <span>{xpToNext.toLocaleString()} to next</span>}
        </div>
        {!maxLevel && (
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>
      {neuron.lastXpGained > 0 && (
        <p className="text-xs text-white/80">
          +{neuron.lastXpGained} XP from last session
          {neuron.lastLeveledUpAt && <span className="ml-1 text-yellow-400">✦ Level up!</span>}
        </p>
      )}
      {neuron.lastXpGained === 0 && neuron.totalXp === 0 && (
        <p className="text-xs text-white/50">No activity yet</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Export from palace index**

Add to `src/components/palace/index.ts`:
```ts
export { NeuronPopover } from './NeuronPopover';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/palace/NeuronPopover.tsx src/components/palace/index.ts
git commit -m "feat(gamification): add NeuronPopover with progress bar and last activity"
```

---

### Task 5: Wire Popover into NeuronMap

**Files:**
- Modify: `src/components/palace/NeuronNode.tsx`
- Modify: `src/components/palace/NeuronMap.tsx`

- [ ] **Step 1: Add `onClick` prop to NeuronNode**

In `NeuronNode.tsx`, add `onClick?: () => void` to props, make the `<article>` a `role="button"` with `tabIndex={0}`, and add `cursor-pointer` to className. Wire `onClick` and `onKeyDown` (Enter/Space).

- [ ] **Step 2: Add selectedNeuronId state and render popover in NeuronMap**

In `NeuronMap.tsx`:
- Import `useState` and `NeuronPopover`
- Add `const [selectedNeuronId, setSelectedNeuronId] = useState<string | null>(null);`
- Compute `selectedNeuron` and `selectedPosition` from state
- Pass `onClick` to each `NeuronNode` that toggles selection
- Render `<NeuronPopover>` at bottom when a neuron is selected

- [ ] **Step 3: Run type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/palace/NeuronNode.tsx src/components/palace/NeuronMap.tsx
git commit -m "feat(gamification): wire NeuronPopover into NeuronMap"
```

---

### Task 6: Live XP Attribution Toast

**Files:**
- Create: `src/components/palace/XpToast.tsx`
- Modify: `src/stores/setup.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create XpToast component**

Create `src/components/palace/XpToast.tsx` using custom events to decouple from stores:

```tsx
import { useCallback, useEffect, useState } from 'react';
import type { XpActivityEntry } from '@/types';

const XP_TOAST_EVENT = 'neural-architect:xp-toast';

export function dispatchXpToast(entries: XpActivityEntry[]) {
  window.dispatchEvent(new CustomEvent(XP_TOAST_EVENT, { detail: entries }));
}

export function XpToast() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<XpActivityEntry[]>([]);

  useEffect(() => {
    const handler = (e: Event) => {
      setEntries((e as CustomEvent).detail as XpActivityEntry[]);
      setVisible(true);
    };
    window.addEventListener(XP_TOAST_EVENT, handler);
    return () => window.removeEventListener(XP_TOAST_EVENT, handler);
  }, []);

  const dismiss = useCallback(() => setVisible(false), []);
  const goPalace = useCallback(() => {
    window.dispatchEvent(new CustomEvent('neural-architect:navigate', { detail: 'palace' }));
    dismiss();
  }, [dismiss]);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(dismiss, 6000);
    return () => clearTimeout(t);
  }, [visible, dismiss]);

  if (!visible || entries.length === 0) return null;

  const totalXp = entries.reduce((s, e) => s + e.xpGained, 0);
  const shown = entries.slice(0, 5);

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm rounded-xl border border-white/20 bg-black/80 p-4 shadow-2xl backdrop-blur-xl">
      <button type="button" onClick={dismiss} className="absolute top-2 right-2 text-white/50 hover:text-white/80 text-sm" aria-label="Dismiss">✕</button>
      <p className="text-sm font-semibold text-white mb-2">Focus complete! +{totalXp} XP</p>
      <ul className="space-y-1">
        {shown.map((entry) => (
          <li key={entry.id} className="flex justify-between text-xs text-white/80">
            <span>→ {entry.sourceLabel}</span>
            <span>+{entry.xpGained} XP{entry.leveledUp && <span className="ml-1 text-yellow-400">✦</span>}</span>
          </li>
        ))}
      </ul>
      {entries.length > 5 && <p className="text-xs text-white/50 mt-1">and {entries.length - 5} more...</p>}
      <button type="button" onClick={goPalace} className="mt-2 text-xs text-primary hover:text-primary/80 underline">View in Mind Palace</button>
    </div>
  );
}
```

- [ ] **Step 2: Wire toast dispatch in setup.ts**

Edit `src/stores/setup.ts`:

```ts
import { usePalaceStore, useSessionStore, useTimerStore } from '@/stores';
import { dispatchXpToast } from '@/components/palace/XpToast';

// In the onFocusSessionCompleted integration:
onFocusSessionCompleted: (record) => {
    useSessionStore.getState().recordSession(record);
    const entries = usePalaceStore.getState().distributeXp(record.category, record.tagIds, record.xpEarned);
    if (entries.length > 0) {
      dispatchXpToast(entries);
    }
},
```

- [ ] **Step 3: Add navigation event listener in App.tsx**

In `src/App.tsx`, add a second `useEffect` to listen for `neural-architect:navigate`:

```tsx
useEffect(() => {
  const handler = (e: Event) => {
    setActiveView((e as CustomEvent).detail as AppView);
  };
  window.addEventListener('neural-architect:navigate', handler);
  return () => window.removeEventListener('neural-architect:navigate', handler);
}, []);
```

Also render `<XpToast />` inside the main container.

- [ ] **Step 4: Export XpToast from palace index**

Add to `src/components/palace/index.ts`:
```ts
export { XpToast, dispatchXpToast } from './XpToast';
```

- [ ] **Step 5: Run type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/palace/XpToast.tsx src/stores/setup.ts src/App.tsx src/components/palace/index.ts
git commit -m "feat(gamification): add XP toast with custom event wiring"
```

---

### Task 7: Background Evolution

**Files:**
- Modify: `src/constants/evolution.ts`
- Modify: `src/components/palace/BackgroundLayer.tsx`
- Modify: `src/index.css`

- [ ] **Step 1: Add `getProgressTier` helper to evolution.ts**

```ts
export type ProgressTier = 1 | 2 | 3 | 4 | 5;

export function getProgressTier(highestLevel: number): ProgressTier {
  if (highestLevel >= 20) return 5;
  if (highestLevel >= 15) return 4;
  if (highestLevel >= 10) return 3;
  if (highestLevel >= 5) return 2;
  return 1;
}
```

- [ ] **Step 2: Update BackgroundLayer to read highest-level neuron and apply tier**

In `BackgroundLayer.tsx`:
- Import `usePalaceStore` from setup
- Import `getProgressTier` from evolution constants
- Compute highest neuron level: `const highestLevel = Math.max(...Object.values(neurons).map((n) => n.level), 0);`
- Compute tier: `const tier = getProgressTier(highestLevel);`
- Add `palace-bg--tier-${tier}` to the className alongside `palace-bg`

- [ ] **Step 3: Add tier CSS to index.css**

```css
.palace-bg--tier-2::after {
  background: linear-gradient(160deg, rgba(16, 185, 129, 0.08), transparent 50%);
}
.palace-bg--tier-3::after {
  background: linear-gradient(160deg, rgba(139, 92, 246, 0.12), transparent 50%);
}
.palace-bg--tier-4::after {
  background: linear-gradient(160deg, rgba(245, 158, 11, 0.10), rgba(245, 158, 11, 0.04) 60%);
}
.palace-bg--tier-5::after {
  background: linear-gradient(160deg, rgba(244, 63, 94, 0.12), rgba(99, 102, 241, 0.06) 50%);
}
```

- [ ] **Step 4: Commit**

```bash
git add src/constants/evolution.ts src/components/palace/BackgroundLayer.tsx src/index.css
git commit -m "feat(gamification): add background evolution based on highest neuron level"
```

---

### Task 8: System Flow View

**Files:**
- Create: `src/components/system/SystemFlowView.tsx`
- Create: `src/components/system/index.ts`

- [ ] **Step 1: Create SystemFlowView component**

Create `src/components/system/SystemFlowView.tsx`:

```tsx
import { useMemo } from 'react';
import { usePalaceStore, useTimerStore } from '@/stores/setup';
import { calculateExperienceToNextLevel } from '@/constants/evolution';

export function SystemFlowView() {
  const config = useTimerStore((state) => state.config);
  const neurons = usePalaceStore((state) => state.neurons);

  const targetNeurons = useMemo(() => {
    if (config.activeTags.length > 0) {
      return config.activeTags
        .map((tagId) => neurons[tagId])
        .filter(Boolean);
    }
    if (config.currentCategory !== 'custom') {
      const catNeuron = neurons[`cat:${config.currentCategory}`];
      return catNeuron ? [catNeuron] : [];
    }
    return [];
  }, [config.activeTags, config.currentCategory, neurons]);

  const xpPerSession = Math.round((config.focusInterval / 60) * 10);
  const xpPerTag = config.activeTags.length > 0
    ? Math.floor(xpPerSession / config.activeTags.length)
    : xpPerSession;

  return (
    <section className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <h2 className="text-2xl font-semibold text-white text-center">How It Works</h2>

      {/* Step 1 */}
      <div className="rounded-xl border border-white/20 bg-black/30 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white/90 mb-2">1. Choose Your Session</h3>
        <p className="text-sm text-white/70 mb-3">
          Each session has a category{config.activeTags.length > 0 ? ' and optional tags' : ''}.
          Tags describe what you're working on and determine where XP goes.
        </p>
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-primary/30 text-white text-xs px-3 py-1">{config.currentCategory}</span>
          {config.activeTags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 text-white/80 text-xs px-3 py-1">{tag}</span>
          ))}
        </div>
      </div>

      {/* Step 2 */}
      <div className="rounded-xl border border-white/20 bg-black/30 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white/90 mb-2">2. Complete a Focus Session</h3>
        <p className="text-sm text-white/70 mb-2">
          Every completed focus session earns XP. {config.focusInterval / 60} min session → {xpPerSession} XP
        </p>
        <div className="text-xs text-white/60">
          {config.focusInterval / 60} min × 10 = {xpPerSession} XP
        </div>
      </div>

      {/* Step 3 */}
      <div className="rounded-xl border border-white/20 bg-black/30 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white/90 mb-2">3. XP Finds Its Home</h3>
        {config.activeTags.length > 0 ? (
          <p className="text-sm text-white/70">
            XP is split evenly across your active tags. Each tag receives ~{xpPerTag} XP per session.
          </p>
        ) : config.currentCategory !== 'custom' ? (
          <p className="text-sm text-white/70">
            XP goes to your <span className="text-white/90 font-medium">{config.currentCategory}</span> category neuron.
          </p>
        ) : (
          <p className="text-sm text-yellow-400">
            No XP earned — add tags to your custom category to earn XP.
          </p>
        )}
        {targetNeurons.length > 0 && (
          <div className="mt-3 space-y-2">
            {targetNeurons.map((n) => (
              <div key={n.id} className="flex items-center gap-3 text-xs">
                <span className="text-white/80">{n.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (n.totalXp / calculateExperienceToNextLevel(n.level)) * 100)}%` }} />
                </div>
                <span className="text-white/60">Lv {n.level} · {n.totalXp} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Step 4 */}
      <div className="rounded-xl border border-white/20 bg-black/30 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white/90 mb-2">4. Neurons Grow</h3>
        <p className="text-sm text-white/70">
          When a neuron accumulates enough XP, it levels up. Higher levels unlock new colors,
          larger size, and brighter glow on the neuron map.
        </p>
        <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[10px] text-white/50">
          <span className="text-neuron-basic font-medium">Basic</span>
          <span className="text-neuron-intermediate font-medium">Inter.</span>
          <span className="text-neuron-advanced font-medium">Adv.</span>
          <span className="text-neuron-expert font-medium">Expert</span>
          <span className="text-neuron-master font-medium">Master</span>
        </div>
      </div>

      {/* Stats */}
      <div className="rounded-xl border border-white/20 bg-black/30 p-5 backdrop-blur-md">
        <h3 className="text-sm font-semibold text-white/90 mb-2">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-semibold text-white">{Object.keys(neurons).length}</p>
            <p className="text-xs text-white/60">Neurons</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {Object.values(neurons).reduce((s, n) => s + n.totalXp, 0).toLocaleString()}
            </p>
            <p className="text-xs text-white/60">Total XP</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-white">
              {Math.max(...Object.values(neurons).map((n) => n.level), 1)}
            </p>
            <p className="text-xs text-white/60">Highest Level</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create system index.ts**

```ts
export { SystemFlowView } from './SystemFlowView';
```

- [ ] **Step 3: Commit**

```bash
git add src/components/system/
git commit -m "feat(gamification): add SystemFlowView explaining the gamification chain"
```

---

### Task 9: Add "How It Works" Navigation and Routing

**Files:**
- Modify: `src/components/navigation/ViewNavigation.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Update AppView type and ViewNavigation**

Edit `src/components/navigation/ViewNavigation.tsx`:

```ts
export type AppView = 'timer' | 'palace' | 'system';

const VIEW_OPTIONS = [
  { id: 'timer', label: 'Timer' },
  { id: 'palace', label: 'Mind Palace' },
  { id: 'system', label: 'How It Works' },
];
```

- [ ] **Step 2: Update App.tsx to render SystemFlowView and XpToast**

Replace the ternary with a switch:
```tsx
import { XpToast } from '@/components/palace';

// In render, after the main section:
{activeView === 'timer' && <TimerView />}
{activeView === 'palace' && <MindPalaceView />}
{activeView === 'system' && <SystemFlowView />}

<XpToast />
```

Add the navigation event listener (already done if Task 6's App.tsx step was followed).

- [ ] **Step 3: Update SettingsSidebar to include system view in navigation**

The `ViewNavigation` component already handles this since it now includes `system` in `VIEW_OPTIONS`. No changes needed.

- [ ] **Step 4: Run type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/navigation/ViewNavigation.tsx src/App.tsx
git commit -m "feat(gamification): add How It Works view navigation and routing"
```

---

### Task 10: Update Business Rules Documentation

**Files:**
- Modify: `docs/business-rules.md`

- [ ] **Step 1: Add sections for new NeuronState fields and activity log**

Add a line to the `Recorded Session Fields` section noting that `lastXpGained` and `lastLeveledUpAt` are tracked per neuron.

Add a new subsection:
```markdown
### XP Activity Log

- Every `distributeXp` call generates `XpActivityEntry` records for each neuron that receives XP.
- The log is persisted in the palace store, capped at 50 entries.
- Each entry records: neuron ID/label, XP gained, source (tag or category), whether a level-up occurred, and timestamp.
- After XP distribution, a toast notification shows the latest entries to provide immediate feedback.
```

Add a row to the Code Reference Index for the activity log.

- [ ] **Step 2: Commit**

```bash
git add docs/business-rules.md
git commit -m "docs(gamification): document new neuron fields and XP activity log"
```

---

### Task 11: Final Verification

- [ ] **Step 1: Run full type-check**

Run: `npm run type-check`
Expected: PASS

- [ ] **Step 2: Run full test suite**

Run: `npm run test`
Expected: PASS

- [ ] **Step 3: Run linter**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Run build**

Run: `npm run build`
Expected: PASS
