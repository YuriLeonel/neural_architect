#!/usr/bin/env node

/**
 * Syncs assets from shared package to mobile app
 * 
 * Usage: npm run assets:sync
 * 
 * This script copies PNG assets from packages/shared/assets/
 * to apps/mobile/assets/ for Expo to use.
 * 
 * Note: This is an alternative to symlinks if they don't work in your environment.
 */

const fs = require('fs');
const path = require('path');

const SHARED_ASSETS_DIR = path.resolve(__dirname, '../assets');
const MOBILE_ASSETS_DIR = path.resolve(__dirname, '../../apps/mobile/assets');

const ASSET_FILES = [
  'icon.png',
  'splash.png',
  'adaptive-icon.png',
  'favicon.png',
];

function syncAssets() {
  console.log('🔄 Syncing assets to mobile app...\n');

  // Ensure mobile assets directory exists
  if (!fs.existsSync(MOBILE_ASSETS_DIR)) {
    fs.mkdirSync(MOBILE_ASSETS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${MOBILE_ASSETS_DIR}`);
  }

  let successCount = 0;
  let failCount = 0;

  for (const assetFile of ASSET_FILES) {
    const sourcePath = path.join(SHARED_ASSETS_DIR, assetFile);
    const destPath = path.join(MOBILE_ASSETS_DIR, assetFile);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Source file not found: ${assetFile}`);
      failCount++;
      continue;
    }

    try {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Synced ${assetFile}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error syncing ${assetFile}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n📊 Sync complete: ${successCount} succeeded, ${failCount} failed`);

  if (failCount > 0) {
    process.exit(1);
  }
}

syncAssets();
