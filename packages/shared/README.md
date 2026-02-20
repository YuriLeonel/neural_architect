# Neural Architect - Shared Package

Shared TypeScript code, Zustand store factories, and business logic used by the web app.

## Purpose

This package centralizes:

- Store factories (`timer`, `evolution`, `userStats`)
- Shared types and interfaces
- Progression constants and formulas
- Reusable utility functions

## Build

From this directory:

```bash
npm run build
```

From repository root:

```bash
npm run build --workspace=packages/shared
```

## Exports

```typescript
import { ... } from '@neural-architect/shared';
import { ... } from '@neural-architect/shared/stores';
import { ... } from '@neural-architect/shared/types';
import { ... } from '@neural-architect/shared/constants';
```

## Storage adapter contract

Store factories require a storage adapter compatible with Zustand persistence:

```typescript
interface Storage {
  getItem: (name: string) => string | null;
  setItem: (name: string, value: string) => void;
  removeItem: (name: string) => void;
}
```

Web implementation is provided in `apps/web/src/stores/setup.ts`.

## Best Practices

1. Keep business logic in this package
2. Keep logic deterministic and testable
3. Avoid duplicating formulas/constants in app packages
4. Keep strict TypeScript types (no `any`)

## Related Documentation

- [Project Root README](../../README.md) - Overall project documentation
- [Web App README](../../apps/web/README.md) - Web app documentation
