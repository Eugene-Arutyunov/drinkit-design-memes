import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pugPath =
  "/Users/dariacoch/Sites/dbdt/src/pages/interiors-in-qsr/monotonous-interiors-are-detrimental-to-qsr.pug";
const imgSrcDir =
  "/Users/dariacoch/Sites/dbdt/static/images/interiors-in-qsr/monotonous-interiors-are-detrimental-to-qsr-and-fast-casual-establishments";
const imgDestDir = join(
  root,
  "src/assets/monotonous-interiors-are-detrimental-to-qsr",
);
const outPath = join(
  root,
  "src/monotonous-interiors-are-detrimental-to-qsr-en.html",
);

const IMG_PREFIX =
  "/assets/monotonous-interiors-are-detrimental-to-qsr";

function indentOf(line) {
  const match = line.match(/^ */);
  return match ? match[0].length : 0;
}

function parseTree(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  const rootNode = { indent: -1, raw: "", children: [] };
  const stack = [rootNode];
  for (const raw of lines) {
    if (raw.trim() === "") continue;
    const indent = indentOf(raw);
    const node = { indent, raw, children: [] };
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push(node);
  }
  return rootNode;
}

function stripped(node) {
  return node.raw.trim();
}

function isComment(node) {
  const t = stripped(node);
  return t.startsWith("//");
}

function attrsToHtml(attrStr) {
  const attrs = [];
  const re = /([a-zA-Z_:][\w:-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s)]+)))?/g;
  let m;
  while ((m = re.exec(attrStr))) {
    const name = m[1];
    const value = m[2] ?? m[3] ?? m[4] ?? "";
    if (name === "src" && value.includes("/images/interiors-in-qsr/")) {
      const file = value.split("/").pop();
      attrs.push(`src="${IMG_PREFIX}/${file}"`);
      continue;
    }
    if (name === "href" && value.startsWith("/images/")) continue;
    attrs.push(value === "" ? name : `${name}="${escapeAttr(value)}"`);
  }
  return attrs.join(" ");
}

function escapeAttr(s) {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function parseTag(line) {
  const t = line.trim();
  if (t.startsWith("|")) {
    return { kind: "text", text: t.slice(1) };
  }
  if (t.startsWith("+ru")) {
    return { kind: "ru", rest: t.slice(3).trimStart() };
  }
  if (t.startsWith("+en")) {
    return { kind: "en", rest: t.slice(3).trimStart() };
  }
  const tagMatch = t.match(
    /^([.#a-zA-Z][\w.-]*)(?:\(([^)]*)\))?(?:\.([a-zA-Z][\w.-]*))*(?:\s+(.*))?$/,
  );
  if (!tagMatch) {
    return { kind: "raw", text: t };
  }
  let name = tagMatch[1];
  const attrStr = tagMatch[2] || "";
  const rest = tagMatch[4] || "";
  const classes = [];
  const ids = [];
  name = name.replace(/[.#][\w-]+/g, (part) => {
    if (part.startsWith(".")) classes.push(part.slice(1));
    else ids.push(part.slice(1));
    return "";
  });
  if (!name) name = "div";
  return {
    kind: "tag",
    name,
    attrStr,
    classes,
    ids,
    rest,
  };
}

function interpolate(text) {
  if (!text) return "";
  return text.replace(/#\[([^\]]+)\]/g, (_, inner) => {
    const parsed = parseTag(inner);
    if (parsed.kind === "tag") {
      return renderTagFromParsed(parsed, []);
    }
    return inner;
  });
}

function linkAttrs(attrStr) {
  let html = attrsToHtml(attrStr);
  if (!/\btarget=/.test(html)) {
    html += (html ? " " : "") + 'target="_blank" rel="noopener noreferrer"';
  } else if (!/\brel=/.test(html)) {
    html += ' rel="noopener noreferrer"';
  }
  html = html.replace(
    /href="https:\/\/dzen\.ru\/away\?to=https%3A%2F%2Fdocs\.google\.com[^"]+"/,
    'href="https://docs.google.com/document/d/1pclBei5Cj4vcP377JgqgVK56MOM9bkaiKt5Z_fcXrXc/edit?usp=sharing"',
  );
  return html;
}

function renderTagFromParsed(parsed, children) {
  const name = parsed.name === "b" ? "strong" : parsed.name === "i" ? "em" : parsed.name;
  let inner = interpolate(parsed.rest) + renderInlineNodes(children);
  if (name === "br") return "<br />";
  if (name === "img") {
    const attrs = attrsToHtml(parsed.attrStr);
    return `<img ${attrs} />`;
  }
  if (name === "a") {
    return `<a ${linkAttrs(parsed.attrStr)}>${inner}</a>`;
  }
  return `<${name}>${inner}</${name}>`;
}

function renderInlineNodes(nodes) {
  let out = "";
  for (const node of nodes) {
    if (isComment(node)) continue;
    const t = stripped(node);
    if (t.startsWith("+ru")) continue;
    if (t.startsWith("+en")) {
      const rest = t.slice(3).trimStart();
      out += interpolate(rest) + renderInlineNodes(node.children);
      continue;
    }
    if (t.startsWith(".dropzones") || t.startsWith("- ")) continue;
    const parsed = parseTag(t);
    if (parsed.kind === "text") {
      out += interpolate(parsed.text);
      continue;
    }
    if (parsed.kind === "tag") {
      out += renderTagFromParsed(parsed, node.children);
      continue;
    }
    out += interpolate(t);
  }
  return out;
}

function enContent(node) {
  const t = stripped(node);
  if (t.startsWith("+en")) {
    const rest = t.slice(3).trimStart();
    return interpolate(rest) + renderInlineNodes(node.children);
  }
  const enChild = node.children.find((c) => stripped(c).startsWith("+en"));
  if (enChild) {
    const rest = stripped(enChild).slice(3).trimStart();
    return interpolate(rest) + renderInlineNodes(enChild.children);
  }
  return "";
}

function findNode(node, pred) {
  if (pred(node)) return node;
  for (const child of node.children) {
    const found = findNode(child, pred);
    if (found) return found;
  }
  return null;
}

function findContentRoot(tree) {
  const block = tree.children.find((c) => stripped(c) === "block content");
  if (!block) throw new Error("block content not found");
  const wrapper = findNode(block, (c) =>
    stripped(c).includes("guide-body-wrapper"),
  );
  if (!wrapper) throw new Error("guide-body-wrapper not found");
  return wrapper;
}

function figureHtml(src, caption) {
  const file = src.split("/").pop();
  const href = `${IMG_PREFIX}/${file}`;
  return `  <div class="ids__space XS"></div>
  <figure>
    <img src="${href}" alt="" />${
      caption
        ? `
    <figcaption>${caption}</figcaption>`
        : ""
    }
  </figure>`;
}

function gameHtml(file, caption, buttonsNode) {
  const buttons = (buttonsNode?.children || [])
    .filter((c) => stripped(c).startsWith("button"))
    .map((c) => {
      const t = stripped(c);
      const correct = (t.match(/data-correct="(\d+)"/) || [])[1] || "0";
      const label = t.replace(/^button[^(]*\([^)]*\)\s*/, "").trim();
      return `      <button class="draggable" type="button" data-correct="${correct}">
        ${label.replace(/&/g, "&amp;")}
      </button>`;
    })
    .join("\n");
  return `  <div class="ids__space XS"></div>
  <div class="game">
    <figure class="quiz">
      <img
        src="${IMG_PREFIX}/${file}"
        alt="" />
      <div class="dropzones">
        <div class="dropzone" data-index="0"></div>
        <div class="dropzone" data-index="1"></div>
        <div class="dropzone" data-index="2"></div>
        <div class="dropzone" data-index="3"></div>
      </div>
      <figcaption>${caption}</figcaption>
    </figure>
    <div class="buttons">
${buttons}
      <div class="mixin--no-yes--arrow---curve-R"></div>
    </div>
  </div>`;
}

function headingHtml(level, text) {
  const space = level === 3 ? "L" : "M";
  return `  <div class="ids__space ${space}"></div>
  <div class="ids__text-width">
    <h${level}>${text}</h${level}>
  </div>`;
}

function fixInlineSpacing(html) {
  return html
    .replace(/([^\s>])(<(?:strong|em|a)\b)/g, "$1 $2")
    .replace(/(<\/(?:strong|em|a)>)([^\s<.,;:])/g, "$1 $2")
    .replace(/(<\/(?:strong|em|a)>)\s+([.,;:])/g, "$1$2")
    .replace(/ {2,}/g, " ");
}

function paragraphHtml(inner) {
  return `  <div class="ids__text-width">
    <p>
      ${inner.trim()}
    </p>
  </div>`;
}

function listHtml(items) {
  const lis = items
    .map(
      (item) => `      <li>
        ${item.trim()}
      </li>`,
    )
    .join("\n");
  return `  <div class="ids__text-width">
    <ul>
${lis}
    </ul>
  </div>`;
}

function walk(nodes, acc) {
  for (const node of nodes) {
    if (isComment(node)) continue;
    const t = stripped(node);
    if (t.startsWith("script") || t.startsWith("-script") || t.startsWith("- ")) {
      continue;
    }
    if (t.startsWith("aside")) continue;
    if (t.startsWith("h1")) {
      continue;
    }
    if (t.startsWith("p.guide-description")) {
      acc.lead = enContent(node);
      continue;
    }
    if (t.startsWith("h2")) {
      acc.blocks.push(headingHtml(3, enContent(node) || node.children.map(enContent).join("")));
      walk(node.children.filter((c) => !stripped(c).startsWith("+ru") && !stripped(c).startsWith("+en")), acc);
      continue;
    }
    if (t.startsWith("h3")) {
      const text = enContent(node) || interpolate(t.replace(/^h3\s*/, ""));
      acc.blocks.push(headingHtml(4, text));
      continue;
    }
    if (t === "ul") {
      const items = node.children
        .filter((c) => stripped(c).startsWith("li"))
        .map((li) =>
          fixInlineSpacing(enContent(li) || renderInlineNodes(li.children)),
        );
      acc.blocks.push(listHtml(items));
      continue;
    }
    if (t.startsWith("p")) {
      const html = enContent(node);
      if (!html.trim()) continue;
      if (html.includes("t.me/nikitatugarin")) continue;
      acc.blocks.push(paragraphHtml(fixInlineSpacing(html)));
      continue;
    }
    if (t.startsWith("figure")) {
      const img = node.children.find((c) => stripped(c).startsWith("img"));
      const cap = node.children.find((c) => stripped(c).startsWith("figcaption"));
      const srcMatch = img && stripped(img).match(/src=["']([^"']+)["']/);
      const caption = cap ? enContent(cap) : "";
      if (srcMatch) acc.blocks.push(figureHtml(srcMatch[1], caption));
      continue;
    }
    if (t === ".game") {
      const figure = node.children.find((c) => stripped(c).startsWith("figure"));
      const cap = figure?.children.find((c) => stripped(c).startsWith("figcaption"));
      const img = figure?.children.find((c) => stripped(c).startsWith("img"));
      const srcMatch = img && stripped(img).match(/src=["']([^"']+)["']/);
      const file = srcMatch ? srcMatch[1].split("/").pop() : "";
      const caption = cap ? enContent(cap) : "";
      const buttons = node.children.find((c) => stripped(c).startsWith(".buttons"));
      acc.blocks.push(gameHtml(file, caption, buttons));
      continue;
    }
    walk(node.children, acc);
  }
}

function mergeLeadInLists(blocks) {
  const out = [];
  for (let i = 0; i < blocks.length; i++) {
    const cur = blocks[i];
    const next = blocks[i + 1];
    if (
      next &&
      /<p>/.test(cur) &&
      /<ul>/.test(next) &&
      !/<ol/.test(next) &&
      !/<div class="game">/.test(cur)
    ) {
      const open = cur.replace(/\s*<\/div>\s*$/, "");
      const ulMatch = next.match(/<ul>[\s\S]*<\/ul>/);
      if (ulMatch) {
        out.push(`${open}\n    ${ulMatch[0]}\n  </div>`);
        i++;
        continue;
      }
    }
    out.push(cur);
  }
  return out;
}

function translateSources(html) {
  const months = [
    ["января", "January"],
    ["февраля", "February"],
    ["марта", "March"],
    ["апреля", "April"],
    ["мая", "May"],
    ["июня", "June"],
    ["июля", "July"],
    ["августа", "August"],
    ["сентября", "September"],
    ["октября", "October"],
    ["ноября", "November"],
    ["декабря", "December"],
    ["август", "August"],
    ["октябрь", "October"],
  ];
  let out = html;
  for (const [ru, en] of months) out = out.replaceAll(ru, en);
  return out
    .replaceAll("б.\u00a0г.", "n.d.")
    .replaceAll("б. г.", "n.d.")
    .replaceAll("[Фотографии]", "[Photographs]")
    .replaceAll("[Фотография]", "[Photograph]")
    .replaceAll("[Обсуждение на онлайн-форуме]", "[Online forum discussion]")
    .replaceAll("[Пост на онлайн-форуме]", "[Online forum post]")
    .replaceAll("Дата обращения:", "Retrieved")
    .replaceAll("\u00a0г.", "")
    .replaceAll(" г.", "")
    .replaceAll("[Фотография интерьера «Старбакс»]", "[Photograph of a Starbucks interior]")
    .replaceAll(
      "[Фотография интерьера Joe &amp; The Juice interior в Martin Place, Сидней]",
      "[Photograph of a Joe &amp; The Juice interior in Martin Place, Sydney]",
    )
    .replaceAll(
      "[Фотография готового к открытию интерьера Shake Shack]",
      "[Photograph of Shake Shack interior ready to open]",
    )
    .replaceAll(
      "[Фотография интерьера Cava Grill в Topanga Plaza, Лос-Анджелес]",
      "[Photograph of a Cava Grill interior in Topanga Plaza, Los Angeles]",
    )
    .replaceAll(
      "[Фотография павильона Shake Shack в Madison Square Park, 2004]",
      "[Photograph of the Shake Shack kiosk in Madison Square Park, 2004]",
    );
}

const tree = parseTree(readFileSync(pugPath, "utf8"));
const contentRoot = findContentRoot(tree);
const acc = { lead: "", blocks: [] };
walk(contentRoot.children, acc);

const h1Node = findNode(contentRoot, (c) => stripped(c).startsWith("h1"));
const titleMain = (h1Node && enContent(h1Node)) || "Monotonous interiors are detrimental to QSR";
const titleFull = `${titleMain} or ${acc.lead.replace(/\.$/, "").replace(/^W/, "w")}`;

const ruPage = readFileSync(join(root, "src/monotonous-interiors-are-detrimental-to-qsr.html"), "utf8");
const sourcesMatch = ruPage.match(/<ol class="article-sources">[\s\S]*?<\/ol>/);
const sources = sourcesMatch ? translateSources(sourcesMatch[0]) : "";

const page = `---
permalink: /monotonous-interiors-are-detrimental-to-qsr/en/
htmlLang: en
pageTitle: ${titleFull}
pageDesc: ${acc.lead}
---
{% extends 'layout.html' %} {% block extra_scripts %}
<script src="/assets/quiz-game.js"></script>
{% endblock %} {% block content %}

<div class="ids__space XL"></div>
<div class="ids__wrapper article-thin-links">

  <div class="ids__text-width">
    <hgroup class="post-title-wide">
      <p class="post-date">14 October 2025</p>
      <h2>
        ${titleFull}
      </h2>
    </hgroup>
    <div class="ids__text-width">
      <div class="post-meta">
        <span class="post-meta__prefix">written by</span>
        <img
          class="post-meta__avatar"
          src="/assets/author.jpg"
          alt=""
          width="20"
          height="20" />
        <span class="post-meta__author"
          ><a
            href="https://t.me/nikitatugarin"
            target="_blank"
            rel="noopener noreferrer"
            >Nikita Tugarin</a
          ></span
        >
        <span class="post-meta__sep">·</span>
        <span class="post-meta__tags">
          qsr, interiors, standardization, franchise
        </span>
      </div>
    </div>
  </div>
  <div class="ids__space M"></div>

${mergeLeadInLists(acc.blocks).join("\n\n")}

  <div class="ids__space L"></div>
  <div class="ids__text-width">
    <h3>Sources</h3>
  </div>

  <div class="ids__text-width">
    ${sources}
  </div>

  <div class="ids__space XL"></div>
  <a
    class="post-subscribe-promo"
    href="https://t.me/nikitatugarin"
    target="_blank"
    rel="noopener noreferrer"
    >subscribe to the channel</a
  >

  <div class="ids__space XL"></div>
</div>
{% endblock %}
`;

writeFileSync(outPath, page);
console.log(`Wrote ${outPath}`);
console.log(`Blocks: ${acc.blocks.length}`);
console.log(`Title: ${titleFull}`);