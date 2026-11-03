/**
 * Renders every raster icon from the SVG sources. Run: `pnpm generate:icons`
 *
 * Sources (hand-edited, committed):
 *   public/favicon.svg               simplified mark for 16–32px browser tabs
 *   public/icons/icon.svg            "any" app icon (full square, bracket corners)
 *   public/icons/icon-maskable.svg   maskable icon (content inside the 80% safe zone)
 *   public/icons/icon-monochrome.svg Android themed icon (alpha only)
 *
 * Outputs (generated, committed so deploys need no build step for them):
 *   public/favicon.ico (16, 32, 48)  public/apple-touch-icon.png (180)
 *   public/icons/icon-{192,512}.png  public/icons/icon-maskable-{192,512}.png
 *   public/icons/icon-monochrome.png
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const pub = path.join(root, 'public');
const icons = path.join(pub, 'icons');

const src = {
  favicon: path.join(pub, 'favicon.svg'),
  any: path.join(icons, 'icon.svg'),
  maskable: path.join(icons, 'icon-maskable.svg'),
  mono: path.join(icons, 'icon-monochrome.svg'),
};

/**
 * Render an SVG to a square PNG buffer. The SVG is rasterised at 2x the target
 * size (density is relative to the SVG's own width, 72 dpi = 1:1) and then
 * downsampled, which keeps thin rings and edges crisp at every size.
 */
async function render(svgPath, size, { flatten = false } = {}) {
  const { width } = await sharp(svgPath).metadata();
  const density = Math.max(1, (72 * size * 2) / width);
  let img = sharp(svgPath, { density }).resize(size, size, { fit: 'cover', kernel: 'lanczos3' });
  if (flatten) img = img.flatten({ background: '#0A0E12' }); // iOS ignores alpha; never let it guess
  return img.png({ compressionLevel: 9 }).toBuffer();
}

/**
 * Build a .ico containing PNG-encoded images (supported by every current browser
 * and by Windows Vista+). Layout: ICONDIR (6 bytes), one ICONDIRENTRY (16 bytes)
 * per image, then the PNG payloads back to back.
 */
export function buildIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(pngs.length, 4);

  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height
    e.writeUInt8(0, 2); // palette colours
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function write(file, data) {
  await fs.writeFile(file, data);
  console.log(`- ${path.relative(root, file)} (${data.length.toLocaleString()} B)`);
}

async function main() {
  await fs.mkdir(icons, { recursive: true });
  console.log('Generated icons:');

  await write(path.join(icons, 'icon-192.png'), await render(src.any, 192));
  await write(path.join(icons, 'icon-512.png'), await render(src.any, 512));
  await write(path.join(icons, 'icon-maskable-192.png'), await render(src.maskable, 192));
  await write(path.join(icons, 'icon-maskable-512.png'), await render(src.maskable, 512));
  await write(path.join(icons, 'icon-monochrome.png'), await render(src.mono, 512));
  // iOS rounds the corners itself, so use the bracket-free maskable art.
  await write(path.join(pub, 'apple-touch-icon.png'), await render(src.maskable, 180, { flatten: true }));

  const sizes = [16, 32, 48];
  const pngs = await Promise.all(sizes.map(async (size) => ({ size, data: await render(src.favicon, size) })));
  await write(path.join(pub, 'favicon.ico'), buildIco(pngs));
}

// Only run when executed directly (keeps buildIco importable for tests).
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('Icon generation failed:', err);
    process.exit(1);
  });
}
