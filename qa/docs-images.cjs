// README images: the gallery, the demo website on desktop and phones. node qa/docs-images.cjs (harness server on :8652)
const { chromium } = require("playwright"); const path = require("path"), fs = require("fs");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const out = path.join(__dirname, "../docs/images"); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const g = await b.newPage({ viewport: { width: 1360, height: 900 } });
  await g.goto("http://localhost:8652/gallery.html"); await g.waitForTimeout(1200);
  await g.setViewportSize({ width: 1360, height: 1250 }); await g.screenshot({ path: path.join(out, "gallery.png") });
  const s = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await s.goto("http://localhost:8652/site.html"); await s.waitForTimeout(1000);
  await s.screenshot({ path: path.join(out, "website.png") });
  const phones = [];
  const { SITES } = await import("../apexlang/_src/sites.mjs"); const { siteFile } = await import("./render.mjs");
  for (const key of ["restaurant", "clinic", "company", "event", "realestate", "saas"]) {
    const site = SITES.find(x => x.key === key), p = { hash: "", name: site.label };
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const pg = await ctx.newPage();
    await pg.goto("http://localhost:8652/" + siteFile(site)); await pg.waitForTimeout(1300);
    const f = path.join(__dirname, "out", "phone-" + key + ".png"); await pg.screenshot({ path: f }); phones.push([f, p.name]); await ctx.close();
  }
  fs.writeFileSync(path.join(__dirname, "out", "phones.html"), `<body style="margin:0;background:#f4f1ec;font:600 14px system-ui;color:#333"><div style="display:flex;gap:20px;padding:24px">` +
    phones.map(([f, n]) => `<div style="text-align:center"><img src="file://${f}" style="width:260px;border-radius:24px;box-shadow:0 0 0 6px #1f2329,0 20px 40px -20px rgba(0,0,0,.5);display:block;margin-bottom:12px">${n}</div>`).join("") + "</div>");
  const sp = await b.newPage({ viewport: { width: 6 * 280 + 28, height: 640 } }); await sp.goto("file://" + path.join(__dirname, "out", "phones.html")); await sp.waitForTimeout(300);
  await sp.screenshot({ path: path.join(out, "phones.png"), fullPage: true });
  fs.copyFileSync(path.join(__dirname, "out", "sweep-1440.png"), path.join(out, "looks.png"));
  await b.close(); console.log("docs images written");
})();
