import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "src/index.html");

const DILYARA_IMG = "/assets/dilyara-kalinina-telyasheva.jpg";
const NIKITA_IMG = "/assets/author.jpg";

function stripLeadingDash(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith("—")) {
    return trimmed.slice(1).replace(/^\s+/, "");
  }
  return trimmed;
}

function isDilyaraInterjection(inner) {
  return /Ага,\s*смотрела/.test(inner);
}

function makeTurn(speaker, paragraphs) {
  const name = speaker === "dilyara" ? "диляра" : "никита";
  const img = speaker === "dilyara" ? DILYARA_IMG : NIKITA_IMG;
  const bodyLines = paragraphs.map((raw) => {
    const content = stripLeadingDash(raw);
    if (speaker === "dilyara") {
      return `        <p><strong>${content}</strong></p>`;
    }
    return `        <p>${content}</p>`;
  });

  return [
    "    <div class=\"interview-turn\">",
    "      <figure class=\"interview-turn__speaker\">",
    "        <img",
    "          class=\"interview-turn__avatar\"",
    `          src="${img}"`,
    "          alt=\"\"",
    "          width=\"48\"",
    "          height=\"48\" />",
    `        <figcaption class="interview-turn__name">${name}</figcaption>`,
    "      </figure>",
    "      <div class=\"interview-turn__body\">",
    ...bodyLines,
    "      </div>",
    "    </div>",
  ].join("\n");
}

function extractParagraphInner(html) {
  const match = html.match(/<p>\s*([\s\S]*?)\s*<\/p>/);
  return match ? match[1] : "";
}

function transformInterviewBlock(block) {
  const tokenRe =
    /(<blockquote>\s*([\s\S]*?)\s*<\/blockquote>|<p>\s*([\s\S]*?)\s*<\/p>)/g;
  const tokens = [];
  let match;

  while ((match = tokenRe.exec(block)) !== null) {
    if (match[2] !== undefined) {
      tokens.push({ type: "blockquote", inner: match[2] });
    } else {
      tokens.push({ type: "p", inner: match[3] });
    }
  }

  const turns = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    if (token.type === "blockquote") {
      turns.push(makeTurn("dilyara", [token.inner]));
      i += 1;

      const answer = [];
      while (i < tokens.length && tokens[i].type === "p") {
        if (isDilyaraInterjection(tokens[i].inner)) {
          if (answer.length) {
            turns.push(makeTurn("nikita", answer));
            answer.length = 0;
          }
          turns.push(makeTurn("dilyara", [tokens[i].inner]));
          i += 1;
          continue;
        }
        answer.push(tokens[i].inner);
        i += 1;
      }
      if (answer.length) {
        turns.push(makeTurn("nikita", answer));
      }
      continue;
    }

    i += 1;
  }

  return turns.join("\n");
}

let html = readFileSync(indexPath, "utf8");

const interviewTitles = [
  "А кто делает интерьеры Дринкит: часть 3",
  "А кто делает интерьеры Дринкит: часть 2",
  "А кто делает интерьеры Дринкит: часть 1",
];

for (const title of interviewTitles) {
  const titleIdx = html.indexOf(`<h2>${title}</h2>`);
  if (titleIdx === -1) {
    throw new Error(`Interview section not found: ${title}`);
  }

  const galleryClose = html.indexOf("</ids-gallery>", titleIdx);
  const start =
    galleryClose === -1 || galleryClose > html.indexOf("<blockquote>", titleIdx)
      ? html.indexOf("<blockquote>", titleIdx)
      : galleryClose + "</ids-gallery>".length;

  const end = html.indexOf("  <div class=\"ids__space XL\"></div>", start);
  if (end === -1) {
    throw new Error(`End marker not found for: ${title}`);
  }

  const block = html.slice(start, end);
  if (!block.includes("<blockquote>")) {
    throw new Error(`No blockquote in interview block: ${title}`);
  }

  const transformed = transformInterviewBlock(block);
  const closingDiv = block.trimEnd().endsWith("</div>") ? "\n  </div>\n" : "\n";
  html =
    html.slice(0, start) + transformed + closingDiv + html.slice(end);
}

writeFileSync(indexPath, html);
console.log("Transformed interview replies in src/index.html");
