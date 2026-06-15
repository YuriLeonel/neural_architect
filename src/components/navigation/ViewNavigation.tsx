export type AppView = 'timer' | 'palace' | 'system';

interface ViewNavigationProps {
  activeView: AppView;
  onChangeView: (view: AppView) => void;
}

const VIEW_OPTIONS: ReadonlyArray<{ id: AppView; label: string }> = [
  { id: 'timer', label: 'Timer' },
  { id: 'palace', label: 'Mind Palace' },
  { id: 'system', label: 'System Flow' },
];

export function ViewNavigation({ activeView, onChangeView }: ViewNavigationProps) {
  return (
    <nav aria-label="View navigation" className="w-full max-w-md">
      <div className="grid grid-cols-3 gap-2 rounded-lg border border-border bg-background-secondary p-1">
        {VIEW_OPTIONS.map((option) => {
          const isActive = option.id === activeView;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onChangeView(option.id)}
              className={[
                'rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              ].join(' ')}
              aria-pressed={isActive}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
