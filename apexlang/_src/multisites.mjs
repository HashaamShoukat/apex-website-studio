// The multi-page websites: the content of four starter websites spread over several pages that share one look, header,
// footer and Website - Menu list. Every page is written by pages.mjs like a one-page website (sitePage), so each page
// object below has the same shape as a site in sites.mjs.
// - The menu list links to pages (target: page), so APEX marks the entry of the current page.
// - Inner pages open with a Compact hero: a page title band with a photo.
// - "#section" links in rows and HTML point to the page that holds that section: page:ALIAS#section in report rows
//   (demo.mjs writes apex_page.get_url) and f?p=&APP_ID.:ALIAS:&APP_SESSION.#section in static HTML.
// - Only the contact page has the contact form.
import { meridian, lume, shifa, harbor, HERO, im } from "./sites.mjs";

const clone = o => JSON.parse(JSON.stringify(o));
const url = (alias, anchor) => `f?p=&APP_ID.:${alias}:&APP_SESSION.${anchor ? "#" + anchor : ""}`;
const LINK_COLS = ["LINK", "BUTTON_LINK", "BUTTON2_LINK"];

// a page title band: the hero region with one slide, Full Bleed and Compact
const band = (title, eyebrow, text, photo, alt) => ({ id: "hero", slot: "hero", report: "ws-hero", title, sec: HERO, rep: ["ws-Hero--fullbleed", "ws-Hero--compact"],
    rows: [{ TITLE: title, SUBTITLE: eyebrow, TEXT: text, ...im(photo, alt) }] });

// def: { key, base, label, icon, text, look, menuOptions, pages: [{ alias, name, title, description, hero, sections: [id | section] }],
//        menu: (P, U) => entries, footerCols: (P) => columns }
function build(def) {
    const base = def.base, start = def.start;
    const of = id => { const s = base.sections.find(x => x.id === id); if (!s) { throw new Error(def.key + ": no section " + id); } return clone(s); };
    const pages = def.pages.map((p, i) => ({ ...p, page: start + i, sections: p.sections.map(x => typeof x === "string" ? of(x) : x) }));
    // on an inner page the title band names the page, so the first section after it hides its own heading
    pages.slice(1).forEach(p => { const x = p.sections.find(s => s.slot !== "hero"); if (x) { x.sec = [...(x.sec || []).filter(c => !/^ws-Head--/.test(c)), "ws-Head--hidden"]; } });
    // which page holds a section: an inner page wins over the home page
    const where = {};
    [...pages.slice(1), pages[0]].forEach(p => p.sections.forEach(x => { if (!where[x.id]) { where[x.id] = p; } }));
    const firstOf = p => (p.sections.find(x => x.slot !== "hero") || {}).id;
    const target = (id, here) => { const t = where[id]; return !t || t === here ? null : { alias: t.alias, anchor: firstOf(t) === id ? null : id }; };
    const rowLink = (h, here) => { if (typeof h !== "string" || !/^#[\w-]+$/.test(h)) { return h; } const t = target(h.slice(1), here); return t ? "page:" + t.alias + (t.anchor ? "#" + t.anchor : "") : h; };
    const htmlLinks = (html, here) => html && html.replace(/href="#([\w-]+)"/g, (m, id) => { if (id === "top") { return `href="${url(pages[0].alias)}"`; } const t = target(id, here); return t ? `href="${url(t.alias, t.anchor)}"` : m; });
    const P = Object.fromEntries(pages.map(p => [p.alias, p.page]));
    const home = pages[0];
    const html = { ...base.html, logo: htmlLinks(base.html.logo, null), footerAbout: htmlLinks(base.html.footerAbout, null) };
    return {
        key: def.key, label: def.label, icon: def.icon, text: def.text, brand: base.brand, look: def.look || base.look, home: home.alias,
        pages: pages.map(p => ({
            ...base, key: def.key + "-" + p.alias.toLowerCase(), menuList: def.key + "-menu",
            page: p.page, alias: p.alias, name: base.brand.replace(/&amp;/g, "&") + " - " + p.name, label: def.label, pageName: p.name,
            title: p.title, description: p.description || base.description, look: def.look || base.look, ogImage: p.og || base.ogImage,
            menu: { options: def.menuOptions || base.menu.options },
            sections: p.sections.map(x => ({
                ...x,
                header: htmlLinks(x.header, p),
                rows: x.rows && x.rows.map(r => Object.fromEntries(Object.entries(r).map(([k, v]) => [k, LINK_COLS.includes(k) ? rowLink(v, p) : v])))
            })),
            html: Object.fromEntries(Object.entries(html).map(([k, v]) => [k, k === "logo" || k === "footerAbout" ? v : htmlLinks(v, p)])),
            footerCols: def.footerCols(P)
        })),
        menu: def.menu(P, url)
    };
}

// ---------------------------------------------------------------- Meridian: pages 20 to 25
const meridianMulti = build({
    key: "meridian", base: meridian, start: 20, label: "Company", icon: "fa-building-o", menuOptions: ["ws-Menu--cta"],
    text: "Six pages: home, about, services, insights, careers and contact, with a shared menu and footer.",
    pages: [
        { alias: "MERIDIAN", name: "Home", title: "Meridian Partners - Engineering and Advisory",
          sections: ["hero", "clients", "services", "numbers", "news", "clients-say"] },
        { alias: "MERIDIAN-ABOUT", name: "About", title: "About - Meridian Partners",
          description: "Four hundred engineers in Riyadh, Dubai and Rotterdam, and the leadership team behind Meridian Partners.",
          sections: [band("Engineers who plan *first*.", "About Meridian", "Since 1998 we have worked on projects that must still work in fifty years.", "company-meeting"), "about", "numbers", "team"] },
        { alias: "MERIDIAN-SERVICES", name: "Services", title: "Services - Meridian Partners",
          description: "Advisory, engineering, operations and sustainability: three practices that work as one team.",
          sections: [band("What we *do*.", "Services", "From the first study to the last inspection.", "company-plan"), "services", "clients-say", "faq"] },
        { alias: "MERIDIAN-INSIGHTS", name: "Insights", title: "Insights - Meridian Partners",
          description: "News, case studies and guides from the engineers of Meridian Partners.",
          sections: [band("Latest *insights*.", "Insights", "News and thinking from our engineers.", "news-1"), "news"] },
        { alias: "MERIDIAN-CAREERS", name: "Careers", title: "Careers - Meridian Partners",
          description: "Open roles in engineering and advisory in Riyadh, Dubai and Rotterdam.",
          sections: [band("Build a career that *matters*.", "Careers", "Open roles in Riyadh, Dubai and Rotterdam.", "company-team"), "careers"] },
        { alias: "MERIDIAN-CONTACT", name: "Contact", title: "Contact - Meridian Partners",
          sections: [band("Talk to an *expert*.", "Contact", "Tell us about your project and the right team will call you back.", "company-hero"), "contact"] }
    ],
    menu: (P, U) => [
        { l: "About", h: P["MERIDIAN-ABOUT"], c: [{ l: "Who we are", h: P["MERIDIAN-ABOUT"] }, { l: "Leadership", h: U("MERIDIAN-ABOUT", "team") }] },
        { l: "Services", h: P["MERIDIAN-SERVICES"] }, { l: "Insights", h: P["MERIDIAN-INSIGHTS"] }, { l: "Careers", h: P["MERIDIAN-CAREERS"] },
        { l: "Contact us", h: P["MERIDIAN-CONTACT"] }
    ],
    footerCols: () => [
        { id: "f-company", title: "Company", rows: [{ LABEL: "About", LINK: "page:MERIDIAN-ABOUT" }, { LABEL: "Insights", LINK: "page:MERIDIAN-INSIGHTS" }, { LABEL: "Careers", LINK: "page:MERIDIAN-CAREERS" }] },
        { id: "f-services", title: "Services", rows: [{ LABEL: "Our services", LINK: "page:MERIDIAN-SERVICES" }, { LABEL: "Questions", LINK: "page:MERIDIAN-SERVICES#faq" }, { LABEL: "Client portal", LINK: "https://example.com/portal" }] }]
});

// ---------------------------------------------------------------- Osteria Lume: pages 30 to 34
const lumeMulti = build({
    key: "lume", base: lume, start: 30, label: "Restaurant", icon: "fa-cutlery",
    text: "Five pages: home, menu, evenings, visit and booking. The home page keeps the story, gallery and reviews.",
    pages: [
        { alias: "LUME", name: "Home", title: "Osteria Lume - Italian Kitchen and Wine Bar", sections: ["hero", "story", "gallery", "reviews"] },
        { alias: "LUME-MENU", name: "Menu", title: "Menu - Osteria Lume", description: "Tonight's menu at Osteria Lume: starters, mains and desserts from a small Italian kitchen.",
          sections: [band("The *menu*.", "Tonight", "It changes with the market. Ask us about allergies.", "dish-5"), "menu"] },
        { alias: "LUME-EVENINGS", name: "Evenings", title: "Special evenings - Osteria Lume", description: "Truffle suppers, pasta classes and jazz nights at Osteria Lume.",
          sections: [band("Special *evenings*.", "Events", "Suppers, classes and music at the long table.", "room-1"), "evenings"] },
        { alias: "LUME-VISIT", name: "Visit", title: "Opening hours and directions - Osteria Lume", description: "Opening hours, address and directions for Osteria Lume.",
          sections: [band("Find *us*.", "Visit", "Five minutes from the metro, open every evening except Monday.", "food-hero-2"), "hours", "visit"] },
        { alias: "LUME-BOOK", name: "Book", title: "Book a table - Osteria Lume", description: "Book a table at Osteria Lume. We confirm by phone within the hour.",
          sections: [band("Book a *table*.", "Reservations", "For six or more guests, or for the long table, please call us.", "food-hero-1"), "contact"] }
    ],
    menu: (P, U) => [
        { l: "Our story", h: U("LUME", "story") }, { l: "Menu", h: P["LUME-MENU"] }, { l: "Evenings", h: P["LUME-EVENINGS"] },
        { l: "Visit", h: P["LUME-VISIT"], c: [{ l: "Opening hours", h: P["LUME-VISIT"] }, { l: "Find us", h: U("LUME-VISIT", "visit") }] },
        { l: "Book a table", h: P["LUME-BOOK"] }
    ],
    footerCols: () => [{ id: "f-visit", title: "Visit", rows: [{ LABEL: "Menu", LINK: "page:LUME-MENU" }, { LABEL: "Opening hours", LINK: "page:LUME-VISIT" },
        { LABEL: "Find us", LINK: "page:LUME-VISIT#visit" }, { LABEL: "Book a table", LINK: "page:LUME-BOOK" }] }]
});

// ---------------------------------------------------------------- Harbor & Stone: pages 40 to 44
const harborMulti = build({
    key: "harbor", base: harbor, start: 40, label: "Real Estate", icon: "fa-home",
    text: "Five pages: home, homes for sale and rent, services, about with the agents, and contact.",
    pages: [
        { alias: "HARBOR", name: "Home", title: "Harbor & Stone - Homes for Sale and Rent", sections: ["hero", "homes", "numbers", "reviews"] },
        { alias: "HARBOR-HOMES", name: "Homes", title: "Homes for sale and rent - Harbor & Stone", description: "Houses, villas and apartments for sale and rent in Riyadh, new this week.",
          sections: [band("Homes for sale and *rent*.", "Listings", "New this week. Viewings in person or by video call.", "home-5"), "homes"] },
        { alias: "HARBOR-SERVICES", name: "Services", title: "Buying, selling and renting - Harbor & Stone", description: "Buying, selling, renting and property management with Harbor & Stone.",
          sections: [band("How we *help*.", "Services", "Buying, selling, renting and property management.", "home-2"), "services", "numbers"] },
        { alias: "HARBOR-ABOUT", name: "About", title: "About us - Harbor & Stone", description: "A family-run estate agency since 1989: meet our agents and read what clients say.",
          sections: [band("A family agency since *1989*.", "About us", "Agents who know every street.", "home-hero-2"), "agents", "reviews"] },
        { alias: "HARBOR-CONTACT", name: "Contact", title: "Book a valuation - Harbor & Stone", description: "Book a free valuation or visit our office on Tahlia Street, Riyadh.",
          sections: [band("Book a free *valuation*.", "Contact", "An agent visits within 48 hours.", "home-1"), "contact", "visit"] }
    ],
    menu: (P, U) => [
        { l: "Homes", h: P["HARBOR-HOMES"] }, { l: "Services", h: P["HARBOR-SERVICES"] },
        { l: "About us", h: P["HARBOR-ABOUT"], c: [{ l: "Our agents", h: P["HARBOR-ABOUT"] }, { l: "Client reviews", h: U("HARBOR-ABOUT", "reviews") }] },
        { l: "Mortgage calculator", h: "https://example.com/mortgage", ext: true },
        { l: "Book a valuation", h: P["HARBOR-CONTACT"] }
    ],
    footerCols: () => [{ id: "f-homes", title: "Homes", rows: [{ LABEL: "For sale and rent", LINK: "page:HARBOR-HOMES" }, { LABEL: "Services", LINK: "page:HARBOR-SERVICES" },
        { LABEL: "Valuations", LINK: "page:HARBOR-CONTACT" }] }]
});

// ---------------------------------------------------------------- Al Shifa clinic (Arabic): pages 50 to 53
const shifaMulti = build({
    key: "shifa", base: shifa, start: 50, label: "Clinic (Arabic, RTL)", icon: "fa-heartbeat",
    text: "أربع صفحات: الرئيسية، الخدمات، من نحن مع الأطباء، والحجز مع أوقات العمل والموقع.",
    pages: [
        { alias: "SHIFA", name: "Home", title: "عيادات الشفاء - رعاية طبية للعائلة", sections: ["hero", "numbers", "services", "reviews"] },
        { alias: "SHIFA-SERVICES", name: "Services", title: "الخدمات - عيادات الشفاء", description: "طب الأسرة والأطفال والأسنان والمختبر والقلب في عيادات الشفاء بالرياض.",
          sections: [band("خدماتنا", "الخدمات", "كل ما تحتاجه عائلتك في مكان واحد.", "clinic-lab", "مختبر بأجهزة حديثة"), "services", "faq"] },
        { alias: "SHIFA-ABOUT", name: "About", title: "من نحن - عيادات الشفاء", description: "تعرف على عيادات الشفاء وأطبائنا الاستشاريين في شمال الرياض.",
          sections: [band("رعاية *إنسانية* قبل كل شيء.", "من نحن", "منذ عام ٢٠١٢ في شمال الرياض.", "clinic-room", "استقبال العيادة"), "about", "doctors", "reviews"] },
        { alias: "SHIFA-BOOK", name: "Book", title: "احجز موعدا - عيادات الشفاء", description: "احجز موعدك في عيادات الشفاء، واطلع على أوقات العمل والموقع.",
          sections: [band("احجز *موعدك*", "الحجز", "اترك بياناتك وسنتصل بك لتأكيد الموعد.", "clinic-hero", "طبيب بمعطف أبيض"), "contact", "hours", "map"] }
    ],
    menu: (P, U) => [
        { l: "الخدمات", h: P["SHIFA-SERVICES"] },
        { l: "من نحن", h: P["SHIFA-ABOUT"], c: [{ l: "عن العيادة", h: P["SHIFA-ABOUT"] }, { l: "الأطباء", h: U("SHIFA-ABOUT", "doctors") }] },
        { l: "أوقات العمل", h: U("SHIFA-BOOK", "hours") },
        { l: "نتائج التحاليل", h: "https://example.com/results", ext: true },
        { l: "احجز موعدا", h: P["SHIFA-BOOK"] }
    ],
    footerCols: () => [{ id: "f-clinic", title: "العيادة", rows: [{ LABEL: "الخدمات", LINK: "page:SHIFA-SERVICES" }, { LABEL: "الأطباء", LINK: "page:SHIFA-ABOUT#doctors" },
        { LABEL: "أوقات العمل", LINK: "page:SHIFA-BOOK#hours" }] }]
});

export const MULTI = [meridianMulti, lumeMulti, harborMulti, shifaMulti];
