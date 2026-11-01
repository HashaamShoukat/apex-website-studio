// One page, one screenshot: node qa/shot.cjs <url path+hash> <out.png> [width] [height] [fullPage]
const { chromium } = require("playwright");
(async () => {
  const [, , url, out, w = 1440, h = 900, full] = process.argv;
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } });
  const errs = []; p.on("pageerror", e => errs.push("PAGE " + e.message)); p.on("console", m => m.type() === "error" && errs.push("CONSOLE " + m.text()));
  p.on("requestfailed", r => { if (!/fonts\.g/.test(r.url())) errs.push("FAILED " + r.url()); });
  await p.goto("http://localhost:8652/" + url); await p.waitForTimeout(1200);
  if (full) { const H = await p.evaluate(() => document.body.scrollHeight); for (let y = 0; y < H; y += 450) { await p.mouse.wheel(0, 450); await p.waitForTimeout(70); } await p.waitForTimeout(1200); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(400); }
  const info = await p.evaluate(() => ({ hs: document.documentElement.scrollWidth > innerWidth + 1, h: document.body.scrollHeight, nav: [...document.querySelectorAll("#ws-nav a")].map(a => a.textContent).join(","), ph: (document.body.innerHTML.match(/#[A-Z][A-Z_0-9]+#/g) || []).slice(0, 5) }));
  await p.screenshot({ path: out, fullPage: !!full });
  console.log(JSON.stringify(info), errs.slice(0, 10));
  await b.close();
})();
