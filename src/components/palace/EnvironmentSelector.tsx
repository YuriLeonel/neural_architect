import { ChangeEvent, useId, useState } from 'react';
import { usePalaceStore } from '@/stores/setup';
import type { EnvironmentType } from '@/types';

const MAX_CUSTOM_IMAGE_BYTES = 2 * 1024 * 1024;

const ENVIRONMENT_OPTIONS: ReadonlyArray<{ id: Exclude<EnvironmentType, 'custom'>; label: string }> = [
  { id: 'library', label: 'Library' },
  { id: 'coffee_shop', label: 'Coffee Shop' },
  { id: 'house', label: 'House' },
];

function normalizeFileReadResult(result: string | ArrayBuffer | null): string | null {
  if (typeof result !== 'string') {
    return null;
  }

  return result.startsWith('data:image/') ? result : null;
}

export function EnvironmentSelector() {
  const activeEnvironment = usePalaceStore((state) => state.activeEnvironment);
  const customBackgroundUrl = usePalaceStore((state) => state.customBackgroundUrl);
  const setEnvironment = usePalaceStore((state) => state.setEnvironment);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const uploadInputId = useId();

  const handleSelectEnvironment = (environment: EnvironmentType) => {
    setEnvironment(environment);
    setFeedback(null);
    setHasError(false);
  };

  const handleCustomImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
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
      setFeedback('Image must be 2MB or smaller.');
      setHasError(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = normalizeFileReadResult(reader.result);
      if (!dataUrl) {
        setFeedback('Failed to load image. Please choose another file.');
        setHasError(true);
        return;
      }

      setEnvironment('custom', dataUrl);
      setFeedback('Custom background updated.');
      setHasError(false);
    };
    reader.onerror = () => {
      setFeedback('Failed to read image from disk.');
      setHasError(true);
    };
    reader.readAsDataURL(file);
  };

  const isCustomActive = activeEnvironment === 'custom';

  return (
    <div className="rounded-2xl border border-white/20 bg-black/35 p-3 shadow-xl backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2">
        {ENVIRONMENT_OPTIONS.map((option) => {
          const isActive = option.id === activeEnvironment;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => handleSelectEnvironment(option.id)}
              className={[
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-black/35 text-white/90 hover:bg-black/45 hover:text-white',
              ].join(' ')}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => handleSelectEnvironment('custom')}
          className={[
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            isCustomActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-black/35 text-white/90 hover:bg-black/45 hover:text-white',
          ].join(' ')}
          aria-pressed={isCustomActive}
        >
          Custom
        </button>

        <label
          htmlFor={uploadInputId}
          className="cursor-pointer rounded-full border border-white/30 bg-black/35 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-black/45"
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

      <p className="mt-2 text-xs text-white/85">
        Max file size: 2MB.{' '}
        {customBackgroundUrl
          ? 'A custom image is currently saved.'
          : 'No custom image selected yet.'}
      </p>

      {feedback ? (
        <p className={`mt-1 text-xs ${hasError ? 'text-error' : 'text-success'}`} role="status">
          {feedback}
        </p>
      ) : null}
    </div>
  );
}
