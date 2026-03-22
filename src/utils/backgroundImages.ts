import type { EnvironmentType } from '@/types';

type ResponsiveUrls = { sm: string; md: string; lg: string };

export const ENVIRONMENT_BACKGROUND_URLS: Record<Exclude<EnvironmentType, 'custom'>, ResponsiveUrls> = {
  library: {
    sm: '/backgrounds/library/library-768.webp',
    md: '/backgrounds/library/library-1280.webp',
    lg: '/backgrounds/library/library-1920.webp',
  },
  coffee_shop: {
    sm: '/backgrounds/coffee-shop/coffee-shop-768.webp',
    md: '/backgrounds/coffee-shop/coffee-shop-1280.webp',
    lg: '/backgrounds/coffee-shop/coffee-shop-1920.webp',
  },
  house: {
    sm: '/backgrounds/house/house-768.webp',
    md: '/backgrounds/house/house-1280.webp',
    lg: '/backgrounds/house/house-1920.webp',
  },
};

export function getResponsiveBackgroundUrl(environment: EnvironmentType): string | null {
  if (environment === 'custom') return null;

  const urls = ENVIRONMENT_BACKGROUND_URLS[environment];
  const width = window.innerWidth;

  if (width <= 768) return urls.sm;
  if (width <= 1280) return urls.md;
  return urls.lg;
}
