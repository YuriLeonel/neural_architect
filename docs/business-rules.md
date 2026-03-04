# Business Rules

This document is the source of truth for product behavior in Neural Architect.
It describes how Pomodoro flow, session lifecycle, and Mind Palace progression work today.

## Scope and Intent

- Define runtime rules for timer phases, transitions, and reset semantics.
- Define what is persisted as a session and what is intentionally excluded.
- Define XP attribution strategy for Mind Palace neurons.
- Capture edge cases and invariants used to keep state consistent.
- Document client-side trust boundaries for persistence and integrity.

## Pomodoro Core Rules

### Phases

- The timer has exactly two normalized phases: `focus` and `break`.
- Legacy persisted values like `shortBreak` and `longBreak` are normalized to `break` on hydration.
- Phase duration is resolved from config:
  - `focus` -> `config.focusInterval`
  - `break` -> `config.breakInterval`

### Start, Pause, Resume

- `start` only activates a run when the timer is neither running nor paused.
- `pause` is valid only while running; it records `pausedAt`.
- `resume` is valid only while paused; it shifts `startedAt` by pause duration so elapsed time stays accurate.

### Tick and Completion

- `tick` is ignored unless the timer is running and has a valid `startedAt`.
- Remaining time is calculated from wall-clock elapsed time, not decremented blindly.
- When remaining time reaches `0`, the current phase completes immediately.

### Transitions and Manual Next Phase

- Completing a phase always transitions to the opposite phase:
  - `focus` -> `break`
  - `break` -> `focus`
- `skipBreak` acts as a manual "next phase" only while currently in `break`; it triggers break completion and moves to `focus`.
- Calling `skipBreak` in `focus` does nothing.

### Reset Behavior

- `requestReset` only opens a pending-reset state (`resetPending = true`).
- `confirmReset` resets remaining time to the full current phase duration and clears run state.
- `cancelReset` only clears the pending-reset flag.

## Session Lifecycle Rules

### What Creates a Session Record

- Only completed `focus` phases create a `SessionRecord`.
- Completed `break` phases never create a session record.
- Session IDs are generated at completion time.

### Recorded Session Fields

Every recorded focus session includes:

- `id`
- `category` (from current timer config)
- `tagIds` (from current timer config)
- `phase` (`focus`)
- `durationSeconds` (full configured focus duration, not partial elapsed)
- `completedAt` (ISO timestamp)
- `xpEarned`

### XP Value on Session

- Session XP is calculated as `round(calculateReward(durationMinutes, 1))`.
- Current reward formula is `durationMinutes * 10 * multiplier`, so with multiplier `1`:
  - `xpEarned = round((durationSeconds / 60) * 10)`

### What Is Intentionally Not Recorded

- No partial-progress session record is written for interrupted or reset focus runs.
- No break-phase completion is stored in session history.

## Gamification Rules (Mind Palace)

### Level Progression Reference

- Neuron level is derived from cumulative XP using the evolution curve in `calculateLevel`.
- XP-to-next-level uses `floor(100 * level ^ 1.5)`.

### XP Attribution Strategy

The XP distribution order is strict:

1. If one or more tags exist, distribute all XP across tag neurons.
2. If no tags exist, try category fallback neuron.
3. If category is `custom`, skip category fallback entirely.

### Tags-First Distribution

- Total XP is split across all `tagIds`.
- Each tag receives `floor(totalXp / tagCount)`, with remainder distributed one-by-one from first tag onward.
- Tag neuron labels are derived from tag IDs if no neuron already exists.

### Category Fallback Behavior

- Category fallback applies only when `tagIds` is empty and category is not `custom`.
- Category neuron IDs use `cat:<category>` and labels are fixed (`Work`, `Study`, `Read`).
- For `custom` category with no tags, no neuron receives XP.

### Safe-Place Mapping Concept

- Categories and tags map to stable neuron identities that represent safe places in the Mind Palace.
- Repeated completions accumulate XP into the same neuron identity, driving level growth over time.

## Edge Cases and Invariants

- Non-finite or non-positive XP values are ignored by XP distribution.
- Rehydration always clears active run flags (`isRunning`, `isPaused`, `startedAt`, `pausedAt`, `resetPending`) to avoid stale runtime continuation.
- Config normalization enforces:
  - positive finite intervals
  - valid known categories
  - `activeTags` filtered to strings only
- Updating config or manually changing phase resets active run state by design.
- On phase completion, phase notification is always emitted; session recording remains focus-only.

## Security and Data Integrity Notes

- Persistence is client-side (`localStorage`) and therefore user-tamperable.
- Stored JSON is parsed defensively; invalid JSON is discarded and removed.
- This project currently has no server-authoritative validation for session or XP integrity.
- Treat all persisted timer/session/palace values as convenience state, not trusted proof.

## End-to-End Flow

```mermaid
flowchart TD
  userStarts[User starts focus] --> timerTick[Tick loop]
  timerTick --> focusComplete{Focus complete?}
  focusComplete -->|yes| createSession[Create SessionRecord]
  createSession --> distributeXp[Distribute XP to Mind Palace]
  distributeXp --> notifyFocus[Notify focus completion]
  notifyFocus --> switchBreak[Switch to break]
  focusComplete -->|no| continueFocus[Continue countdown]
  switchBreak --> breakComplete{Break complete or skipped?}
  breakComplete --> notifyBreak[Notify break completion]
  notifyBreak --> switchFocus[Switch to focus]
```

## Code Reference Index

| Rule Area | Primary Implementation References |
| --- | --- |
| Timer phases, transitions, start/pause/resume/reset, skip-break | `src/stores/timerStore.ts`, `src/constants/timer.ts` |
| Focus-only session creation and XP value at completion | `src/stores/timerStore.ts`, `src/utils/rewards.ts` |
| Store integration boundary (`timer -> session + palace + notifications`) | `src/stores/setup.ts` |
| Session persistence model (records/tags/order) | `src/stores/sessionStore.ts` |
| Mind Palace XP distribution (tags-first, fallback, custom handling) | `src/stores/palaceStore.ts` |
| Level progression curve and level calculation | `src/constants/evolution.ts`, `src/stores/palaceStore.ts` |
| Storage parsing and client-side persistence boundary | `src/stores/setup.ts` |
