import { useMemo, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useSessionStore, useTimerStore } from '@/stores/setup';
import type { SessionCategory } from '@/types';
import { createId } from '@/utils';

interface CategoryOption {
  label: string;
  value: SessionCategory;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  { label: 'Work', value: 'work' },
  { label: 'Study', value: 'study' },
  { label: 'Training', value: 'training' },
  { label: 'Custom', value: 'custom' },
];

const MAX_TAG_LENGTH = 40;

export function CategorySelector() {
  const config = useTimerStore((state) => state.config);
  const setConfig = useTimerStore((state) => state.setConfig);
  const tags = useSessionStore((state) => state.tags);
  const addTag = useSessionStore((state) => state.addTag);
  const removeTag = useSessionStore((state) => state.removeTag);

  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [newTagLabel, setNewTagLabel] = useState('');

  const customTags = useMemo(
    () => Object.values(tags).filter((tag) => tag.category === 'custom'),
    [tags],
  );

  const saveCustomTag = () => {
    const normalizedLabel = newTagLabel.trim().replace(/\s+/g, ' ');

    if (normalizedLabel.length === 0 || normalizedLabel.length > MAX_TAG_LENGTH) {
      return;
    }

    const tagId = createId('tag');

    addTag({
      id: tagId,
      label: normalizedLabel,
      category: 'custom',
    });

    setConfig({
      currentCategory: 'custom',
      activeTags: Array.from(new Set([...config.activeTags, tagId])),
    });

    setNewTagLabel('');
    setIsCreatingTag(false);
  };

  const handleCategorySelect = (category: SessionCategory) => {
    setConfig({ currentCategory: category });
  };

  const toggleCustomTag = (tagId: string) => {
    const activeTags = config.activeTags.includes(tagId)
      ? config.activeTags.filter((activeTagId) => activeTagId !== tagId)
      : [...config.activeTags, tagId];

    setConfig({
      currentCategory: 'custom',
      activeTags,
    });
  };

  const removeCustomTag = (tagId: string) => {
    removeTag(tagId);
    setConfig({
      currentCategory: 'custom',
      activeTags: config.activeTags.filter((activeTagId) => activeTagId !== tagId),
    });
  };

  return (
    <div className="w-full max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {CATEGORY_OPTIONS.map((option) => {
          const isActive = config.currentCategory === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleCategorySelect(option.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
            >
              {option.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setIsCreatingTag((value) => !value)}
          aria-expanded={isCreatingTag}
          aria-label="Create custom tag"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <AddIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isCreatingTag ? (
        <div className="mx-auto flex w-full max-w-md items-center gap-2 rounded-lg bg-muted p-2">
          <input
            type="text"
            value={newTagLabel}
            onChange={(event) => setNewTagLabel(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                saveCustomTag();
              }
            }}
            placeholder="Custom tag name"
            maxLength={MAX_TAG_LENGTH}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={saveCustomTag}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      ) : null}

      {customTags.length > 0 ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {customTags.map((tag) => {
            const isTagActive = config.activeTags.includes(tag.id);
            return (
              <div
                key={tag.id}
                className={`flex items-center rounded-full border transition-colors ${
                  isTagActive
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCustomTag(tag.id)}
                  className="rounded-l-full px-3 py-1 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  {tag.label}
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    removeCustomTag(tag.id);
                  }}
                  aria-label={`Remove ${tag.label} tag`}
                  className={`inline-flex items-center justify-center rounded-r-full px-2 py-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isTagActive
                      ? 'text-primary-foreground/80 hover:text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <CloseIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
