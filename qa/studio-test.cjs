// Gallery and Designer logic against the harness websites: node qa/studio-mock.mjs && node qa/studio-test.cjs
const { chromium } = require("playwright");
(async () => {
  const { PRESETS } = await import("../apexlang/_src/presets.mjs");
  const { SITES } = await import("../apexlang/_src/sites.mjs");
  const b = await chromium.launch(); const errs = []; const fails = [];
  const ok = (cond, msg) => { if (!cond) { fails.push(msg); } };
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", e => errs.push(e.message));
  // Gallery: starter websites, looks, filter, links
  await p.goto("http://localhost:8652/gallery.html"); await p.waitForTimeout(600);
  const sites = await p.$$eval("#wss-sites .wss-Card", c => c.length), cards = await p.$$eval("#wss-gallery .wss-Card", c => c.length);
  ok(sites === SITES.length, "starter website cards " + sites);
  ok(cards === PRESETS.length && cards >= 24, "look cards " + cards);
  await p.click('.wss-Filter button[data-f="dark"]');
  const shown = await p.$$eval("#wss-gallery .wss-Card", c => c.filter(x => !x.hidden).length), sitesShown = await p.$$eval("#wss-sites .wss-Card", c => c.filter(x => !x.hidden).length);
  ok(shown > 0 && shown < cards, "dark filter shows " + shown);
  ok(sitesShown === sites, "the filter leaves the starter websites alone");
  const link = await p.$eval("#wss-gallery .wss-Card .t-Button--hot", a => a.getAttribute("href"));
  ok(/f\?p=100:DESIGNER:1#look=/.test(link), "customize link " + link);
  const siteLink = await p.$eval("#wss-sites .wss-Card .t-Button--hot", a => a.getAttribute("href"));
  ok(siteLink === "f?p=100:WEBSITE:1", "open website link " + siteLink);
  // Designer from a Gallery look: Bold (split hero, bento services, wall testimonials)
  const bold = await p.$$eval("#wss-gallery .wss-Card", (cs) => cs.find(c => c.querySelector("h3").textContent === "Bold").querySelector(".t-Button--hot").getAttribute("href"));
  await p.goto("http://localhost:8652/designer.html" + bold.replace(/^.*?#/, "#")); await p.waitForTimeout(2500);
  const v = await p.evaluate(() => ({ design: $v("P2_DESIGN"), accent: $v("P2_ACCENT"), hero: $v("P2_HERO_LAYOUT"), services: $v("P2_FEATURES_LAYOUT"), quotes: $v("P2_TESTIMONIALS_LAYOUT"), code: document.getElementById("wsd-code").textContent, sql: document.getElementById("wsd-sql").textContent }));
  ok(v.design === "ws-Design--bold" && v.accent === "ws-Accent--amber", "designer page options from the gallery look: " + v.design + " " + v.accent);
  ok(v.hero === "ws-Hero--split" && v.services === "ws-Features--bento" && v.quotes === "ws-Quotes--wall", "section options from the gallery look: " + [v.hero, v.services, v.quotes]);
  ok(/#DEFAULT#/.test(v.code) && /ws-Design--bold/.test(v.code) && /template: @ws-hero/.test(v.code) && /ws-Hero--split/.test(v.code) && /ws-Hero--zoom/.test(v.code), "APEXlang snippet:\n" + v.code);
  ok(/image_file/.test(v.sql) && /from dual/.test(v.sql), "section SQL panel: " + v.sql.slice(0, 80));
  let f = p.frame({ url: /WEBSITE/ });
  const inFrame = await f.evaluate(() => ({ body: document.body.className, hero: document.querySelector("#hero .ws-R").className, svc: document.querySelector("#services .ws-R").className }));
  ok(/ws-Design--bold/.test(inFrame.body) && /ws-Accent--amber/.test(inFrame.body), "preview page classes: " + inFrame.body);
  ok(/ws-Hero--split/.test(inFrame.hero) && !/ws-Hero--slider/.test(inFrame.hero) && /ws-Hero--zoom/.test(inFrame.hero), "preview hero: " + inFrame.hero);
  ok(/ws-Features--bento/.test(inFrame.svc), "preview services: " + inFrame.svc);
  // a page option changes the preview without a reload
  await f.evaluate(() => { window.__marker = 1; });
  await p.selectOption("#P2_ACCENT", "ws-Accent--ocean"); await p.waitForTimeout(500);
  const live = await f.evaluate(() => ({ cls: document.body.className, kept: window.__marker === 1 }));
  ok(/ws-Accent--ocean/.test(live.cls) && !/ws-Accent--amber/.test(live.cls) && live.kept, "live accent change without reload: " + live.cls);
  // two options of one template combine: hero height and overlay next to the layout
  await p.selectOption("#P2_HERO_HEIGHT", "ws-Hero--medium"); await p.selectOption("#P2_HERO_ZOOM", "-ws-Hero--zoom"); await p.waitForTimeout(2500);
  f = p.frame({ url: /WEBSITE/ });
  const hero2 = await f.evaluate(() => document.querySelector("#hero .ws-R").className);
  ok(/ws-Hero--split/.test(hero2) && /ws-Hero--medium/.test(hero2) && !/ws-Hero--zoom/.test(hero2), "hero layout + height, zoom off: " + hero2);
  // switching a default option off drops #DEFAULT# from the snippet
  await p.selectOption("#P2_REVEAL", "N"); await p.waitForTimeout(300);
  const code2 = await p.$eval("#wsd-code", e => e.textContent);
  ok(!/#DEFAULT#\n        ws-Design/.test(code2) && /ws-Fx--sticky/.test(code2) && !/ws-Fx--reveal/.test(code2), "snippet without Reveal on Scroll:\n" + code2);
  // another website: its own look, a menu option on its list region
  await p.selectOption("#P2_SITE", "RESTAURANT"); await p.waitForTimeout(2500);
  f = p.frame({ url: /RESTAURANT/ });
  ok(!!f, "preview switched to the restaurant");
  if (f) {
    const r = await f.evaluate(() => ({ body: document.body.className, nav: document.querySelectorAll("#ws-nav .ws-Menu > li").length }));
    ok(/ws-Design--organic/.test(r.body) && r.nav >= 6, "restaurant look and menu: " + r.body + " " + r.nav);
    ok(await p.evaluate(() => $v("P2_DESIGN")) === "ws-Design--organic", "page options follow the website");
    await p.selectOption("#P2_MENU_ALIGN", "ws-Menu--center"); await p.waitForTimeout(2500);
    f = p.frame({ url: /RESTAURANT/ });
    const m = await f.evaluate(() => ({ list: document.querySelector("#ws-nav .ws-Menu").className, body: document.body.className }));
    ok(/ws-Menu--center/.test(m.list) && /ws-Menu--cta/.test(m.list) && /ws-MenuOpt--center/.test(m.body), "menu alignment in preview: " + m.list);
    const sql = await p.$eval("#wsd-sql", e => e.textContent);
    ok(/food-hero-1/.test(sql), "restaurant SQL panel: " + sql.slice(0, 120));
  }
  await p.screenshot({ path: __dirname + "/out/designer.png" });
  await b.close();
  if (fails.length || errs.length) { process.exitCode = 1; }
  console.log(fails.length ? "FAILED:\n" + fails.join("\n") : "designer and gallery: all checks passed", errs.length ? "\nerrors: " + errs.join(" | ") : "");
})();
