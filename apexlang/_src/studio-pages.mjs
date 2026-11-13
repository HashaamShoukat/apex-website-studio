// Writes the Gallery (1), Designer (2) and How to Use (3) pages: node _src/studio-pages.mjs
import fs from "node:fs";
import { PRESETS, PAGE_DEFAULTS } from "./presets.mjs";
import { DESIGNS, FONTS, ACCENTS, ALWAYS_DARK, REPORTS, PAGE, MENU } from "./options.mjs";
import { SITES } from "./sites.mjs";
import { MULTI } from "./multisites.mjs";
// the Designer can preview the one-page websites and the home page of each multi-page website
const DESIGNER_SITES = [...SITES, ...MULTI.map(m => ({ ...m.pages[0], label: m.label + " - multi-page" }))];
import { sql } from "./demo.mjs";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const pageHead = (no, name, alias, title) => `page ${no} (
    name: ${name}
    alias: ${alias}
    title: ${title}
    appearance {
        pageTemplate: @/standard
        templateOptions: #DEFAULT#
    }
    navigation {
        cursorFocus: doNotFocusCursor
    }`;
const pageSec = `    security {
        authentication: public
        pageAccessProtection: argumentsMustHaveChecksum
        formAutoComplete: false
    }`;
const crumb = name => `    region breadcrumb (
        name: ${name}
        type: breadcrumb
        source {
            breadcrumb: @breadcrumb
        }
        layout {
            sequence: 10
            slot: breadcrumbBar
        }
        appearance {
            template: @/title-bar
            templateOptions: [
                #DEFAULT#
                t-BreadcrumbRegion--useBreadcrumbTitle
            ]
        }
        componentAppearance {
            breadcrumbTemplate: @/breadcrumb
            templateOptions: #DEFAULT#
        }
    )`;
const js = (fn, onload, fileUrls) => `    javaScript {${fileUrls ? `
        fileUrls: ${fileUrls}` : ""}${fn ? `
        functionAndGlobalVariableDeclaration:
            \`\`\`javascript-browser
${ind(fn, 12)}
            \`\`\`` : ""}
        executeWhenPageLoads:
            \`\`\`javascript-browser
${ind(onload, 12)}
            \`\`\`
    }`;
const cssBlock = css => `    css {
        inline:
            \`\`\`css
${ind(css, 12)}
            \`\`\`
    }`;
const staticRegion = (id, name, seq, html, template = "@/blank-with-attributes") => `    region ${id} (
        name: ${name}
        type: staticContent
        source {
            htmlCode:
                \`\`\`html
${ind(html, 16)}
                \`\`\`
        }
        layout {
            sequence: ${seq}
            slot: body
        }
        appearance {
            template: ${template}
            templateOptions: #DEFAULT#
        }
    )`;
const write = (file, s) => fs.writeFileSync(ROOT + "pages/" + file, s);

// ---------- 1 Gallery ----------
const galleryFn = `// Ready-made looks of the Website Studio templates; thumbnails are app files gallery/<id>.jpg (made from the demo website).
var WS_PRESETS = ${JSON.stringify(PRESETS.map(p => ({ id: p.id, name: p.name, tags: p.tags, page: p.page, r: p.r, hash: p.hash })), null, 0).replace(/\},\{/g, "},\n    {")};
// The starter websites: one page each, with their own content, menu and look.
var WS_SITES = ${JSON.stringify(SITES.map(st => ({ key: st.key, alias: st.alias, name: st.brand.replace(/&amp;/g, "&"), label: st.label, text: st.description, look: st.look })), null, 0).replace(/\},\{/g, "},\n    {")};
// The multi-page websites: several pages with one shared menu, header and footer.
var WS_MULTI = ${JSON.stringify(MULTI.map(m => ({ key: m.key, alias: m.home, label: m.label, name: m.brand.replace(/&amp;/g, "&"), text: m.text, look: m.look,
    pages: m.pages.map(p => ({ name: p.pageName, alias: p.alias })) })), null, 0).replace(/\},\{"key"/g, "},\n    {\"key\"")};`;
const galleryLoad = `(function ($) {
    var box = document.getElementById("wss-gallery"), files = box.getAttribute("data-files"),
        site = box.getAttribute("data-site"), designer = box.getAttribute("data-designer"), app = box.getAttribute("data-app"), ses = box.getAttribute("data-session");
    function esc(s) { return apex.util.escapeHTML(String(s)); }
    function regions(p) { return Object.keys(p.r).map(function (k) { return k + ":" + p.r[k].join("+"); }).join(","); }
    function look(p) { return "#look=" + encodeURIComponent(p.page) + (regions(p) ? "&r=" + encodeURIComponent(regions(p)) : ""); }
    box.innerHTML = WS_PRESETS.map(function (p) {
        return '<article class="wss-Card" data-tags="' + esc(p.tags) + '">' +
            '<a class="wss-Card-shot" href="' + esc(designer + look(p)) + '" aria-label="' + esc("Customize " + p.name) + '"><img src="' + esc(files + "gallery/" + p.id + ".jpg") + '" alt="" loading="lazy" width="640" height="400"></a>' +
            '<div class="wss-Card-body"><h3 class="wss-Card-title">' + esc(p.name) + '</h3>' +
            '<div class="wss-Card-tags">' + p.tags.split(" ").map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + '</div>' +
            '<div class="wss-Card-actions"><a class="t-Button t-Button--small t-Button--hot" href="' + esc(designer + look(p)) + '"><span class="t-Button-label">Customize</span></a>' +
            '<a class="t-Button t-Button--small" target="_blank" rel="noopener" href="' + esc(site + p.hash) + '"><span class="t-Button-label">Full Screen</span></a></div></div></article>';
    }).join("");
    document.getElementById("wss-sites").innerHTML = WS_SITES.map(function (s) {
        var open = app + s.alias + ses, custom = designer + "#site=" + encodeURIComponent(s.alias) + "&look=" + encodeURIComponent(s.look);
        return '<article class="wss-Card wss-Card--site">' +
            '<a class="wss-Card-shot" href="' + esc(open) + '" target="_blank" rel="noopener" aria-label="' + esc("Open " + s.name) + '"><img src="' + esc(files + "gallery/site-" + s.key + ".jpg") + '" alt="" loading="lazy" width="640" height="400"></a>' +
            '<div class="wss-Card-body"><h3 class="wss-Card-title">' + esc(s.label) + '</h3><p class="wss-Card-text">' + esc(s.text) + '</p>' +
            '<div class="wss-Card-actions"><a class="t-Button t-Button--small t-Button--hot" target="_blank" rel="noopener" href="' + esc(open) + '"><span class="t-Button-label">Open Website</span></a>' +
            '<a class="t-Button t-Button--small" href="' + esc(custom) + '"><span class="t-Button-label">Customize</span></a></div></div></article>';
    }).join("");
    document.getElementById("wss-multi").innerHTML = WS_MULTI.map(function (s) {
        var open = app + s.alias + ses, custom = designer + "#site=" + encodeURIComponent(s.alias) + "&look=" + encodeURIComponent(s.look);
        return '<article class="wss-Card wss-Card--site">' +
            '<a class="wss-Card-shot" href="' + esc(open) + '" target="_blank" rel="noopener" aria-label="' + esc("Open " + s.name) + '"><img src="' + esc(files + "gallery/multi-" + s.key + ".jpg") + '" alt="" loading="lazy" width="640" height="400"></a>' +
            '<div class="wss-Card-body"><h3 class="wss-Card-title">' + esc(s.label) + ' <span class="wss-Count">' + s.pages.length + ' pages</span></h3><p class="wss-Card-text">' + esc(s.text) + '</p>' +
            '<div class="wss-Card-pages">' + s.pages.map(function (p) { return '<a href="' + esc(app + p.alias + ses) + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>'; }).join("") + '</div>' +
            '<div class="wss-Card-actions"><a class="t-Button t-Button--small t-Button--hot" target="_blank" rel="noopener" href="' + esc(open) + '"><span class="t-Button-label">Open Website</span></a>' +
            '<a class="t-Button t-Button--small" href="' + esc(custom) + '"><span class="t-Button-label">Customize</span></a></div></div></article>';
    }).join("");
    // the tag buttons and the search field work together
    function filter() {
        var f = $(".wss-Filter button[aria-pressed=true]").attr("data-f") || "", q = ($("#wss-q").val() || "").toLowerCase().trim(), n = 0;
        $("#wss-gallery .wss-Card").each(function () {
            var tags = " " + this.getAttribute("data-tags") + " ", name = $(this).find(".wss-Card-title").text().toLowerCase();
            this.hidden = (!!f && tags.indexOf(" " + f + " ") < 0) || (!!q && name.indexOf(q) < 0 && tags.indexOf(q) < 0);
            if (!this.hidden) { n++; }
        });
        $("#wss-none").prop("hidden", n > 0);
    }
    $(document).on("click", ".wss-Filter button", function () {
        $(".wss-Filter button").attr("aria-pressed", "false");
        this.setAttribute("aria-pressed", "true");
        filter();
    });
    $(document).on("input", "#wss-q", filter);
    $(document).on("keydown", "#wss-q", function (e) { if (e.key === "Enter") { e.preventDefault(); } });
})(apex.jQuery);`;
const galleryCss = `.wss-Hero { padding: clamp(1.5rem, 4vw, 3rem) clamp(1rem, 3vw, 2rem); border-radius: 18px; color: #ffffff;
            background: radial-gradient(circle at 86% 18%, rgba(255,255,255,.18), transparent 40%), linear-gradient(120deg, #7c2d12, #ea580c 52%, #db2777); }
.wss-Hero h1 { margin: 0 0 .5rem; font-size: clamp(1.75rem, 1.2rem + 2vw, 2.75rem); font-weight: 800; letter-spacing: -.03em; line-height: 1.1; }
.wss-Hero p { max-width: 52rem; margin: 0 0 1.25rem; font-size: 1.0625rem; line-height: 1.6; opacity: .94; }
.wss-Hero .t-Button { margin: 0 .5rem .5rem 0; }
.wss-Hero .t-Button--hot { --a-button-background-color: #ffffff; --a-button-text-color: #7c2d12; --a-button-hover-background-color: #ffedd5; --a-button-hover-text-color: #7c2d12; }
.wss-Hero .wss-Ghost { --a-button-background-color: transparent; --a-button-text-color: #ffffff; --a-button-hover-background-color: rgba(255,255,255,.14); --a-button-hover-text-color: #ffffff; border: 1px solid rgba(255,255,255,.6); }
.wss-Filter { display: flex; flex-wrap: wrap; gap: .5rem; margin: 1.5rem 0 1rem; }
.wss-Filter button { padding: .375rem .95rem; border-radius: 999px; border: 1px solid var(--ut-component-border-color, #d0d5dd); background: var(--ut-component-background-color, #fff); color: inherit; font: inherit; font-size: .875rem; cursor: pointer; }
.wss-Filter button[aria-pressed="true"] { background: #7c2d12; border-color: #7c2d12; color: #ffffff; }
.wss-Filter button:focus-visible { outline: 2px solid #ea580c; outline-offset: 2px; }
.wss-Search { flex: 1 1 12rem; max-width: 18rem; min-height: 2.1rem; padding: .3rem .9rem; border-radius: 999px; border: 1px solid var(--ut-component-border-color, #d0d5dd); background: var(--ut-component-background-color, #fff); color: inherit; font: inherit; font-size: .875rem; }
.wss-Search:focus-visible { outline: 2px solid #ea580c; outline-offset: 2px; }
.wss-None { margin: 1rem 0; opacity: .8; }
.wss-Grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 19rem), 1fr)); gap: 1.25rem; }
.wss-Card { display: flex; flex-direction: column; overflow: hidden; border-radius: 14px; border: 1px solid var(--ut-component-border-color, #e4e7ec); background: var(--ut-component-background-color, #fff);
            box-shadow: 0 1px 2px rgba(16,24,40,.05); transition: box-shadow .2s ease, transform .2s ease; }
.wss-Card:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -18px rgba(16,24,40,.35); }
.wss-Card[hidden] { display: none; }
.wss-Card-shot { display: block; aspect-ratio: 16 / 10; overflow: hidden; background: #eef0f4; }
.wss-Card-shot img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .4s ease; }
.wss-Card:hover .wss-Card-shot img { transform: scale(1.03); }
.wss-Card-body { display: flex; flex-direction: column; gap: .5rem; padding: .875rem 1rem 1rem; }
.wss-Card-title { margin: 0; font-size: 1rem; font-weight: 700; }
.wss-Card-text { margin: 0; font-size: .8125rem; line-height: 1.5; opacity: .8; }
.wss-H2 { margin: 2rem 0 .25rem; font-size: 1.25rem; font-weight: 700; }
.wss-Sub { margin: 0 0 1rem; opacity: .8; }
.wss-Card-tags { display: flex; flex-wrap: wrap; gap: .375rem; }
.wss-Card-tags span { padding: .1rem .5rem; border-radius: 999px; background: rgba(234,88,12,.1); color: #9a3412; font-size: .75rem; font-weight: 600; text-transform: capitalize; }
.wss-Card-actions { display: flex; gap: .5rem; margin-top: .25rem; }
.wss-Count { margin-inline-start: .35rem; padding: .05rem .45rem; border-radius: 999px; background: rgba(234,88,12,.1); color: #9a3412; font-size: .7rem; font-weight: 700; vertical-align: middle; }
.wss-Card-pages { display: flex; flex-wrap: wrap; gap: .25rem .75rem; font-size: .8125rem; }
.wss-Card-pages a { color: inherit; text-decoration: underline; text-decoration-color: rgba(234,88,12,.45); text-underline-offset: 3px; }
.wss-Card-pages a:hover { color: #9a3412; }
.wss-Card-actions .t-Button { flex: 1; justify-content: center; }
@media (prefers-reduced-motion: reduce) { .wss-Card, .wss-Card-shot img { transition: none; } .wss-Card:hover { transform: none; } .wss-Card:hover .wss-Card-shot img { transform: none; } }`;
const TAGS = [...new Set(PRESETS.flatMap(p => p.tags.split(" ")))];
const TAG_NAME = { light: "Light", dark: "Dark", clean: "Clean", editorial: "Editorial", bold: "Bold", glass: "Glass", soft: "Soft UI", midnight: "Midnight", minimal: "Minimal",
    corporate: "Corporate", saas: "SaaS", luxury: "Elegant", playful: "Playful", organic: "Organic", techgrid: "Tech Grid", swiss: "Swiss", retro: "Retro",
    aurora: "Aurora", clay: "Clay", blueprint: "Blueprint", sketch: "Hand-drawn", deco: "Art Deco", majlis: "Majlis" };
const galleryHero = `<div class="wss-Hero">
  <h1>One-page and multi-page websites for Oracle APEX</h1>
  <p>A page template, a section template, a menu template and ${REPORTS.length} report templates - hero sliders, services, numbers, team, testimonials, clients, pricing, news, products and menus, photo galleries, events, opening hours, comparisons, videos, maps, tabs, countdowns, banners and more. Every list comes from a SQL query. ${DESIGNS.length} designs, ${ACCENTS.length} accent colours, light and dark, ${FONTS.length - 1} typefaces including Arabic, right-to-left ready. Every look is a template option. Start from a website below, fine-tune it in the Designer, copy the templates into your app.</p>
  <a class="t-Button t-Button--hot" href="f?p=&APP_ID.:DESIGNER:&APP_SESSION."><span class="t-Button-label">Open the Designer</span></a>
  <a class="t-Button wss-Ghost" href="f?p=&APP_ID.:WEBSITE:&APP_SESSION." target="_blank" rel="noopener"><span class="t-Button-label">See the demo website</span></a>
  <a class="t-Button wss-Ghost" href="f?p=&APP_ID.:HOW-TO-USE:&APP_SESSION."><span class="t-Button-label">How to use it</span></a>
</div>
<h2 class="wss-H2">Starter Websites</h2>
<p class="wss-Sub">${SITES.length} complete websites with their own content, menu and photos. Open one, or customize it in the Designer.</p>
<div class="wss-Grid" id="wss-sites"></div>
<h2 class="wss-H2">Multi-page Websites</h2>
<p class="wss-Sub">${MULTI.length} websites with several pages that share one menu, header and footer. The menu links to pages, and inner pages open with a page title.</p>
<div class="wss-Grid" id="wss-multi"></div>
<h2 class="wss-H2">Looks</h2>
<p class="wss-Sub">${PRESETS.length} ready-made looks on the demo website. Each one works on every starter website.</p>
<div class="wss-Filter" role="group" aria-label="Filter">
  <button type="button" data-f="" aria-pressed="true">All</button>
${TAGS.map(t => `  <button type="button" data-f="${t}" aria-pressed="false">${TAG_NAME[t] || t}</button>`).join("\n")}
  <input type="search" id="wss-q" class="wss-Search" placeholder="Search looks" aria-label="Search looks" autocomplete="off">
</div>
<p class="wss-None" id="wss-none" role="status" hidden>No look matches. Try another word or press All.</p>`;
const gallery = [pageHead(1, "Gallery", "HOME", "Website Studio - Gallery"), js(galleryFn, galleryLoad), cssBlock(galleryCss), pageSec, "",
    staticRegion("hero", "Website Studio", 10, galleryHero), "",
    staticRegion("gallery", "Gallery", 20, `<div class="wss-Grid" id="wss-gallery" data-files="#APP_FILES#" data-site="f?p=&APP_ID.:WEBSITE:&APP_SESSION." data-designer="f?p=&APP_ID.:DESIGNER:&APP_SESSION." data-app="f?p=&APP_ID.:" data-session=":&APP_SESSION."></div>`),
    "", ")", ""].join("\n");
write("p00001-home.apx", gallery);

// ---------- 2 Designer ----------
// Page options: the option groups and switches of Modern One Page. Section options: one select per option group of a
// report or list template; they act on every region with that template (#ws=...&r=@ws-hero:...), so they work on every site.
const PAGE_SELECTS = PAGE.groups.map(g => ({ item: "P2_" + g.id.replace(/^ws-/, "").toUpperCase(), group: g.name, nul: g.nul, options: g.options }));
const PAGE_SWITCHES = PAGE.singles.map(([css, label]) => ({ item: "P2_" + css.replace(/^ws-Fx--/, "").toUpperCase(), css, label }));
const tplOf = id => id === MENU.id ? MENU : REPORTS.find(r => r.id === id);
// [template, label, [group ids and single classes]]
const SECTION_SPEC = [
    ["ws-hero", "Hero", ["wsr-hero-layout", "wsr-hero-height", "wsr-hero-overlay", "wsr-hero-move", "ws-Hero--zoom", "wsr-autoplay"]],
    [MENU.id, "Menu", ["wsm-align", "wsm-max", "wsm-mobile", "ws-Menu--cta"]],
    ["ws-features", "Services", ["wsr-features-layout"]], ["ws-testimonials", "Testimonials", ["wsr-quotes-layout"]],
    ["ws-team", "Team", ["wsr-team-layout"]], ["ws-gallery", "Portfolio", ["wsr-works-layout"]],
    ["ws-logos", "Logos", ["wsr-logos-layout", "wsr-logos-speed"]], ["ws-steps", "Process", ["wsr-steps-layout"]], ["ws-timeline", "Timeline", ["wsr-timeline-layout"]],
    ["ws-news", "News", ["wsr-news-layout"]], ["ws-products", "Products", ["wsr-products-layout"]], ["ws-photos", "Photo Gallery", ["wsr-photos-layout"]],
    ["ws-events", "Events", ["wsr-events-layout"]], ["ws-hours", "Opening Hours", ["wsr-hours-layout"]],
    ["ws-faq", "FAQ", ["wsr-faq-layout", "ws-Faqs--search"]], ["ws-banner", "Banner", ["wsr-banner-style", "wsr-banner-layout"]], ["ws-tabs", "Tabs", ["wsr-tabs-style"]],
    ["ws-countdown", "Countdown", ["wsr-countdown-layout", "wsr-countdown-style"]], ["ws-skills", "Skills", ["wsr-skills-layout"]], ["ws-ticker", "Ticker", ["wsr-ticker-style", "wsr-ticker-speed"]]
];
// [item, label, template, [[option label, value]...]] - value: a class, !<group> (the group's empty choice) or -<class> (a switch off)
const SECTIONS = SECTION_SPEC.flatMap(([tpl, label, parts]) => parts.map(part => {
    const t = tplOf(tpl), g = (t.groups || []).find(x => x.id === part), single = (t.singles || []).find(x => x[0] === part);
    const item = ("P2_" + tpl.replace(/^ws-|^website-/, "") + "_" + (g ? g.id.split("-").pop() : part.replace(/^ws-\w+--/, ""))).toUpperCase().replace(/-/g, "_");
    if (g) { return [item, label + " - " + g.name, tpl, [[g.nul, g.nulClass || "!" + g.id], ...g.options.map(([c, n]) => [n, c])]]; }
    return [item, label + " - " + single[1], tpl, [["On", single[0]], ["Off", "-" + single[0]]]];
}));
const lov = n => String(n).replace(/[,;]/g, "");
const PRESET_OF = Object.fromEntries(REPORTS.map(r => [r.id, r.preset || []]));
const TPL_NAME = Object.fromEntries([...REPORTS, MENU].map(r => [r.id, r.name]));
// per site: the page options of its look, and the SQL of every section that shows pictures (for the SQL panel)
const SITE_DATA = Object.fromEntries(DESIGNER_SITES.map(st => [st.alias, {
    look: st.look, name: st.label, page: st.page, tpls: [...new Set(st.sections.map(x => x.report).filter(Boolean))],
    sql: st.sections.filter(x => x.rows && x.rows.some(r => "IMAGE_FILE" in r || "IMAGE_URL" in r)).map(x => ({ id: x.id, name: (x.menu || x.title).replace(/\*/g, "") + " (" + TPL_NAME[x.report] + ")", sql: sql(x.rows) }))
}]));
// too big for the page's JavaScript (32 KB per property): a static file the Designer loads first (run build.mjs once after adding it)
fs.writeFileSync(ROOT + "shared-components/static-files/website-studio/designer-sites.js",
    "// Website Studio Designer: the look and the picture SQL of every starter website (generated by apexlang/_src/studio-pages.mjs)\nwindow.WSD_SITES = " + JSON.stringify(SITE_DATA) + ";\n");
const designerLoad = `// Designer: every choice is a template option (a CSS class) of Modern One Page or of a Website report or list template.
// The preview iframe shows a real website page; the classes travel in its URL hash (#ws=<page classes>&r=@<template>:<classes>,...).
(function ($) {
    var DEF = "${PAGE_DEFAULTS}".split(" ");
    var SELECTS = ${JSON.stringify(PAGE_SELECTS.map(x => ({ item: x.item, group: x.group })))};
    var SWITCHES = ${JSON.stringify(PAGE_SWITCHES)};
    // [item, label, template, [[option, value]...]]
    var SECTIONS = ${JSON.stringify(SECTIONS)};
    var PRESET = ${JSON.stringify(PRESET_OF)}, TPL_NAME = ${JSON.stringify(TPL_NAME)};
    var SITES = window.WSD_SITES;   // static file website-studio/designer-sites.js
    var frame = document.getElementById("wsd-frame"), app = frame.getAttribute("data-app"), ses = frame.getAttribute("data-session"), lastSrc = null, share = "";
    function esc(s) { return apex.util.escapeHTML(String(s)); }
    function siteUrl() { return app + ($v("P2_SITE") || "WEBSITE") + ses; }
    function site() { return SITES[$v("P2_SITE") || "WEBSITE"]; }
    var ALWAYS_DARK = /--(${ALWAYS_DARK.join("|")})$/;

    // page options of a look: every select and switch follows the list of classes
    function setPage(cls) {
        SELECTS.forEach(function (s) {
            var hit = $("#" + s.item + " option").filter(function () { return this.value && cls.indexOf(this.value) >= 0; }).first();
            apex.item(s.item).setValue(hit.length ? hit.val() : "", null, true);
        });
        SWITCHES.forEach(function (s) { apex.item(s.item).setValue(DEF.indexOf(s.css) >= 0 || cls.indexOf(s.css) >= 0 ? "Y" : "N", null, true); });
    }
    function setSections(rs) {
        SECTIONS.forEach(function (s) {
            var mine = rs["@" + s[2]] || [], hit = s[3].filter(function (o) { return mine.indexOf(o[1]) >= 0; })[0];
            apex.item(s[0]).setValue(hit ? hit[1] : "", null, true);
        });
    }
    // from the Gallery: #site=<page alias>&look=<page classes>&r=@<template>:<classes>,...
    (function fromHash() {
        var h = location.hash, g = function (k) { var m = new RegExp("[#&]" + k + "=([^&]*)").exec(h); try { return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } };
        if (g("site") && SITES[g("site")]) { apex.item("P2_SITE").setValue(g("site"), null, true); }
        if (g("dir") === "rtl" || g("dir") === "ltr") { apex.item("P2_DIR").setValue(g("dir"), null, true); }
        var look = g("look"), rs = {};
        (g("r") || "").split(",").forEach(function (p) { var i = p.indexOf(":"); if (i > 0) { rs[p.slice(0, i)] = p.slice(i + 1).split(/[\\s+]+/); } });
        setPage((look !== null ? look : SITES[$v("P2_SITE") || "WEBSITE"].look).split(/[\\s+]+/));
        setSections(rs);
    })();
    function reset() { setPage(site().look.split(/\\s+/)); setSections({}); apex.item("P2_DIR").setValue("", null, true); }
    $("#P2_SITE").on("change", function () { reset(); sqlPanel(); render(); });

    function chosen() {
        var page = [], rows = [], extra = [], allDefaults = true, tpl = {}, changed = [];
        SELECTS.forEach(function (s) {
            var v = $v(s.item), text = $("#" + s.item + " option:selected").text();
            if (v) { page.push(v); extra.push(v); }
            rows.push({ group: s.group, option: text, isDefault: !v });
        });
        SWITCHES.forEach(function (s) {
            var on = $v(s.item) === "Y", isDef = DEF.indexOf(s.css) >= 0;
            if (on) { page.push(s.css); }
            if (isDef && !on) { allDefaults = false; }
            if (on && !isDef) { extra.push(s.css); }
            rows.push({ group: s.label, option: on ? "On" : "Off", isDefault: on === isDef });
        });
        SECTIONS.forEach(function (s) {
            var v = $v(s[0]);
            if (!v) { return; }
            (tpl[s[2]] = tpl[s[2]] || []).push(v);
            changed.push({ tpl: s[2], label: s[1], option: $("#" + s[0] + " option:selected").text(), cls: v });
        });
        return { page: page, rows: rows, snippet: allDefaults ? ["#DEFAULT#"].concat(extra) : page, tpl: tpl, changed: changed,
                 regions: Object.keys(tpl).map(function (k) { return "@" + k + ":" + tpl[k].join("+"); }).join(","), dir: $v("P2_DIR") };
    }
    function arr(list, n) {
        var pad = new Array(n + 1).join(" ");
        return list.length === 1 ? " " + list[0] + "\\n" : " [\\n" + list.map(function (x) { return pad + "    " + x + "\\n"; }).join("") + pad + "]\\n";
    }
    function relevance() {
        var dark = ALWAYS_DARK.test($v("P2_DESIGN")), sticky = $v("P2_STICKY") === "Y" || /transparent/.test($v("P2_HEADER")), has = site().tpls;
        $("#P2_SCHEME_CONTAINER").toggleClass("wsd-Off", dark).attr("data-why", dark ? "This design is always dark" : null);
        $("#P2_AUTOHIDE_CONTAINER").toggleClass("wsd-Off", !sticky).attr("data-why", sticky ? null : "Needs Sticky Header");
        // only the section options of templates this website uses
        SECTIONS.forEach(function (s) { $("#" + s[0] + "_CONTAINER").toggle(s[2] === "website-menu" || has.indexOf(s[2]) >= 0); });
    }
    function render() {
        var c = chosen(), hash = "#ws=" + encodeURIComponent(c.page.join(" ")) + (c.regions ? "&r=" + encodeURIComponent(c.regions) : "") + (c.dir ? "&dir=" + c.dir : ""), src = siteUrl();
        relevance();
        // section options and another site need a fresh page; page options follow the hash without a reload
        if (src + c.regions + c.dir !== lastSrc || !frame.getAttribute("src")) { frame.setAttribute("src", src + hash); }
        else { try { frame.contentWindow.location.hash = hash; } catch (e) { frame.setAttribute("src", src + hash); } }
        lastSrc = src + c.regions + c.dir;
        // this look as a link to the Designer (Copy Link)
        share = location.href.split("#")[0].replace(/([?&])session=\\d+&?/, "$1").replace(/[?&]$/, "") + "#site=" + encodeURIComponent($v("P2_SITE") || "WEBSITE") + "&look=" + encodeURIComponent(c.page.join(" ")) +
            (c.regions ? "&r=" + encodeURIComponent(c.regions) : "") + (c.dir ? "&dir=" + c.dir : "");
        $("#wsd-summary").html('<p class="wsd-H">Modern One Page</p><dl class="wsd-List">' + c.rows.map(function (r) {
            return "<dt>" + esc(r.group) + "</dt><dd" + (r.isDefault ? ' class="is-default"' : "") + ">" + esc(r.option) + "</dd>";
        }).join("") + "</dl>" + (c.changed.length ? '<p class="wsd-H">Sections</p><dl class="wsd-List">' + c.changed.map(function (r) {
            return "<dt>" + esc(r.label) + "</dt><dd>" + esc(r.option) + "</dd>";
        }).join("") + "</dl>" : ""));
        var code = "appearance {\\n    pageTemplate: @modern-one-page\\n    templateOptions:" + arr(c.snippet, 4) + "}";
        Object.keys(c.tpl).forEach(function (t) {
            var on = (PRESET[t] || []).concat(c.tpl[t].filter(function (x) { return /^ws-/.test(x); })), off = c.tpl[t].filter(function (x) { return x.charAt(0) === "-"; }).map(function (x) { return x.slice(1); });
            on = on.filter(function (x, i) { return off.indexOf(x) < 0 && on.indexOf(x) === i; });
            code += "\\n\\n// every region with " + TPL_NAME[t] + "\\ncomponentAppearance {\\n" + (t === "website-menu" ? "    listTemplate: @website-menu\\n" : "    templateType: theme\\n    template: @" + t + "\\n") +
                "    templateOptions:" + arr(["#DEFAULT#"].concat(on), 4) + "}";
        });
        $("#wsd-code").text(code);
    }
    // the SQL of the sections with pictures on the chosen site
    function sqlPanel() {
        var list = SITES[$v("P2_SITE") || "WEBSITE"].sql, sel = $("#wsd-sqlpick");
        sel.html(list.map(function (x, i) { return '<option value="' + i + '">' + esc(x.name) + "</option>"; }).join(""));
        showSql();
    }
    function showSql() { var x = SITES[$v("P2_SITE") || "WEBSITE"].sql[+$("#wsd-sqlpick").val() || 0]; $("#wsd-sql").text(x ? x.sql : ""); }
    $(document).on("change", "#wsd-sqlpick", showSql);

    $(SELECTS.concat(SWITCHES).map(function (s) { return "#" + s.item; }).concat(SECTIONS.map(function (s) { return "#" + s[0]; })).concat("#P2_DIR").join(",")).on("change", render);
    // Desktop: the page is laid out at 1280px and scaled down to fit the preview
    function fit() {
        var stage = document.getElementById("wsd-stage"), desk = $v("P2_DEVICE") === "DESKTOP", s = Math.min(1, stage.clientWidth / 1280);
        stage.setAttribute("data-device", $v("P2_DEVICE"));
        frame.style.width = desk ? "1280px" : "";
        frame.style.height = desk ? (stage.clientHeight / s) + "px" : "";
        frame.style.transform = desk && s < 1 ? "scale(" + s + ")" : "";
    }
    $("#P2_DEVICE").on("change", fit);
    $(window).on("resize apexwindowresized", fit);
    fit();
    // copy to the clipboard; where the browser refuses, the text is shown selected so Ctrl+C still works
    function copy(text) {
        var done = function () { apex.message.showPageSuccess("Copied."); };
        var manual = function () {
            var ta = document.createElement("textarea"), ok = false;
            ta.value = text; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;left:0;opacity:0"; document.body.appendChild(ta); ta.select();
            try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
            document.body.removeChild(ta);
            if (ok) { done(); return; }
            $("#wsd-manual").remove();
            $('<div id="wsd-manual" class="wsd-Manual"><p>Your browser did not allow copying. Select the text below and press Ctrl+C (Cmd+C on a Mac).</p><textarea readonly rows="6"></textarea></div>').insertAfter("#wsd-code").find("textarea").val(text).trigger("focus").trigger("select");
        };
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, manual); } else { manual(); }
    }
    // Surprise Me: a random design, colour, typeface, header and corners (the switches stay as they are)
    function pick(item) { var o = $("#" + item + " option"); return o.eq(Math.floor(Math.random() * o.length)).val(); }
    $(document).on("click", ".js-wsd-random", function () {
        ["P2_DESIGN", "P2_ACCENT", "P2_FONT", "P2_HEADER", "P2_CORNERS", "P2_FOOTER"].forEach(function (i) { apex.item(i).setValue(pick(i), null, true); });
        apex.item("P2_SCHEME").setValue(Math.random() < .25 ? "ws-Scheme--dark" : "", null, true);
        render();
    });
    $(document).on("click", ".js-wsd-reset", function () { reset(); render(); });
    $(document).on("click", ".js-wsd-link", function () { copy(share); });
    $(document).on("click", ".js-wsd-copy", function () { copy($("#wsd-code").text()); });
    $(document).on("click", ".js-wsd-copysql", function () { copy($("#wsd-sql").text()); });
    $(document).on("click", ".js-wsd-open", function () { window.open(frame.getAttribute("src"), "_blank"); });
    sqlPanel();
    render();
})(apex.jQuery);`;
const designerCss = `.wsd-Stage { position: relative; display: flex; justify-content: center; align-items: center; height: min(80vh, 780px); min-height: 520px; overflow: hidden; border-radius: 12px;
             border: 1px solid var(--ut-component-border-color, #ddd); background: repeating-conic-gradient(rgba(0,0,0,.035) 0 25%, transparent 0 50%) 0 0 / 24px 24px; }
.wsd-Stage iframe { display: block; width: 100%; height: 100%; border: 0; background: #fff; transition: width .3s ease, border-radius .3s ease; }
.wsd-Stage[data-device="DESKTOP"] { display: block; }
.wsd-Stage[data-device="DESKTOP"] iframe { transform-origin: 0 0; transition: none; }
.wsd-Stage[data-device="TABLET"], .wsd-Stage[data-device="PHONE"] { padding: 16px 0; }
.wsd-Stage[data-device="TABLET"] iframe { width: 820px; max-width: calc(100% - 32px); border-radius: 20px; box-shadow: 0 0 0 12px #1f2329, 0 24px 48px -12px rgba(0,0,0,.45); }
.wsd-Stage[data-device="PHONE"] iframe { width: 390px; max-width: calc(100% - 32px); border-radius: 28px; box-shadow: 0 0 0 10px #1f2329, 0 24px 48px -12px rgba(0,0,0,.45); }
.wsd-List { display: grid; grid-template-columns: auto 1fr; gap: .375rem 1rem; margin: 0 0 1rem; font-size: .875rem; }
.wsd-List dt { opacity: .75; }
.wsd-List dd { margin: 0; font-weight: 600; }
.wsd-List dd.is-default::after { content: " (default)"; font-weight: 400; opacity: .7; }
.wsd-Code { margin: 0 0 1rem; padding: .875rem 1rem; overflow-x: auto; border-radius: 8px; background: #1f2329; color: #e6edf3; font-size: .8125rem; line-height: 1.5; white-space: pre-wrap; }
.wsd-Where { margin: 0 0 .75rem; padding: .625rem .875rem; border-radius: 8px; background: rgba(234,88,12,.08); font-size: .8125rem; line-height: 1.5; }
.wsd-H { display: block; margin: 1rem 0 .5rem; font-size: .875rem; font-weight: 700; }
.wsd-Pick { width: 100%; max-width: 32rem; margin-bottom: .75rem; }
.wsd-Off { opacity: .6; }
.wsd-Manual { margin: .75rem 0; padding: .75rem; border-radius: 8px; background: rgba(234,88,12,.08); font-size: .8125rem; }
.wsd-Manual textarea { width: 100%; margin-top: .5rem; font: .8125rem/1.5 monospace; }
.wsd-Off[data-why]::after { content: attr(data-why); display: block; padding: 0 .75rem .25rem; font-size: .75rem; font-style: italic; }
@media (max-width: 640px) { .wsd-Stage { height: 72vh; min-height: 460px; } }`;
const sel = (name, label, seq, values, nul, def, region = "options") => `    pageItem ${name} (
        type: selectList
        label {
            label: ${label}
            alignment: left
        }
        lov {
            type: staticValues
            staticValues: STATIC2:${values}${nul === false ? "\n            displayNullValue: false" : `\n            nullDisplayValue: ${nul}`}
        }
        layout {
            sequence: ${seq}
            region: @${region}
            slot: regionBody
            alignment: left
        }
        appearance {
            template: @/optional-floating
            templateOptions: #DEFAULT#
        }${def ? `
        default {
            type: static
            staticValue: ${def}
        }` : ""}
        sessionState {
            storage: request
        }
    )`;
const sw = (name, label, seq, def, newRow) => `    pageItem ${name} (
        type: switch
        label {
            label: ${label}
            alignment: left
        }
        layout {
            sequence: ${seq}
            region: @options
            slot: regionBody
            alignment: left${newRow ? "" : "\n            startNewRow: false"}
        }
        appearance {
            template: @/optional-floating
            templateOptions: #DEFAULT#
        }
        default {
            type: static
            staticValue: ${def}
        }
        sessionState {
            storage: request
        }
    )`;
const radio = (name, label, seq, values, def) => `    pageItem ${name} (
        type: radioGroup
        label {
            label: ${label}
            alignment: left
        }
        settings {
            noOfCols: ${values.split(",").length}
        }
        lov {
            type: staticValues
            staticValues: STATIC2:${values}
            displayNullValue: false
        }
        layout {
            sequence: ${seq}
            region: @preview
            slot: edit
        }
        appearance {
            template: @/hidden
            templateOptions: [
                #DEFAULT#
                t-Form-fieldContainer--radioButtonGroup
            ]
        }
        default {
            type: static
            staticValue: ${def}
        }
        sessionState {
            storage: request
        }
    )`;
const designer = [pageHead(2, "Designer", "DESIGNER", "Website Studio - Designer"), js(null, designerLoad, "#APP_FILES#website-studio/designer-sites.js"), cssBlock(designerCss), pageSec, "", crumb("Designer"), "",
`    region options (
        name: Template Options
        type: staticContent
        layout {
            sequence: 20
            slot: body
            columnSpan: 4
        }
        appearance {
            template: @/standard
            templateOptions: #DEFAULT#
        }
    )`, "",
`    region sections (
        name: Section Options
        type: staticContent
        layout {
            sequence: 5
            parentRegion: @options
            slot: subRegions
        }
        appearance {
            template: @/content-block
            templateOptions: [
                #DEFAULT#
                t-ContentBlock--h3
            ]
        }
    )`, "",
`    region preview (
        name: Live Preview
        type: staticContent
        source {
            htmlCode: <div class="wsd-Stage" id="wsd-stage" data-device="DESKTOP"><iframe id="wsd-frame" title="Website preview" data-app="f?p=&APP_ID.:" data-session=":&APP_SESSION."></iframe></div>
        }
        layout {
            sequence: 30
            slot: body
            startNewRow: false
            columnSpan: 8
        }
        appearance {
            template: @/standard
            templateOptions: [
                #DEFAULT#
                t-Region--noPadding
            ]
        }
    )`, "",
`    region summary (
        name: Your Choice
        type: staticContent
        source {
            htmlCode:
                \`\`\`html
                <p class="wsd-Where">Page Designer: select your one page, <strong>Appearance &gt; Page Template</strong> = <strong>Modern One Page</strong>, then tick the <strong>Template Options</strong> listed below. Section Options act on every region with that template: select the region, <strong>Attributes &gt; Appearance &gt; Template Options</strong> (for the menu: the List region's Template Options). Or paste the APEXlang into the page file.</p>
                <div id="wsd-summary"></div>
                <p class="wsd-H">APEXlang (page file)</p>
                <pre class="wsd-Code" id="wsd-code"></pre>
                <button type="button" class="t-Button t-Button--small t-Button--iconLeft js-wsd-copy"><span class="t-Icon fa fa-copy" aria-hidden="true"></span><span class="t-Button-label">Copy APEXlang</span></button>
                \`\`\`
        }
        layout {
            sequence: 10
            parentRegion: @options
            slot: subRegions
        }
        appearance {
            template: @/content-block
            templateOptions: [
                #DEFAULT#
                t-ContentBlock--h3
            ]
        }
    )`, "",
    sel("P2_SITE", "Website", 1, DESIGNER_SITES.map(st => `${lov(st.label)};${st.alias}`).join(","), false, "WEBSITE"), "",
    sel("P2_DIR", "Direction", 3, "Left to right;ltr,Right to left;rtl", "As on the website", ""), "",
    ...PAGE_SELECTS.map((x, i) => sel(x.item, x.group, (i + 1) * 5 + 1, x.options.map(([c, n]) => `${lov(n)};${c}`).join(","), x.nul, "") + "\n"),
    ...PAGE_SWITCHES.map((x, i) => sw(x.item, x.label, 100 + i, PAGE.defaults.includes(x.css) ? "Y" : "N", i % 2 === 0) + "\n"),
    ...SECTIONS.map(([item, label, , o], i) => sel(item, label, (i + 1) * 10, o.map(([n, c]) => `${lov(n)};${c}`).join(","), "As on the page", "", "sections") + "\n"),
`    region sql (
        name: Section SQL
        type: staticContent
        source {
            htmlCode:
                \`\`\`html
                <p class="wsd-Where">The query of a section with pictures on this website. Copy it into a Classic Report region, then swap <code>from dual</code> for your own table. IMAGE_FILE is a file in Static Application Files; IMAGE_URL takes any image URL instead (see How to Use for BLOB columns).</p>
                <label class="wsd-H" for="wsd-sqlpick">Section</label>
                <select id="wsd-sqlpick" class="selectlist apex-item-select wsd-Pick"></select>
                <pre class="wsd-Code" id="wsd-sql"></pre>
                <button type="button" class="t-Button t-Button--small t-Button--iconLeft js-wsd-copysql"><span class="t-Icon fa fa-copy" aria-hidden="true"></span><span class="t-Button-label">Copy SQL</span></button>
                \`\`\`
        }
        layout {
            sequence: 10
            parentRegion: @preview
            slot: subRegions
        }
        appearance {
            template: @/content-block
            templateOptions: [
                #DEFAULT#
                t-ContentBlock--h3
            ]
        }
    )`, "",
    radio("P2_DEVICE", "Preview On", 10, "Desktop;DESKTOP,Tablet;TABLET,Phone;PHONE", "DESKTOP"), "",
`    button surprise (
        buttonName: SURPRISE
        label: Surprise Me
        layout {
            sequence: 12
            region: @preview
            slot: edit
        }
        appearance {
            buttonTemplate: @/text-with-icon
            templateOptions: [
                #DEFAULT#
                t-Button--iconLeft
            ]
            cssClasses: js-wsd-random
            icon: fa-random
        }
        behavior {
            action: definedByDynamicAction
        }
    )`, "",
`    button reset-look (
        buttonName: RESET_LOOK
        label: Reset
        layout {
            sequence: 14
            region: @preview
            slot: edit
        }
        appearance {
            buttonTemplate: @/text-with-icon
            templateOptions: [
                #DEFAULT#
                t-Button--iconLeft
            ]
            cssClasses: js-wsd-reset
            icon: fa-undo
        }
        behavior {
            action: definedByDynamicAction
        }
    )`, "",
`    button copy-link (
        buttonName: COPY_LINK
        label: Copy Link
        layout {
            sequence: 16
            region: @preview
            slot: edit
        }
        appearance {
            buttonTemplate: @/text-with-icon
            templateOptions: [
                #DEFAULT#
                t-Button--iconLeft
            ]
            cssClasses: js-wsd-link
            icon: fa-link
        }
        behavior {
            action: definedByDynamicAction
        }
    )`, "",
`    button open-full (
        buttonName: OPEN_FULL
        label: Open Full Page
        layout {
            sequence: 20
            region: @preview
            slot: edit
        }
        appearance {
            buttonTemplate: @/text-with-icon
            templateOptions: [
                #DEFAULT#
                t-Button--iconLeft
            ]
            cssClasses: js-wsd-open
            icon: fa-external-link
        }
        behavior {
            action: definedByDynamicAction
        }
    )`, "", ")", ""].join("\n");
if (Buffer.byteLength(designerLoad, "utf8") > 32000) { throw new Error("Designer JavaScript is " + Buffer.byteLength(designerLoad, "utf8") + " bytes - the limit is 32767"); }
console.log("designer JavaScript", Buffer.byteLength(designerLoad, "utf8"), "bytes");
write("p00002-designer.apx", designer);

// ---------- 3 How to Use ----------
const howCss = `.wss-Doc { max-width: 62rem; line-height: 1.7; }
.wss-Doc h3 { margin: 1.75rem 0 .5rem; font-size: 1.125rem; }
.wss-Doc h3:first-child { margin-top: 0; }
.wss-Doc ol, .wss-Doc ul { padding-inline-start: 1.25rem; margin: .25rem 0 .75rem; }
.wss-Doc li { margin: .2rem 0; }
.wss-Doc pre { margin: .5rem 0 1rem; padding: .875rem 1rem; overflow-x: auto; border-radius: 8px; background: #1f2329; color: #e6edf3; font-size: .8125rem; line-height: 1.55; }
.wss-Doc p code, .wss-Doc li code, .wss-Doc td code { padding: .05rem .35rem; border-radius: 4px; background: rgba(127,127,127,.14); font-size: .8125rem; }
.wss-Doc table { width: 100%; border-collapse: collapse; margin: .5rem 0 1rem; font-size: .875rem; }
.wss-Doc th, .wss-Doc td { padding: .45rem .6rem; border-bottom: 1px solid var(--ut-component-border-color, #e4e7ec); text-align: left; vertical-align: top; }
.wss-Doc th { font-weight: 700; opacity: .8; }
.wss-Doc td:first-child { font-weight: 600; white-space: nowrap; }`;
const reportRows = REPORTS.map(r => `  <tr><td>${esc(r.name)}</td><td>${esc(r.help)}</td><td>${r.cols.map(c => `<code>${c}</code>`).join(" ")}</td></tr>`).join("\n");
const T = REPORTS.map(r => r.name.replace("Website - ", "")).join(", ");
const heroSql = `select 'We design brands people *remember*.' as title,
       'Brand and digital studio' as subtitle,
       'Strategy, identity and websites.' as text,
       'website-studio/img/studio-hero-1.jpg' as image_file,
       'Designers around a table' as image_alt,
       'center 40%' as image_position,
       'See our work' as button_label,
       '#work' as button_link,
       1 as sort_order
  from dual`;
const howHtml = `<div class="wss-Doc">
<h3>Build a website in 10 minutes</h3>
<ol>
  <li><strong>Pick a starting point.</strong> In the Gallery, open the starter website closest to yours (company, restaurant, clinic, real estate, event, portfolio, SaaS) and press <em>Customize</em>.</li>
  <li><strong>Choose the look.</strong> In the Designer, change Design, Accent Color, Typeface and Header until it feels right. Press <em>Copy APEXlang</em>, or note the options listed under <em>Your Choice</em>.</li>
  <li><strong>Copy the page.</strong> In Website Studio, <strong>Page Designer &gt; Create &gt; Page as Copy</strong> of that starter page (into your own application after step 2 of the next section), give it a name, and set the Template Options you chose.</li>
  <li><strong>Change the words.</strong> Every section is a region: change titles in Page Designer, and the rows in each region's SQL query (or point the query at your own table).</li>
  <li><strong>Add your photos.</strong> Upload them to <strong>Shared Components &gt; Static Application Files</strong> and put the file names in <code>IMAGE_FILE</code> (see <em>Pictures</em> below).</li>
  <li><strong>Set the menu.</strong> Edit the list under <strong>Shared Components &gt; Lists</strong> (for example <em>Company - Menu</em>): its entries are the header menu.</li>
  <li><strong>Make the form yours.</strong> Change the process <em>Send Message</em> to email or store the message (the code is in its comments).</li>
</ol>

<h3>1. Get Website Studio into your workspace</h3>
<ol>
  <li>Download <code>website-studio.sql</code> from <a href="https://github.com/HashaamShoukat/apex-website-studio" target="_blank" rel="noopener">GitHub</a> (or import the APEXlang source with SQLcl: <code>apex import -input apexlang</code>).</li>
  <li><strong>App Builder &gt; Import</strong>, install it with any application ID. No database objects; APEX 26.1 or later.</li>
</ol>

<h3>2. Copy the templates into your application</h3>
<p>In <em>your</em> application: <strong>Shared Components &gt; Templates &gt; Create &gt; As a Copy of an Existing Template</strong>, copy from <strong>Website Studio</strong> (tick <em>Subscribe</em> for later updates):</p>
<table>
  <tr><th>Type</th><th>Template</th><th>Use it for</th></tr>
  <tr><td>Page</td><td>Modern One Page</td><td>The website page: header, menu, hero, sections, footer.</td></tr>
  <tr><td>Region</td><td>Modern Section</td><td>Every band of the page. The region title is the heading, the Static ID the menu anchor.</td></tr>
  <tr><td>List</td><td>Website - Menu</td><td>The header menu, with drop-downs for child entries.</td></tr>
  <tr><td>Report</td><td>Website - ${T}</td><td>Classic Report templates: each turns the rows of a SQL query into a section.</td></tr>
</table>
<p>The templates load their CSS and JavaScript from static files, which the copy does not bring along. Upload <code>website-studio/website.css</code> and <code>website-studio/website.js</code> to <strong>Shared Components &gt; Static Application Files</strong> in your application, in a directory named <code>website-studio</code>. Download them from Website Studio's own Static Application Files, or from <code>apexlang/shared-components/static-files/website-studio</code> on GitHub.</p>

<h3>3. Build the page</h3>
<ol>
  <li>Create a blank page and set <strong>Appearance &gt; Page Template</strong> to <strong>Modern One Page</strong>. Make it public if visitors should not sign in. Pick the Template Options you built in the Designer.</li>
  <li><strong>Hero</strong>: a Classic Report in the <em>Hero</em> slot. Region template <strong>Modern Section</strong> with Spacing <em>None</em>, Width <em>Full Width</em>, Heading <em>Hidden</em>; report template <strong>Website - Hero</strong>. One row per slide.</li>
  <li><strong>Sections</strong>: regions in the <em>Body</em> slot with the <strong>Modern Section</strong> template. Give each a <strong>Static ID</strong> (it becomes <code>#services</code> in the menu).</li>
  <li><strong>Lists of things</strong>: make the region a <strong>Classic Report</strong>, write the SQL with the column names below, and set <strong>Attributes &gt; Appearance &gt; Template</strong> to the matching Website report template. Set <em>Number of Rows</em> high enough (the starters use 100) and pagination to <em>No Pagination</em>. APEX does not keep the order of the query, so add a column such as <code>SORT_ORDER</code> and set its <em>Sorting &gt; Default Sequence</em> to 1 (the templates do not show it).</li>
  <li><strong>Free text</strong> (about, vision, call to action): a Static Content region with the helper classes below.</li>
  <li><strong>Contact form</strong>: page items and a button in a Modern Section region with the CSS class <code>ws-Contact</code>, and a process that stores or emails the message. Put a <em>Website - Contact Details</em> report in its Sub Regions.</li>
  <li><strong>Footer</strong>: regions with the <em>Blank with Attributes</em> template in the <em>Footer</em> slot (a <em>Website - Links</em> report with layout List makes a link column) and <em>Footer Bottom</em> for the copyright line.</li>
  <li><strong>Logo</strong>: a Static Content region in the <em>Logo</em> slot (or the application logo).</li>
  <li><strong>Announcement</strong> (optional): a Static Content region in the <em>Announcement</em> slot, for example <code>&lt;p&gt;Early prices end on 31 December. &lt;a href="#tickets"&gt;Get tickets&lt;/a&gt;&lt;/p&gt;</code>. It shows as a bar above the menu; a visitor who closes it does not see it again during that visit.</li>
</ol>

<h3>4. The menu</h3>
<p>Create a <strong>List</strong> (<strong>Shared Components &gt; Lists</strong>), then a <strong>List</strong> region in the page's <strong>Menu</strong> slot with region template <em>Blank with Attributes</em> and list template <strong>Website - Menu</strong>.</p>
<ul>
  <li>Entries with a URL like <code>#services</code> scroll to that section and light up while it is on screen. Entries can also go to other pages or other websites.</li>
  <li>Child entries (<em>Parent List Entry</em>) open as a drop-down on wide screens (hover, click or the keyboard; Escape closes) and as an accordion on phones.</li>
  <li><em>User Defined Attribute 1</em>: extra CSS classes (<code>ws-Menu-cta</code> makes a button). <em>Attribute 2</em>: link target (<code>_blank</code> for a new tab). For a new tab add <code>rel="noopener"</code> in <em>Link Attributes</em>.</li>
  <li>Template Options: <em>Alignment</em>, <em>Visible Entries</em> (the rest go into More), <em>On Phones</em> (drop-down, full-screen overlay or side drawer) and <em>Last Entry as Button</em>.</li>
  <li>No list region? The menu is built from the Modern Section regions with <em>Show in Menu</em>.</li>
</ul>
<p>A list can also come from a table (<strong>List Source = SQL Query</strong>). The restaurant starter does this:</p>
<pre>select level, label, target,
       null as is_current, null as image, null as image_attribute, null as image_alt,
       null as attribute1, link_target as attribute2
  from my_menu
 start with parent_id is null
connect by prior id = parent_id
 order siblings by seq</pre>
<p><strong>A website with several pages.</strong> Give every page the Modern One Page template with the same Template Options, and put the same list in each page's Menu slot (<em>Copy to other Page</em> copies the menu, logo and footer regions). Then:</p>
<ul>
  <li>Let the list entries go to pages (<em>Target Type: Page in this Application</em>). APEX marks the entry of the page that is open.</li>
  <li>A child entry can open a section of another page: URL <code>f?p=&amp;APP_ID.:SERVICES:&amp;APP_SESSION.#faq</code>.</li>
  <li>Links in reports (footer columns, buttons, "read more") come from the query: <code>apex_page.get_url(p_page =&gt; 'SERVICES') as link</code>. In Static Content, use <code>f?p=&amp;APP_ID.:SERVICES:&amp;APP_SESSION.</code>; point the logo to the home page.</li>
  <li>Inner pages open with a short title band: a Website - Hero region with one row, Layout <em>Full Bleed</em> and Height <em>Compact (page title)</em>.</li>
  <li>Put the contact form on one page only and link to it from the others.</li>
</ul>
<p>The ${MULTI.length} multi-page starters in the Gallery (pages ${MULTI[0].pages[0].page} to ${MULTI[MULTI.length - 1].pages[MULTI[MULTI.length - 1].pages.length - 1].page}) show all of this.</p>

<h3>5. Pictures</h3>
<p>Every template that shows a picture has the same columns: <code>IMAGE_URL</code>, <code>IMAGE_FILE</code>, <code>IMAGE_ALT</code> (what the picture shows, read aloud by screen readers) and <code>IMAGE_POSITION</code> (the part to keep when it is cropped, like <code>center 30%</code> or <code>top</code>). Pictures load when they scroll into view. A row without a picture shows a soft placeholder (Template Option <em>Placeholder Images</em>), and people show their initials. There are three ways to give a picture:</p>
<p><strong>a. A URL</strong> - any https address:</p>
<pre>select 'https://images.example.com/team/sara.jpg' as image_url,
       'Sara in the studio' as image_alt, name, role
  from team_members</pre>
<p><strong>b. A Static Application File</strong> - upload it to <strong>Shared Components &gt; Static Application Files</strong>, then give its name in <code>IMAGE_FILE</code>. The starter websites use <code>website-studio/img/...</code>:</p>
<pre>${heroSql}</pre>
<p><strong>c. A BLOB column</strong> - keep the photo in your own table. Create an <strong>Application Item</strong> <code>IMG_ID</code> (Session State Protection: <em>Unrestricted</em>) and an <strong>Application Process</strong> <code>GET_IMAGE</code> (Point: <em>Ajax Callback</em>, no authentication needed for public pages):</p>
<pre>declare
    l_photo blob;
    l_mime  varchar2(255);
begin
    select photo, mime_type into l_photo, l_mime
      from team_members
     where id = :IMG_ID;
    sys.owa_util.mime_header(l_mime, false);
    sys.htp.p('Cache-Control: max-age=86400');
    sys.owa_util.http_header_close;
    sys.wpg_docload.download_file(l_photo);
    apex_application.stop_apex_engine;
end;</pre>
<p>Then return its URL in <code>IMAGE_URL</code>:</p>
<pre>select name, role,
       'f?p=' || :APP_ID || ':0:' || :APP_SESSION || ':APPLICATION_PROCESS=GET_IMAGE:::IMG_ID:' || id as image_url
  from team_members</pre>
<p>The hero also takes <code>VIDEO_URL</code>: an <code>.mp4</code> or <code>.webm</code> file plays silently behind the slide. The <em>Video</em> template takes YouTube and Vimeo links and loads the player only when the visitor presses play.</p>

<h3>6. The report templates and their columns</h3>
<p>Every column is optional: a column the query does not return is simply left out. <code>ICON</code> takes a Font APEX class such as <code>fa-lightbulb-o</code>; brand icons (<code>fa-instagram</code>, <code>fa-linkedin</code>, <code>fa-x-twitter</code>, <code>fa-youtube-play</code>, <code>fa-facebook</code>, <code>fa-github</code>, <code>fa-tiktok</code>, <code>fa-whatsapp</code> ...) are drawn by Website Studio, because Font APEX has none.</p>
<table>
  <tr><th>Template</th><th>What it is</th><th>Columns</th></tr>
${reportRows}
</table>

<h3>7. Helper classes for Static Content</h3>
<table>
  <tr><th>Class</th><th>What it does</th></tr>
  <tr><td><code>ws-Eyebrow</code>, <code>ws-Lead</code></td><td>At the start of a Modern Section's <em>Header</em> text: a small label above the heading and an intro below it.</td></tr>
  <tr><td><code>*word*</code> in a title</td><td>Highlights the word in the accent colour (italic with the serif typefaces).</td></tr>
  <tr><td><code>ws-Split</code>, <code>ws-Split--reverse</code></td><td>Two columns, for example <code>&lt;div class="ws-Media" data-file="website-studio/img/studio.jpg" role="img" aria-label="Our studio"&gt;&lt;/div&gt;</code> next to a <code>ws-Stack</code> of text.</td></tr>
  <tr><td><code>ws-Title</code>, <code>ws-Display</code>, <code>ws-Statement</code></td><td>Section heading, hero-size heading, a large statement.</td></tr>
  <tr><td><code>ws-Btn</code>, <code>ws-Btn--ghost</code>, <code>ws-More</code>, <code>ws-Actions</code></td><td>Buttons, a text link with an arrow, a row of buttons.</td></tr>
  <tr><td><code>ws-Checks</code>, <code>ws-Pillars</code>, <code>ws-Center</code></td><td>A list with check marks, a row of short columns, centred content.</td></tr>
</table>

<h3>8. Arabic and right to left</h3>
<p>The templates use logical CSS, so a page in a right-to-left language mirrors itself: menu, sliders, arrows, drawers and the WhatsApp button. Run the application in Arabic (<strong>Globalization &gt; Application Primary Language</strong>, or a translated application) and APEX sets <code>dir="rtl"</code>; the Arabic clinic starter sets it from its <em>HTML Header</em> instead, so it works in an English application too. Pick one of the Arabic typefaces: <em>Arabic</em> (IBM Plex Sans Arabic), <em>Arabic - Cairo</em> or <em>Arabic - Kufi</em>. Texts such as "Menu" and "Back to top" are built in for Arabic; for other languages create the text messages <code>WEBSITE_STUDIO.MENU</code>, <code>.BACK_TO_TOP</code>, <code>.ALL</code>, <code>.PREVIOUS</code>, <code>.NEXT</code>, <code>.SLIDE</code>, <code>.APPLY</code>, <code>.MORE</code>, <code>.CLOSE</code>, <code>.PLAY</code>, <code>.DARK_MODE</code>, <code>.MAP</code>, <code>.PAUSE</code>, <code>.RESUME</code>, <code>.SEARCH</code>, <code>.NONE</code>, <code>.YES</code>, <code>.NO</code>, <code>.DAYS</code>, <code>.HOURS</code>, <code>.MINUTES</code>, <code>.SECONDS</code> and <code>.PHOTO</code>.</p>

<h3>9. Countdown, top edges, WhatsApp, light and dark, search engines, spam</h3>
<ul>
  <li><strong>Countdown</strong>: <code>TARGET_DATE</code> is a date and time with its time zone, so every visitor counts down to the same moment: <code>to_char(event_start, 'YYYY-MM-DD"T"HH24:MI:SS') || '+03:00' as target_date</code>.</li>
  <li><strong>Top Edge</strong> (Modern Section option): Slanted, Curved or Rounded Corners let a coloured section rise over the one before it. Use it on sections with a Background.</li>
  <li><strong>Hide Header on Scroll</strong> and <strong>Reveal Style</strong> (page options): the sticky header slides away while the visitor reads down; sections can rise, fade, zoom, blur or slide into view.</li>
  <li><strong>FAQ</strong>: the <em>Search Box</em> option adds a search field, and the questions are also given to search engines as structured data (FAQPage).</li>
  <li><strong>The Designer</strong>: <em>Surprise Me</em> tries a random look, <em>Copy Link</em> gives you a link that opens the Designer with your look, and <em>Direction</em> shows any website right to left.</li>
  <li><strong>WhatsApp Button</strong> (page Template Option): a floating button that opens a chat. The number is the substitution string <code>WHATSAPP_NUMBER</code> in <strong>Shared Components &gt; Application Definition</strong>, in international format, digits only (<code>966500000000</code>). Without digits the button hides itself.</li>
  <li><strong>Light/Dark Toggle</strong>: a button in the header; the visitor's choice is remembered in the browser.</li>
  <li><strong>Search engines</strong>: put a short description and Open Graph tags in the page's <strong>HTML Header</strong> - every starter does: <code>&lt;meta name="description" content="..."&gt;</code>, <code>og:title</code>, <code>og:description</code>, <code>og:image</code>. For <code>og:image</code> use a full https address when you can: link previews in WhatsApp and LinkedIn need it. Give the page a clear <strong>Title</strong>, use <code>IMAGE_ALT</code>, and turn on <strong>Friendly URLs</strong> in the application's definition.</li>
  <li><strong>Speed</strong>: pictures load as they scroll into view; the starters preload the first hero picture with <code>&lt;link rel="preload" as="image" href="&#35;APP_FILES&#35;website-studio/img/..."&gt;</code> in the HTML Header. Keep photos under about 300 KB (1600 px wide for heroes, 800 px for cards).</li>
  <li><strong>Spam</strong>: the starters add a hidden field (<code>P11_WEBSITE</code>, CSS class <code>ws-Honeypot</code> on its column). People never see it; robots fill it in, and the process then sends nothing.</li>
  <li><strong>Sending the message</strong>: the starters do not send or store anything yet, and their success message says so ("Demo: nothing was sent or stored yet"). The process <em>Send Message</em> has an <code>apex_mail.send</code> example in its comments; add your code, test that a message arrives, then remove the note from the process's Success Message. Email needs the instance's mail settings (ask your APEX administrator).</li>
</ul>

<h3>10. Good to know</h3>
<ul>
  <li>The demo website (page <code>WEBSITE</code>) the starter websites (pages 11 to 17) and the multi-page websites (pages 20 to 53) are the best reference. Every query is a plain <code>select ... from dual</code> you can replace with your own tables.</li>
  <li>Typefaces other than System load from Google Fonts.</li>
  <li>After a partial page refresh of a section, call <code>wsSite.refresh(element)</code> - the templates already do it for <code>apexafterrefresh</code>.</li>
  <li>Visitors who prefer reduced motion get no animations; Windows high-contrast mode is respected; the menu, sliders, lightbox and accordions work with the keyboard. The source is in <code>apexlang/_src</code> on GitHub - edit there and run <code>node _src/build.mjs</code>.</li>
</ul>
</div>`;
// APEX would substitute #APP_FILES# in the guide's examples: write it as an entity
const howSafe = howHtml.replace(/#APP_FILES#/g, "&#35;APP_FILES&#35;");
const how = [pageHead(3, "How to Use", "HOW-TO-USE", "Website Studio - How to Use"), cssBlock(howCss), pageSec, "", crumb("How to Use"), "",
    staticRegion("guide", "Use Website Studio in Your Own App", 20, howSafe, "@/standard"), "", ")", ""].join("\n");
write("p00003-how-to-use.apx", how);
console.log("gallery, designer, how-to written;", PRESETS.length, "presets");
