// Gallery thumbnails: every look on the demo website (gallery/<id>.jpg) and every starter website in its own look
// (gallery/site-<key>.jpg), shot at 1280x800 and shrunk in a canvas to 640x400 JPEG.
// node qa/thumbs.cjs   (harness server on :8652, see qa/README.md)
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const { SITES } = await import("../apexlang/_src/sites.mjs");
  const { siteFile } = await import("./render.mjs");
  const shots = PRESETS.map(p => ({ id: p.id, url: "site.html" + p.hash })).concat(SITES.map(s => ({ id: "site-" + s.key, url: siteFile(s) })));
  const outDir = path.join(__dirname, "../apexlang/shared-components/static-files/gallery");
  fs.mkdirSync(outDir, { recursive: true });
  const b = await chromium.launch();
  const shrink = await b.newPage();
  for (const p of shots) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
    const pg = await ctx.newPage();
    await pg.goto("http://localhost:8652/" + p.url); await pg.waitForTimeout(1500);
    const png = await pg.screenshot();
    await ctx.close();
    const jpg = await shrink.evaluate(async b64 => {
      const img = new Image(); img.src = "data:image/png;base64," + b64; await img.decode();
      const c = document.createElement("canvas"); c.width = 640; c.height = 400;
      const g = c.getContext("2d"); g.imageSmoothingQuality = "high"; g.drawImage(img, 0, 0, 640, 400);
      return c.toDataURL("image/jpeg", 0.86).split(",")[1];
    }, png.toString("base64"));
    fs.writeFileSync(path.join(outDir, p.id + ".jpg"), Buffer.from(jpg, "base64"));
  }
  await b.close();
  console.log(shots.length, "thumbnails written");
})();
