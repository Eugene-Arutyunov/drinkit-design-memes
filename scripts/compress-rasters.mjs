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
  "moscow",
  "rorshah",
];

const JPEG_QUALITY_FROM_PNG = 95;
const JPEG_RECOMPRESS_QUALITY = 92;
/** Как у library/graffity: не больше 1920 по длинной стороне */
const MAX_JPEG_EDGE = 1920;

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
  const meta = await sharp(absPath).metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  const needsResize = w > MAX_JPEG_EDGE || h > MAX_JPEG_EDGE;

  let pipeline = sharp(absPath);
  if (needsResize) {
    pipeline = pipeline.resize({
      width: w >= h ? MAX_JPEG_EDGE : undefined,
      height: h > w ? MAX_JPEG_EDGE : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await pipeline.jpeg(jpegRecompress).toFile(tmp);
  const after = fs.statSync(tmp).size;
  if (needsResize || after < before) {
    fs.renameSync(tmp, absPath);
    const note = needsResize ? `, ${w}×${h} → ≤${MAX_JPEG_EDGE}` : "";
    console.log(
      `JPEG− ${path.relative(srcAssets, absPath)} ${before} → ${after} (${Math.round((100 * after) / before)}%)${note}`,
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

  const jpegDirs = [
    "graffity",
    "table-reality",
    "moscow",
    "rorshah",
    "library",
    "interview-1",
    "1",
    "2",
    "3",
    "4",
    "5",
  ];
  for (const d of jpegDirs) {
    for (const abs of walkJpegs(d)) {
      await recompressJpegIfSmaller(abs);
    }
  }

  const pngPathRe =
    /(\/assets\/(?:table-process-1|table-process-2|table-mechanical|table-start|moscow|rorshah)\/[^"'>\s]+)\.png/g;

  for (const name of ["index.html", "index-test.html"]) {
    const indexPath = path.join(root, "src", name);
    if (!fs.existsSync(indexPath)) continue;
    let html = fs.readFileSync(indexPath, "utf8");
    html = html.replace(pngPathRe, "$1.jpg");
    fs.writeFileSync(indexPath, html);
    console.log(`Updated src/${name} (.png → .jpg)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
