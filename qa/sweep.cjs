// QA sweep: every design (and dark / header / typeface variants) on desktop, tablet and phone.
// Checks: no horizontal scroll, no console errors, no #COLUMN# placeholders left, the menu is built. Writes contact sheets to qa/out.
// node qa/sweep.cjs   (harness server on :8652, see qa/README.md)
const { chromium } = require("playwright"); const fs = require("fs"), path = require("path");
const SCREENS = [[1440, 900], [820, 1180], [390, 844]];
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const b = await chromium.launch(); const dir = path.join(__dirname, "out", "sweep"); fs.mkdirSync(dir, { recursive: true });
  const problems = [];
  for (const [w, h] of SCREENS) {
    const files = [];
    for (const p of PRESETS) {
      const ctx = await b.newContext({ viewport: { width: w, height: h } }); const pg = await ctx.newPage(); const errs = [];
      pg.on("pageerror", e => errs.push(e.message)); pg.on("console", m => m.type() === "error" && !/fonts\.g/.test(m.text()) && errs.push(m.text()));
      await pg.goto(`http://localhost:8652/site.html${p.hash}`); await pg.waitForTimeout(900);
      for (let y = 0; y < 14000; y += 700) { await pg.mouse.wheel(0, 700); await pg.waitForTimeout(40); }
      await pg.waitForTimeout(500);
      const m = await pg.evaluate(() => ({ hs: document.documentElement.scrollWidth > innerWidth + 1, ph: (document.querySelector(".ws-Main").innerHTML.match(/#[A-Z][A-Z_0-9]+#/g) || []).length,
        nav: document.querySelectorAll("#ws-nav a").length, hidden: document.querySelectorAll(".ws-Main .ws-rv").length }));
      if (m.hs || m.ph || !m.nav || errs.length) problems.push(`${w}x${h} ${p.id}: ${m.hs ? "H-SCROLL " : ""}${m.ph ? "PLACEHOLDERS " : ""}${m.nav ? "" : "NO-MENU "}${errs.join(" | ")}`);
      await pg.evaluate(() => scrollTo(0, 0)); await pg.waitForTimeout(300);
      const f = path.join(dir, `${w}x${h}-${p.id}.png`); await pg.screenshot({ path: f }); files.push([f, p.name]); await ctx.close();
    }
    const cols = w < 900 ? 6 : 4, tw = w < 900 ? 220 : 360;
    fs.writeFileSync(path.join(dir, "s.html"), `<body style="margin:0;background:#111;color:#ddd;font:12px system-ui"><div style="display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:8px;padding:8px">` +
      files.map(([f, n]) => `<div><img src="file://${f}" style="width:${tw}px;display:block">${n}</div>`).join("") + "</div>");
    const sp = await b.newPage({ viewport: { width: cols * (tw + 8) + 8, height: 300 } }); await sp.goto("file://" + path.join(dir, "s.html")); await sp.waitForTimeout(300);
    await sp.screenshot({ path: path.join(__dirname, "out", `sweep-${w}x${h}.png`), fullPage: true }); await sp.close();
  }
  await b.close();
  console.log(problems.length ? problems.join("\n") : "no problems", "\nlooks:", PRESETS.length, "screens:", SCREENS.length);
})();
