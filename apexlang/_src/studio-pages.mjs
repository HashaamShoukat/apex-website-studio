// Writes the Gallery (1), Designer (2) and How to Use (3) pages: node _src/studio-pages.mjs
import fs from "node:fs";
import { PRESETS, PAGE_DEFAULTS } from "./presets.mjs";
import { DESIGNS, ACCENTS, FONTS, REPORTS } from "./options.mjs";
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
const js = (fn, onload) => `    javaScript {${fn ? `
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
var WS_PRESETS = ${JSON.stringify(PRESETS.map(p => ({ id: p.id, name: p.name, tags: p.tags, page: p.page, r: p.r, hash: p.hash })), null, 0).replace(/\},\{/g, "},\n    {")};`;
const galleryLoad = `(function ($) {
    var box = document.getElementById("wss-gallery"), files = box.getAttribute("data-files"),
        site = box.getAttribute("data-site"), designer = box.getAttribute("data-designer");
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
    $(document).on("click", ".wss-Filter button", function () {
        var f = this.getAttribute("data-f");
        $(".wss-Filter button").attr("aria-pressed", "false");
        this.setAttribute("aria-pressed", "true");
        $(".wss-Card").each(function () { this.hidden = !!f && (" " + this.getAttribute("data-tags") + " ").indexOf(" " + f + " ") < 0; });
    });
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
.wss-Card-tags { display: flex; flex-wrap: wrap; gap: .375rem; }
.wss-Card-tags span { padding: .1rem .5rem; border-radius: 999px; background: rgba(234,88,12,.1); color: #9a3412; font-size: .75rem; font-weight: 600; text-transform: capitalize; }
.wss-Card-actions { display: flex; gap: .5rem; margin-top: .25rem; }
.wss-Card-actions .t-Button { flex: 1; justify-content: center; }
@media (prefers-reduced-motion: reduce) { .wss-Card, .wss-Card-shot img { transition: none; } .wss-Card:hover { transform: none; } .wss-Card:hover .wss-Card-shot img { transform: none; } }`;
const galleryHero = `<div class="wss-Hero">
  <h1>One-page websites for Oracle APEX</h1>
  <p>A page template, a section template and ${REPORTS.length} report templates for heroes and sliders, services, numbers that count up, team, testimonials, clients, pricing, timeline, careers, FAQ, portfolio, contact details and social links - every list comes from a SQL query. ${DESIGNS.length} designs, 10 accent colours, light and dark, ${FONTS.length - 1} typefaces. Every look is a template option. Pick one, fine-tune it in the Designer, copy the templates into your app.</p>
  <a class="t-Button t-Button--hot" href="f?p=&APP_ID.:DESIGNER:&APP_SESSION."><span class="t-Button-label">Open the Designer</span></a>
  <a class="t-Button wss-Ghost" href="f?p=&APP_ID.:WEBSITE:&APP_SESSION." target="_blank" rel="noopener"><span class="t-Button-label">See the demo website</span></a>
  <a class="t-Button wss-Ghost" href="f?p=&APP_ID.:HOW-TO-USE:&APP_SESSION."><span class="t-Button-label">How to use it</span></a>
</div>
<div class="wss-Filter" role="group" aria-label="Filter">
  <button type="button" data-f="" aria-pressed="true">All</button>
  <button type="button" data-f="light" aria-pressed="false">Light</button>
  <button type="button" data-f="dark" aria-pressed="false">Dark</button>
  <button type="button" data-f="editorial" aria-pressed="false">Editorial</button>
  <button type="button" data-f="bold" aria-pressed="false">Bold</button>
  <button type="button" data-f="glass" aria-pressed="false">Glass</button>
  <button type="button" data-f="soft" aria-pressed="false">Soft UI</button>
</div>`;
const gallery = [pageHead(1, "Gallery", "HOME", "Website Studio - Gallery"), js(galleryFn, galleryLoad), cssBlock(galleryCss), pageSec, "",
    staticRegion("hero", "Website Studio", 10, galleryHero), "",
    staticRegion("gallery", "Gallery", 20, `<div class="wss-Grid" id="wss-gallery" data-files="#APP_FILES#" data-site="f?p=&APP_ID.:WEBSITE:&APP_SESSION." data-designer="f?p=&APP_ID.:DESIGNER:&APP_SESSION."></div>`),
    "", ")", ""].join("\n");
write("p00001-home.apx", gallery);

// ---------- 2 Designer ----------
// section layouts the Designer offers: [item, label, static id on the demo page, report template, [option label, class]...] - the first is the default
const SECTIONS = [
    ["P2_HERO", "Hero", "hero", "ws-hero", [["Slider", "ws-Hero--slider"], ["Split", "ws-Hero--split"], ["Centered", "ws-Hero--centered"], ["Full Bleed", "ws-Hero--fullbleed"]]],
    ["P2_LOGOS", "Clients", "clients", "ws-logos", [["Scrolling Marquee", "ws-Logos--marquee"], ["Grid", "ws-Logos--grid"], ["Row", "ws-Logos--row"]]],
    ["P2_SERVICES", "Services", "services", "ws-features", [["Cards", "ws-Features--cards"], ["Rows", "ws-Features--rows"], ["Bento", "ws-Features--bento"], ["Icons Only", "ws-Features--icons"]]],
    ["P2_WORK", "Portfolio", "work", "ws-gallery", [["Grid", "ws-Works--grid"], ["Editorial", "ws-Works--editorial"], ["Large", "ws-Works--large"]]],
    ["P2_PROCESS", "Process", "process", "ws-steps", [["Connected", "ws-Steps--line"], ["Cards", "ws-Steps--cards"]]],
    ["P2_QUOTES", "Testimonials", "clients-say", "ws-testimonials", [["Carousel", "ws-Quotes--carousel"], ["Wall", "ws-Quotes--wall"], ["Spotlight", "ws-Quotes--spotlight"]]],
    ["P2_TEAM", "Team", "team", "ws-team", [["Portrait Cards", "ws-Team--cards"], ["Round Photos", "ws-Team--round"], ["Compact List", "ws-Team--list"]]],
    ["P2_HISTORY", "Timeline", "history", "ws-timeline", [["Alternating", "ws-Timeline--alternate"], ["List", "ws-Timeline--list"]]]
];
const PRESET_OF = Object.fromEntries(REPORTS.map(r => [r.id, r.preset || []]));
const ACC = ACCENTS.map(([id, n]) => `${n};ws-Accent--${id}`).join(",");
const designerLoad = `// Designer: every choice is a template option (a CSS class) of Modern One Page or of a Website report template.
// The preview iframe shows the real demo website; the classes travel in its URL hash (#ws=<page classes>&r=<static id>:<classes>,...).
(function ($) {
    var DEF = "${PAGE_DEFAULTS}".split(" ");
    var SELECTS = [
        { item: "P2_DESIGN", group: "Design" }, { item: "P2_ACCENT", group: "Accent Color" }, { item: "P2_SCHEME", group: "Color Scheme" },
        { item: "P2_FONT", group: "Typeface" }, { item: "P2_HEADER", group: "Header" }, { item: "P2_CORNERS", group: "Corners" },
        { item: "P2_SPACE", group: "Section Spacing" }, { item: "P2_FOOTER", group: "Footer" }
    ];
    var SWITCHES = [
        { item: "P2_STICKY", css: "ws-Fx--sticky", label: "Sticky Header" }, { item: "P2_REVEAL", css: "ws-Fx--reveal", label: "Reveal on Scroll" },
        { item: "P2_COUNT", css: "ws-Fx--count", label: "Count Up Numbers" }, { item: "P2_TOP", css: "ws-Fx--top", label: "Back to Top Button" },
        { item: "P2_PROGRESS", css: "ws-Fx--progress", label: "Scroll Progress Bar" }
    ];
    // [item, label, static id, report template, [[option, class]...]] - the first option is the template's default
    var SECTIONS = ${JSON.stringify(SECTIONS)};
    var PRESET = ${JSON.stringify(PRESET_OF)};
    var frame = document.getElementById("wsd-frame"), site = frame.getAttribute("data-site"), lastRegions = null;
    function esc(s) { return apex.util.escapeHTML(String(s)); }

    // a look passed from the Gallery: #look=<page classes>&r=<static id>:<classes>,...
    (function fromHash() {
        var h = location.hash, g = function (k) { var m = new RegExp("[#&]" + k + "=([^&]*)").exec(h); return m ? decodeURIComponent(m[1]) : null; };
        if (g("look") === null) { return; }
        var cls = g("look").split(/[\\s+]+/), rs = {};
        (g("r") || "").split(",").forEach(function (p) { var i = p.indexOf(":"); if (i > 0) { rs[p.slice(0, i)] = p.slice(i + 1).split(/[\\s+]+/); } });
        SELECTS.forEach(function (s) {
            var hit = $("#" + s.item + " option").filter(function () { return this.value && cls.indexOf(this.value) >= 0; }).first();
            apex.item(s.item).setValue(hit.length ? hit.val() : "", null, true);
        });
        SWITCHES.forEach(function (s) { apex.item(s.item).setValue(DEF.indexOf(s.css) >= 0 || cls.indexOf(s.css) >= 0 ? "Y" : "N", null, true); });
        SECTIONS.forEach(function (s) {
            var mine = rs[s[2]] || [], hit = s[4].filter(function (o) { return mine.indexOf(o[1]) >= 0; })[0];
            apex.item(s[0]).setValue(hit ? hit[1] : s[4][0][1], null, true);
        });
    })();

    function chosen() {
        var page = [], rows = [], extra = [], allDefaults = true, regions = [], changed = [];
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
            var v = $v(s[0]) || s[4][0][1], isDef = v === s[4][0][1];
            regions.push(s[2] + ":" + v);
            rows.push({ group: s[1], option: $("#" + s[0] + " option:selected").text(), isDefault: isDef, section: true });
            if (!isDef) { changed.push({ id: s[2], label: s[1], tpl: s[3], cls: v }); }
        });
        return { page: page, rows: rows, snippet: allDefaults ? ["#DEFAULT#"].concat(extra) : page, regions: regions.join(","), changed: changed };
    }
    function arr(list, n) {
        var pad = new Array(n + 1).join(" ");
        return list.length === 1 ? " " + list[0] + "\\n" : " [\\n" + list.map(function (x) { return pad + "    " + x + "\\n"; }).join("") + pad + "]\\n";
    }
    function relevance() {
        var hero = $v("P2_HERO"), transparent = $v("P2_HEADER") === "ws-Header--transparent", photo = /slider|fullbleed/.test(hero);
        $("#P2_HEADER_CONTAINER").toggleClass("wsd-Off", transparent && !photo).attr("data-why", transparent && !photo ? "Transparent needs the Slider or Full Bleed hero; with this hero it shows as Classic" : null);
        $("#P2_SCHEME_CONTAINER").toggleClass("wsd-Off", $v("P2_DESIGN") === "ws-Design--midnight").attr("data-why", $v("P2_DESIGN") === "ws-Design--midnight" ? "Midnight is always dark" : null);
    }
    function render() {
        var c = chosen(), hash = "#ws=" + encodeURIComponent(c.page.join(" ")) + "&r=" + encodeURIComponent(c.regions);
        relevance();
        // section layouts need a fresh page; page options follow the hash without a reload
        if (c.regions !== lastRegions || !frame.getAttribute("src")) { frame.setAttribute("src", site + hash); }
        else { try { frame.contentWindow.location.hash = hash; } catch (e) { frame.setAttribute("src", site + hash); } }
        lastRegions = c.regions;
        $("#wsd-summary").html('<p class="wsd-H">Modern One Page</p><dl class="wsd-List">' + c.rows.filter(function (r) { return !r.section; }).map(function (r) {
            return "<dt>" + esc(r.group) + "</dt><dd" + (r.isDefault ? ' class="is-default"' : "") + ">" + esc(r.option) + "</dd>";
        }).join("") + '</dl><p class="wsd-H">Sections</p><dl class="wsd-List">' + c.rows.filter(function (r) { return r.section; }).map(function (r) {
            return "<dt>" + esc(r.group) + "</dt><dd" + (r.isDefault ? ' class="is-default"' : "") + ">" + esc(r.option) + "</dd>";
        }).join("") + "</dl>");
        var code = "appearance {\\n    pageTemplate: @modern-one-page\\n    templateOptions:" + arr(c.snippet, 4) + "}";
        c.changed.forEach(function (s) {
            code += "\\n\\n// region " + s.id + " (" + s.label + ")\\ncomponentAppearance {\\n    templateType: theme\\n    template: @" + s.tpl + "\\n    templateOptions:" + arr(["#DEFAULT#"].concat(PRESET[s.tpl] || [], [s.cls]), 4) + "}";
        });
        $("#wsd-code").text(code);
    }

    $(SELECTS.concat(SWITCHES).map(function (s) { return "#" + s.item; }).concat(SECTIONS.map(function (s) { return "#" + s[0]; })).join(",")).on("change", render);
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
    $(document).on("click", ".js-wsd-copy", function () {
        navigator.clipboard.writeText($("#wsd-code").text()).then(function () { apex.message.showPageSuccess("Copied."); });
    });
    $(document).on("click", ".js-wsd-open", function () { window.open(frame.getAttribute("src"), "_blank"); });
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
.wsd-H { margin: 1rem 0 .5rem; font-size: .875rem; font-weight: 700; }
.wsd-Off { opacity: .6; }
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
const designer = [pageHead(2, "Designer", "DESIGNER", "Website Studio - Designer"), js(null, designerLoad), cssBlock(designerCss), pageSec, "", crumb("Designer"), "",
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
        name: Section Layouts
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
            htmlCode: <div class="wsd-Stage" id="wsd-stage" data-device="DESKTOP"><iframe id="wsd-frame" title="Website preview" data-site="f?p=&APP_ID.:WEBSITE:&APP_SESSION."></iframe></div>
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
                <p class="wsd-Where">Page Designer: select your one page, <strong>Appearance &gt; Page Template</strong> = <strong>Modern One Page</strong>, then tick the <strong>Template Options</strong> listed below. For a section, select its Classic Report region, <strong>Attributes &gt; Appearance</strong>, and set the Template Options of its Website report template. Or paste the APEXlang into the page file.</p>
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
    sel("P2_DESIGN", "Design", 5, DESIGNS.slice(1).map(([id, n]) => `${n};ws-Design--${id}`).join(","), "Clean", ""), "",
    sel("P2_ACCENT", "Accent Color", 10, ACC, "Theme Color", "ws-Accent--tangerine"), "",
    sel("P2_SCHEME", "Color Scheme", 20, "Dark;ws-Scheme--dark,Follow Device Setting;ws-Scheme--auto", "Light", ""), "",
    sel("P2_FONT", "Typeface", 30, FONTS.slice(1).map(([id, n]) => `${n};ws-Font--${id}`).join(","), "System", "ws-Font--grotesk"), "",
    sel("P2_HEADER", "Header", 40, "Centered Logo;ws-Header--centered,Floating Pill;ws-Header--pill,Transparent over Hero;ws-Header--transparent", "Classic", ""), "",
    sel("P2_CORNERS", "Corners", 50, "Square;ws-Corners--square,Soft;ws-Corners--soft,Extra Round;ws-Corners--round", "Rounded", ""), "",
    sel("P2_SPACE", "Section Spacing", 60, "Compact;ws-Space--compact,Airy;ws-Space--airy", "Comfortable", ""), "",
    sel("P2_FOOTER", "Footer", 70, "Light;ws-Footer--light,Accent Color;ws-Footer--accent", "Dark", ""), "",
    sw("P2_STICKY", "Sticky Header", 80, "Y", true), "",
    sw("P2_REVEAL", "Reveal on Scroll", 81, "Y", false), "",
    sw("P2_COUNT", "Count Up Numbers", 82, "Y", true), "",
    sw("P2_TOP", "Back to Top Button", 83, "Y", false), "",
    sw("P2_PROGRESS", "Scroll Progress Bar", 84, "N", true), "",
    ...SECTIONS.map(([item, label, , , o], i) => sel(item, label, (i + 1) * 10, o.map(([n, c]) => `${n};${c}`).join(","), false, o[0][1], "sections") + "\n"),
    radio("P2_DEVICE", "Preview On", 10, "Desktop;DESKTOP,Tablet;TABLET,Phone;PHONE", "DESKTOP"), "",
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
const howHtml = `<div class="wss-Doc">
<h3>1. Get Website Studio into your workspace</h3>
<ol>
  <li>Download <code>website-studio.sql</code> from <a href="https://github.com/HashaamShoukat/apex-website-studio" target="_blank" rel="noopener">GitHub</a> (or import the APEXlang source with SQLcl: <code>apex import -input apexlang</code>).</li>
  <li><strong>App Builder &gt; Import</strong>, install it with any application ID. No database objects; APEX 26.1 or later.</li>
</ol>

<h3>2. Copy the templates into your application</h3>
<p>In <em>your</em> application: <strong>Shared Components &gt; Templates &gt; Create &gt; As a Copy of an Existing Template</strong>, copy from <strong>Website Studio</strong> (tick <em>Subscribe</em> for later updates):</p>
<table>
  <tr><th>Type</th><th>Template</th><th>Use it for</th></tr>
  <tr><td>Page</td><td>Modern One Page</td><td>The website page: header with a menu built from the sections, hero, sections, footer.</td></tr>
  <tr><td>Region</td><td>Modern Section</td><td>Every band of the page. The region title is the heading, the Static ID the menu anchor.</td></tr>
  <tr><td>Report</td><td>Website - Hero, Numbers, Services, Team, Testimonials, Logos, Pricing, Timeline, Process, FAQ, Careers, Portfolio, Links, Contact Details</td><td>Classic Report templates: each turns the rows of a SQL query into a section.</td></tr>
</table>
<p>The templates load their CSS and JavaScript from two static files, which the copy does not bring along. Upload <code>website-studio/website.css</code> and <code>website-studio/website.js</code> to <strong>Shared Components &gt; Static Application Files</strong> in your application, in a directory named <code>website-studio</code>. Download them from Website Studio's own Static Application Files, or from <code>apexlang/shared-components/static-files/website-studio</code> on GitHub.</p>

<h3>3. Build the page</h3>
<ol>
  <li>Create a blank page and set <strong>Appearance &gt; Page Template</strong> to <strong>Modern One Page</strong>. Make it public if visitors should not sign in. Pick the Template Options you built in the Designer.</li>
  <li><strong>Hero</strong>: a Classic Report in the <em>Hero</em> slot. Region template <strong>Modern Section</strong> with Spacing <em>None</em>, Width <em>Full Width</em>, Heading <em>Hidden</em>; report template <strong>Website - Hero</strong>. One row per slide.</li>
  <li><strong>Sections</strong>: regions in the <em>Body</em> slot with the <strong>Modern Section</strong> template. Give each a <strong>Static ID</strong> (it becomes <code>#services</code> in the menu) and keep <em>Show in Menu</em> on for the ones you want in the header. The menu label is the region title, or <code>data-menu="Services"</code> in <em>Advanced &gt; Custom Attributes</em> for a shorter one.</li>
  <li><strong>Lists of things</strong>: make the region a <strong>Classic Report</strong>, write the SQL with the column names below, and set <strong>Attributes &gt; Appearance &gt; Template</strong> to the matching Website report template. Set <em>Number of Rows</em> high enough (the demo uses 100) and pagination to <em>No Pagination</em>. APEX does not keep the order of the query, so to control the order add a column such as SORT_ORDER and set its <em>Sorting &gt; Default Sequence</em> to 1 (the templates do not show it).</li>
  <li><strong>Free text</strong> (about, vision, call to action): a Static Content region with the helper classes below.</li>
  <li><strong>Contact form</strong>: page items and a button in a Modern Section region with the CSS class <code>ws-Contact</code>, and a process that stores or emails the message. Put a <em>Website - Contact Details</em> report in its Sub Regions for the address, phone and email.</li>
  <li><strong>Footer</strong>: regions with the <em>Blank with Attributes</em> template in the <em>Footer</em> slot (one per column - a <em>Website - Links</em> report with layout List makes a link column) and <em>Footer Bottom</em> for the copyright line.</li>
  <li><strong>Logo</strong>: a Static Content region in the <em>Logo</em> slot (or the application logo), and a button in <em>Header Buttons</em> for a call to action.</li>
</ol>
<pre>select title, subtitle, text, image_url,
       'See our work' as button_label, '#work' as button_link
  from my_slides
 order by display_order</pre>

<h3>4. The report templates and their columns</h3>
<p>Every column is optional: a column the query does not return is simply left out. <code>IMAGE_URL</code> takes any URL (<code>#APP_FILES#photo.jpg</code>, a BLOB download URL, an external image); without it the templates draw artwork in the accent colours, or the person's initials. <code>ICON</code> takes a Font APEX class such as <code>fa-lightbulb-o</code>; brand icons (<code>fa-instagram</code>, <code>fa-linkedin</code>, <code>fa-x-twitter</code>, <code>fa-youtube-play</code>, <code>fa-facebook</code>, <code>fa-github</code>, <code>fa-tiktok</code>, <code>fa-whatsapp</code> ...) are drawn by Website Studio, because Font APEX has none.</p>
<table>
  <tr><th>Template</th><th>What it is</th><th>Columns</th></tr>
${reportRows}
</table>

<h3>5. Helper classes for Static Content</h3>
<table>
  <tr><th>Class</th><th>What it does</th></tr>
  <tr><td><code>ws-Eyebrow</code>, <code>ws-Lead</code></td><td>At the start of a Modern Section's <em>Header</em> text: a small label above the heading and an intro below it.</td></tr>
  <tr><td><code>*word*</code> in a title</td><td>Highlights the word in the accent colour (italic with the serif typefaces).</td></tr>
  <tr><td><code>ws-Split</code>, <code>ws-Split--reverse</code></td><td>Two columns, for example <code>&lt;div class="ws-Media" data-img="#APP_FILES#studio.jpg"&gt;&lt;/div&gt;</code> next to a <code>ws-Stack</code> of text.</td></tr>
  <tr><td><code>ws-Title</code>, <code>ws-Display</code>, <code>ws-Statement</code></td><td>Section heading, hero-size heading, a large statement.</td></tr>
  <tr><td><code>ws-Btn</code>, <code>ws-Btn--ghost</code>, <code>ws-More</code>, <code>ws-Actions</code></td><td>Buttons, a text link with an arrow, a row of buttons.</td></tr>
  <tr><td><code>ws-Checks</code>, <code>ws-Pillars</code>, <code>ws-Center</code></td><td>A list with check marks, a row of short columns, centred content.</td></tr>
</table>

<h3>6. Good to know</h3>
<ul>
  <li>The demo website (page <code>WEBSITE</code>) is the best reference: every section is in it, and every query is a plain <code>select ... from dual</code> you can replace with your own tables.</li>
  <li>Texts can be translated with the text messages <code>WEBSITE_STUDIO.MENU</code>, <code>.BACK_TO_TOP</code>, <code>.ALL</code>, <code>.PREVIOUS</code>, <code>.NEXT</code>, <code>.SLIDE</code> and <code>.APPLY</code>.</li>
  <li>Typefaces other than System load from Google Fonts. Transparent over Hero needs the Slider or Full Bleed hero; with any other first section it behaves like Classic.</li>
  <li>After a partial page refresh of a section, call <code>wsSite.refresh(element)</code> - the templates already do it for <code>apexafterrefresh</code>.</li>
  <li>Visitors who prefer reduced motion get no animations; Windows high-contrast mode is respected. The source is in <code>apexlang/_src</code> on GitHub - edit there and run <code>node _src/build.mjs</code>.</li>
</ul>
</div>`;
// APEX would substitute #APP_FILES# in the guide's examples: write it as an entity
const howSafe = howHtml.replace(/#APP_FILES#/g, "&#35;APP_FILES&#35;");
const how = [pageHead(3, "How to Use", "HOW-TO-USE", "Website Studio - How to Use"), cssBlock(howCss), pageSec, "", crumb("How to Use"), "",
    staticRegion("guide", "Use Website Studio in Your Own App", 20, howSafe, "@/standard"), "", ")", ""].join("\n");
write("p00003-how-to-use.apx", how);
console.log("gallery, designer, how-to written;", PRESETS.length, "presets");
