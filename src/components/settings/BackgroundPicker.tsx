import { ChangeEvent, useId, useMemo, useState } from 'react';
import { usePalaceStore, useTimerStore } from '@/stores/setup';
import type { EnvironmentType, SessionCategory } from '@/types';
import { saveCustomBackground } from '@/utils/imageStorage';

const MAX_CUSTOM_IMAGE_BYTES = 10 * 1024 * 1024;

const ENVIRONMENT_OPTIONS: ReadonlyArray<{ id: EnvironmentType; label: string }> = [
  { id: 'library', label: 'Library' },
  { id: 'coffee_shop', label: 'Coffee Shop' },
  { id: 'house', label: 'House' },
  { id: 'custom', label: 'Custom' },
];

const CATEGORY_LABELS: Record<SessionCategory, string> = {
  work: 'Work',
  study: 'Study',
  read: 'Read',
  custom: 'Custom',
};

export function BackgroundPicker() {
  const currentCategory = useTimerStore((state) => state.config.currentCategory);
  const categoryBackgrounds = usePalaceStore((state) => state.categoryBackgrounds);
  const customBackgroundUrl = usePalaceStore((state) => state.customBackgroundUrl);
  const setCategoryBackground = usePalaceStore((state) => state.setCategoryBackground);

  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const uploadInputId = useId();

  const activeBackground = categoryBackgrounds[currentCategory];
  const currentCategoryLabel = CATEGORY_LABELS[currentCategory];
  const activeBackgroundLabel = useMemo(() => {
    return ENVIRONMENT_OPTIONS.find((option) => option.id === activeBackground)?.label ?? 'Unknown';
  }, [activeBackground]);

  const handleSelectBackground = (environment: EnvironmentType) => {
    setCategoryBackground(currentCategory, environment);
    setFeedback(null);
    setHasError(false);
  };

  const handleCustomImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setFeedback('Only image files are allowed for custom backgrounds.');
      setHasError(true);
      return;
    }

    if (file.size > MAX_CUSTOM_IMAGE_BYTES) {
      setFeedback('Image must be 10MB or smaller.');
      setHasError(true);
      return;
    }

    try {
      await saveCustomBackground(file);
      setCategoryBackground(currentCategory, 'custom', 'indexeddb');
      setFeedback(`Custom background set for ${currentCategoryLabel}.`);
      setHasError(false);
    } catch {
      setFeedback('Failed to save image. Please try again.');
      setHasError(true);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-3">
      <p className="text-sm text-muted-foreground">
        Background for <span className="font-medium text-foreground">{currentCategoryLabel}</span>:
        <span className="ml-1 font-medium text-foreground">{activeBackgroundLabel}</span>
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {ENVIRONMENT_OPTIONS.map((option) => {
          const isActive = option.id === activeBackground;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectBackground(option.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-background hover:text-foreground'
              }`}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}

        <label
          htmlFor={uploadInputId}
          className="cursor-pointer rounded-full border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Upload image
        </label>
        <input
          id={uploadInputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleCustomImageUpload}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Max file size: 10MB. {customBackgroundUrl === 'indexeddb' ? 'A custom image is currently saved.' : 'No custom image selected yet.'}
      </p>

      {feedback ? (
        <p className={`text-xs ${hasError ? 'text-error' : 'text-success'}`} role="status">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
