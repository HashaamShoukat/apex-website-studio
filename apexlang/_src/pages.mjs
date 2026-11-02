// Writes the website pages - the demo (page 10, alias WEBSITE) and the starter websites (pages 11 to 17) - and
// shared-components/lists.apx (the studio's navigation lists and one Website - Menu list per website): node _src/pages.mjs
// Every section is a region with the Modern Section template; lists of things are Classic Reports with a Website report
// template; the header menu is a List region with the Website - Menu template in the Menu slot.
import fs from "node:fs";
import { sql, columnsOf } from "./demo.mjs";
import { SITES } from "./sites.mjs";
import { REPORTS } from "./options.mjs";
import { photoFile } from "./photos.mjs";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");
const fence = (key, v, n, lang = "") => `${" ".repeat(n)}${key}:\n${" ".repeat(n + 4)}\`\`\`${lang}\n${ind(String(v), n + 4)}\n${" ".repeat(n + 4)}\`\`\``;
const val = (key, v, n) => String(v).includes("\n") ? fence(key, v, n) : `${" ".repeat(n)}${key}: ${v}`;
const opts = (arr, n) => !arr.length ? `${" ".repeat(n)}templateOptions: #DEFAULT#` : `${" ".repeat(n)}templateOptions: [\n${arr.map(a => " ".repeat(n + 4) + a).join("\n")}\n${" ".repeat(n)}]`;
const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
export const DEMO_PAGE = 10;
export const pageFile = s => `pages/p${String(s.page).padStart(5, "0")}-${s.alias.toLowerCase()}.apx`;
export const menuListId = s => s.key + "-menu";
export const siteTheme = s => ["#DEFAULT#", ...s.look.split(/\s+/).filter(Boolean)];

// a Classic Report region with a Website report template
export function reportRegion({ id, name, title, slot, seq, parent, rows, template, sec = [], css, header, reportOptions = [], menu, regionTemplate = "@modern-section" }) {
    const cols = columnsOf(rows);
    // the template's preset options are written out (a preset is ticked when a region is created, it is not part of #DEFAULT#)
    const preset = (REPORTS.find(r => r.id === template) || {}).preset || [];
    reportOptions = [...new Set(["#DEFAULT#", ...preset, ...reportOptions.filter(o => o !== "#DEFAULT#")])];
    return `    region ${id} (
        name: ${name}${title ? `\n        title: ${title}` : ""}
        type: classicReport
        source {
            location: localDatabase
            type: sqlQuery
${val("sqlQuery", sql(rows), 12)}
        }
        layout {
            sequence: ${seq}${parent ? `\n            parentRegion: @${parent}` : ""}
            slot: ${slot}
        }
        appearance {
            template: ${regionTemplate}
${opts(sec, 12)}${css ? `\n            cssClasses: ${css}` : ""}
        }
        advanced {
            htmlDomId: ${id}${menu ? `\n            customAttributes: data-menu="${attr(menu)}"` : ""}
        }${header ? `
        headerAndFooter {
            headerText: ${header}
        }` : ""}
        reportLayout {
            numberOfRowsType: staticValue
            numberOfRows: 100
        }
        componentAppearance {
            templateType: theme
            template: @${template}
${opts(reportOptions, 12)}
        }
        messages {
            whenNoDataFound: Nothing to show yet.
        }
${cols.map((c, i) => `
        column ${c} (
            layout {
                sequence: ${(i + 1) * 10}
            }${c === "SORT_ORDER" ? `
            sorting {
                defaultSequence: 1
            }` : ""}
        )`).join("\n")}
    )`;
}
export function staticRegion({ id, name, title, slot, seq, parent, html, template = "@modern-section", sec = [], css, header, menu }) {
    return `    region ${id} (
        name: ${name}${title ? `\n        title: ${title}` : ""}
        type: staticContent${html ? `
        source {
${val("htmlCode", html, 12)}
        }` : ""}
        layout {
            sequence: ${seq}${parent ? `\n            parentRegion: @${parent}` : ""}
            slot: ${slot}
        }
        appearance {
            template: ${template}
${opts(sec, 12)}${css ? `\n            cssClasses: ${css}` : ""}
        }
        advanced {
            htmlDomId: ${id}${menu ? `\n            customAttributes: data-menu="${attr(menu)}"` : ""}
        }${header ? `
        headerAndFooter {
            headerText: ${header}
        }` : ""}
    )`;
}
// the header menu: a List region with the Website - Menu list template in the Menu slot
export const menuRegion = (s) => `    region site-menu (
        name: Menu
        type: list
        source {
            list: @${menuListId(s)}
        }
        layout {
            sequence: 10
            slot: menu
        }
        appearance {
            template: @/blank-with-attributes
            templateOptions: #DEFAULT#
        }
        advanced {
            htmlDomId: site-menu
        }
        componentAppearance {
            listTemplate: @website-menu
${opts(["#DEFAULT#", ...s.menu.options], 12)}
        }
    )`;
const item = (page, f, seq) => `    pageItem P${page}_${f.n} (
        type: ${f.t}
        label {
            label: ${f.l}
            alignment: left
        }${f.email ? `
        settings {
            subtype: email
        }` : ""}
        layout {
            sequence: ${seq}
            region: @contact
            slot: regionBody${f.newRow === false ? "\n            startNewRow: false" : ""}
            columnSpan: ${f.span}
        }
        appearance {
            template: ${f.req ? "@/required-floating" : "@/optional-floating"}
            templateOptions: #DEFAULT#
        }${f.req ? `
        validation {
            valueRequired: true
        }` : ""}
        sessionState {
            storage: request
        }
    )`;
// a field people do not see; spam robots fill it in, and the process then sends nothing
const honeypot = (page, seq) => `    pageItem P${page}_WEBSITE (
        type: textField
        label {
            label: Leave this field empty
            alignment: left
        }
        layout {
            sequence: ${seq}
            region: @contact
            slot: regionBody
            columnSpan: 12
            columnCssClasses: ws-Honeypot
        }
        appearance {
            template: @/optional-floating
            templateOptions: #DEFAULT#
        }
        advanced {
            customAttributes: tabindex="-1" autocomplete="off"
        }
        sessionState {
            storage: request
        }
    )`;

// meta description, Open Graph and the first hero photo preloaded; Arabic pages switch the document to right to left
function htmlHeader(s) {
    const hero = (s.sections.find(x => x.id === "hero") || { rows: [] }).rows[0] || {};
    const og = photoFile(s.ogImage);
    return [
        s.rtl ? `<script>document.documentElement.setAttribute("dir","rtl");document.documentElement.setAttribute("lang","${s.lang}");document.addEventListener("DOMContentLoaded",function(){document.body.setAttribute("dir","rtl");});</script>` : "",
        `<meta name="description" content="${attr(s.description)}">`,
        `<meta property="og:type" content="website">`,
        `<meta property="og:title" content="${attr(s.title)}">`,
        `<meta property="og:description" content="${attr(s.description)}">`,
        `<meta property="og:image" content="#APP_FILES#${og}">`,
        `<meta name="twitter:card" content="summary_large_image">`,
        hero.IMAGE_FILE ? `<link rel="preload" as="image" href="#APP_FILES#${hero.IMAGE_FILE}" fetchpriority="high">` : ""
    ].filter(Boolean).join("\n");
}

export function sitePage(s) {
    const P = s.page, parts = [];
    let seq = 10;
    for (const x of s.sections) {
        const name = x.menu || x.title.replace(/\*/g, "");
        const common = { id: x.id, name, title: x.title, slot: x.slot || "body", seq: (seq += 10), sec: x.sec, css: x.css, header: x.header, menu: x.menu };
        if (x.report) { parts.push(reportRegion({ ...common, rows: x.rows, template: x.report, reportOptions: x.rep || [] })); }
        else if (x.html) { parts.push(staticRegion({ ...common, html: s.html[x.html] })); }
        else if (x.form) {
            parts.push(staticRegion({ ...common, html: "" }));
            parts.push(reportRegion({ id: "contact-details", name: "Contact Details", slot: "subRegions", seq: 10, parent: "contact", rows: s.contact, template: "ws-contact", regionTemplate: "@/blank-with-attributes" }));
        }
    }
    parts.push(menuRegion(s));
    parts.push(staticRegion({ id: "logo", name: "Logo", slot: "logo", seq: 10, html: s.html.logo, template: "@/blank-with-attributes" }));
    parts.push(staticRegion({ id: "footer-about", name: "Footer - About", slot: "footer", seq: 10, html: s.html.footerAbout, template: "@/blank-with-attributes" }));
    parts.push(reportRegion({ id: "social", name: "Social Media", slot: "subRegions", seq: 10, parent: "footer-about", rows: s.social, template: "ws-links", regionTemplate: "@/blank-with-attributes" }));
    s.footerCols.forEach((c, i) => parts.push(reportRegion({ id: c.id, name: "Footer - " + c.title, slot: "footer", seq: 20 + i * 10, rows: c.rows, template: "ws-links",
        reportOptions: ["ws-Links--list"], regionTemplate: "@/blank-with-attributes", header: `<h3>${c.title}</h3>` })));
    parts.push(staticRegion({ id: "copyright", name: "Copyright", slot: "footerBottom", seq: 10, html: s.html.copyright, template: "@/blank-with-attributes" }));
    if (s.legal.length) { parts.push(reportRegion({ id: "legal", name: "Legal Links", slot: "footerBottom", seq: 20, rows: s.legal, template: "ws-links", reportOptions: ["ws-Links--inline"], regionTemplate: "@/blank-with-attributes" })); }

    const fields = s.form.fields.map((f, i) => ({ ...f, newRow: i === 0 || f.span === 12 || (s.form.fields[i - 1] || {}).span === 12 ? true : false }));
    const items = fields.map((f, i) => item(P, f, (i + 1) * 10)).concat(honeypot(P, fields.length * 10 + 10));
    const names = fields.map(f => f.n);
    const v = n => names.includes(n) ? `:P${P}_${n}` : "null";
    return `page ${P} (
    name: ${s.name}
    alias: ${s.alias}
    title: ${s.title}
    appearance {
        pageTemplate: @modern-one-page
${opts(siteTheme(s), 8)}
    }
    navigation {
        cursorFocus: doNotFocusCursor
    }
    htmlHeader {
${fence("htmlHeader", htmlHeader(s), 8, "html")}
    }
    security {
        authentication: public
        pageAccessProtection: argumentsMustHaveChecksum
        formAutoComplete: false
    }

${parts.join("\n\n")}

${items.join("\n\n")}

    button send (
        buttonName: SEND
        label: ${s.form.button}
        layout {
            sequence: ${fields.length * 10 + 20}
            region: @contact
            slot: regionBody
        }
        appearance {
            buttonTemplate: @/text
            hot: true
            templateOptions: #DEFAULT#
        }
        behavior {
            action: submitPage
        }
    )

    process send-message (
        name: Send Message
        type: executeCode
        source {
            location: localDatabase
            language: plsql
            plsqlCode:
                \`\`\`
                -- P${P}_WEBSITE is a hidden honeypot field: people leave it empty, spam robots fill it in.
                if :P${P}_WEBSITE is null then
                    -- The starter only says thank you. To receive the message by email, use for example:
                    -- apex_mail.send(p_to   => 'hello@example.com',
                    --                p_from => 'noreply@example.com',
                    --                p_subj => 'Website message from ' || ${v("NAME")},
                    --                p_body => ${v("MESSAGE")} || chr(10) || chr(10) || ${v("NAME")} || ', ' || ${v("EMAIL")} || ', ' || ${names.includes("PHONE") ? v("PHONE") : v("COMPANY")});
                    -- apex_mail.push_queue;
                    null;
                end if;
                \`\`\`
        }
        execution {
            sequence: 10
            point: processing
        }
        successMessage {
            successMessage: ${s.form.success}
        }
        serverSideCondition {
            whenButtonPressed: @send
        }
    )

    branch back-to-website (
        name: Back to the Website
        execution {
            sequence: 10
            point: afterProcessing
        }
        behavior {
            type: pageOrUrl
            target: {
                page: ${P}
            }
        }
    )

)
`;
}

// ---------- shared-components/lists.apx ----------
const slug = (l, used) => { let b = l.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").replace(/^(\d)/, "e-$1") || "entry", s = b, i = 2; while (used.has(s)) { s = b + "-" + i++; } used.add(s); return s; };
const target = e => typeof e.h === "number" ? `{\n                page: ${e.h}\n            }` : `{\n                type: url\n                url: ${e.h}\n            }`;
function entry(e, seq, parent, used) {
    const id = slug(e.l, used);
    return [`    entry ${id} (
        label: ${e.l}${e.icon ? `
        icon {
            imageIconCssClasses: ${e.icon}
        }` : ""}
        layout {
            sequence: ${seq}${parent ? `\n            parentEntry: @${parent}` : ""}
        }
        link {
            target: ${target(e)}${e.ext ? `
            linkAttributes: rel="noopener"` : ""}
        }${e.ext ? `
        userDefinedAttributes {
            2: _blank
        }` : ""}
    )`, ...(e.c || []).flatMap((c, i) => entry(c, (i + 1) * 10, id, used))];
}
const staticList = (id, name, entries) => { const used = new Set(); return `list ${id} (
    name: ${name}

${entries.flatMap((e, i) => entry(e, (i + 1) * 10, null, used)).join("\n\n")}

)`; };
// a SQL list: the rows of a query with connect by (in your app: select from your own menu table)
const q = v => v == null ? "null" : "'" + String(v).replace(/'/g, "''") + "'";
function sqlList(id, name, entries) {
    const rows = [];
    let n = 0;
    entries.forEach((e, i) => { const pid = ++n; rows.push([pid, null, e, (i + 1) * 10]); (e.c || []).forEach((c, j) => rows.push([++n, pid, c, (j + 1) * 10])); });
    const data = rows.map(([i, p, e, s]) => `select ${i} as id, ${p ?? "null"} as parent_id, ${q(e.l)} as label, ${q(e.h)} as target, ${q(e.ext ? "_blank" : null)} as link_target, ${s} as seq from dual`).join("\n    union all\n    ");
    return `list ${id} (
    name: ${name}
    source {
        type: sqlQuery
        sqlQuery:
            \`\`\`
${ind(`with menu_entries as (
    ${data}
)
select level,
       label,
       target,
       null as is_current,
       null as image,
       null as image_attribute,
       null as image_alt,
       null as attribute1,
       link_target as attribute2
  from menu_entries
 start with parent_id is null
connect by prior id = parent_id
 order siblings by seq`, 12)}
            \`\`\`
    }
)`;
}
const studioNav = staticList("navigation-menu", "Navigation Menu", [
    { l: "Gallery", h: 1, icon: "fa-th-large" }, { l: "Designer", h: 2, icon: "fa-paint-brush" }, { l: "How to Use", h: 3, icon: "fa-book" },
    { l: "Demo Website", h: DEMO_PAGE, icon: "fa-globe" },
    { l: "Starter Websites", h: SITES[1].page, icon: "fa-files-o", c: SITES.slice(1).map(s => ({ l: s.label, h: s.page, icon: s.icon })) }
]);
const navBar = staticList("navigation-bar", "Navigation Bar", [{ l: "GitHub", h: "https://github.com/HashaamShoukat/apex-website-studio", icon: "fa-github" }]);
const lists = [navBar, studioNav, ...SITES.map(s => (s.menu.sql ? sqlList : staticList)(menuListId(s), s.brand.replace(/&amp;/g, "&") + " - Menu", s.menu.entries))];

if (process.argv[1] && process.argv[1].endsWith("pages.mjs")) {
    for (const f of fs.readdirSync(ROOT + "pages")) {
        const n = +f.slice(1, 6);
        if (n >= DEMO_PAGE && n < 100) { fs.unlinkSync(ROOT + "pages/" + f); }
    }
    for (const s of SITES) {
        const page = sitePage(s);
        fs.writeFileSync(ROOT + pageFile(s), page);
        console.log(pageFile(s), s.sections.length, "sections,", (page.match(/^    region /gm) || []).length, "regions");
    }
    fs.writeFileSync(ROOT + "shared-components/lists.apx", lists.join("\n\n") + "\n");
    console.log("shared-components/lists.apx", lists.length, "lists");
}
