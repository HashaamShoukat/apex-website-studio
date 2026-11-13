// Renders the website pages (the demo, page 10, and the starter websites) the way APEX does, from the real .apx files: the Modern One Page page template,
// the Modern Section region template, Universal Theme's Blank with Attributes, the Website report templates and the page's
// regions, items, buttons and the Website - Menu list. Report rows come from _src/sites.mjs - the rows the page's SQL queries return.
// The page loads the real Universal Theme 26.1 files from /i/ (an extracted apex_26.1 images folder).
import fs from "node:fs";
import { parseApx } from "./apx.mjs";
import { SITES } from "../apexlang/_src/sites.mjs";
import { pageFile } from "../apexlang/_src/pages.mjs";
import { PAGE } from "../apexlang/_src/options.mjs";

const A = new URL("../apexlang/", import.meta.url).pathname;
const UT = (process.env.UT_APEXLANG || "/home/user/tools/mmd/261/apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme").replace(/\/?$/, "/");
const read = f => parseApx(fs.readFileSync(f, "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const arr = v => v == null ? [] : [].concat(v);

let ROWS = {}, PAGE_ID = "10";
const rowsOf = site => Object.fromEntries([...site.sections.filter(s => s.rows).map(s => [s.id, s.rows]), ["contact-details", site.contact], ["social", site.social],
    ...site.footerCols.map(c => [c.id, c.rows]), ["legal", site.legal]]);
export const siteFile = site => site.alias === "WEBSITE" ? "site.html" : site.alias.toLowerCase() + ".html";

function templates() {
    const pageTpl = read(A + "shared-components/themes/universal-theme/page-templates/modern-one-page.apx")[0];
    const regionTpls = { "@modern-section": read(A + "shared-components/themes/universal-theme/region-templates/modern-section.apx")[0],
                         "@/blank-with-attributes": read(UT + "region-templates/blank-with-attributes.apx")[0] };
    const reports = {};
    for (const f of fs.readdirSync(A + "shared-components/themes/universal-theme/classic-report-templates")) {
        const t = read(A + "shared-components/themes/universal-theme/classic-report-templates/" + f)[0];
        reports["@" + t.id] = t;
    }
    const menuTpl = read(A + "shared-components/themes/universal-theme/list-templates/website-menu.apx")[0];
    return { pageTpl, regionTpls, reports, menuTpl };
}
const TEXT = { "APEX.TEMPLATE.MAIN_NAV_LABEL": "Main Navigation", APEX_PAGE_NOSCRIPT: "You must run this web page in a JavaScript-enabled browser.", UI_PAGE_SKIP_TO_CONTENT: "Skip to Main Content" };
const appSubst = s => s.replace(/&"?APP_TEXT\$([\w.]+?)"?(!\w+)?\./g, (m, k) => TEXT[k] || k).replace(/&APP_PAGE_ID(!\w+)?\./g, () => PAGE_ID).replace(/&WHATSAPP_NUMBER(!\w+)?\./g, "966500000000").replace(/#APP_FILES#/g, "/static/").replace(/&APP_ALIAS(!\w+)?\./g, "WEBSITE-STUDIO")
    .replace(/&BROWSER_LANGUAGE(!\w+)?\./g, "en").replace(/&APP_ID(!\w+)?\./g, "100").replace(/&APP_SESSION(!\w+)?\./g, "1").replace(/#APEX_CSP_NONCE_ATTRIBUTE#/g, "");
const optsOf = (v, defaults = []) => arr(v).flatMap(o => o === "#DEFAULT#" ? defaults : [o]);

function report(region, reports) {
    const t = reports[region.props["componentAppearance.template"]];
    if (!t) { throw new Error("no report template " + region.props["componentAppearance.template"]); }
    const rows = ROWS[region.props["advanced.htmlDomId"] || region.id] || [];
    const cls = optsOf(region.props["componentAppearance.templateOptions"]).join(" ");
    const fill = s => s.replace(/#COMPONENT_CSS_CLASSES#/g, cls).replace(/#DOM_ID#/g, region.props["advanced.htmlDomId"] || region.id).replace(/#REPORT_ATTRIBUTES#/g, "");
    const row = t.props["rowTemplate1.template"];
    // APEX replaces #COLUMN# with the escaped value of that column; columns the query does not return stay as they are
    const body = rows.map(r => row.replace(/#([A-Z0-9_]+)#/g, (m, c) => (c in r ? esc(r[c] ?? "") : m))).join("\n");
    // APEX puts every Classic Report inside a "catch" div
    return `<div id="report_${region.id}_catch">` + fill(t.props["reportTemplate.top"]) + "\n" + body + "\n" + fill(t.props["reportTemplate.bottom"]) + "</div>";
}
// a static or SQL list with the Website - Menu template (the harness renders the entries of sites.mjs)
function menuHtml(region, tpl, site) {
    const p = tpl.props, cls = optsOf(region.props["componentAppearance.templateOptions"]).join(" ");
    const one = (e, sub) => {
        const kind = (e.c && e.c.length ? "noncurrentWithSublist" : "noncurrent");
        const t = p[(sub ? "sublistEntry." : "entry.") + kind]
            .replace(/#LINK#/g, esc(typeof e.h === "number" ? "f?p=100:" + e.h : e.h)).replace(/#TEXT_ESC_SC#/g, esc(e.l)).replace(/#A01#/g, "").replace(/#A02#/g, e.ext ? "_blank" : "")
            .replace(/#LINK_ATTR#/g, e.ext ? 'rel="noopener"' : "");
        return t + (e.c && e.c.length ? p["sublist.beforeEntries"] + e.c.map(c => one(c, true)).join("") + p["sublist.afterEntries"] : "");
    };
    return p["list.beforeEntries"].replace(/#COMPONENT_CSS_CLASSES#/g, cls) + site.menu.entries.map(e => one(e, false)).join("") + p["list.afterEntries"];
}
function itemHtml(it) {
    const p = it.props, id = it.id, req = /required/.test(p["appearance.template"] || "");
    const type = p.type === "textarea" ? "textarea" : "text";
    const ca = p["advanced.customAttributes"] || "";
    const input = type === "textarea" ? `<textarea id="${id}" name="${id}" rows="5" class="textarea apex-item-textarea" ${req ? "required" : ""}></textarea>`
        : `<input type="${p["settings.subtype"] === "email" ? "email" : "text"}" id="${id}" name="${id}" class="text_field apex-item-text" size="30" ${req ? "required" : ""} ${ca}>`;
    return `<div class="t-Form-fieldContainer t-Form-fieldContainer--floatingLabel ${req ? "is-required " : ""}apex-item-wrapper apex-item-wrapper--${type === "textarea" ? "textarea" : "text-field"}" id="${id}_CONTAINER"><div class="t-Form-labelContainer"><label for="${id}" id="${id}_LABEL" class="t-Form-label">${esc(p["label.label"])}</label></div><div class="t-Form-inputContainer"><div class="t-Form-itemWrapper">${input}</div><span id="${id}_error_placeholder" class="a-Form-error"></span></div></div>`;
}
const buttonHtml = b => `<button class="t-Button${b.props["appearance.hot"] === "true" ? " t-Button--hot" : ""}" type="button" id="B_${b.id}"${b.props["behavior.targetUrl"] ? ` onclick="location.href='${b.props["behavior.targetUrl"]}'"` : ""}><span class="t-Button-label">${esc(b.props.label)}</span></button>`;
// the page template's grid: one row per item unless "startNewRow: false"
function grid(cells, layout) {
    const rows = [];
    cells.forEach(c => { if (!rows.length || c.newRow) { rows.push([]); } rows[rows.length - 1].push(c); });
    return layout.containerTemplate.replace("#ROWS#", rows.map(r => layout.rowTemplate.replace("#CSS_CLASSES#", "").replace("#COLUMNS#",
        r.map(c => layout.columnTemplate.replace("#COLUMN_SPAN_NUMBER#", c.span || 12).replace(/#CSS_CLASSES#/g, c.cls || "").replace(/#FIRST_LAST_COLUMN_ATTRIBUTES#|#ATTRIBUTES#/g, "").replace("#CONTENT#", c.html)).join(""))).join("\n"));
}

export function renderSite({ site = SITES[0], pageClasses } = {}) {
    const { pageTpl, regionTpls, reports, menuTpl } = templates();
    const [page] = read(A + pageFile(site));
    ROWS = rowsOf(site); PAGE_ID = String(site.page);
    const regions = page.children.filter(c => c.type === "region"), items = page.children.filter(c => c.type === "pageItem"), buttons = page.children.filter(c => c.type === "button");
    const pp = pageTpl.props;
    const layout = { containerTemplate: pp["layout.containerTemplate"], rowTemplate: pp["layout.rowTemplate"], columnTemplate: pp["layout.columnTemplate"] };
    const seqSort = (a, b) => (+a.props["layout.sequence"] || 0) - (+b.props["layout.sequence"] || 0);
    const kids = (parent, slot) => regions.filter(r => (r.props["layout.parentRegion"] || null) === (parent ? "@" + parent : null) && r.props["layout.slot"] === slot).sort(seqSort);
    function regionHtml(r) {
        const p = r.props, tpl = regionTpls[p["appearance.template"]];
        if (!tpl) { throw new Error("no region template " + p["appearance.template"]); }
        const id = p["advanced.htmlDomId"] || r.id;
        let content = p.type === "classicReport" ? report(r, reports) : p.type === "list" ? menuHtml(r, menuTpl, site) : (p["source.htmlCode"] || "");
        const myItems = items.filter(i => i.props["layout.region"] === "@" + r.id).sort(seqSort).map(i => ({ html: itemHtml(i), span: i.props["layout.columnSpan"], newRow: i.props["layout.startNewRow"] !== "false", seq: +i.props["layout.sequence"], cls: i.props["layout.columnCssClasses"] }));
        const myButtons = buttons.filter(b => b.props["layout.region"] === "@" + r.id && b.props["layout.slot"] === "regionBody").map(b => ({ html: buttonHtml(b), span: 12, newRow: true, seq: +b.props["layout.sequence"] }));
        const cells = myItems.concat(myButtons).sort((a, b) => a.seq - b.seq);
        if (cells.length) { content += grid(cells, layout); }
        const body = (p["headerAndFooter.headerText"] || "") + content;
        const classes = [...optsOf(p["appearance.templateOptions"]), p["appearance.cssClasses"] || ""].join(" ").trim();
        return tpl.props["region.template"]
            .replace(/#REGION_CSS_CLASSES#/g, classes).replace(/#DOM_ID#/g, id).replace(/#REGION_ATTRIBUTES#/g, p["advanced.customAttributes"] || "")
            .replace(/#REGION_LANDMARK_ATTRIBUTES#/g, tpl.props["accessibility.landmarkType"] ? `aria-labelledby="${id}_heading"` : "")
            .replace(/#TITLE#/g, esc(p.title || p.name)).replace("#BODY#", body).replace("#SUB_REGIONS#", kids(r.id, "subRegions").map(regionHtml).join("\n"))
            .replace(/#PREVIOUS#|#NEXT#|#EDIT#|#CHANGE#|#COPY#|#CLOSE#|#HELP#/g, "");
    }
    const slot = name => kids(null, name).map(regionHtml).join("\n");
    const bodySlot = grid(kids(null, "body").map(r => ({ html: regionHtml(r), span: 12, newRow: true })), layout);
    const classes = pageClasses ?? optsOf(page.props["appearance.templateOptions"], PAGE.defaults);
    const css = ["/i/app_ui/css/Core.min.css", "/i/libraries/font-apex/latest/css/font-apex.min.css", "/i/themes/theme_42/26.1/css/Core.min.css",
        "/i/libraries/oracle-fonts/oraclesans-apex.min.css", "/i/themes/theme_42/26.1/css/Redwood.min.css", "/i/themes/theme_42/26.1/css/Redwood-Theme.min.css"];
    const link = h => `<link rel="stylesheet" href="${h}" type="text/css">`;
    const sub = s => appSubst(s)
        .replace("#APEX_CSS#", css.slice(0, 3).map(link).join("\n")).replace("#THEME_CSS#", "")
        .replace("#TEMPLATE_CSS#", link("/static/website-studio/website.css")).replace("#THEME_STYLE_CSS#", css.slice(3).map(link).join("\n"))
        .replace("#HEAD#", () => appSubst(page.props["htmlHeader.htmlHeader"] || ""))
        .replace(/#APPLICATION_CSS#|#PAGE_CSS#|#FAVICONS#|#ONLOAD#|#RTL_CLASS#|#TEXT_DIRECTION#/g, "")
        .replace("#TITLE#", esc(page.props.title)).replace("#PAGE_CSS_CLASSES#", classes.join(" "))
        .replace("#FORM_OPEN#", '<form action="#" method="post" name="wwv_flow" id="wwvFlowForm" novalidate><input type="hidden" name="p_flow_id" value="100" id="pFlowId"><input type="hidden" name="p_flow_step_id" value="' + PAGE_ID + '" id="pFlowStepId"><input type="hidden" name="p_instance" value="1" id="pInstance">')
        .replace("#FORM_CLOSE#", "</form>").replace("#HOME_LINK#", "#").replace("#LOGO#", '<span class="apex-logo-text">Website Studio</span>')
        .replace("#REGION_POSITION_07#", slot("logo")).replace("#REGION_POSITION_08#", slot("menu")).replace("#AFTER_NAVIGATION_BAR#", buttons.filter(b => b.props["layout.slot"] === "headerButtons").map(buttonHtml).join(""))
        .replace("#REGION_POSITION_01#", slot("hero")).replace("#REGION_POSITION_02#", slot("announcement")).replace("#BODY#", bodySlot).replace("#REGION_POSITION_05#", slot("footer")).replace("#REGION_POSITION_06#", slot("footerBottom"))
        .replace(/#SUCCESS_MESSAGE#|#NOTIFICATION_MESSAGE#|#GLOBAL_NOTIFICATION#|#REGION_POSITION_04#|#DEVELOPER_TOOLBAR#|#GENERATED_CSS#|#APPLICATION_JAVASCRIPT#|#PAGE_JAVASCRIPT#/g, "")
        .replace("#APEX_JAVASCRIPT#", `<script>var apex_img_dir = "/i/", htmldb_Img_Dir = apex_img_dir;var apex = { env: { APP_ID: "100", APP_PAGE_ID: "${PAGE_ID}", APP_SESSION: "1", APP_USER: "nobody", APEX_FILES: "/i/", APEX_VERSION: "26.1.0" } };</script>
<script src="/i/libraries/apex/minified/desktop_all.min.js"></script>`)
        .replace("#THEME_JAVASCRIPT#", `<script src="/i/libraries/apex/minified/widget.stickyWidget.min.js"></script>\n<script src="/i/themes/theme_42/26.1/js/theme42.min.js"></script>`)
        .replace("#TEMPLATE_JAVASCRIPT#", `<script src="/static/website-studio/website.js"></script>`)
        .replace("#GENERATED_JAVASCRIPT#", `<script>
apex.jQuery( function() {
  apex.page.init( this, function() {
    try {
${pp["javaScript.executeWhenPageLoads"]}
    } catch ( e ) { apex.debug.error( e ); }
  } );
} );
</script>`);
    return sub(pp["page.header"]) + "\n" + sub(pp["page.body"]) + "\n" + sub(pp["page.footer"]);
}

if (import.meta.url === "file://" + process.argv[1]) {
    for (const site of SITES) { fs.writeFileSync(new URL("www/" + siteFile(site), import.meta.url), renderSite({ site })); }
    console.log("qa/www: " + SITES.map(siteFile).join(", ") + " written");
}
