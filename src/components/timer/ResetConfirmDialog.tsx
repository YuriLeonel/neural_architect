import { useTimerStore } from '@/stores/setup';

const RESET_PROMPT =
  'Deep work state detected. Resetting now will lose accumulated neuro-plasticity gains. Proceed?';

export function ResetConfirmDialog() {
  const resetPending = useTimerStore((state) => state.resetPending);
  const confirmReset = useTimerStore((state) => state.confirmReset);
  const cancelReset = useTimerStore((state) => state.cancelReset);

  if (!resetPending) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-confirm-title"
        aria-describedby="reset-confirm-message"
        className="w-full max-w-md rounded-xl border border-border bg-background p-6 shadow-xl"
      >
        <h2 id="reset-confirm-title" className="text-lg font-semibold text-foreground">
          Confirm Reset
        </h2>
        <p id="reset-confirm-message" className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {RESET_PROMPT}
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={cancelReset}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={confirmReset}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Confirm Reset
          </button>
        </div>
      </div>
    </div>
  );
}
