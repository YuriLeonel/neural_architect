# Neural Architect — Product Roadmap

Status: **Planning** · Updated: 2026-09-21 · Owner: TLC workflow

This roadmap is the *plan of record*. It is the input to the `tlc-spec-driven` workflow: each **feature** below becomes a `.specs/features/<feature>/` spec (Specify → Design → Tasks → Execute) with its own requirement IDs, atomic tasks, deterministic validators, and Verifier report. **Green-light actions** (deploys, external pushes, production DB changes) always need explicit approval per the TLC blast-radius rule.

The live source of product behavior is `docs/business-rules.md`. Where this roadmap changes a rule (e.g. server-authoritative XP), the change is listed under "Locked Decisions" and each affected feature spec must reconcile it back into `docs/business-rules.md`.

---

## 1. Problem Statement

> When a focus or break phase completes while the app is minimized or backgrounded, the completion notification is not delivered reliably — worst on mobile/tablet, present on desktop web.

The current app is a single-client SPA with `localStorage`-only state and no server. Browser timer throttling/suspension (iOS Safari especially) and the dead **Notification Triggers API** make it impossible for any pure-web build to fire an on-time completion notification in the background.

## 2. Solution Direction

Ship two surfaces against one self-hosted backend:

- **Android app** (phones *and* tablets, adaptive layout) built with Expo/React Native. Completion notifications are **scheduled locally via `expo-notifications`** — the OS fires them on time even if the app is killed.
- **Desktop web app** (existing codebase) gains auth, account sync, and **server-fired web push** at the phase deadline via the self-hosted API (VAPID, no Google in the message path).
- A **self-hosted Node API + Postgres** becomes the source of truth. It recomputes XP from raw session **facts** (anti-cheat by construction) and serves cross-device sync.

## 3. Locked Decisions (from product grilling — 2026-09-21)

These are settled and are *not* re-litigated by feature specs. Each maps to an AD entry to record in `.specs/STATE.md`.

| AD | Decision |
|----|----------|
| AD-01 | Delivery vehicle: native **Android** app (Expo managed) + existing desktop web; no iOS. |
| AD-02 | Auth: **Google one-tap only**, via **better-auth** self-hosted inside the API. No email/password. |
| AD-03 | Backend: **self-hosted** Node API (Express or Fastify) + Postgres, on the user's own box, deployed via GitHub Actions. |
| AD-04 | **Server is authoritative.** API recomputes XP from raw session facts; the Mind Palace is a derived projection of session history. Client payloads are untrusted (defensive validation mirrors existing philosophy). |
| AD-05 | Sync = **append-only idempotent fact log** (sessions) + **last-write-wins config blob**. No merge/reconciliation engine. |
| AD-06 | First-login **import** of existing `localStorage` history into an account — once, only if the account is empty. |
| AD-07 | "**Download my data**" JSON export in settings. |
| AD-08 | Notification contract: **2 events** (focus-end, break-end) × **3 switches** (on, sound, vibration); notification prefs are **per-device**; "keep screen awake during focus" toggle **syncs**. No action buttons in v1; no foreground service in v1. |
| AD-09 | Android completion notification = **locally scheduled** (`expo-notifications`); fires with the app killed and screen off, per business rules for phase completion this must also reconcile session/XP to the server when connectivity returns. |
| AD-10 | Desktop web completion alert = **deadline endpoint + VAPID web push**. Web client POSTs a "pending timer + deadline" on session start; the API scheduler fires a push at focus-end *and* break-end. |
| AD-11 | Repo shape: **npm workspaces monorepo**; pure domain logic extracted to a `shared/` package imported by both apps; web keeps the repo-root spot. No Turborepo. |
| AD-12 | Distribution: **side-loaded signed APK** from `eas build` for the user's own devices. No Play Store listing in v1. |
| AD-13 | Adaptive UI from day one (phones + tablets). Timer dial sized from viewport; neuron map supports pan. |

**Explicitly out of scope (v1):** iOS, Play Store/App Store listing, email/password auth, notification action buttons, Android foreground service, offline reconciliation/merge engine, FCM/mobile push, polyfills for background scheduling (none exist).

## 4. Target Architecture

```
┌────────────────────┐   ┌─────────────────────┐
│  Web app (desktop) │   │  Android app (Expo) │
│  React + Vite      │   │  React Native       │
│  (stays at root)   │   │  (mobile/           │
└──────┬─────────────┘   └─────┬───────────────┘
       │ billed pushes at      │ local scheduled
       │ phase deadline        │ notifications
┌──────┴──────────────────────┴───────────────────┐
│            Self-hosted Node API                  │
│  better-auth (Google one-tap) · sync · push      │
│  recomputes XP from session facts                │
├──────────────────────────────────────────────────┤
│                Postgres                          │
│  sessions (facts) · config (LWW) · users         │
└──────────────────────────────────────────────────┘
                  ▲
        ┌─────────┴─────────┐
        │ shared/ domain    │  rewards · evolution ·
        │ package (pure TS) │  timer constants · validation
        └───────────────────┘
```

## 5. Features by Phase

Execution order is **phase-by-phase**; each phase's features are independent units for the TLC workflow but share a semantic area. Do not start a phase whose dependency isn't done.

Legend — sizes are for TLC auto-sizing: S = small, M = medium, L = large, C = complex.

### Phase P0 — Foundations (shared domain + repo shape)

| Feature | Size | Depends on | Purpose |
|---|---|---|---|
| F0.1 npm workspaces monorepo | M | — | Add `shared/` as a workspace source package; web stays at root; vite + tsconfig updated; existing build/tests stay green. |
| F0.2 Extract pure domain into `shared/` | L | F0.1 | Move and re-export: rewards (`calculateReward`), evolution (`calculateLevel`, `getProgressTier`, curve constants), timer constants (phases, durations, categories, tags), and session/config validation helpers. No UI, no stores. Existing tests move with the code and stay green. |

**P0 Definition of Done**: `npm run build`, `npm run lint`, `npm run test` all green on `main`-equivalent state; web imports from `shared/`; no behavioral delta.

### Phase P1 — Backend (self-hosted API + Postgres)

| Feature | Size | Depends on | Purpose |
|---|---|---|---|
| F1.1 API skeleton + DB schema + migrations | L | — | Fastify app, Postgres via migrations, health endpoint, config/env handling, GitHub Actions deploy to the self-hosted box. |
| F1.2 Auth: better-auth + Google one-tap | C | F1.1 | Google-only sign-in, issued sessions, protected routes, first-run setup docs. |
| F1.3 Session facts API + server-side XP | L | F1.2 | Idempotent `POST /facts`, `GET /facts`, server recomputes XP per AD-04 from `category/tagIds/durationSeconds/completedAt`; defensive validation; derived `GET /palace` projection. |
| F1.4 Config sync (LWW) | S | F1.2 | `GET/PUT /config`, last-write-wins, schema-validated. |
| F1.5 First-login import | M | F1.3 | Bulk idempotent import endpoint with **empty-account-only** guard. |
| F1.6 Data export | S | F1.3 | `GET /export` returns sessions + config JSON (AD-07). |
| F1.7 Deadline push endpoint + scheduler | C | F1.2 | `POST /pending-timers`, in-API scheduler fires VAPID push at focus-end and break-end deadlines (AD-10). |

**P1 Definition of Done**: tests green for all API routes; push delivered on a real test subscription; deploy pipeline reaches the self-hosted box; secrets never in git (`.env` + ignore rules).

### Phase P2 — Android app (Expo)

| Feature | Size | Depends on | Purpose |
|---|---|---|---|
| F2.1 Expo scaffold + adaptive shell | L | F0.1 | Managed Expo app importing `shared/`; phone/tablet breakpoint system; navigation shell mirroring the web's three views. |
| F2.2 Port views (Timer / Palace / System Flow) | C | F2.1 | Viewport-sized timer dial, neuron map with pan, system flow cards; shared domain drives behavior. |
| F2.3 Offline-first stores + sync queue | C | F2.2, F1.3 | zustand + AsyncStorage/SQLite; append-only fact queue, config LWW; sync on connectivity/foreground. |
| F2.4 Local notifications + keep-awake | L | F2.2 | `expo-notifications` scheduling at phase deadlines; cancel/reschedule on reset/pause; permission flow; per-device matrix (on/sound/vibration); `expo-keep-awake` toggle synced (AD-08). |
| F2.5 Google one-tap auth on Android | M | F2.1, F1.2 | Full Google Sign-In → token → backend session (AD-02). |

**P2 Definition of Done**: APK side-loaded and run on a physical phone and tablet; notification fires on time with screen off; sessions queued offline sync to the API.

### Phase P3 — Web integration

| Feature | Size | Depends on | Purpose |
|---|---|---|---|
| F3.1 Web auth (Google one-tap) | M | F1.2 | Sign-in state, protected sync, graceful anonymous→signed-in transition. |
| F3.2 Web sync + first-login import | L | F3.1, F1.3 | Push local facts/config, pull + replace derived palace, once-only localStorage import (AD-06). |
| F3.3 Web push at phase deadlines | C | F3.2, F1.7 | Service worker + VAPID subscription; POST pending-timer on start; handler shows notifications at focus-end/break-end. |
| F3.4 Data export (web settings) | S | F3.1 | "Download my data" button (AD-07). |

**P3 Definition of Done**: desktop web timer completion alerts arrive while the tab is backgrounded; palace reflects server-derived state after sync; import migrated data appears once.

## 6. Cross-Cutting Requirements (apply to every feature that touches them)

These are normative statements in EARS style; feature specs inherit them.

- REQ-NOT-1: **When** a focus or break phase reaches its deadline **while** the Android app is backgrounded or killed, the app **shall** surface a notification at that deadline via OS-scheduled delivery.
- REQ-NOT-2: **While** the user enables a notification category's switches, the app **shall** honor on/sound/vibration independently per event and platform, degrading silently where the platform cannot deliver a component.
- REQ-SYNC-1: **When** connectivity returns after an offline period, the client **shall** push queued session facts and the latest config, then **shall** reconcile its local derived palace to the server-derived projection.
- REQ-SYNC-2: **If** the API receives a session fact whose client-generated ID already exists, it **shall** respond success without duplicating state.
- REQ-AUTH-1: **While** a request requires authentication, the API **shall** reject it with a 401 unless a valid Google-backed session is presented.
- REQ-DATA-1: **When** the API receives any client payload, it **shall** validate it defensively and ignore non-conforming fields, mirroring the existing localStorage defensive-parse philosophy.
- REQ-EXPORT-1: **When** the user requests a data export, the API **shall** return all of that user's session facts and config as downloadable JSON.
- REQ-IMPORT-1: **If** an account already contains any session facts, the API **shall** reject first-login imports for that account.

## 7. How the TLC Workflow Consumes This

1. Each phase feature becomes `.specs/features/<feature>/` via the auto-sized pipeline (Specify always; Design/Tasks for L/C; Execute per task with TDD and the always-on Verifier).
2. Deterministic gates enforce: EARS-shaped ACs and well-formed requirement IDs (`validate_spec.py`), atomic tasks with `Tests` + `Gate` (`validate_tasks.py`), Conventional Commits (`check_commit.py`), Verifier evidence (`validate_state.py`).
3. Requirement IDs in feature specs extend the `REQ-*`/`F<n>` numbering above for traceability.
4. Locked decisions (Section 3) are promoted into `.specs/STATE.md` AD entries during each feature's Design phase.
5. Phase ordering is enforced by the `Depends on` column; no forward-phase task may start.
6. Since total tasks exceed ~8, Execute is dispatched as **batched sub-agent workers** only after the user accepts the offer.

## 8. Milestones

| Milestone | Contents | Definition of "Done" observable |
|---|---|---|
| M1 Foundations | P0 | Monorepo builds; shared/ consumed by web; suite green. |
| M2 Backend live | P1 | API answering real requests on the self-hosted box; Google login works; push tested; secrets safe. |
| M3 Android v1 | P2 | APK side-loaded; screen-off notifications on time; offline→online sync verified on hardware. |
| M4 Web sync + push | P3 | Desktop notifications in background; palace synced; import once. |
| M5 Hardening | — | True-up `docs/business-rules.md` (server-authoritative XP, sync semantics), export validated, badge/edge-case review, `caveman-review` before merge. |

## 9. Risks & Sensitivities

- **Self-hosted uptime**: the user's box owns auth + sync. Document backup (Postgres dump) and restore as part of F1.1.
- **Google-only auth**: account loss = data loss. Export (AD-07) is the lifeboat; keep it cheap and correct.
- **Web push reality**: Safari/desktop receives it; iOS mobile web stays best-effort by platform — outside the Android scope, document as expected behavior.
- **OEM battery killers**: some Android OEMs can still delay scheduled notifications; note the limitation, don't silently promise guarantees.
- **Domain extraction drift**: extraction (F0.2) must be behavior-preserving — existing pure tests move with the code, nothing is rewritten.

## 10. Reference

- `docs/business-rules.md` — behavior source of truth (to be updated for server-authoritative rules in M5).
- `docs/specs/` — historical, repo-approved per-feature specs.
- `.specs/STATE.md` — decision log (AD-01…AD-13) populated during Design phases.