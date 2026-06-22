# README & Repository Description — Design

## Goal

Update the README and repository metadata to communicate that Neural Architect is built through AI-assisted development using superpowers skills and a structured engineering workflow.

## Audience

Both contributors (developers who might work on the codebase) and portfolio viewers (recruiters evaluating the project).

## Approach

**Approach A** — Add a dedicated "Development Workflow" section to the existing README with minimal restructuring.

## Changes

### 1. Tagline (README L2)

**Current:**
> A Pomodoro web application focused on completion momentum through gamified progression.

**New:**
> A gamified Pomodoro web application — built through AI-assisted development with disciplined phase-gate workflows, spec-driven design, and mandatory TDD.

### 2. Badge (after title)

Add badge line after `# Neural Architect`:

```markdown
![AI-Assisted Development](https://img.shields.io/badge/AI--Assisted-Development-6366f1?style=flat-square)
```

Color `#6366f1` matches the project's primary indigo brand color.

### 3. `package.json` description

**Current:** `"Gamified Pomodoro web application"`

**New:** `"Gamified Pomodoro app built with AI-assisted development, phase-gate workflows, spec-driven design, and TDD"`

### 4. New "Development Workflow" section (after "Theming")

```markdown
## Development Workflow

This project is built through AI-assisted development using [opencode](https://opencode.ai) with **superpowers skills** — a modular skill ecosystem that enforces disciplined engineering practices:

- **Phase-gate model** (Gates 0→3): every task flows through investigation → plan → implementation → review, with mandatory stop points at each stage.
- **Spec-driven development**: features are designed and documented in `docs/superpowers/specs/` before any code is written.
- **Mandatory TDD** (Red-Green-Refactor): no production code without a failing test first.
- **Plan-before-implement**: code changes require an approved written plan — no exceptions.
- **GitHub Flow** with Conventional Commits and squash-merge PRs.
- **Pre-commit gates**: tests must pass, lint must be clean, type-check must succeed.

The full agent instructions live in [`AGENTS.md`](AGENTS.md), which serves as the development guide for AI contributors.
```

## Files Changed

| File | Change |
|------|--------|
| `README.md` | Update tagline (L2), add badge (after L1), add Development Workflow section (after L119) |
| `package.json` | Update `description` field (L6) |
