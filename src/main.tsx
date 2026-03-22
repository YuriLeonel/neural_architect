import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { getResponsiveBackgroundUrl } from './utils/backgroundImages';
import type { EnvironmentType, SessionCategory } from './types';

(function injectBackgroundPreload() {
  try {
    const palaceRaw = localStorage.getItem('neural-architect-palace');
    const timerRaw = localStorage.getItem('neural-architect-timer');

    const palaceState = palaceRaw ? (JSON.parse(palaceRaw)?.state ?? {}) : {};
    const timerState = timerRaw ? (JSON.parse(timerRaw)?.state ?? {}) : {};

    const categoryBackgrounds: Record<string, EnvironmentType> =
      palaceState.categoryBackgrounds ?? { work: 'coffee_shop', study: 'library', read: 'house' };

    const currentCategory: SessionCategory = timerState.config?.currentCategory ?? 'work';

    const environment: EnvironmentType = categoryBackgrounds[currentCategory] ?? 'coffee_shop';

    const url = getResponsiveBackgroundUrl(environment);
    if (!url) return;

    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.type = 'image/webp';
    link.href = url;
    document.head.appendChild(link);
  } catch {
    // Non-critical — silently skip if localStorage or JSON parsing fails
  }
})();

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element '#root' not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
