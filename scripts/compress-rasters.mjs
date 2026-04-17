import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcAssets = path.join(root, "src/assets");

const PNG_TO_JPEG_DIRS = [
  "table-process-1",
  "table-process-2",
  "table-mechanical",
  "table-start",
];

const JPEG_QUALITY_FROM_PNG = 95;
const JPEG_RECOMPRESS_QUALITY = 92;

const jpegFromPng = {
  quality: JPEG_QUALITY_FROM_PNG,
  mozjpeg: true,
  progressive: true,
};

const jpegRecompress = {
  quality: JPEG_RECOMPRESS_QUALITY,
  mozjpeg: true,
  progressive: true,
};

async function convertPngDir(relDir) {
  const dir = path.join(srcAssets, relDir);
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".png"));
  for (const f of files) {
    const input = path.join(dir, f);
    const out = input.replace(/\.png$/i, ".jpg");
    await sharp(input).jpeg(jpegFromPng).toFile(`${out}.tmp`);
    fs.renameSync(`${out}.tmp`, out);
    fs.unlinkSync(input);
    const sz = fs.statSync(out).size;
    console.log(`PNG→JPEG ${relDir}/${f} → ${path.basename(out)} (${Math.round(sz / 1024)} KB)`);
  }
}

async function recompressJpegIfSmaller(absPath) {
  const before = fs.statSync(absPath).size;
  const tmp = `${absPath}.opt.tmp`;
  await sharp(absPath).jpeg(jpegRecompress).toFile(tmp);
  const after = fs.statSync(tmp).size;
  if (after < before) {
    fs.renameSync(tmp, absPath);
    console.log(
      `JPEG− ${path.relative(srcAssets, absPath)} ${before} → ${after} (${Math.round((100 * after) / before)}%)`,
    );
  } else {
    fs.unlinkSync(tmp);
  }
}

function walkJpegs(relDir) {
  const dir = path.join(srcAssets, relDir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.jpe?g$/i.test(f))
    .map((f) => path.join(dir, f));
}

async function main() {
  for (const d of PNG_TO_JPEG_DIRS) {
    await convertPngDir(d);
  }

  const jpegDirs = ["graffity", "table-reality", "1", "2", "3", "4", "5"];
  for (const d of jpegDirs) {
    for (const abs of walkJpegs(d)) {
      await recompressJpegIfSmaller(abs);
    }
  }

  const indexPath = path.join(root, "src/index.html");
  let html = fs.readFileSync(indexPath, "utf8");
  const re =
    /(\/assets\/(?:table-process-1|table-process-2|table-mechanical|table-start)\/[^"'>\s]+)\.png/g;
  html = html.replace(re, "$1.jpg");
  fs.writeFileSync(indexPath, html);
  console.log("Updated src/index.html (.png → .jpg for table-* paths)");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
