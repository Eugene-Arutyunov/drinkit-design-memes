import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(root, "src/index.html");
const testPath = join(root, "src/index-test.html");

let html = readFileSync(indexPath, "utf8");

html = html.replace(
  /<figure class="interview-turn__speaker">\s*<img([^>]*class="interview-turn__avatar"[^>]*)>\s*<figcaption class="interview-turn__name">([^<]*)<\/figcaption>\s*<\/figure>/g,
  `<div class="interview-turn__speaker"><img$1><span class="interview-turn__name">$2</span></div>`,
);

writeFileSync(indexPath, html);

const testHeader = `---
permalink: /index-test.html
---
{% extends 'layout.html' %} {% block content %}

`;
const testBody = html.replace(/^[\s\S]*?{% block content %}\s*/, "");
writeFileSync(testPath, testHeader + testBody);

console.log("Fixed interview speaker markup and index-test.html");
