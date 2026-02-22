import { create } from 'zustand';
import { persist, type PersistOptions } from 'zustand/middleware';
import type { SessionRecord, SessionTag } from '../types';

interface SessionState {
  tags: Record<string, SessionTag>;
  sessions: Record<string, SessionRecord>;
  sessionOrder: string[];
}

export interface SessionStore extends SessionState {
  addTag: (tag: SessionTag) => void;
  removeTag: (id: string) => void;
  recordSession: (record: SessionRecord) => void;
}

export function createSessionStore(storage: PersistOptions<SessionStore>['storage']) {
  return create<SessionStore>()(
    persist(
      (set) => ({
        tags: {} as Record<string, SessionTag>,
        sessions: {} as Record<string, SessionRecord>,
        sessionOrder: [] as string[],
        addTag: (tag: SessionTag) => {
          set((state) => ({
            tags: {
              ...state.tags,
              [tag.id]: tag,
            },
          }));
        },
        removeTag: (id: string) => {
          set((state) => {
            const { [id]: _removedTag, ...remainingTags } = state.tags;

            return {
              tags: remainingTags,
              sessions: Object.fromEntries(
                Object.entries(state.sessions).map(([sessionId, session]) => [
                  sessionId,
                  {
                    ...session,
                    tagIds: session.tagIds.filter((tagId) => tagId !== id),
                  },
                ]),
              ),
            };
          });
        },
        recordSession: (record: SessionRecord) => {
          set((state) => ({
            sessions: {
              ...state.sessions,
              [record.id]: record,
            },
            sessionOrder: [...state.sessionOrder, record.id],
          }));
        },
      }),
      {
        name: 'neural-architect-session',
        storage,
      },
    ),
  );
}
