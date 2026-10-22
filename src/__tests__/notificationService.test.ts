import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockPlayChime = vi.fn();
const mockPlayVibration = vi.fn();

vi.mock('@/utils/audioService', () => ({
  playCompletionChime: mockPlayChime,
}));

vi.mock('@/utils/vibrationService', () => ({
  playCompletionVibration: mockPlayVibration,
  isVibrationSupported: () => true,
}));

describe('notificationService', () => {
  let NotificationMock: ReturnType<typeof vi.fn> & { permission: string; requestPermission: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    vi.resetModules();
    mockPlayChime.mockClear();
    mockPlayVibration.mockClear();

    NotificationMock = Object.assign(vi.fn(), {
      permission: 'granted',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    });

    vi.stubGlobal('Notification', NotificationMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends browser notification when notificationsEnabled', async () => {
    const { notifyPhaseCompletion } = await import('@/utils/notificationService');
    notifyPhaseCompletion({ type: 'FOCUS_COMPLETE' }, {
      notificationsEnabled: true,
      soundEnabled: false,
      vibrationEnabled: false,
    });

    expect(NotificationMock).toHaveBeenCalledTimes(1);
    expect(mockPlayChime).not.toHaveBeenCalled();
    expect(mockPlayVibration).not.toHaveBeenCalled();
  });

  it('plays chime when soundEnabled', async () => {
    const { notifyPhaseCompletion } = await import('@/utils/notificationService');
    notifyPhaseCompletion({ type: 'BREAK_COMPLETE' }, {
      notificationsEnabled: false,
      soundEnabled: true,
      vibrationEnabled: false,
    });

    expect(mockPlayChime).toHaveBeenCalledTimes(1);
  });

  it('plays vibration when vibrationEnabled', async () => {
    const { notifyPhaseCompletion } = await import('@/utils/notificationService');
    notifyPhaseCompletion({ type: 'FOCUS_COMPLETE' }, {
      notificationsEnabled: false,
      soundEnabled: false,
      vibrationEnabled: true,
    });

    expect(mockPlayVibration).toHaveBeenCalledTimes(1);
  });

  it('fires all three channels when all enabled', async () => {
    const { notifyPhaseCompletion } = await import('@/utils/notificationService');
    notifyPhaseCompletion({ type: 'FOCUS_COMPLETE' }, {
      notificationsEnabled: true,
      soundEnabled: true,
      vibrationEnabled: true,
    });

    expect(NotificationMock).toHaveBeenCalledTimes(1);
    expect(mockPlayChime).toHaveBeenCalledTimes(1);
    expect(mockPlayVibration).toHaveBeenCalledTimes(1);
  });

  it('fires nothing when all disabled', async () => {
    const { notifyPhaseCompletion } = await import('@/utils/notificationService');
    notifyPhaseCompletion({ type: 'BREAK_COMPLETE' }, {
      notificationsEnabled: false,
      soundEnabled: false,
      vibrationEnabled: false,
    });

    expect(mockPlayChime).not.toHaveBeenCalled();
    expect(mockPlayVibration).not.toHaveBeenCalled();
  });
});
