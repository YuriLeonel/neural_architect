# README & Repository Description Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update README tagline, add badge, add Development Workflow section, and update `package.json` description.

**Architecture:** No code logic changes — only documentation and metadata edits. Two files affected: `README.md` (3 changes) and `package.json` (1 change).

**Tech Stack:** Markdown, JSON

---

### Task 1: Create branch and update package.json description

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Create and switch to branch**

```bash
git checkout -b docs/readme-and-repo-description
```

- [ ] **Step 2: Update package.json description**

Replace `"Gamified Pomodoro web application"` with `"Gamified Pomodoro app built with AI-assisted development, phase-gate workflows, spec-driven design, and TDD"`.

Edit `package.json` line 6:

```json
"description": "Gamified Pomodoro app built with AI-assisted development, phase-gate workflows, spec-driven design, and TDD",
```

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "docs: update package.json description to reflect AI-assisted development workflow"
```

---

### Task 2: Update README tagline

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Update tagline**

Replace line 3 with:

```markdown
A gamified Pomodoro web application — built through AI-assisted development with disciplined phase-gate workflows, spec-driven design, and mandatory TDD.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: update README tagline to include AI-assisted development methodology"
```

---

### Task 3: Add badge and Development Workflow section to README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add badge after title**

After line 1 (`# Neural Architect`), insert:

```markdown
![AI-Assisted Development](https://img.shields.io/badge/AI--Assisted-Development-6366f1?style=flat-square)
```

- [ ] **Step 2: Add Development Workflow section after Theming**

After line 119 (last line), append:

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

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add AI-Assisted Development badge and Development Workflow section to README"
```

---

### Task 4: Verify everything

- [ ] **Step 1: Run lint**

```bash
npm run lint
```

Expected: no errors (no source code changed).

- [ ] **Step 2: Run type-check**

```bash
npm run type-check
```

Expected: no errors (no source code changed).

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: production build succeeds.

- [ ] **Step 4: Review diff**

```bash
git log --oneline -5
git diff main...HEAD
```
