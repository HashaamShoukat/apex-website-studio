// Builds the Website Studio templates, option groups and static files from _src:
//   cd apexlang && node _src/build.mjs
// - website.css / website.js -> static-files/website-studio/*, loaded by the page template's CSS and JavaScript File URLs
// - PAGE    -> page-templates/modern-one-page.apx
// - SECTION -> region-templates/modern-section.apx
// - REPORTS -> classic-report-templates/ws-*.apx (named column report templates)
// - option groups -> template-option-groups.apx; every static file -> static-files.apx
// Field limits checked: option names 30 bytes, report row templates and region template 4000, page template parts 32767.
import fs from "node:fs";
import path from "node:path";
import { PAGE, SECTION, REPORTS } from "./options.mjs";
import { brandCss } from "./brands.mjs";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const THEME = ROOT + "shared-components/themes/universal-theme/";
const FILES = ROOT + "shared-components/static-files/";
const SRC = ROOT + "_src/";
const bytes = s => Buffer.byteLength(s, "utf8");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");
const read = f => fs.readFileSync(SRC + f, "utf8").replace(/\r\n/g, "\n");
const LIMITS = [];
function field(name, value, max) {
    const b = bytes(value);
    LIMITS.push(`${name} ${b}/${max}`);
    if (b > max) { throw new Error(`${name} is ${b} bytes - the limit is ${max}`); }
    return value;
}
const block = (key, lang, value, n) => value.includes("\n")
    ? `${" ".repeat(n)}${key}:\n${" ".repeat(n + 4)}\`\`\`${lang}\n${ind(value, n + 4)}\n${" ".repeat(n + 4)}\`\`\``
    : `${" ".repeat(n)}${key}: ${value}`;
const optId = css => css.replace(/^ws-/, "").replace(/--/g, "-").replace(/[A-Z]/g, c => "-" + c.toLowerCase()).replace(/^-/, "").replace(/--+/g, "-");
const list = (key, arr, n) => arr.length === 1 ? `${" ".repeat(n)}${key}: ${arr[0]}` : `${" ".repeat(n)}${key}: [\n${arr.map(a => " ".repeat(n + 4) + a).join("\n")}\n${" ".repeat(n)}]`;

// ---------- template options ----------
function options(def, type) {
    let out = "";
    const seen = new Set();
    const one = (css, name, seq, help, group, advanced) => {
        if (bytes(name) > 30) { throw new Error("option name over 30 bytes: " + name); }
        const id = optId(css);
        if (seen.has(id)) { throw new Error("duplicate option id " + id); }
        seen.add(id);
        out += `\n    templateOption ${id} (\n        name: ${name}\n` + (group ? `        group: @${type}/${group}\n` : "") + `        sequence: ${seq}\n` +
            `        appearance {\n            cssClasses: ${css}\n        }\n` + (help ? `        help {\n            helpText: ${help}\n        }\n` : "") +
            (advanced ? `        advanced {\n            isAdvancedOption: true\n        }\n` : "") + `    )\n`;
    };
    for (const g of def.groups || []) { g.options.forEach(([css, name, help], i) => one(css, name, (i + 1) * 10, help, g.id, g.advanced)); }
    for (const [css, name, seq, help] of def.singles || []) { one(css, name, seq, help); }
    return out;
}
const groupDefs = [];
function groups(type, gs) {
    for (const g of gs) {
        if (groupDefs.some(x => x.id === g.id)) { continue; }
        if (bytes(g.name) > 30) { throw new Error("group name over 30 bytes: " + g.name); }
        groupDefs.push({ ...g, type });
    }
}

// ---------- static files ----------
fs.mkdirSync(FILES + "website-studio", { recursive: true });
const css = read("website.css") + brandCss(), js = read("website.js");
fs.writeFileSync(FILES + "website-studio/website.css", css);
fs.writeFileSync(FILES + "website-studio/website.js", js);
LIMITS.push(`website.css ${bytes(css)} (static file)`, `website.js ${bytes(js)} (static file)`);

// ---------- Modern One Page ----------
// applies a look passed in the URL (#ws=...) before the page is drawn, so the Designer preview does not flash
const early = `<script #APEX_CSP_NONCE_ATTRIBUTE#>(function(b,h){var m=/[#&]ws=([^&]*)/.exec(h);if(!m)return;b.className=b.className.split(/\\s+/).filter(function(c){return!/^ws-(Design|Accent|Scheme|Font|Header|Corners|Space|Fx|Footer)--/.test(c)}).concat(decodeURIComponent(m[1]).split(/[\\s+,]+/)).join(" ")})(document.body,location.hash);</script>`;
const header = `<!DOCTYPE html>
<html class="no-js #RTL_CLASS# page-&APP_PAGE_ID!ATTR. app-&APP_ALIAS!ATTR." lang="&BROWSER_LANGUAGE!ATTR." #TEXT_DIRECTION#>
<head>
  <meta charset="utf-8">
  <title>#TITLE#</title>
  #APEX_CSS#
  #THEME_CSS#
  #TEMPLATE_CSS#
  #THEME_STYLE_CSS#
  #APPLICATION_CSS#
  #PAGE_CSS#
  #FAVICONS#
  #HEAD#
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
</head>
<body class="ws-Page #PAGE_CSS_CLASSES#" #TEXT_DIRECTION# #ONLOAD# id="t_PageBody">
${early}
<noscript>&APP_TEXT$APEX_PAGE_NOSCRIPT.</noscript>
<a href="#main" class="ws-Skip">&APP_TEXT$UI_PAGE_SKIP_TO_CONTENT.</a>
#FORM_OPEN#
<div class="ws-Progress" aria-hidden="true"></div>
<header class="ws-Header" id="ws-header">
  <div class="ws-Wrap ws-Header-in">
    <div class="ws-Brand-slot">#REGION_POSITION_07#</div>
    <a class="ws-Brand ws-Brand-default" href="#HOME_LINK#">#LOGO#</a>
    <nav class="ws-Nav" id="ws-nav" aria-label="&APP_TEXT$APEX.TEMPLATE.MAIN_NAV_LABEL!ATTR."></nav>
    <div class="ws-Header-end">#AFTER_NAVIGATION_BAR#<button type="button" class="ws-Burger" aria-expanded="false" aria-controls="ws-nav" aria-label="Menu"><span></span><span></span><span></span></button></div>
  </div>
</header>`;
const body = `<main id="main" class="ws-Main">
  #SUCCESS_MESSAGE##NOTIFICATION_MESSAGE##GLOBAL_NOTIFICATION#
  <div class="ws-Hero-slot">#REGION_POSITION_01#</div>
  #BODY#
</main>
<footer class="ws-Footer" id="ws-footer">
  <div class="ws-Wrap">
    <div class="ws-Footer-grid">#REGION_POSITION_05#</div>
    <div class="ws-Footer-bottom">#REGION_POSITION_06#</div>
  </div>
</footer>
<button type="button" class="ws-ToTop" aria-label="Back to top"><span aria-hidden="true">&#8593;</span></button>
<div class="ws-Dialogs" id="t_Body_inlineDialogs">#REGION_POSITION_04#</div>`;
const footer = `#FORM_CLOSE#
#DEVELOPER_TOOLBAR#
#APEX_JAVASCRIPT#
#GENERATED_CSS#
#THEME_JAVASCRIPT#
#TEMPLATE_JAVASCRIPT#
#APPLICATION_JAVASCRIPT#
#PAGE_JAVASCRIPT#
#GENERATED_JAVASCRIPT#
</body>
</html>`;
field("page header", header, 32767); field("page body", body, 32767); field("page footer", footer, 32767);
const slot = (id, name, staticId, { items = false, buttons = false, grid = false, cols, newRow } = {}) => `
    slot ${id} (
        name: ${name}
        staticId: ${staticId}${items || buttons ? `
        supports {${items ? "\n            items: true" : ""}${buttons ? "\n            buttons: true" : ""}
        }` : ""}
        gridLayout {${grid ? `
            maxFixedColumns: ${cols || 12}` : `
            gridSupport: false`}${newRow === false ? "\n            newRow: false" : ""}
        }
    )
`;
groups("page", PAGE.groups);
const pageTpl = `pageTemplate modern-one-page (
    name: Modern One Page
    templateClass: custom1
    templateOptions {
${list("default", PAGE.defaults, 8)}
    }
    page {
${block("header", "html", header, 8)}
${block("body", "html", body, 8)}
${block("footer", "html", footer, 8)}
    }
    javaScript {
        fileUrls: #APP_FILES#website-studio/website.js
        executeWhenPageLoads: if (window.wsSite) { wsSite.init(); }
    }
    css {
        fileUrls: #APP_FILES#website-studio/website.css
    }
    subtemplate {
        successMessage: <div class="ws-Alert" id="t_Alert_Success" role="status"><h2 class="u-vh">#SUCCESS_MESSAGE_HEADING#</h2>#SUCCESS_MESSAGE#</div>
        notification: <div class="ws-Alert ws-Alert--warning" id="t_Alert_Notification" role="alert"><h2 class="u-vh">#ERROR_MESSAGE_HEADING#</h2>#MESSAGE#</div>
    }
    layout {
        maxColumns: 12
        alwaysUseMaxColumns: true
        defaultLabelColumnSpan: 2
        firstColumnAttributes: col-start
        lastColumnAttributes: col-end
        containerTemplate:
            \`\`\`html
            <div class="ws-Grid">
            #ROWS#
            </div>
            \`\`\`
        rowTemplate:
            \`\`\`html
            <div class="ws-Row #CSS_CLASSES#">
            #COLUMNS#
            </div>
            \`\`\`
        columnTemplate: <div class="ws-Col ws-Col--#COLUMN_SPAN_NUMBER# #CSS_CLASSES# #FIRST_LAST_COLUMN_ATTRIBUTES#" #ATTRIBUTES#>#CONTENT#</div>
    }
    errorPage {
        template:
            \`\`\`html
            <div class="ws-Alert ws-Alert--warning">
              <h1>#MESSAGE#</h1>
              <p>#ADDITIONAL_INFO#</p>
              <div>#TECHNICAL_INFO#</div>
              <p><button class="a-Error-back t-Button t-Button--hot" type="button">#OK#</button></p>
            </div>
            \`\`\`
    }
    comments {
        comments: Modern One Page (Website Studio) - a one-page website. The header menu is built from the sections (Modern Section regions with Show in Menu); the hero goes in the Hero slot, the footer columns in Footer. CSS and JavaScript come from the static files website-studio/website.css and website.js.
    }
${options(PAGE, "page")}${slot("hero", "Hero", "REGION_POSITION_01")}${slot("logo", "Logo", "REGION_POSITION_07", { newRow: false })}${slot("headerButtons", "Header Buttons", "AFTER_NAVIGATION_BAR", { items: true, buttons: true, newRow: false })}${slot("body", "Body", "BODY", { items: true, buttons: true, grid: true })}${slot("footer", "Footer", "REGION_POSITION_05")}${slot("footerBottom", "Footer Bottom", "REGION_POSITION_06", { buttons: true })}${slot("inlineDialogs", "Inline Dialogs", "REGION_POSITION_04")}
)
`;
fs.mkdirSync(THEME + "page-templates", { recursive: true });
fs.writeFileSync(THEME + "page-templates/modern-one-page.apx", pageTpl);

// ---------- Modern Section ----------
const region = `<section class="ws-Sec #REGION_CSS_CLASSES#" id="#DOM_ID#" #REGION_LANDMARK_ATTRIBUTES# #REGION_ATTRIBUTES#>
  <div class="ws-Wrap">
    <header class="ws-Head"><h2 class="ws-Title" id="#DOM_ID#_heading">#TITLE#</h2></header>
    <div class="ws-Body">#BODY##SUB_REGIONS#</div>
    <div class="ws-Btns">#PREVIOUS##NEXT#</div>
  </div>
</section>`;
field("region template", region, 4000);
groups("region", SECTION.groups);
const sectionTpl = `regionTemplate modern-section (
    name: Modern Section
    templateClass: custom1
    templateOptions {
${list("preset", SECTION.defaults, 8)}
    }
    region {
${block("template", "html", region, 8)}
    }
    accessibility {
        landmarkType: region
        regionTitleHtmlId: #DOM_ID#_heading
    }
    comments {
        comments: Modern Section (Website Studio) - one band of a one-page website. The region title is the heading (*word* highlights a word); the Static ID is the menu anchor. Header text can start with <p class="ws-Eyebrow"> and <p class="ws-Lead">.
    }
${options(SECTION, "region")}
    slot next (
        name: Buttons
        staticId: NEXT
        supports {
            regions: false
            buttons: true
        }
        gridLayout {
            gridSupport: false
        }
    )

    slot previous (
        name: Buttons Before
        staticId: PREVIOUS
        supports {
            regions: false
            buttons: true
        }
        gridLayout {
            gridSupport: false
        }
    )

    slot regionBody (
        name: Region Body
        staticId: BODY
        supports {
            items: true
            buttons: true
        }
    )

    slot subRegions (
        name: Sub Regions
        staticId: SUB_REGIONS
        gridLayout {
            gridSupport: false
        }
    )

)
`;
fs.mkdirSync(THEME + "region-templates", { recursive: true });
fs.writeFileSync(THEME + "region-templates/modern-section.apx", sectionTpl);

// ---------- report templates ----------
const pagination = `    pagination {
        template: <span class="t-Report-paginationText">#TEXT#</span>
        nextPage: <a href="#LINK#" class="t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--next">#PAGINATION_NEXT#</a>
        previousPage: <a href="#LINK#" class="t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--prev">#PAGINATION_PREVIOUS#</a>
        nextSet: <a href="#LINK#" class="t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--next">#PAGINATION_NEXT_SET#</a>
        previousSet: <a href="#LINK#" class="t-Button t-Button--small t-Button--noUI t-Report-paginationLink t-Report-paginationLink--prev">#PAGINATION_PREVIOUS_SET#</a>
    }`;
fs.mkdirSync(THEME + "classic-report-templates", { recursive: true });
for (const r of REPORTS) {
    const nul = (r.groups || []).find(g => g.nulClass);
    const top = `<${r.tag} class="ws-R ${r.base} #COMPONENT_CSS_CLASSES#" id="report_#DOM_ID#" data-region-id="#DOM_ID#"` +
        (nul ? ` data-ws-null="${nul.nulClass}" data-ws-base-class="${r.base}"` : "") + ">";
    const bottom = `</${r.tag}>`;
    field(r.id + " top", top, 4000);
    field(r.id + " row", r.row, 4000);
    groups("report", r.groups || []);
    const tpl = `classicReportTemplate ${r.id} (
    name: ${r.name}
    templateClass: custom1
    type: namedColumn${r.preset && r.preset.length ? `
    templateOptions {
${list("preset", r.preset, 8)}
    }` : ""}
    reportTemplate {
        top: ${top}
        bottom: ${bottom}
    }
    rowTemplate1 {
${block("template", "html", r.row, 8)}
    }
${pagination}
    comments {
        comments: ${r.name} (Website Studio). ${r.help} Columns (all optional): ${r.cols.join(", ")}.
    }
${options(r, "report")})
`;
    fs.writeFileSync(THEME + "classic-report-templates/" + r.id + ".apx", tpl);
}

// ---------- option groups ----------
const groupsApx = groupDefs.map((g, i) => `templateOptionGroup ${g.id} (
    templateType: ${g.type}
    name: ${g.name}
    sequence: ${g.seq || (i + 1) * 10}${g.nul ? `
    settings {
        nullText: ${g.nul}
    }` : ""}${g.help ? `
    help {
        helpText: ${g.help}
    }` : ""}
)
`).join("\n");
fs.writeFileSync(THEME + "template-option-groups.apx", groupsApx);

// ---------- static-files.apx: every file under static-files ----------
const TYPES = { ".css": "text/css", ".js": "text/javascript", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml" };
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const files = walk(FILES).map(f => path.relative(FILES, f).split(path.sep).join("/")).sort();
fs.writeFileSync(ROOT + "shared-components/static-files.apx", files.map(f => `file "${f}" (\n    mimeType: ${TYPES[path.extname(f)] || "application/octet-stream"}\n)\n`).join("\n"));

console.log(LIMITS.join("\n"));
console.log(`built: 1 page template, 1 region template, ${REPORTS.length} report templates, ${groupDefs.length} option groups, ${files.length} static files`);
