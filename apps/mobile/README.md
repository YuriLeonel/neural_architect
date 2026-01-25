# Neural Architect - Mobile App

React Native mobile application for Neural Architect, built with Expo and TypeScript.

## Overview

The mobile application provides a native mobile experience for the Neural Architect Pomodoro timer. It uses MMKV for high-performance data persistence and leverages the shared package for business logic.

## Tech Stack

- **React Native 0.73** - Mobile UI framework
- **Expo 54** - Development platform and tooling
- **TypeScript 5.3** - Type safety
- **NativeWind v4** - Tailwind CSS for React Native
- **Zustand 4.4** - State management
- **react-native-mmkv 2.11** - High-performance storage

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Expo CLI (optional, can use npx)
- iOS Simulator (for macOS) or Android Emulator (for Android development)
- Expo Go app (for physical device testing)

### Installation

Install dependencies from the project root:

```bash
npm install
```

Build the shared package (required before development):

```bash
npm run build --workspace=packages/shared
```

### Running the Development Server

From the project root:

```bash
npm run dev:mobile
```

Or from this directory:

```bash
npm start
```

This starts the Expo development server. You can then:

- Press `i` to open iOS simulator
- Press `a` to open Android emulator
- Scan QR code with Expo Go app (iOS/Android) for physical device testing
- Press `w` to open in web browser

### Platform-Specific Commands

```bash
# iOS Simulator
npm run ios

# Android Emulator
npm run android

# Web Browser
npm run web
```

## Build and Deployment

### Development Build

For testing on physical devices without Expo Go:

```bash
npx expo prebuild
npx expo run:ios
# or
npx expo run:android
```

### Production Build

#### iOS

```bash
npm run build
eas build --platform ios
```

#### Android

```bash
npm run build
eas build --platform android
```

Note: EAS Build requires an Expo account and EAS CLI setup.

## Project Structure

```
apps/mobile/
├── src/
│   ├── stores/
│   │   └── setup.tsx          # Zustand store setup with MMKV
│   └── ...
├── App.tsx                     # Root component
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── tailwind.config.js          # NativeWind configuration
├── global.css                  # Global styles
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## Configuration

### Expo Configuration

The `app.json` file contains Expo app configuration including:

- App name and version
- Platform-specific settings
- Build configuration

### NativeWind Configuration

Uses NativeWind v4 with the global Tailwind config, providing the same design system as the web app.

### TypeScript Configuration

Extends the base TypeScript config with React Native-specific settings and path aliases.

## State Management

The mobile app uses Zustand stores configured with MMKV persistence for high performance:

```typescript
import { useTimerStore, useEvolutionStore, useUserStatsStore } from '@/stores/setup';
```

### Available Stores

- **useTimerStore** - Timer state and controls
- **useEvolutionStore** - Neural network evolution and leveling
- **useUserStatsStore** - User statistics, streaks, and achievements

All stores persist data to MMKV automatically, providing faster read/write performance compared to AsyncStorage.

## Styling

The app uses NativeWind v4 (Tailwind CSS for React Native):

- Same design system as web app
- Brand colors and design tokens
- Responsive utilities
- Dark theme by default

## Key Features

- **Pomodoro Timer**: Work sessions, short breaks, and long breaks
- **Neural Network Visualization**: Watch your network grow as you level up
- **Experience System**: Earn XP and progress through levels
- **Achievements**: Unlock achievements for milestones
- **Streak Tracking**: Maintain daily streaks for bonus rewards
- **Persistent State**: All progress saved to MMKV
- **Native Performance**: Optimized for mobile devices

## Platform-Specific Considerations

### iOS

- Uses native iOS components and navigation
- Supports iOS-specific features (notifications, background tasks)
- Follows iOS Human Interface Guidelines

### Android

- Uses native Android components and navigation
- Supports Android-specific features (notifications, background tasks)
- Follows Material Design principles

### Storage

MMKV provides:

- Synchronous API (no async/await needed)
- Higher performance than AsyncStorage
- Smaller storage footprint
- Thread-safe operations

## Development Scripts

- `npm start` - Start Expo development server
- `npm run ios` - Open in iOS simulator
- `npm run android` - Open in Android emulator
- `npm run web` - Open in web browser
- `npm run build` - Build for production
- `npm run type-check` - Type check without emitting files

## Testing on Physical Devices

1. Install Expo Go app from App Store (iOS) or Play Store (Android)
2. Start the development server: `npm start`
3. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app
4. The app will load on your device

## Troubleshooting

### Build Errors

If you encounter build errors, ensure:

1. The shared package is built: `npm run build --workspace=packages/shared`
2. All dependencies are installed: `npm install`
3. TypeScript types are up to date: `npm run type-check`
4. Expo CLI is up to date: `npx expo install --fix`

### MMKV Issues

If MMKV storage is not working:

- Ensure `react-native-mmkv` is properly installed
- Check that native modules are linked (automatic with Expo)
- Verify storage permissions on device

### Metro Bundler Issues

If Metro bundler has issues:

```bash
# Clear Metro cache
npx expo start --clear

# Reset watchman
watchman watch-del-all
```

## Performance Optimization

- MMKV for fast storage operations
- NativeWind for efficient styling
- Code splitting via Expo's automatic optimization
- Optimized bundle size

## Related Documentation

- [Project Root README](../../README.md) - Overall project documentation
- [Shared Package README](../../packages/shared/README.md) - Shared code reference
- [Web App README](../web/README.md) - Web app documentation
- [Expo Documentation](https://docs.expo.dev/) - Expo platform documentation
