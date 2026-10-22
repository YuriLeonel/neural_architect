import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import VolumeUpOutlinedIcon from '@mui/icons-material/VolumeUpOutlined';
import VibrationOutlinedIcon from '@mui/icons-material/VibrationOutlined';
import { useUserStatsStore } from '@/stores/setup';
import { isNotificationSupported, requestPermission, notifyPhaseCompletion } from '@/utils/notificationService';
import { isVibrationSupported } from '@/utils/vibrationService';

interface ToggleProps {
  readonly label: string;
  readonly description: string;
  readonly checked: boolean;
  readonly onChange: (checked: boolean) => void;
  readonly icon: React.ReactNode;
  readonly disabled?: boolean;
  readonly disabledReason?: string;
}

function Toggle({ label, description, checked, onChange, icon, disabled, disabledReason }: ToggleProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-background p-3">
      <div className="mt-0.5 text-muted-foreground" aria-hidden="true">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer">
            {label}
          </label>
          {disabled && disabledReason && (
            <span className="text-xs text-muted-foreground" title={disabledReason}>
              (unsupported)
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          checked ? 'bg-primary' : 'bg-muted'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-lg ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

const ICON_CLASS = 'h-5 w-5';

export function PreferencesSection() {
  const preferences = useUserStatsStore((state) => state.preferences);
  const updatePreferences = useUserStatsStore((state) => state.updatePreferences);

  const notificationSupported = isNotificationSupported();
  const vibrationSupported = isVibrationSupported();

  const handleNotificationToggle = async (checked: boolean) => {
    if (checked && notificationSupported) {
      const permission = await requestPermission();
      if (permission !== 'granted') {
        return;
      }
    }
    updatePreferences({ notificationsEnabled: checked });
  };

  const handleTest = () => {
    notifyPhaseCompletion(
      { type: 'FOCUS_COMPLETE' },
      {
        notificationsEnabled: preferences.notificationsEnabled,
        soundEnabled: preferences.soundEnabled,
        vibrationEnabled: preferences.vibrationEnabled,
      },
    );
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Toggle
          label="Notifications"
          description="Show system notifications when a session ends"
          checked={preferences.notificationsEnabled}
          onChange={handleNotificationToggle}
          icon={<NotificationsActiveOutlinedIcon className={ICON_CLASS} />}
          disabled={!notificationSupported}
          disabledReason="Notifications not supported in this browser"
        />
        <Toggle
          label="Sound"
          description="Play a gentle chime when a session ends"
          checked={preferences.soundEnabled}
          onChange={(checked) => updatePreferences({ soundEnabled: checked })}
          icon={<VolumeUpOutlinedIcon className={ICON_CLASS} />}
        />
        <Toggle
          label="Vibration"
          description="Vibrate the device when a session ends"
          checked={preferences.vibrationEnabled}
          onChange={(checked) => updatePreferences({ vibrationEnabled: checked })}
          icon={<VibrationOutlinedIcon className={ICON_CLASS} />}
          disabled={!vibrationSupported}
          disabledReason="Vibration not supported on this device"
        />
      </div>
      <button
        type="button"
        onClick={handleTest}
        className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        Test Alerts
      </button>
    </div>
  );
}
