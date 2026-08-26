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
  "src/monotonous-interiors-are-detrimental-to-qsr.html",
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
    if (t.startsWith("+en")) continue;
    if (t.startsWith("+ru")) {
      const rest = t.slice(3).trimStart();
      out += interpolate(rest) + renderInlineNodes(node.children);
      continue;
    }
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

function ruContent(node) {
  const t = stripped(node);
  if (t.startsWith("+ru")) {
    const rest = t.slice(3).trimStart();
    return interpolate(rest) + renderInlineNodes(node.children);
  }
  const ruChild = node.children.find((c) => stripped(c).startsWith("+ru"));
  if (ruChild) {
    const rest = stripped(ruChild).slice(3).trimStart();
    return interpolate(rest) + renderInlineNodes(ruChild.children);
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
      acc.lead = ruContent(node);
      continue;
    }
    if (t.startsWith("h2")) {
      acc.blocks.push(headingHtml(3, ruContent(node) || node.children.map(ruContent).join("")));
      walk(node.children.filter((c) => !stripped(c).startsWith("+ru") && !stripped(c).startsWith("+en")), acc);
      continue;
    }
    if (t.startsWith("h3")) {
      const text = ruContent(node) || interpolate(t.replace(/^h3\s*/, ""));
      acc.blocks.push(headingHtml(4, text));
      continue;
    }
    if (t === "ul") {
      const items = node.children
        .filter((c) => stripped(c).startsWith("li"))
        .map((li) =>
          fixInlineSpacing(ruContent(li) || renderInlineNodes(li.children)),
        );
      acc.blocks.push(listHtml(items));
      continue;
    }
    if (t.startsWith("p")) {
      const html = ruContent(node);
      if (!html.trim()) continue;
      if (html.includes("t.me/nikitatugarin")) continue;
      acc.blocks.push(paragraphHtml(fixInlineSpacing(html)));
      continue;
    }
    if (t.startsWith("figure")) {
      const img = node.children.find((c) => stripped(c).startsWith("img"));
      const cap = node.children.find((c) => stripped(c).startsWith("figcaption"));
      const srcMatch = img && stripped(img).match(/src=["']([^"']+)["']/);
      const caption = cap ? ruContent(cap) : "";
      if (srcMatch) acc.blocks.push(figureHtml(srcMatch[1], caption));
      continue;
    }
    if (t === ".game") {
      const figure = node.children.find((c) => stripped(c).startsWith("figure"));
      if (figure) walk([figure], acc);
      continue;
    }
    walk(node.children, acc);
  }
}

const tree = parseTree(readFileSync(pugPath, "utf8"));
const contentRoot = findContentRoot(tree);
const acc = { lead: "", blocks: [] };
walk(contentRoot.children, acc);

const page = `---
permalink: /monotonous-interiors-are-detrimental-to-qsr/
pageTitle: Как однообразие интерьеров убивает QSR или почему «не как у всех» — это не блажь, а стратегия выживания
pageDesc: Почему «не как у всех» — это не блажь, а стратегия выживания.
---
{% extends 'layout.html' %} {% block content %}

<div class="ids__space XL"></div>
<div class="ids__wrapper">

  <div class="ids__text-width">
    <hgroup>
      <p class="post-date">14 октября 2025</p>
      <h2>
        Как однообразие интерьеров убивает QSR или почему «не как у всех» —
        это не блажь, а стратегия выживания
      </h2>
    </hgroup>
    <div class="ids__text-width">
      <div class="post-meta">
        <span class="post-meta__prefix">написал</span>
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
            >никита тугарин</a
          ></span
        >
        <span class="post-meta__sep">·</span>
        <span class="post-meta__tags">
          qsr, интерьеры, типизация, франшиза
        </span>
      </div>
    </div>
  </div>
  <div class="ids__space M"></div>

${acc.blocks.join("\n\n")}

  <div class="ids__space M"></div>
  <div class="ids__text-width">
    <p>
      Ответы к коллажам. «Дотипизировались»: сверху слева направо — KFC, Burger King; снизу — McDonald’s, Chick-fil-A. «Дотипизировались-2»: сверху — Cava, Starbucks Coffee; снизу — Shake Shack, Joe &amp; The Juice.
    </p>
  </div>

  <div class="ids__space XL"></div>
  <a
    class="post-subscribe-promo"
    href="https://t.me/nikitatugarin"
    target="_blank"
    rel="noopener noreferrer"
    >подписаться на канал</a
  >

  <div class="ids__space XL"></div>
</div>
{% endblock %}
`;

mkdirSync(imgDestDir, { recursive: true });
for (const file of ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"]) {
  copyFileSync(join(imgSrcDir, file), join(imgDestDir, file));
}

writeFileSync(outPath, page);
console.log(`Wrote ${outPath}`);
console.log(`Blocks: ${acc.blocks.length}`);
console.log(`Lead: ${acc.lead}`);;