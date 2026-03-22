// @ts-check
import sharp from 'sharp';
import { readdir, stat, mkdir, rename, writeFile, access } from 'node:fs/promises';
import { join, basename, extname } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const PUBLIC = join(ROOT, 'public');

const PATHS = {
  /** Drop images here to be processed. Emptied after each run. */
  input: join(PUBLIC, 'to-optimize'),
  /** Responsive WebP variants are written here, grouped by slug subfolder. */
  output: join(PUBLIC, 'backgrounds'),
  /** Originals are moved here after successful conversion. */
  archive: join(PUBLIC, 'originals'),
  favicon: {
    src: join(PUBLIC, 'icon.png'),
    dest: join(PUBLIC, 'favicon.ico'),
  },
};

/** Widths (px) to generate for each image. */
const WIDTHS = [768, 1280, 1920];

/** WebP compression quality (0-100). */
const WEBP_QUALITY = 80;

/**
 * Maximum number of concurrent sharp encode operations.
 * Each sharp call is CPU-bound; keep this at logical-core count or below.
 */
const CONCURRENCY = 4;

const SUPPORTED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.tiff']);

/** Returns human-readable file size, or 'N/A' if the file doesn't exist. */
async function fileSize(filePath) {
  try {
    const { size } = await stat(filePath);
    return size >= 1024 * 1024
      ? `${(size / 1024 / 1024).toFixed(2)} MB`
      : `${(size / 1024).toFixed(1)} KB`;
  } catch {
    return 'N/A';
  }
}

/**
 * Derives a URL-safe slug from a filename.
 * "Coffee-Shop-bg.png" -> "coffee-shop"
 * "hero_banner.jpg"    -> "hero-banner"
 */
function deriveSlug(filename) {
  return basename(filename, extname(filename))
    .replace(/-bg$/i, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Runs an array of async task factories with a bounded concurrency pool.
 * Guarantees at most `limit` tasks execute simultaneously at any time.
 *
 * @template T
 * @param {Array<() => Promise<T>>} tasks
 * @param {number} limit
 * @returns {Promise<T[]>}
 */
async function withConcurrency(tasks, limit) {
  /** @type {Promise<T>[]} */
  const results = [];
  /** @type {Map<number, Promise<T>>} */
  const pool = new Map();
  let nextId = 0;

  for (const task of tasks) {
    const id = nextId++;
    const promise = task().finally(() => pool.delete(id));
    pool.set(id, promise);
    results.push(promise);

    if (pool.size >= limit) {
      await Promise.race(pool.values());
    }
  }

  return Promise.all(results);
}

/** Returns true if a file exists and is accessible. */
async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Encodes a single (image, width) variant as WebP and logs the result.
 *
 * @param {{ srcPath: string; slug: string; width: number }} params
 */
async function encodeVariant({ srcPath, slug, width }) {
  const outPath = join(PATHS.output, slug, `${slug}-${width}.webp`);
  await sharp(srcPath)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outPath);

  const size = await fileSize(outPath);
  console.log(`    ${slug}-${width}.webp  (${size})`);
}

/** Processes all images found in the input folder. */
async function optimizeImages() {
  await mkdir(PATHS.input, { recursive: true });
  await mkdir(PATHS.archive, { recursive: true });

  const entries = await readdir(PATHS.input, { withFileTypes: true });
  const images = entries.filter(
    (e) => e.isFile() && SUPPORTED_EXTENSIONS.has(extname(e.name).toLowerCase()),
  );

  if (images.length === 0) {
    console.log(`No images found in public/to-optimize/. Nothing to do.\n`);
    return;
  }

  console.log(`Found ${images.length} image(s) to process.\n`);

  /** @type {Array<() => Promise<void>>} */
  const tasks = [];

  for (const entry of images) {
    const srcPath = join(PATHS.input, entry.name);
    const slug = deriveSlug(entry.name);
    const srcSize = await fileSize(srcPath);

    console.log(`[${entry.name}]  ${srcSize}  ->  slug: "${slug}"`);
    await mkdir(join(PATHS.output, slug), { recursive: true });

    for (const width of WIDTHS) {
      tasks.push(() => encodeVariant({ srcPath, slug, width }));
    }
  }

  console.log();

  await withConcurrency(tasks, CONCURRENCY);

  console.log();

  for (const entry of images) {
    const src = join(PATHS.input, entry.name);
    const dest = join(PATHS.archive, entry.name);
    await rename(src, dest);
    console.log(`  archived: ${entry.name}`);
  }

  console.log();
}

/**
 * Generates a minimal valid ICO file (32×32) from icon.png.
 * sharp does not natively write .ico, so we hand-craft the binary container
 * (ICONDIR + ICONDIRENTRY headers) wrapping a PNG-encoded frame.
 */
async function optimizeFavicon() {
  if (!(await fileExists(PATHS.favicon.src))) {
    console.log('icon.png not found, skipping favicon generation.\n');
    return;
  }

  const before = await fileSize(PATHS.favicon.dest);
  console.log(`[favicon.ico]  before: ${before}`);

  const pngBuffer = await sharp(PATHS.favicon.src).resize(32, 32).png().toBuffer();

  // ICONDIR: reserved(2) + type=1(2) + count=1(2)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);

  // ICONDIRENTRY: width(1) + height(1) + colorCount(1) + reserved(1)
  //             + planes(2) + bitCount(2) + bytesInRes(4) + imageOffset(4)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(32, 0);
  entry.writeUInt8(32, 1);
  entry.writeUInt8(0, 2);
  entry.writeUInt8(0, 3);
  entry.writeUInt16LE(1, 4);
  entry.writeUInt16LE(32, 6);
  entry.writeUInt32LE(pngBuffer.length, 8);
  entry.writeUInt32LE(header.length + entry.length, 12);

  await writeFile(PATHS.favicon.dest, Buffer.concat([header, entry, pngBuffer]));

  const after = await fileSize(PATHS.favicon.dest);
  console.log(`               after:  ${after}\n`);
}

async function main() {
  const start = Date.now();
  console.log('\n=== Neural Architect Image Optimizer ===\n');

  await optimizeImages();
  await optimizeFavicon();

  const elapsed = ((Date.now() - start) / 1000).toFixed(2);
  console.log(`=== Done in ${elapsed}s ===\n`);
}

main().catch((err) => {
  console.error('\nError:', err.message);
  process.exit(1);
});
