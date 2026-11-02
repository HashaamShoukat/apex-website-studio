// QA sweep: every starter website x every Gallery look x desktop, tablet and phone, then every website right to left.
// Checks: header, main and footer no wider than the screen, no horizontal scroll, no console errors (photos that are not
// downloaded yet are allowed: they fall back to placeholders), no #COLUMN# left, the menu is built and its drop-down /
// phone menu opens and closes, the hero slider moves, every picture element is resolved (photo or placeholder).
// Contact sheets of the looks (on the demo website) and of the websites go to qa/out.
// node qa/sweep.cjs [site keys...]   (harness server on :8652, see qa/README.md)
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const SCREENS = [[1440, 900], [820, 1180], [390, 844]];
const PHOTO_404 = /\/static\/website-studio\/img\/|Failed to load resource: the server responded with a status of 404/;
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const { SITES } = await import("../apexlang/_src/sites.mjs");
  const { siteFile } = await import("./render.mjs");
  const only = process.argv.slice(2), sites = SITES.filter(s => !only.length || only.includes(s.key));
  const b = await chromium.launch(); const dir = path.join(__dirname, "out", "sweep"); fs.mkdirSync(dir, { recursive: true });
  const problems = [], shots = {}; let runs = 0;

  async function check({ site, look, w, h, rtl, shot }) {
    const ctx = await b.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); const errs = [];
    pg.on("pageerror", e => errs.push(e.message));
    pg.on("console", m => { if (m.type() === "error" && !/fonts\.g/.test(m.text()) && !PHOTO_404.test(m.text())) { errs.push(m.text()); } });
    pg.on("requestfailed", r => { if (!/fonts\.g|\/img\/|openstreetmap|youtube|vimeo/.test(r.url())) { errs.push("failed " + r.url()); } });
    await pg.goto(`http://localhost:8652/${siteFile(site)}${rtl ? "?dir=rtl" : ""}${look ? look.hash : ""}`); await pg.waitForTimeout(700);
    for (let y = 0; y < 16000; y += 900) { await pg.mouse.wheel(0, 900); await pg.waitForTimeout(30); }
    await pg.waitForTimeout(350);
    const m = await pg.evaluate(() => {
      const W = innerWidth, wide = el => { if (!el) { return false; } const r = el.getBoundingClientRect(); return r.width > W + 1 || r.right > W + 1 || r.left < -1; };
      const parts = [".ws-Header", ".ws-Main", ".ws-Footer"].filter(s => wide(document.querySelector(s)));
      // anything inside main sticking out of the screen (the marquee track and slides parked off screen are meant to)
      const out = [...document.querySelectorAll(".ws-Main *, .ws-Footer *")].filter(el => {
        if (el.closest(".ws-Logos--marquee, .ws-Slides, .ws-Quotes--carousel, .ws-Photos--strip, .u-vh, .ws-Honeypot")) { return false; }
        // inside a box that clips its content and itself fits the screen (the hero's slow zoom, image frames)
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const cs = getComputedStyle(a); if (/hidden|clip/.test(cs.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= W + 2 && ar.left >= -2) { return false; } }
        }
        const r = el.getBoundingClientRect(); return r.width && (r.right > W + 2 || r.left < -2) && getComputedStyle(el).position !== "fixed";
      }).slice(0, 3).map(el => el.tagName + "." + String(el.className).split(" ").slice(0, 2).join("."));
      const html = [".ws-Header", ".ws-Main", ".ws-Footer"].map(s => (document.querySelector(s) || {}).innerHTML || "").join("");
      const media = [...document.querySelectorAll("[data-img], [data-file]")];
      // on wide screens the logo and the menu entries must not overlap (a crowded centered header)
      const brand = [...document.querySelectorAll(".ws-Header-in .ws-Brand")].find(e => e.getClientRects().length), br = brand && brand.getBoundingClientRect();
      const overlap = W >= 901 && br ? [...document.querySelectorAll("#ws-nav .ws-Menu > li")].filter(li => { const r = li.getBoundingClientRect(); return r.width && r.left < br.right - 1 && r.right > br.left + 1 && r.top < br.bottom && r.bottom > br.top; }).length : 0;
      return { hs: document.documentElement.scrollWidth > W + 1, parts, out, overlap, ph: (html.match(/#[A-Z][A-Z_0-9]+#/g) || []).slice(0, 3),
        nav: document.querySelectorAll("#ws-nav .ws-Menu > li").length, unresolved: media.filter(e => !e.classList.contains("has-img") && !e.classList.contains("ws-Ph") && !e.hasAttribute("data-initials") && e.getClientRects().length).length,
        slides: document.querySelectorAll(".ws-Hero .ws-Slide").length };
    });
    const bad = [];
    if (m.hs) { bad.push("H-SCROLL"); } if (m.parts.length) { bad.push("WIDE " + m.parts.join(",")); } if (m.out.length) { bad.push("OUT " + m.out.join(",")); }
    if (m.overlap) { bad.push("LOGO-UNDER-MENU"); }
    if (m.ph.length) { bad.push("PLACEHOLDERS " + m.ph.join(",")); } if (!m.nav) { bad.push("NO-MENU"); } if (m.unresolved) { bad.push("IMAGES-UNRESOLVED " + m.unresolved); }
    await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(250);
    // the menu: a drop-down on wide screens, the phone menu with an accordion on small ones; Escape closes
    const menuOk = await pg.evaluate(async (wideScreen) => {
      const wait = t => new Promise(r => setTimeout(r, t)), vis = el => !!el && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden";
      const esc = el => el.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      const parent = document.querySelector("#ws-nav .ws-Menu-item--parent:not(.ws-Menu-more)"), burger = document.querySelector(".ws-Burger");
      if (wideScreen) {
        if (!parent) { return "no parent entry"; }
        const t = parent.querySelector(".ws-Menu-toggle"), sub = parent.querySelector(".ws-Menu-sub");
        if (!vis(t) && !parent.closest(".ws-Menu-more")) { /* toggle may be visually small but present */ }
        t.click();
        for (let i = 0; i < 10 && !(parent.classList.contains("is-open") && vis(sub)); i++) { await wait(100); }
        if (!parent.classList.contains("is-open") || !vis(sub) || t.getAttribute("aria-expanded") !== "true") { return "drop-down did not open (" + parent.className + ", expanded " + t.getAttribute("aria-expanded") + ", visible " + vis(sub) + ")"; }
        esc(t); await wait(250);
        if (parent.classList.contains("is-open")) { return "Escape did not close the drop-down"; }
        return "";
      }
      if (!burger || !vis(burger)) { return "no burger on a small screen"; }
      burger.click(); await wait(450);
      const nav = document.getElementById("ws-nav");
      if (!vis(nav) || burger.getAttribute("aria-expanded") !== "true") { return "phone menu did not open"; }
      if (parent) { const t = parent.querySelector(".ws-Menu-toggle"); t.click(); await wait(300); if (!parent.classList.contains("is-open") || !vis(parent.querySelector(".ws-Menu-sub a"))) { return "phone accordion did not open"; } }
      esc(document.activeElement && nav.contains(document.activeElement) ? document.activeElement : nav); await wait(100);
      if (burger.getAttribute("aria-expanded") === "true") { burger.click(); await wait(400); }
      if (burger.getAttribute("aria-expanded") === "true") { return "phone menu did not close"; }
      return "";
    }, w >= 901);
    if (menuOk) { bad.push("MENU " + menuOk); }
    if (m.slides > 1) {
      const moved = await pg.evaluate(async () => {
        const next = document.querySelector(".ws-Hero .ws-Arrow--next");
        const cur = () => [...document.querySelectorAll(".ws-Hero .ws-Slide")].findIndex(s => s.classList.contains("is-active"));
        if (!next) { return "no next button"; }
        const a = cur(); next.click(); await new Promise(r => setTimeout(r, 400)); return cur() !== a ? "" : "slide did not change";
      });
      if (moved) { bad.push("SLIDER " + moved); }
    }
    if (errs.length) { bad.push("ERRORS " + [...new Set(errs)].slice(0, 3).join(" | ")); }
    if (bad.length) { problems.push(`${site.key}${rtl ? " RTL" : ""} ${look ? look.id : "own look"} ${w}x${h}: ${bad.join("; ")}`); }
    if (shot) { await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(250); const f = path.join(dir, shot); await pg.screenshot({ path: f }); (shots[w] = shots[w] || []).push([f, shot.replace(/\.png$/, "")]); }
    runs++;
    await ctx.close();
  }
  // a small pool keeps the sweep quick
  const jobs = [];
  for (const [w, h] of SCREENS) {
    for (const site of sites) {
      jobs.push({ site, w, h, shot: `${w}-site-${site.key}.png` });
      for (const look of PRESETS) { jobs.push({ site, look, w, h, shot: site.key === "halcyon" ? `${w}-look-${look.id}.png` : null }); }
      if (!site.rtl) { jobs.push({ site, w, h, rtl: true, shot: site.key === "halcyon" ? `${w}-rtl-halcyon.png` : null }); }
    }
  }
  const pool = 6; let next = 0;
  await Promise.all(Array.from({ length: pool }, async () => { while (next < jobs.length) { const j = jobs[next++]; try { await check(j); } catch (e) { problems.push(`${j.site.key} ${j.look ? j.look.id : ""} ${j.w}: CRASH ${e.message.split("\n")[0]}`); } } }));
  for (const [w, list] of Object.entries(shots)) {
    list.sort((a, c) => a[1].localeCompare(c[1]));
    const cols = +w < 900 ? 7 : 5, tw = +w < 900 ? 200 : 300;
    fs.writeFileSync(path.join(dir, "s.html"), `<body style="margin:0;background:#111;color:#ddd;font:12px system-ui"><div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:8px;padding:8px">` +
      list.map(([f, n]) => `<div><img src="file://${f}" style="width:${tw}px;display:block">${n}</div>`).join("") + "</div>");
    const sp = await b.newPage({ viewport: { width: cols * (tw + 8) + 8, height: 300 } }); await sp.goto("file://" + path.join(dir, "s.html")); await sp.waitForTimeout(500);
    await sp.screenshot({ path: path.join(__dirname, "out", `sweep-${w}.png`), fullPage: true }); await sp.close();
  }
  await b.close();
  console.log(problems.length ? problems.join("\n") : "no problems", `\nruns: ${runs} (websites: ${sites.length}, looks: ${PRESETS.length}, screens: ${SCREENS.length}, plus right to left)`);
})();
