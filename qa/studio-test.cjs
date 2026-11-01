// Gallery and Designer logic against the harness website: node qa/studio-mock.mjs && node qa/studio-test.cjs
const { chromium } = require("playwright");
(async () => {
  const b = await chromium.launch(); const errs = []; const fails = [];
  const ok = (cond, msg) => { if (!cond) { fails.push(msg); } };
  const p = await b.newPage({ viewport: { width: 1440, height: 1000 } });
  p.on("pageerror", e => errs.push(e.message));
  // Gallery: cards, filter, links
  await p.goto("http://localhost:8652/gallery.html"); await p.waitForTimeout(600);
  const cards = await p.$$eval(".wss-Card", c => c.length);
  ok(cards === 16, "gallery cards " + cards);
  await p.click('.wss-Filter button[data-f="dark"]');
  const shown = await p.$$eval(".wss-Card", c => c.filter(x => !x.hidden).length);
  ok(shown > 0 && shown < cards, "dark filter shows " + shown);
  const link = await p.$eval(".wss-Card .t-Button--hot", a => a.getAttribute("href"));
  ok(/f\?p=100:DESIGNER:1#look=/.test(link), "customize link " + link);
  // Designer from a Gallery look: Bold (split hero, bento services, wall testimonials)
  const bold = await p.$$eval(".wss-Card", (cs) => cs.find(c => c.querySelector("h3").textContent === "Bold").querySelector(".t-Button--hot").getAttribute("href"));
  await p.goto("http://localhost:8652/designer.html" + bold.replace(/^.*?#/, "#")); await p.waitForTimeout(2500);
  const v = await p.evaluate(() => ({ design: $v("P2_DESIGN"), accent: $v("P2_ACCENT"), hero: $v("P2_HERO"), services: $v("P2_SERVICES"), quotes: $v("P2_QUOTES"), code: document.getElementById("wsd-code").textContent }));
  ok(v.design === "ws-Design--bold" && v.accent === "ws-Accent--amber", "designer page options from the gallery look: " + v.design + " " + v.accent);
  ok(v.hero === "ws-Hero--split" && v.services === "ws-Features--bento" && v.quotes === "ws-Quotes--wall", "section layouts from the gallery look");
  ok(/#DEFAULT#/.test(v.code) && /ws-Design--bold/.test(v.code) && /template: @ws-hero/.test(v.code) && /ws-Hero--split/.test(v.code), "APEXlang snippet:\n" + v.code);
  const f = p.frame({ url: /WEBSITE/ });
  const inFrame = await f.evaluate(() => ({ body: document.body.className, hero: document.querySelector("#hero .ws-R").className, svc: document.querySelector("#services .ws-R").className }));
  ok(/ws-Design--bold/.test(inFrame.body) && /ws-Accent--amber/.test(inFrame.body), "preview page classes: " + inFrame.body);
  ok(/ws-Hero--split/.test(inFrame.hero) && !/ws-Hero--slider/.test(inFrame.hero), "preview hero: " + inFrame.hero);
  ok(/ws-Features--bento/.test(inFrame.svc), "preview services: " + inFrame.svc);
  // a page option changes the preview without a reload
  await f.evaluate(() => { window.__marker = 1; });
  await p.selectOption("#P2_ACCENT", "ws-Accent--ocean"); await p.waitForTimeout(500);
  const live = await f.evaluate(() => ({ cls: document.body.className, kept: window.__marker === 1 }));
  ok(/ws-Accent--ocean/.test(live.cls) && !/ws-Accent--amber/.test(live.cls) && live.kept, "live accent change without reload: " + live.cls);
  // a section layout reloads the preview with the new layout
  await p.selectOption("#P2_TEAM", "ws-Team--round"); await p.waitForTimeout(2500);
  const f2 = p.frame({ url: /WEBSITE/ });
  const team = await f2.evaluate(() => document.querySelector("#team .ws-R").className);
  ok(/ws-Team--round/.test(team), "team layout in preview: " + team);
  // switching a default option off drops #DEFAULT# from the snippet
  await p.selectOption("#P2_REVEAL", "N"); await p.waitForTimeout(300);
  const code2 = await p.$eval("#wsd-code", e => e.textContent);
  ok(!/#DEFAULT#\n        ws-Design/.test(code2) && /ws-Fx--sticky/.test(code2) && !/ws-Fx--reveal/.test(code2), "snippet without Reveal on Scroll:\n" + code2);
  await p.screenshot({ path: __dirname + "/out/designer.png" });
  await b.close();
  console.log(fails.length ? "FAILED:\n" + fails.join("\n") : "designer and gallery: all checks passed", errs.length ? "\nerrors: " + errs.join(" | ") : "");
})();
