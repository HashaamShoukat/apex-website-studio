// Writes the demo website, page 10 (alias WEBSITE): node _src/pages.mjs
// Every section is a region with the Modern Section template; lists of things are Classic Reports with a Website report template.
import fs from "node:fs";
import { SECTIONS, CONTACT, SOCIAL, FOOTER_COLS, LEGAL, HTML, sql, columnsOf } from "./demo.mjs";
import { REPORTS } from "./options.mjs";
const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const ind = (s, n) => s.split("\n").map(l => (l ? " ".repeat(n) + l : l)).join("\n");
const val = (key, v, n) => String(v).includes("\n")
    ? `${" ".repeat(n)}${key}:\n${" ".repeat(n + 4)}\`\`\`\n${ind(String(v), n + 4)}\n${" ".repeat(n + 4)}\`\`\``
    : `${" ".repeat(n)}${key}: ${v}`;
const opts = (arr, n) => !arr.length ? `${" ".repeat(n)}templateOptions: #DEFAULT#` : `${" ".repeat(n)}templateOptions: [\n${arr.map(a => " ".repeat(n + 4) + a).join("\n")}\n${" ".repeat(n)}]`;
export const DEMO_PAGE = 10;
export const DEMO_THEME = ["#DEFAULT#", "ws-Accent--tangerine", "ws-Font--grotesk"];

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
            staticId: ${id}${menu ? `\n            customAttributes: data-menu="${menu}"` : ""}
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
        pagination {
            type: rowRangesXToYNoPagination
        }
        messages {
            whenNoDataFound: Nothing to show yet.
        }
${cols.map((c, i) => `
        column ${c} (
            layout {
                sequence: ${(i + 1) * 10}
            }
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
            staticId: ${id}${menu ? `\n            customAttributes: data-menu="${menu}"` : ""}
        }${header ? `
        headerAndFooter {
            headerText: ${header}
        }` : ""}
    )`;
}
const item = (name, type, label, seq, span, newRow, required, extra = "") => `    pageItem ${name} (
        type: ${type}
        label {
            label: ${label}
            alignment: left
        }${extra}
        layout {
            sequence: ${seq}
            region: @contact
            slot: regionBody${newRow ? "" : "\n            startNewRow: false"}
            columnSpan: ${span}
        }
        appearance {
            template: ${required ? "@/required-floating" : "@/optional-floating"}
            templateOptions: #DEFAULT#
        }${required ? `
        validation {
            valueRequired: true
        }` : ""}
        sessionState {
            storage: request
        }
    )`;

// ---------- page 10 ----------
const parts = [];
let seq = 10;
for (const s of SECTIONS) {
    const name = s.menu || s.title.replace(/\*/g, "");
    const common = { id: s.id, name, title: s.title, slot: s.slot || "body", seq: (seq += 10), sec: s.sec, css: s.css, header: s.header, menu: s.menu };
    if (s.report) { parts.push(reportRegion({ ...common, rows: s.rows, template: s.report, reportOptions: s.rep || [] })); }
    else if (s.html) { parts.push(staticRegion({ ...common, html: HTML[s.html] })); }
    else if (s.form) {
        parts.push(staticRegion({ ...common, html: "" }));
        parts.push(reportRegion({ id: "contact-details", name: "Contact Details", slot: "subRegions", seq: 10, parent: "contact", rows: CONTACT, template: "ws-contact", regionTemplate: "@/blank-with-attributes" }));
    }
}
parts.push(staticRegion({ id: "logo", name: "Logo", slot: "logo", seq: 10, html: HTML.logo, template: "@/blank-with-attributes" }));
parts.push(staticRegion({ id: "footer-about", name: "Footer - About", slot: "footer", seq: 10, html: HTML.footerAbout, template: "@/blank-with-attributes" }));
parts.push(reportRegion({ id: "social", name: "Social Media", slot: "subRegions", seq: 10, parent: "footer-about", rows: SOCIAL, template: "ws-links", regionTemplate: "@/blank-with-attributes" }));
FOOTER_COLS.forEach((c, i) => parts.push(reportRegion({ id: c.id, name: "Footer - " + c.title, slot: "footer", seq: 20 + i * 10, rows: c.rows, template: "ws-links",
    reportOptions: ["#DEFAULT#", "ws-Links--list"], regionTemplate: "@/blank-with-attributes", header: `<h3>${c.title}</h3>` })));
parts.push(staticRegion({ id: "copyright", name: "Copyright", slot: "footerBottom", seq: 10, html: HTML.copyright, template: "@/blank-with-attributes" }));
parts.push(reportRegion({ id: "legal", name: "Legal Links", slot: "footerBottom", seq: 20, rows: LEGAL, template: "ws-links", reportOptions: ["#DEFAULT#", "ws-Links--inline"], regionTemplate: "@/blank-with-attributes" }));

const page = `page ${DEMO_PAGE} (
    name: Demo Website
    alias: WEBSITE
    title: Halcyon - Brand and Digital Design Studio
    appearance {
        pageTemplate: @modern-one-page
${opts(DEMO_THEME, 8)}
    }
    navigation {
        cursorFocus: doNotFocusCursor
    }
    security {
        authentication: public
        pageAccessProtection: argumentsMustHaveChecksum
        formAutoComplete: false
    }

${parts.join("\n\n")}

${item("P10_NAME", "textField", "Name", 10, 6, true, true)}

${item("P10_EMAIL", "textField", "Email", 20, 6, false, true, `
        settings {
            subtype: email
        }`)}

${item("P10_COMPANY", "textField", "Company", 30, 12, true, false)}

${item("P10_MESSAGE", "textarea", "What are you working on?", 40, 12, true, true)}

    button start (
        buttonName: START
        label: Start a project
        layout {
            sequence: 10
            slot: headerButtons
        }
        appearance {
            buttonTemplate: @/text
            hot: true
            templateOptions: #DEFAULT#
        }
        behavior {
            action: redirectUrl
            targetUrl: #contact
        }
    )

    button send (
        buttonName: SEND
        label: Send message
        layout {
            sequence: 50
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
                -- The demo only says thank you. In your app, store or send the message, for example:
                -- apex_mail.send(p_to => 'hello@example.com', p_from => 'noreply@example.com',
                --                p_subj => 'Website enquiry from ' || :P10_NAME,
                --                p_body => :P10_MESSAGE || chr(10) || chr(10) || :P10_NAME || ' <' || :P10_EMAIL || '>, ' || :P10_COMPANY);
                null;
                \`\`\`
        }
        execution {
            sequence: 10
            point: processing
        }
        successMessage {
            successMessage: Thanks for your message. We will reply within two working days.
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
                page: ${DEMO_PAGE}
            }
        }
    )

)
`;
fs.writeFileSync(ROOT + "pages/p00010-demo-website.apx", page);
console.log("demo website written:", SECTIONS.length, "sections,", (page.match(/^    region /gm) || []).length, "regions");
