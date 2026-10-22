import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SOURCE_ICON = path.resolve('public/icon.png');
const OUTPUT_DIR = path.resolve('public/icons');

const SIZES = [192, 512];

async function generateIcons() {
  if (!fs.existsSync(SOURCE_ICON)) {
    console.error('Source icon not found:', SOURCE_ICON);
    process.exit(1);
  }

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const source = sharp(SOURCE_ICON);

  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}.png`);
    await source.resize(size, size, { fit: 'contain' }).png().toFile(outputPath);
    console.log(`Generated ${outputPath}`);
  }
}

generateIcons().catch((error) => {
  console.error('Failed to generate icons:', error);
  process.exit(1);
});
