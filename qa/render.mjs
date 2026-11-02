// Renders the demo website (page 10) the way APEX does, from the real .apx files: the Modern One Page page template,
// the Modern Section region template, Universal Theme's Blank with Attributes, the Website report templates and the page's
// regions, items and buttons. Report rows come from _src/demo.mjs - the same rows the page's SQL queries return.
// The page loads the real Universal Theme 26.1 files from /i/ (an extracted apex_26.1 images folder).
import fs from "node:fs";
import { parseApx } from "./apx.mjs";
import { SECTIONS, CONTACT, SOCIAL, FOOTER_COLS, LEGAL } from "../apexlang/_src/demo.mjs";
import { PAGE } from "../apexlang/_src/options.mjs";

const A = new URL("../apexlang/", import.meta.url).pathname;
const UT = (process.env.UT_APEXLANG || "/home/user/tools/mmd/261/apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme").replace(/\/?$/, "/");
const read = f => parseApx(fs.readFileSync(f, "utf8"));
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
const arr = v => v == null ? [] : [].concat(v);

const ROWS = Object.fromEntries([...SECTIONS.filter(s => s.rows).map(s => [s.id, s.rows]), ["contact-details", CONTACT], ["social", SOCIAL],
    ...FOOTER_COLS.map(c => [c.id, c.rows]), ["legal", LEGAL]]);

function templates() {
    const pageTpl = read(A + "shared-components/themes/universal-theme/page-templates/modern-one-page.apx")[0];
    const regionTpls = { "@modern-section": read(A + "shared-components/themes/universal-theme/region-templates/modern-section.apx")[0],
                         "@/blank-with-attributes": read(UT + "region-templates/blank-with-attributes.apx")[0] };
    const reports = {};
    for (const f of fs.readdirSync(A + "shared-components/themes/universal-theme/classic-report-templates")) {
        const t = read(A + "shared-components/themes/universal-theme/classic-report-templates/" + f)[0];
        reports["@" + t.id] = t;
    }
    return { pageTpl, regionTpls, reports };
}
const TEXT = { "APEX.TEMPLATE.MAIN_NAV_LABEL": "Main Navigation", APEX_PAGE_NOSCRIPT: "You must run this web page in a JavaScript-enabled browser.", UI_PAGE_SKIP_TO_CONTENT: "Skip to Main Content" };
const appSubst = s => s.replace(/&"?APP_TEXT\$([\w.]+?)"?(!\w+)?\./g, (m, k) => TEXT[k] || k).replace(/&APP_PAGE_ID(!\w+)?\./g, "10").replace(/&APP_ALIAS(!\w+)?\./g, "WEBSITE-STUDIO")
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
function itemHtml(it) {
    const p = it.props, id = it.id, req = /required/.test(p["appearance.template"] || "");
    const type = p.type === "textarea" ? "textarea" : "text";
    const input = type === "textarea" ? `<textarea id="${id}" name="${id}" rows="5" class="textarea apex-item-textarea" ${req ? "required" : ""}></textarea>`
        : `<input type="${p["settings.subtype"] === "email" ? "email" : "text"}" id="${id}" name="${id}" class="text_field apex-item-text" size="30" ${req ? "required" : ""}>`;
    return `<div class="t-Form-fieldContainer t-Form-fieldContainer--floatingLabel ${req ? "is-required " : ""}apex-item-wrapper apex-item-wrapper--${type === "textarea" ? "textarea" : "text-field"}" id="${id}_CONTAINER"><div class="t-Form-labelContainer"><label for="${id}" id="${id}_LABEL" class="t-Form-label">${esc(p["label.label"])}</label></div><div class="t-Form-inputContainer"><div class="t-Form-itemWrapper">${input}</div><span id="${id}_error_placeholder" class="a-Form-error"></span></div></div>`;
}
const buttonHtml = b => `<button class="t-Button${b.props["appearance.hot"] === "true" ? " t-Button--hot" : ""}" type="button" id="B_${b.id}"${b.props["behavior.targetUrl"] ? ` onclick="location.href='${b.props["behavior.targetUrl"]}'"` : ""}><span class="t-Button-label">${esc(b.props.label)}</span></button>`;
// the page template's grid: one row per item unless "startNewRow: false"
function grid(cells, layout) {
    const rows = [];
    cells.forEach(c => { if (!rows.length || c.newRow) { rows.push([]); } rows[rows.length - 1].push(c); });
    return layout.containerTemplate.replace("#ROWS#", rows.map(r => layout.rowTemplate.replace("#CSS_CLASSES#", "").replace("#COLUMNS#",
        r.map(c => layout.columnTemplate.replace("#COLUMN_SPAN_NUMBER#", c.span || 12).replace(/#CSS_CLASSES#|#FIRST_LAST_COLUMN_ATTRIBUTES#|#ATTRIBUTES#/g, "").replace("#CONTENT#", c.html)).join(""))).join("\n"));
}

export function renderSite({ pageClasses } = {}) {
    const { pageTpl, regionTpls, reports } = templates();
    const [page] = read(A + "pages/p00010-website.apx");
    const regions = page.children.filter(c => c.type === "region"), items = page.children.filter(c => c.type === "pageItem"), buttons = page.children.filter(c => c.type === "button");
    const pp = pageTpl.props;
    const layout = { containerTemplate: pp["layout.containerTemplate"], rowTemplate: pp["layout.rowTemplate"], columnTemplate: pp["layout.columnTemplate"] };
    const seqSort = (a, b) => (+a.props["layout.sequence"] || 0) - (+b.props["layout.sequence"] || 0);
    const kids = (parent, slot) => regions.filter(r => (r.props["layout.parentRegion"] || null) === (parent ? "@" + parent : null) && r.props["layout.slot"] === slot).sort(seqSort);
    function regionHtml(r) {
        const p = r.props, tpl = regionTpls[p["appearance.template"]];
        if (!tpl) { throw new Error("no region template " + p["appearance.template"]); }
        const id = p["advanced.htmlDomId"] || r.id;
        let content = p.type === "classicReport" ? report(r, reports) : (p["source.htmlCode"] || "");
        const myItems = items.filter(i => i.props["layout.region"] === "@" + r.id).sort(seqSort).map(i => ({ html: itemHtml(i), span: i.props["layout.columnSpan"], newRow: i.props["layout.startNewRow"] !== "false", seq: +i.props["layout.sequence"] }));
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
        .replace(/#APPLICATION_CSS#|#PAGE_CSS#|#FAVICONS#|#HEAD#|#ONLOAD#|#RTL_CLASS#|#TEXT_DIRECTION#/g, "")
        .replace("#TITLE#", esc(page.props.title)).replace("#PAGE_CSS_CLASSES#", classes.join(" "))
        .replace("#FORM_OPEN#", '<form action="#" method="post" name="wwv_flow" id="wwvFlowForm" novalidate><input type="hidden" name="p_flow_id" value="100" id="pFlowId"><input type="hidden" name="p_flow_step_id" value="10" id="pFlowStepId"><input type="hidden" name="p_instance" value="1" id="pInstance">')
        .replace("#FORM_CLOSE#", "</form>").replace("#HOME_LINK#", "#").replace("#LOGO#", '<span class="apex-logo-text">Website Studio</span>')
        .replace("#REGION_POSITION_07#", slot("logo")).replace("#AFTER_NAVIGATION_BAR#", buttons.filter(b => b.props["layout.slot"] === "headerButtons").map(buttonHtml).join(""))
        .replace("#REGION_POSITION_01#", slot("hero")).replace("#BODY#", bodySlot).replace("#REGION_POSITION_05#", slot("footer")).replace("#REGION_POSITION_06#", slot("footerBottom"))
        .replace(/#SUCCESS_MESSAGE#|#NOTIFICATION_MESSAGE#|#GLOBAL_NOTIFICATION#|#REGION_POSITION_04#|#DEVELOPER_TOOLBAR#|#GENERATED_CSS#|#APPLICATION_JAVASCRIPT#|#PAGE_JAVASCRIPT#/g, "")
        .replace("#APEX_JAVASCRIPT#", `<script>var apex_img_dir = "/i/", htmldb_Img_Dir = apex_img_dir;var apex = { env: { APP_ID: "100", APP_PAGE_ID: "10", APP_SESSION: "1", APP_USER: "nobody", APEX_FILES: "/i/", APEX_VERSION: "26.1.0" } };</script>
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
    fs.writeFileSync(new URL("www/site.html", import.meta.url), renderSite());
    console.log("qa/www/site.html written");
}
