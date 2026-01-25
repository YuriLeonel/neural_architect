# Shared Assets

This directory contains shared branding assets (icons, splash screens, favicons) used across all platforms in the Neural Architect monorepo.

## Directory Structure

```
assets/
├── icon.png
├── splash.png
├── adaptive-icon.png
└── favicon.png
```

All assets are PNG files stored directly in the `assets/` directory.

## Asset Requirements

### Icon (`icon.png`)
- **Size**: 1024x1024px
- **Format**: PNG
- **Usage**: Main app icon for iOS and Android
- **Requirements**: Square, recognizable at small sizes

### Splash Screen (`splash.png`)
- **Size**: 1242x2436px (recommended for full screen)
- **Format**: PNG
- **Usage**: App launch screen
- **Requirements**: Full-screen design, centered content

### Adaptive Icon (`adaptive-icon.png`)
- **Size**: 1024x1024px
- **Format**: PNG
- **Usage**: Android adaptive icon
- **Requirements**: Safe zone 768x768px (Android may crop edges)

### Favicon (`favicon.png`)
- **Size**: 512x512px
- **Format**: PNG
- **Usage**: Web browser favicon
- **Requirements**: Simple, readable at 16x16px and 32x32px

## Scripts

### Sync Assets (Alternative to Symlinks)
```bash
npm run assets:sync --workspace=packages/shared
```

Copies PNG assets from `assets/` to `apps/mobile/assets/`. Use this if symlinks don't work in your environment (e.g., Windows without developer mode).

## Platform Integration

### Mobile App (Expo)
- Assets are accessed via symlinks: `apps/mobile/assets/` → `packages/shared/assets/`
- Referenced in `apps/mobile/app.json`
- Expo automatically bundles these assets during build

### Web App (Vite)
- Favicon is symlinked: `apps/web/public/favicon.png` → `packages/shared/assets/favicon.png`
- Referenced in `apps/web/index.html`
- Other assets can be imported using the `@shared-assets` alias in `vite.config.ts`

## Adding New Assets

1. Add the PNG file directly to `assets/` directory
2. Update platform-specific configurations:
   - Mobile: Add symlink in `apps/mobile/assets/` or update `apps/mobile/app.json` if needed
   - Web: Add symlink or reference in `apps/web/public/` if needed

## Best Practices

1. **Use high-quality PNG files** - Ensure assets are properly sized and optimized
2. **Commit PNG files** to git for consistency across environments
3. **Test assets** on both platforms after making changes
4. **Keep consistent branding** - all assets should follow the same design language
5. **Optimize file sizes** - Use appropriate compression without losing quality

## Troubleshooting

### Symlinks Not Working
If symlinks don't work (common on Windows without developer mode):
- Use the `assets:sync` script instead
- Or manually copy PNG files to `apps/mobile/assets/`

### Assets Not Appearing
- Ensure PNG files exist in `assets/` directory
- Check symlinks are valid: `ls -la apps/mobile/assets/`
- For web, ensure favicon is in `apps/web/public/`
- Clear Expo cache: `npx expo start --clear`
- Clear Vite cache: Delete `node_modules/.vite`
