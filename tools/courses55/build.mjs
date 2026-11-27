// Builds the static "55 Courses" pages from the data files in ./data.
//
//   cd tools/courses55 && npm install && node build.mjs
//
// Output goes to /courses55 at the root of the site. Mathematics in the data is
// written in LaTeX between $...$ (inline) or $$...$$ (display) and is rendered
// to HTML here with KaTeX, so the pages need only the KaTeX stylesheet and fonts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import katex from "katex";

import math55 from "./data/math55.mjs";
import ant55 from "./data/ant55.mjs";
import prob55 from "./data/prob55.mjs";
import algnt55 from "./data/algnt55.mjs";
import modular55 from "./data/modular55.mjs";
import ag55 from "./data/ag55.mjs";
import hub from "./data/hub.mjs";

const COURSES = [math55, ant55, prob55, algnt55, modular55, ag55];
const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../../courses55");
const UPDATED = hub.updated;

// ---------- inline markup: $math$, $$display$$, [text](url), **bold**, *italic* ----------
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function md(src) {
  if (!src) return "";
  const stash = [];
  const keep = (html) => `\u0000${stash.push(html) - 1}\u0000`;
  let s = src.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) =>
    keep(`<span class="display-math">${katex.renderToString(tex, { displayMode: true, throwOnError: true })}</span>`));
  s = s.replace(/\$([^$]+?)\$/g, (_, tex) => keep(katex.renderToString(tex, { throwOnError: true })));
  s = esc(s);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, text, url) => {
    const ext = /^https?:/.test(url);
    return `<a href="${url.replace(/&amp;/g, "&").replace(/&/g, "&amp;")}"${ext ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;
  });
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => stash[+i]);
}
const plain = (s) => s.replace(/\$([^$]+)\$/g, "$1").replace(/[*\\]/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

// ---------- shared page chrome ----------
function head({ title, description, canonical }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${esc(title)} | Abdullah M. Al-jazy</title>
    <meta name="description" content="${esc(description)}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="https://abdullahmaljazy.github.io/courses55/${canonical}">
    <link rel="icon" href="../favicon.svg" type="image/svg+xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap">
    <link rel="stylesheet" href="katex/katex.min.css">
    <link rel="stylesheet" href="courses55.css">
</head>
<body>
`;
}

function topbar(activeId) {
  const items = COURSES.map((c) =>
    `<li><a href="${c.id}.html"${c.id === activeId ? ' aria-current="page"' : ""}>${esc(c.code)}</a></li>`).join("");
  return `<header class="topbar">
    <div class="wrap">
        <a class="brand" href="../index.html">Abdullah M. Al-jazy</a>
        <nav aria-label="55 Courses">
            <ul class="menu">
                <li><a href="index.html"${activeId === "hub" ? ' aria-current="page"' : ""}>All courses</a></li>
                ${items}
            </ul>
        </nav>
    </div>
</header>
`;
}

function footer() {
  return `<footer class="foot">
    <div class="wrap">
        <p>${md(hub.disclaimer)}</p>
        <p class="fine">Links checked on ${esc(UPDATED)}. <a href="https://github.com/AbdullaHMAljazy/AbdullaHMAljazy.github.io/tree/main/tools/courses55">Source of these pages</a> · <a href="../index.html">Home</a></p>
    </div>
</footer>
</body>
</html>
`;
}

// ---------- building blocks ----------
function table(cols, rows, { cls = "", rowClass } = {}) {
  const th = cols.map((c) => `<th scope="col">${md(c)}</th>`).join("");
  const body = rows.map((r, i) => {
    const rc = rowClass ? rowClass(r, i) : "";
    return `<tr${rc ? ` class="${rc}"` : ""}>${r.map((cell, j) => `<td data-label="${esc(plain(cols[j]))}">${md(cell)}</td>`).join("")}</tr>`;
  }).join("\n");
  return `<div class="table-wrap"><table class="${cls}"><thead><tr>${th}</tr></thead><tbody>
${body}
</tbody></table></div>`;
}

const list = (items, ordered = false) =>
  `<${ordered ? "ol" : "ul"} class="items">${items.map((x) => `<li>${md(x)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;

function section(id, kicker, title, inner, alt = false) {
  return `<section class="section${alt ? " section-alt" : ""}" id="${id}">
    <div class="wrap">
        <div class="section-head"><p class="kicker">${kicker}</p><h2>${md(title)}</h2></div>
        ${inner}
    </div>
</section>
`;
}

// ---------- a course page ----------
function coursePage(c) {
  const sections = [];
  const nav = [];
  const add = (id, label, html) => { nav.push([id, label]); sections.push(html); };

  let overview = c.intro.map((p) => `<p class="prose">${md(p)}</p>`).join("");
  if (c.map) overview += table(c.map.head, c.map.rows, { cls: "map" });
  add("overview", "Overview", section("overview", "Overview", "What the course is", overview));

  if (c.rules) {
    add("method", "How to work", section("method", "Method", "How to work",
      list(c.rules, true) + (c.rulesNote ? `<p class="note">${md(c.rulesNote)}</p>` : ""), true));
  }

  if (c.week0) {
    add("week0", "Week 0", section("week0", "Before you start", c.week0.title,
      `<p class="prose">${md(c.week0.intro)}</p>` + list(c.week0.items, true), true));
  }

  const libRows = c.library.map(([name, url, ...rest]) => [`[${name}](${url})`, ...rest]);
  add("library", "Library", section("library", "Free library", "The library",
    table(c.libraryCols, libRows, { cls: "lib" }) + (c.libraryNote ? `<p class="note">${md(c.libraryNote)}</p>` : "")));

  c.terms.forEach((t, k) => {
    const rows = t.weeks.map((w, i) => [String(i + 1), ...w]);
    const examRow = (r) => (/\*\*(Midterm|Final)/.test(r[1]) ? "exam" : "");
    add(`term-${t.code}`, `Term ${t.code}`, section(`term-${t.code}`, `${c.code} · ${t.code}`, t.title,
      `<p class="prose">${md(t.intro)}</p>` + table(["Week", ...t.cols], rows, { cls: "weeks", rowClass: examRow }), k % 2 === 0));
  });

  const a = c.assessment;
  let assess = `<p class="prose">${md(a.intro)}</p>` + list(a.items);
  if (a.project) assess += `<h3>${md(a.project.title)}</h3><p class="prose">${md(a.project.intro)}</p>` + list(a.project.items, true);
  if (a.note) assess += `<p class="note">${md(a.note)}</p>`;
  add("assessment", "Problems & exams", section("assessment", "Assessment", "Problem sets, exams and project", assess));

  if (c.path) {
    add("path", "Compressed path", section("path", "Shortcut", c.path.title,
      `<p class="prose">${md(c.path.intro)}</p>` + list(c.path.items, true), true));
  }

  const srcs = [...c.library.map(([n, u]) => [n, u]), ...c.sources];
  const seen = new Set();
  const uniq = srcs.filter(([, u]) => (seen.has(u) ? false : seen.add(u)));
  add("sources", "Sources", section("sources", "References", "Sources",
    `<ul class="sources">${uniq.map(([n, u]) => `<li><a href="${esc(u)}" target="_blank" rel="noopener">${md(n)}</a></li>`).join("")}</ul>`));

  const facts = c.meta.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${md(v)}</dd></div>`).join("");
  const toc = nav.map(([id, label]) => `<li><a href="#${id}">${esc(label)}</a></li>`).join("");
  const desc = plain(c.card);
  return head({ title: plain(c.title), description: desc, canonical: `${c.id}.html` }) + topbar(c.id) + `
<main id="top">
<section class="hero">
    <div class="wrap">
        <p class="eyebrow"><a href="index.html">55 Courses</a></p>
        <h1>${md(c.title)}</h1>
        <p class="subtitle">${md(c.subtitle)}</p>
        <p class="tagline">${md(c.lead)}</p>
        <dl class="facts">${facts}</dl>
        <nav class="onpage" aria-label="On this page"><ul>${toc}</ul></nav>
    </div>
</section>
${sections.join("")}
</main>
` + footer();
}

// ---------- the hub page ----------
function hubPage() {
  const cards = COURSES.map((c) => `<a class="course-card" href="${c.id}.html">
            <p class="code">${esc(c.code)}</p>
            <h3>${md(c.title.replace(/^[^:]+:\s*/, ""))}</h3>
            <p>${md(c.card)}</p>
            <dl>${c.meta.slice(0, 3).map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${md(v)}</dd></div>`).join("")}</dl>
            <span class="go">Open the course &rarr;</span>
        </a>`).join("\n");
  const s = [];
  s.push(section("courses", "The courses", "Six courses", `<div class="course-grid">${cards}</div>`));
  s.push(section("format", "The format", "What every 55 course has in common", list(hub.format, true), true));
  s.push(section("order", "Order", "Suggested order and time",
    `<p class="prose">${md(hub.orderIntro)}</p>` + table(hub.order.head, hub.order.rows, { cls: "map" }) +
    `<p class="note">${md(hub.orderNote)}</p>`));
  return head({ title: "55 Courses", description: plain(hub.lead), canonical: "" }) + topbar("hub") + `
<main id="top">
<section class="hero">
    <div class="wrap">
        <p class="eyebrow"><a href="../index.html#resources">Resources</a></p>
        <h1>55 Courses</h1>
        <p class="subtitle">${md(hub.subtitle)}</p>
        <p class="tagline">${md(hub.lead)}</p>
    </div>
</section>
${s.join("")}
</main>
` + footer();
}

// ---------- write everything ----------
fs.mkdirSync(path.join(OUT, "katex/fonts"), { recursive: true });
const kdist = path.join(here, "node_modules/katex/dist");
fs.copyFileSync(path.join(kdist, "katex.min.css"), path.join(OUT, "katex/katex.min.css"));
for (const f of fs.readdirSync(path.join(kdist, "fonts"))) {
  if (f.endsWith(".woff2")) fs.copyFileSync(path.join(kdist, "fonts", f), path.join(OUT, "katex/fonts", f));
}
fs.copyFileSync(path.join(here, "courses55.css"), path.join(OUT, "courses55.css"));
fs.writeFileSync(path.join(OUT, "index.html"), hubPage());
for (const c of COURSES) fs.writeFileSync(path.join(OUT, `${c.id}.html`), coursePage(c));
console.log(`Wrote ${COURSES.length + 1} pages to ${OUT}`);
