import { describe, it, expect } from 'vitest';
import { createPalaceStore } from '@/stores/palaceStore';

function createTestStore() {
  const storage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {},
  } as any;
  return createPalaceStore(storage);
}

describe('palaceStore', () => {
  describe('distributeXp', () => {
    it('returns XpActivityEntry[] for tag distribution', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('work', ['tag_a', 'tag_b'], 100);

      expect(entries).toHaveLength(2);

      for (const entry of entries) {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('neuronLabel');
        expect(entry).toHaveProperty('neuronId');
        expect(entry).toHaveProperty('xpGained');
        expect(entry).toHaveProperty('source');
        expect(entry).toHaveProperty('sourceLabel');
        expect(entry).toHaveProperty('sessionCategory');
        expect(entry).toHaveProperty('leveledUp');
        expect(entry).toHaveProperty('newLevel');
        expect(entry).toHaveProperty('occurredAt');
        expect(entry.source).toBe('tag');
      }

      expect(entries[0]!.xpGained).toBe(50);
      expect(entries[1]!.xpGained).toBe(50);
    });

    it('remainder XP goes to first tag(s)', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('work', ['tag_a', 'tag_b'], 101);

      expect(entries).toHaveLength(2);
      expect(entries[0]!.xpGained).toBe(51);
      expect(entries[1]!.xpGained).toBe(50);
    });

    it('lastXpGained updates on subsequent distributions', () => {
      const store = createTestStore();

      store.getState().distributeXp('work', ['tag_a'], 100);
      expect(store.getState().neurons['tag_a']!.lastXpGained).toBe(100);

      store.getState().distributeXp('work', ['tag_a'], 50);
      expect(store.getState().neurons['tag_a']!.lastXpGained).toBe(50);
    });

    it('level-up sets leveledUp: true and lastLeveledUpAt', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('work', ['tag_a'], 10000);

      expect(entries[0]!.leveledUp).toBe(true);
      expect(store.getState().neurons['tag_a']!.lastLeveledUpAt).toEqual(expect.any(String));
    });

    it('non-finite / non-positive XP returns empty array', () => {
      const store = createTestStore();

      expect(store.getState().distributeXp('work', ['tag_a'], 0)).toEqual([]);
      expect(store.getState().distributeXp('work', ['tag_a'], -5)).toEqual([]);
      expect(store.getState().distributeXp('work', ['tag_a'], Infinity)).toEqual([]);
      expect(store.getState().neurons).toEqual({});
    });

    it('category fallback with no tags (non-custom)', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('study', [], 200);

      expect(entries).toHaveLength(1);
      expect(entries[0]!.source).toBe('category');
      expect(entries[0]!.sourceLabel).toBe('Study');
      expect(entries[0]!.neuronId).toBe('cat:study');
    });

    it('custom category with no tags returns empty', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('custom', [], 100);

      expect(entries).toEqual([]);
      expect(store.getState().neurons).toEqual({});
    });

    it('activity log has correct entries after distribution', () => {
      const store = createTestStore();
      const entries = store.getState().distributeXp('work', ['tag_a'], 100);

      expect(store.getState().xpActivityLog).toHaveLength(1);
      expect(store.getState().xpActivityLog[0]!).toEqual(entries[0]!);
    });

    it('activity log caps at 50 entries', () => {
      const store = createTestStore();

      for (let i = 0; i < 55; i++) {
        store.getState().distributeXp('work', ['tag_a'], 100);
      }

      expect(store.getState().xpActivityLog.length).toBeLessThanOrEqual(50);
    });
  });

  describe('ensureNeuron', () => {
    it('creates neurons with default values', () => {
      const store = createTestStore();
      store.getState().ensureNeuron('tag_test', 'Test');

      const neuron = store.getState().neurons['tag_test']!;
      expect(neuron).toBeDefined();
      expect(neuron.lastXpGained).toBe(0);
      expect(neuron.lastLeveledUpAt).toBeNull();
    });
  });

  describe('onRehydrateStorage', () => {
    it('normalizes missing lastXpGained and lastLeveledUpAt on rehydration', () => {
      const staleStorage = {
        getItem: () => ({
          state: {
            neurons: {
              tag_a: {
                id: 'tag_a',
                label: 'Tag A',
                totalXp: 500,
                level: 3,
                unlocked: true,
              },
            },
            xpActivityLog: [],
          },
          version: 0,
        }),
        setItem: () => {},
        removeItem: () => {},
      } as any;
      const store = createPalaceStore(staleStorage);
      const neuron = store.getState().neurons['tag_a']!;
      expect(neuron.lastXpGained).toBe(0);
      expect(neuron.lastLeveledUpAt).toBeNull();
    });

    it('normalizes non-array xpActivityLog on rehydration', () => {
      const staleStorage = {
        getItem: () => ({
          state: {
            neurons: {},
            xpActivityLog: 'invalid',
          },
          version: 0,
        }),
        setItem: () => {},
        removeItem: () => {},
      } as any;
      const store = createPalaceStore(staleStorage);
      expect(store.getState().xpActivityLog).toEqual([]);
    });

    it('restores valid xpActivityLog on rehydration', () => {
      const existingLog = [
        {
          id: 'entry_1',
          neuronLabel: 'Tag A',
          neuronId: 'tag_a',
          xpGained: 100,
          source: 'tag',
          sourceLabel: 'Tag A',
          sessionCategory: 'work',
          leveledUp: true,
          newLevel: 2,
          occurredAt: '2026-01-01T00:00:00.000Z',
        },
      ];
      const validStorage = {
        getItem: () => ({
          state: {
            neurons: {},
            xpActivityLog: existingLog,
          },
          version: 0,
        }),
        setItem: () => {},
        removeItem: () => {},
      } as any;
      const store = createPalaceStore(validStorage);
      expect(store.getState().xpActivityLog).toEqual(existingLog);
    });
  });
});
