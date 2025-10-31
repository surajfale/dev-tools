import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd());
const iconsDir = path.join(root, 'public', 'icons');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function svgToPng(svgPath, outPath, size) {
  await sharp(svgPath, { density: 384 })
    .resize(size, size, { fit: 'cover' })
    .png({ compressionLevel: 9 })
    .toFile(outPath);
}

async function main() {
  await ensureDir(iconsDir);

  const svg192 = path.join(iconsDir, 'icon-192.svg');
  const svg512 = path.join(iconsDir, 'icon-512.svg');
  const svgMono = path.join(iconsDir, 'icon-monochrome.svg');

  const out192 = path.join(iconsDir, 'icon-192.png');
  const out512 = path.join(iconsDir, 'icon-512.png');
  const outMono = path.join(iconsDir, 'icon-monochrome.png');

  await svgToPng(svg192, out192, 192);
  await svgToPng(svg512, out512, 512);
  await svgToPng(svgMono, outMono, 512);

  // Simple log
  console.log('Generated PNG icons:');
  console.log('-', path.relative(root, out192));
  console.log('-', path.relative(root, out512));
  console.log('-', path.relative(root, outMono));
}

main().catch((err) => {
  console.error('Icon generation failed:', err);
  process.exit(1);
});


