import sharp from "sharp";
import { stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesDir = resolve(__dirname, "../public/images");

async function getSize(path) {
  const s = await stat(path);
  return s.size;
}

function fmt(bytes) {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(2) + " MB";
  return Math.round(bytes / 1024) + " KB";
}

async function optimizeBydToWebP() {
  const input = resolve(imagesDir, "byd-fleet-transparent (1).png");
  const output = resolve(imagesDir, "byd-fleet.webp");
  const beforeSize = await getSize(input);

  const meta = await sharp(input)
    .resize(1200, null, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 85, effort: 6, alphaQuality: 90 })
    .toFile(output);

  const afterSize = await getSize(output);
  console.log(
    `✓ BYD:   ${fmt(beforeSize)} → ${fmt(afterSize)}   (${meta.width}×${meta.height} webp)`
  );
}

async function optimizeLogoPng() {
  const input = resolve(imagesDir, "Taxi-shiar-logo.png");
  const output = resolve(imagesDir, "Taxi-shiar-logo-optimized.png");
  const beforeSize = await getSize(input);

  const meta = await sharp(input)
    .resize(null, 400, { fit: "inside", withoutEnlargement: true })
    .png({ quality: 90, compressionLevel: 9, palette: true })
    .toFile(output);

  const afterSize = await getSize(output);
  console.log(
    `✓ Logo:  ${fmt(beforeSize)} → ${fmt(afterSize)}   (${meta.width}×${meta.height} png-palette)`
  );
}

await optimizeBydToWebP();
await optimizeLogoPng();
console.log("Done!");
