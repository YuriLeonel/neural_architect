# Neural Architect Project Rules

You are acting as a Senior Software Engineer and Architect. Follow these rules for every interaction and code generation task.

## 1. Technical Stack & Architecture

- **Language**: TypeScript (strict mode). Avoid `any`; prefer `unknown` or explicit interfaces.
- **Frameworks**: React (web).
- **State Management**: Zustand with `persist` middleware.
- **Styling**: Tailwind CSS.
- **Structure**: Single application at repository root. Business logic, types, and stores live in `src/`.
- **Imports**: Use absolute path aliases (`@/`) defined in `tsconfig.json`.

## 2. Best Programming Practices

- **Composition over Inheritance**: Prioritize functional components and custom hooks.
- **DRY**: Avoid duplicated timer/evolution logic; centralize shared logic under `src/constants`, `src/stores`, and `src/types`.
- **Immutability**: Treat state as immutable and use Zustand update patterns.
- **Performance**: Use `useMemo` and `useCallback` for heavy computations or frequent re-renders.
- **Naming**: Use PascalCase for components/types and camelCase for functions/variables.

## 3. Security & Stability

- **Data Persistence**: Use `localStorage` safely with controlled serialization/deserialization.
- **Input Validation**: Validate user-configured durations to prevent negative values or unsafe ranges.
- **Side Effects**: Clean up timers and listeners in `useEffect`/store lifecycle paths.

## 4. Documentation & Grounding

- **Official Docs**:
  - Zustand: https://docs.pmnd.rs/zustand/getting-started/introduction
  - React: https://react.dev/
  - Vite: https://vitejs.dev/
- **Mathematical Grounding**:
  - XP: `XP_next = 100 * (level ^ 1.5)`
  - Reward: `Reward = (t * 10) * m`

## 5. Implementation Protocol

- **Step-by-Step**: For complex features, outline a plan before coding.
- **Type-First**: Define interfaces and types before implementing logic.
- **Testability**: Prefer pure functions for core logic where practical.
