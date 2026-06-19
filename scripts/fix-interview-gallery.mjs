import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const testPath = join(root, "src/index-test.html");
const indexPath = join(root, "src/index.html");

const gallery = `  <div class="ids__space XS"></div>
  <ids-gallery>
    <figure>
      <a href="/assets/interview-1/4.jpg"
        ><img src="/assets/interview-1/4.jpg" alt=""
      /></a>
      <figcaption>Никита Тугарin</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/2.jpg"
        ><img src="/assets/interview-1/2.jpg" alt=""
      /></a>
      <figcaption>Один из&nbsp;проектов бюро Правда, школа-интернат для детей из&nbsp;неполных семей</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/5.jpg"
        ><img src="/assets/interview-1/5.jpg" alt=""
      /></a>
      <figcaption>И&nbsp;ещё один: флагман adidas Originals на&nbsp;Кузнецком до&nbsp;ухода adidas</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/guadalajara-tower.jpg"
        ><img src="/assets/interview-1/guadalajara-tower.jpg" alt=""
      /></a>
      <figcaption>Гвадалахарская башня</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/1.jpg"
        ><img src="/assets/interview-1/1.jpg" alt=""
      /></a>
      <figcaption>Метро Лос-Анджелеса</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/la-metro-2.jpg"
        ><img src="/assets/interview-1/la-metro-2.jpg" alt=""
      /></a>
      <figcaption>Метро Лос-Анджелеса</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/lax-1.jpg"
        ><img src="/assets/interview-1/lax-1.jpg" alt=""
      /></a>
      <figcaption>Полицейский участок</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/lax-2.jpg"
        ><img src="/assets/interview-1/lax-2.jpg" alt=""
      /></a>
      <figcaption>Полицейский участок</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/lax-3.jpg"
        ><img src="/assets/interview-1/lax-3.jpg" alt=""
      /></a>
      <figcaption>Полицейский участок</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/bus-stop-01.jpg"
        ><img src="/assets/interview-1/bus-stop-01.jpg" alt=""
      /></a>
      <figcaption>Автобусные остановки</figcaption>
    </figure>
    <figure>
      <a href="/assets/interview-1/bus-stop-06.jpg"
        ><img src="/assets/interview-1/bus-stop-06.jpg" alt=""
      /></a>
      <figcaption>Автобусные остановки</figcaption>
    </figure>
  </ids-gallery>

  <div class="ids__space XL"></div>
`;

let testHtml = readFileSync(testPath, "utf8");
const start = testHtml.indexOf("  <div class=\"ids__space XS\"></div>\n  <ids-gallery>");
const end = testHtml.indexOf("  <div class=\"ids__text-width\">\n    <hgroup>\n      <p class=\"post-date\">12 июня 2026</p>");
if (start === -1 || end === -1) throw new Error("Gallery markers not found");
testHtml = testHtml.slice(0, start) + gallery + testHtml.slice(end);
writeFileSync(testPath, testHtml);

// Fix duplicate XL in index.html
let indexHtml = readFileSync(indexPath, "utf8");
indexHtml = indexHtml.replace(
  /<div class="ids__wrapper">\n\n    <div class="ids__space XL"><\/div>\n  <div class="ids__text-width">/,
  '<div class="ids__wrapper">\n\n  <div class="ids__text-width">',
);
writeFileSync(indexPath, indexHtml);

console.log("Gallery fixed on index-test.html, index.html cleaned up");
