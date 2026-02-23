import type { TimerNotificationPayload } from '../types';

interface NotificationContent {
  readonly title: string;
  readonly body: string;
}

function getNotificationContent(payload: TimerNotificationPayload): NotificationContent {
  switch (payload.type) {
    case 'FOCUS_COMPLETE':
      return {
        title: 'Focus Complete',
        body: 'Focus Session Complete. Commencing recovery phase.',
      };
    case 'BREAK_COMPLETE':
      return {
        title: 'Break Complete',
        body: 'Break Concluded. Return to deep work state.',
      };
    default: {
      const exhaustiveCheck: never = payload;
      return exhaustiveCheck;
    }
  }
}

export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function sendTimerNotification(payload: TimerNotificationPayload): void {
  if (!isNotificationSupported()) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const content = getNotificationContent(payload);

  try {
    new Notification(content.title, { body: content.body });
  } catch {
    // Ignore notification delivery failures so timer flow never breaks.
  }
}
