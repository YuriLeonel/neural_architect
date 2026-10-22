import type { TimerNotificationPayload } from '../types';
import { playCompletionChime } from './audioService';
import { playCompletionVibration } from './vibrationService';

interface NotificationContent {
  readonly title: string;
  readonly body: string;
}

function getNotificationContent(payload: TimerNotificationPayload): NotificationContent {
  switch (payload.type) {
    case 'FOCUS_COMPLETE':
      return {
        title: 'Focus Complete',
        body: 'Focus Session Complete. We recommend a short break to reset your mind.',
      };
    case 'BREAK_COMPLETE':
      return {
        title: 'Break Complete',
        body: 'Break Concluded. Return to deep work to continue your focus session.',
      };
    default: {
      const exhaustiveCheck: never = payload;
      return exhaustiveCheck;
    }
  }
}

export function isNotificationSupported(): boolean {
  return typeof Notification !== 'undefined';
}

export async function requestPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.warn('Notification permission request failed:', error);
    return 'denied';
  }
}

interface NotificationPreferences {
  readonly notificationsEnabled: boolean;
  readonly soundEnabled: boolean;
  readonly vibrationEnabled: boolean;
}

function sendBrowserNotification(payload: TimerNotificationPayload): void {
  if (!isNotificationSupported()) {
    return;
  }

  if (Notification.permission !== 'granted') {
    return;
  }

  const content = getNotificationContent(payload);

  try {
    new Notification(content.title, { body: content.body });
  } catch (error) {
    console.warn('Notification delivery failed:', error);
  }
}

export function notifyPhaseCompletion(
  payload: TimerNotificationPayload,
  preferences: NotificationPreferences,
): void {
  if (preferences.notificationsEnabled) {
    sendBrowserNotification(payload);
  }

  if (preferences.soundEnabled) {
    playCompletionChime();
  }

  if (preferences.vibrationEnabled) {
    playCompletionVibration();
  }
}
