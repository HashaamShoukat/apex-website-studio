// The starter websites. Each one becomes a page (pages.mjs writes p000NN-<alias>.apx) with its own menu list
// (lists.apx), and the QA harness renders the same data. Every list is a SQL query built from these rows.
// A section: { id, menu (label in the section-built menu), title, report | html | form, rows, sec (section options),
//              rep (report options), header (html above the content), css, slot }
import { SECTIONS as HALCYON, CONTACT as H_CONTACT, SOCIAL as H_SOCIAL, FOOTER_COLS as H_FOOTER, LEGAL as H_LEGAL, HTML as H_HTML } from "./demo.mjs";
import { PHOTOS, photoFile } from "./photos.mjs";

const alt = n => (PHOTOS.find(p => p.file === photoFile(n)) || {}).alt || "";
// IMAGE_FILE + IMAGE_ALT of a photo
export const im = (n, a) => ({ IMAGE_FILE: photoFile(n), IMAGE_ALT: a || alt(n) });
const logo = (brand, mark) => `<a class="ws-Brand" href="#top"><span class="ws-Logo-mark" aria-hidden="true">${mark}</span>${brand}</a>`;
const footAbout = (brand, mark, text) => `${logo(brand, mark)}\n<p>${text}</p>`;
const media = (n, a) => `<div class="ws-Media" data-file="${photoFile(n)}" role="img" aria-label="${(a || alt(n)).replace(/"/g, "&quot;")}"></div>`;
const HERO = ["ws-Pad--none", "ws-Width--full", "ws-Head--hidden"];
const LI = "https://www.linkedin.com/";
// the contact form: page items P<page>_<name>, a honeypot item and a Send button
const FORM_EN = {
    fields: [
        { n: "NAME", t: "textField", l: "Name", span: 6, req: true },
        { n: "EMAIL", t: "textField", l: "Email", span: 6, req: true, email: true },
        { n: "PHONE", t: "textField", l: "Phone", span: 12 },
        { n: "MESSAGE", t: "textarea", l: "Message", span: 12, req: true }
    ],
    button: "Send message", success: "Thanks for your message. We will reply within one working day."
};
const socials = (...names) => names.map(n => ({
    instagram: { LABEL: "Instagram", LINK: "https://www.instagram.com/", ICON: "fa-instagram" }, linkedin: { LABEL: "LinkedIn", LINK: LI, ICON: "fa-linkedin" },
    x: { LABEL: "X", LINK: "https://x.com/", ICON: "fa-x-twitter" }, facebook: { LABEL: "Facebook", LINK: "https://www.facebook.com/", ICON: "fa-facebook" },
    youtube: { LABEL: "YouTube", LINK: "https://www.youtube.com/", ICON: "fa-youtube-play" }, whatsapp: { LABEL: "WhatsApp", LINK: "https://wa.me/966500000000", ICON: "fa-whatsapp" },
    dribbble: { LABEL: "Dribbble", LINK: "https://dribbble.com/", ICON: "fa-dribbble" }, behance: { LABEL: "Behance", LINK: "https://www.behance.net/", ICON: "fa-behance" },
    github: { LABEL: "GitHub", LINK: "https://github.com/", ICON: "fa-github" }, tiktok: { LABEL: "TikTok", LINK: "https://www.tiktok.com/", ICON: "fa-tiktok" }
}[n]));
const LEGAL = [{ LABEL: "Privacy", LINK: "#" }, { LABEL: "Terms", LINK: "#" }];

// ---------------------------------------------------------------- Halcyon (page 10): every section, the full demo
const HALCYON_IMG = {
    hero: ["studio-hero-1", "studio-hero-2", "studio-hero-3"], work: ["work-1", "work-2", "work-3", "work-4", "work-5", "work-6"],
    team: ["person-1", "person-2", "person-5", "person-4"], "clients-say": ["person-3", "person-6", "person-5"]
};
const halcyon = {
    key: "halcyon", page: 10, alias: "WEBSITE", name: "Demo Website", label: "Design Studio", brand: "Halcyon", icon: "fa-paint-brush",
    title: "Halcyon - Brand and Digital Design Studio",
    description: "Halcyon is a brand and digital design studio in Lisbon and Porto: strategy, identity, websites and product design.",
    look: "ws-Accent--tangerine ws-Font--grotesk", preset: "studio",
    menu: {
        options: ["ws-Menu--cta"],
        entries: [
            { l: "About", h: "#about" },
            { l: "Services", h: "#services", c: [
                { l: "Brand strategy", h: "#services" }, { l: "Websites", h: "#work" }, { l: "Our process", h: "#process" }, { l: "Pricing", h: "#pricing" }] },
            { l: "Work", h: "#work" }, { l: "Team", h: "#team" }, { l: "Careers", h: "#careers" },
            { l: "Journal", h: "https://medium.com/", ext: true },
            { l: "Start a project", h: "#contact" }
        ]
    },
    sections: HALCYON.map(s => {
        const imgs = HALCYON_IMG[s.id];
        const t = imgs ? { ...s, rows: s.rows.map((r, i) => ({ ...r, ...im(imgs[i]) })) } : s;
        if (s.id === "hero") { t.rows = t.rows.map((r, i) => i === 0 ? { ...r, IMAGE_POSITION: "center 40%" } : r); }
        return t;
    }),
    contact: H_CONTACT, social: H_SOCIAL, footerCols: H_FOOTER, legal: H_LEGAL,
    html: { ...H_HTML, about: H_HTML.about.replace(/<div class="ws-Media"[^>]*><\/div>/, media("studio-about", "The Halcyon studio in Lisbon")) },
    form: {
        fields: [
            { n: "NAME", t: "textField", l: "Name", span: 6, req: true },
            { n: "EMAIL", t: "textField", l: "Email", span: 6, req: true, email: true },
            { n: "COMPANY", t: "textField", l: "Company", span: 12 },
            { n: "MESSAGE", t: "textarea", l: "What are you working on?", span: 12, req: true }
        ],
        button: "Send message", success: "Thanks for your message. We will reply within two working days."
    },
    ogImage: "studio-hero-1"
};

// ---------------------------------------------------------------- Meridian (page 11): a company website
const meridian = {
    key: "company", page: 11, alias: "COMPANY", name: "Starter - Company", label: "Company", brand: "Meridian", icon: "fa-building-o",
    title: "Meridian Partners - Engineering and Advisory",
    description: "Meridian Partners plans, builds and runs infrastructure for cities, utilities and industry across the Gulf and Europe.",
    look: "ws-Design--corporate ws-Accent--indigo ws-Font--tech ws-Header--centered", preset: "corporate",
    menu: {
        options: ["ws-Menu--cta", "ws-Menu--max5"],
        entries: [
            { l: "About", h: "#about" },
            { l: "Services", h: "#services", c: [
                { l: "Advisory", h: "#services" }, { l: "Engineering", h: "#services" }, { l: "Operations", h: "#services" }, { l: "Sustainability", h: "#about" }] },
            { l: "Insights", h: "#news" }, { l: "Team", h: "#team" }, { l: "Careers", h: "#careers" },
            { l: "Client portal", h: "https://example.com/portal", ext: true },
            { l: "Contact us", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Meridian", sec: HERO, rep: ["ws-Hero--split", "ws-Hero--medium"], rows: [
            { TITLE: "Infrastructure that *lasts* a generation.", SUBTITLE: "Engineering and advisory since 1998", TEXT: "We plan, build and run the roads, grids and water networks that cities depend on.",
              BUTTON_LABEL: "Our services", BUTTON_LINK: "#services", BUTTON2_LABEL: "Talk to an expert", BUTTON2_LINK: "#contact", ...im("company-hero") }] },
        { id: "clients", report: "ws-logos", title: "Trusted by", sec: ["ws-Pad--tight", "ws-Head--center"], css: "ws-Sec--small",
          rows: ["Gulf Water", "Atlas Rail", "Northgrid", "City of Lumen", "Harborline", "Petra Energy"].map(n => ({ NAME: n })) },
        { id: "about", menu: "About", report: "ws-zigzag", title: "Who we are", sec: ["ws-Sec--menu", "ws-Head--hidden"], rows: [
            { EYEBROW: "About us", TITLE: "Four hundred engineers, *one* standard.", TEXT: "From offices in Riyadh, Dubai and Rotterdam we work with public and private clients on projects that must still work in fifty years.", LINK: "#team", LINK_LABEL: "Meet the leadership", ...im("company-team") },
            { EYEBROW: "How we work", TITLE: "Plan first, build once.", TEXT: "Every project starts with a digital model of the asset, so cost, risk and carbon are clear before the first contract is signed.", LINK: "#services", LINK_LABEL: "Our services", ...im("company-plan") },
            { EYEBROW: "Sustainability", TITLE: "Net zero on our own sites by *2030*.", TEXT: "We publish our emissions every year and design every project to the lowest carbon option the client can afford.", ...im("company-meeting") }] },
        { id: "numbers", report: "ws-stats", title: "Meridian in numbers", sec: ["ws-Tone--dark", "ws-Pad--tight", "ws-Head--hidden"], rep: ["ws-Stats--center"], rows: [
            { VALUE: "26", LABEL: "Years in business" }, { VALUE: "410", LABEL: "Engineers and advisers" }, { VALUE: "1200", SUFFIX: "+", LABEL: "Projects delivered" }, { VALUE: "14", LABEL: "Countries" }] },
        { id: "services", menu: "Services", report: "ws-features", title: "What we *do*", sec: ["ws-Sec--menu"], rep: ["ws-Features--rows"],
          header: '<p class="ws-Eyebrow">Services</p><p class="ws-Lead">Three practices that work as one team from the first study to the last inspection.</p>', rows: [
            { ICON: "fa-line-chart", TITLE: "Advisory", TEXT: "Feasibility studies, financing and procurement strategies for large public projects." },
            { ICON: "fa-cogs", TITLE: "Engineering", TEXT: "Civil, structural and electrical design, with digital models shared with every contractor." },
            { ICON: "fa-wrench", TITLE: "Operations", TEXT: "Asset management and maintenance plans that keep networks running and costs predictable." },
            { ICON: "fa-leaf", TITLE: "Sustainability", TEXT: "Carbon accounting, climate risk and renewable integration for every stage of a project." }] },
        { id: "news", menu: "Insights", report: "ws-news", title: "Latest *insights*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--split"],
          header: '<p class="ws-Eyebrow">Insights</p><p class="ws-Lead">News and thinking from our engineers.</p>', rows: [
            { TITLE: "What digital twins changed on the Atlas Rail extension", TEXT: "Two years in, the model has saved four months of site work. Here is what we learned.", POST_DATE: "12 Oct 2026", CATEGORY: "Case study", LINK: "#", ...im("news-1") },
            { TITLE: "Meridian opens a Rotterdam office", TEXT: "Forty engineers join to lead our water and port work in Northern Europe.", POST_DATE: "28 Sep 2026", CATEGORY: "News", LINK: "#", ...im("news-2") },
            { TITLE: "Five questions to ask before a feasibility study", TEXT: "A short guide for project owners from our advisory practice.", POST_DATE: "3 Sep 2026", CATEGORY: "Guide", LINK: "#", ...im("news-3") }] },
        { id: "team", menu: "Team", report: "ws-team", title: "Leadership", sec: ["ws-Sec--menu", "ws-Head--center"], header: '<p class="ws-Eyebrow">Team</p>', rows: [
            { NAME: "Omar Al-Harbi", ROLE: "Chief Executive", LINK: LI, ...im("person-2") }, { NAME: "Sara Lindqvist", ROLE: "Head of Engineering", LINK: LI, ...im("person-5") },
            { NAME: "Daniel Okoro", ROLE: "Head of Advisory", LINK: LI, ...im("person-6") }, { NAME: "Maya Chen", ROLE: "Head of Sustainability", LINK: LI, ...im("person-3") }] },
        { id: "clients-say", report: "ws-testimonials", title: "What clients *say*", sec: ["ws-Tone--soft", "ws-Head--center"], rep: ["ws-Quotes--spotlight"], rows: [
            { QUOTE: "Meridian found savings in the design that paid for their whole contract. Calm, precise and always on time.", NAME: "Khalid Mansour", ROLE: "Programme Director, Atlas Rail", RATING: "5", ...im("person-4") },
            { QUOTE: "The best engineering partner we have had in twenty years of building water networks.", NAME: "Laila Haddad", ROLE: "CEO, Gulf Water", RATING: "5", ...im("person-1") }] },
        { id: "careers", menu: "Careers", report: "ws-jobs", title: "Build a *career* that matters", sec: ["ws-Sec--menu"],
          header: '<p class="ws-Eyebrow">Careers</p>', rows: [
            { TITLE: "Senior Structural Engineer", TEAM: "Engineering", LOCATION: "Riyadh", TYPE: "Full-time", DESCRIPTION: "Lead structural design for transport projects.", APPLY_LINK: "mailto:careers@example.com" },
            { TITLE: "Infrastructure Economist", TEAM: "Advisory", LOCATION: "Dubai", TYPE: "Full-time", DESCRIPTION: "Build the business cases behind major public projects.", APPLY_LINK: "mailto:careers@example.com" },
            { TITLE: "Graduate Engineer", TEAM: "Engineering", LOCATION: "Rotterdam", TYPE: "Graduate", DESCRIPTION: "A two-year programme across our three practices.", APPLY_LINK: "mailto:careers@example.com" }] },
        { id: "faq", report: "ws-faq", title: "Questions", sec: ["ws-Tone--soft", "ws-Head--center"], rep: ["ws-Faqs--columns"], rows: [
            { QUESTION: "Which regions do you work in?", ANSWER: "Saudi Arabia, the UAE, the wider Gulf and Northern Europe, with partners elsewhere." },
            { QUESTION: "Do you work on private projects?", ANSWER: "Yes. About a third of our work is for private developers and industrial clients." },
            { QUESTION: "How do you price a project?", ANSWER: "Fixed fees for studies and design, and agreed rates for long-term operations support." },
            { QUESTION: "Can you join a project already under way?", ANSWER: "Often. We review the design and the programme first and tell you honestly where we can help." }] },
        { id: "contact", menu: "Contact", title: "Talk to an *expert*", form: true, sec: ["ws-Sec--menu"], css: "ws-Contact",
          header: '<p class="ws-Eyebrow">Contact</p><p class="ws-Lead">Tell us about your project and the right team will call you back.</p>' }
    ],
    contact: [
        { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "info@example.com", LINK: "mailto:info@example.com" },
        { ICON: "fa-phone", LABEL: "Phone", VALUE: "+966 11 000 4100", LINK: "tel:+966110004100" },
        { ICON: "fa-map-marker", LABEL: "Head office", VALUE: "King Fahd Road, Riyadh" }],
    social: socials("linkedin", "x", "youtube"),
    footerCols: [
        { id: "f-company", title: "Company", rows: [{ LABEL: "About", LINK: "#about" }, { LABEL: "Insights", LINK: "#news" }, { LABEL: "Careers", LINK: "#careers" }] },
        { id: "f-services", title: "Services", rows: [{ LABEL: "Advisory", LINK: "#services" }, { LABEL: "Engineering", LINK: "#services" }, { LABEL: "Operations", LINK: "#services" }] }],
    legal: LEGAL,
    html: { logo: logo("Meridian", "M"), footerAbout: footAbout("Meridian", "M", "Engineering and advisory for infrastructure that lasts."), copyright: "<span>&copy; Meridian Partners. All rights reserved.</span>" },
    form: { ...FORM_EN, fields: [...FORM_EN.fields.slice(0, 2), { n: "COMPANY", t: "textField", l: "Organisation", span: 12 }, FORM_EN.fields[3]] },
    ogImage: "company-hero"
};

// ---------------------------------------------------------------- Osteria Lume (page 12): a restaurant; its menu is a SQL list
const lume = {
    key: "restaurant", page: 12, alias: "RESTAURANT", name: "Starter - Restaurant", label: "Restaurant", brand: "Osteria Lume", icon: "fa-cutlery",
    title: "Osteria Lume - Italian Kitchen and Wine Bar",
    description: "Seasonal Italian cooking, wood-fired bread and natural wine in the heart of the old town. Book a table online.",
    look: "ws-Design--organic ws-Accent--wine ws-Font--serif ws-Header--transparent", preset: "trattoria",
    menu: {
        sql: true, options: ["ws-Menu--cta"],
        entries: [
            { l: "Menu", h: "#menu", c: [{ l: "Starters", h: "#menu" }, { l: "Mains", h: "#menu" }, { l: "Desserts", h: "#menu" }] },
            { l: "Our story", h: "#story" }, { l: "Gallery", h: "#gallery" }, { l: "Evenings", h: "#evenings" }, { l: "Visit", h: "#visit" },
            { l: "Order online", h: "https://example.com/order", ext: true },
            { l: "Book a table", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Osteria Lume", sec: HERO, rep: ["ws-Hero--fullbleed", "ws-Hero--full"], rows: [
            { TITLE: "Slow food, *good* wine, long evenings.", SUBTITLE: "Italian kitchen and wine bar", TEXT: "Seasonal plates from a small kitchen, open every evening from six.", BUTTON_LABEL: "Book a table", BUTTON_LINK: "#contact", BUTTON2_LABEL: "See the menu", BUTTON2_LINK: "#menu", ...im("food-hero-1") },
            { TITLE: "A dining room made for *sharing*.", SUBTITLE: "Since 2014", TEXT: "Forty seats, one long table and a bar for walk-ins.", BUTTON_LABEL: "Plan your visit", BUTTON_LINK: "#visit", ...im("food-hero-2") },
            { TITLE: "Everything made *here*, every day.", SUBTITLE: "From our kitchen", TEXT: "Pasta rolled each morning, bread from our wood oven.", BUTTON_LABEL: "Our story", BUTTON_LINK: "#story", ...im("food-hero-3") }] },
        { id: "story", menu: "Our story", title: "Our story", html: "story", sec: ["ws-Sec--menu", "ws-Head--hidden"] },
        { id: "menu", menu: "Menu", report: "ws-products", title: "The *menu*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"],
          header: '<p class="ws-Eyebrow">Tonight</p><p class="ws-Lead">The menu changes with the market. Ask us about allergies: most dishes can be adapted.</p>', rows: [
            { NAME: "Burrata and roasted peppers", TEXT: "Basil oil, sourdough from our oven", PRICE: "SAR 58", CATEGORY: "Starters", ...im("dish-2") },
            { NAME: "Grilled sea bream", TEXT: "Lemon, capers, charred greens", PRICE: "SAR 124", CATEGORY: "Mains", BADGE: "Chef's choice", ...im("dish-1") },
            { NAME: "Margherita from the wood oven", TEXT: "San Marzano tomato, fior di latte", PRICE: "SAR 72", CATEGORY: "Mains", ...im("dish-3") },
            { NAME: "Tagliatelle al pomodoro", TEXT: "Fresh egg pasta, slow tomato, basil", PRICE: "SAR 84", CATEGORY: "Mains", ...im("dish-5") },
            { NAME: "Dark chocolate torta", TEXT: "Olive oil, sea salt, cream", PRICE: "SAR 42", CATEGORY: "Desserts", ...im("dish-4") },
            { NAME: "Espresso and cornetto", TEXT: "Until noon at the bar", PRICE: "SAR 26", CATEGORY: "Desserts", ...im("dish-6") }] },
        { id: "gallery", menu: "Gallery", report: "ws-photos", title: "Inside *Lume*", sec: ["ws-Sec--menu", "ws-Head--center"], rep: ["ws-Photos--masonry"], rows: [
            { TITLE: "The bar", ...im("room-1") }, { TITLE: "Grilled sea bream", ...im("dish-1") }, { TITLE: "Friday supper", ...im("room-2") },
            { TITLE: "The dining room", ...im("food-hero-2") }, { TITLE: "Wood-fired pizza", ...im("dish-3") }, { TITLE: "Chocolate torta", ...im("dish-4") }] },
        { id: "reviews", report: "ws-testimonials", title: "Guests *say*", sec: ["ws-Tone--soft", "ws-Head--center"], rep: ["ws-Quotes--wall"], rows: [
            { QUOTE: "The best pasta in the city, and the staff remember your name.", NAME: "Nora A.", ROLE: "Google review", RATING: "5" },
            { QUOTE: "We come every anniversary. The sea bream is perfect every time.", NAME: "Faisal and Reem", ROLE: "Regulars", RATING: "5" },
            { QUOTE: "Warm room, honest food, fair prices. Book ahead on Fridays.", NAME: "James P.", ROLE: "Tripadvisor", RATING: "4" }] },
        { id: "evenings", menu: "Evenings", report: "ws-events", title: "Special *evenings*", sec: ["ws-Sec--menu"], rep: ["ws-Events--cards"], rows: [
            { EVENT_DATE: "14 Nov", EVENT_TIME: "19:00", TITLE: "Truffle supper", TEXT: "Five courses with white truffle from Alba.", LOCATION: "Long table", LINK: "#contact", LINK_LABEL: "Reserve" },
            { EVENT_DATE: "28 Nov", EVENT_TIME: "18:30", TITLE: "Pasta class", TEXT: "Learn to roll tagliatelle with our chef, then eat what you made.", LOCATION: "Kitchen", LINK: "#contact", LINK_LABEL: "Reserve" },
            { EVENT_DATE: "12 Dec", EVENT_TIME: "20:00", TITLE: "Winter jazz night", TEXT: "A trio in the bar and a short sharing menu.", LOCATION: "Bar", LINK: "#contact", LINK_LABEL: "Reserve" }] },
        { id: "hours", report: "ws-hours", title: "Opening *hours*", sec: ["ws-Head--center", "ws-Width--narrow"], rows: [
            { DAY_NAME: "Monday", HOURS: "Closed", DAY_NUMBER: "1" }, { DAY_NAME: "Tuesday", HOURS: "18:00 - 23:00", DAY_NUMBER: "2" },
            { DAY_NAME: "Wednesday", HOURS: "18:00 - 23:00", DAY_NUMBER: "3" }, { DAY_NAME: "Thursday", HOURS: "18:00 - 23:30", DAY_NUMBER: "4" },
            { DAY_NAME: "Friday", HOURS: "13:00 - 00:00", NOTE: "Lunch from 13:00", DAY_NUMBER: "5" }, { DAY_NAME: "Saturday", HOURS: "13:00 - 00:00", DAY_NUMBER: "6" },
            { DAY_NAME: "Sunday", HOURS: "13:00 - 22:00", NOTE: "Family lunch", DAY_NUMBER: "7" }] },
        { id: "visit", menu: "Visit", report: "ws-map", title: "Find *us*", sec: ["ws-Sec--menu", "ws-Tone--soft"], rows: [
            { MAP_URL: "https://www.openstreetmap.org/export/embed.html?bbox=46.66%2C24.68%2C46.70%2C24.71&layer=mapnik", TITLE: "Osteria Lume", ADDRESS: "12 Olive Street, Old Town", TEXT: "Five minutes from the metro. Street parking after 18:00.", LINK: "https://www.openstreetmap.org/", LINK_LABEL: "Directions" }] },
        { id: "contact", menu: "Book", title: "Book a *table*", form: true, sec: ["ws-Sec--menu"], css: "ws-Contact",
          header: '<p class="ws-Lead">For six or more guests, or for the long table, please call us.</p>' }
    ],
    contact: [
        { ICON: "fa-phone", LABEL: "Reservations", VALUE: "+966 11 000 7788", LINK: "tel:+966110007788" },
        { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "ciao@example.com", LINK: "mailto:ciao@example.com" },
        { ICON: "fa-map-marker", LABEL: "Address", VALUE: "12 Olive Street, Old Town" }],
    social: socials("instagram", "tiktok", "whatsapp"),
    footerCols: [{ id: "f-visit", title: "Visit", rows: [{ LABEL: "Menu", LINK: "#menu" }, { LABEL: "Opening hours", LINK: "#hours" }, { LABEL: "Find us", LINK: "#visit" }, { LABEL: "Gift cards", LINK: "#contact" }] }],
    legal: LEGAL,
    html: {
        logo: logo("Osteria Lume", "L"), footerAbout: footAbout("Osteria Lume", "L", "Italian kitchen and wine bar. Open every evening except Monday."), copyright: "<span>&copy; Osteria Lume</span>",
        story: `<div class="ws-Split">
  ${media("food-about")}
  <div class="ws-Stack">
    <p class="ws-Eyebrow">Our story</p>
    <h2 class="ws-Title">A small kitchen with a *big* table.</h2>
    <p class="ws-Lead">Chef Marco and Hala opened Lume in 2014 with one oven, six tables and recipes from Marco's grandmother in Bologna.</p>
    <p class="ws-Muted">We buy from local farms and the morning fish market, so the menu is short and changes every week.</p>
    <a class="ws-More" href="#menu">See tonight's menu</a>
  </div>
</div>`
    },
    form: { fields: [
        { n: "NAME", t: "textField", l: "Name", span: 6, req: true }, { n: "PHONE", t: "textField", l: "Phone", span: 6, req: true },
        { n: "EMAIL", t: "textField", l: "Email", span: 12, email: true },
        { n: "MESSAGE", t: "textarea", l: "Date, time and number of guests", span: 12, req: true }],
        button: "Request a table", success: "Thank you. We will confirm your table by phone within the hour." },
    ogImage: "food-hero-1"
};

// ---------------------------------------------------------------- Al Shifa clinic (page 13): Arabic, right to left
const DAYS_AR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const shifa = {
    key: "clinic", page: 13, alias: "CLINIC", name: "Starter - Clinic (Arabic)", label: "Clinic (Arabic, RTL)", brand: "عيادات الشفاء", icon: "fa-heartbeat",
    rtl: true, lang: "ar",
    title: "عيادات الشفاء - رعاية طبية للعائلة",
    description: "عيادات الشفاء في الرياض: طب الأسرة والأطفال والأسنان والمختبر، مع حجز المواعيد عبر الإنترنت أو واتساب.",
    look: "ws-Accent--emerald ws-Font--arabic ws-Corners--round ws-Fx--chat ws-Fx--theme", preset: "clinic-ar",
    menu: {
        options: ["ws-Menu--cta", "ws-Menu--drawer"],
        entries: [
            { l: "من نحن", h: "#about" },
            { l: "الخدمات", h: "#services", c: [{ l: "طب الأسرة", h: "#services" }, { l: "طب الأطفال", h: "#services" }, { l: "طب الأسنان", h: "#services" }, { l: "المختبر", h: "#services" }] },
            { l: "الأطباء", h: "#doctors" }, { l: "أوقات العمل", h: "#hours" }, { l: "الأسئلة", h: "#faq" },
            { l: "نتائج التحاليل", h: "https://example.com/results", ext: true },
            { l: "احجز موعدا", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "عيادات الشفاء", sec: HERO, rep: ["ws-Hero--split"], rows: [
            { TITLE: "رعاية طبية *قريبة* منك ومن عائلتك.", SUBTITLE: "عيادات الشفاء - الرياض", TEXT: "أطباء استشاريون، مختبر حديث، ومواعيد في نفس اليوم.", BUTTON_LABEL: "احجز موعدا", BUTTON_LINK: "#contact", BUTTON2_LABEL: "خدماتنا", BUTTON2_LINK: "#services", ...im("clinic-hero", "طبيب يتحدث مع مريض") },
            { TITLE: "مختبر *دقيق* ونتائج سريعة.", SUBTITLE: "المختبر", TEXT: "معظم النتائج جاهزة خلال ٢٤ ساعة وتصلك على جوالك.", BUTTON_LABEL: "اعرف المزيد", BUTTON_LINK: "#about", ...im("clinic-lab", "مختبر بأجهزة حديثة") }] },
        { id: "numbers", report: "ws-stats", title: "بالأرقام", sec: ["ws-Tone--soft", "ws-Pad--tight", "ws-Head--hidden"], rows: [
            { VALUE: "18", LABEL: "طبيبا استشاريا" }, { VALUE: "12", LABEL: "عاما من الخبرة" }, { VALUE: "40000", SUFFIX: "+", LABEL: "مريض سنويا" }, { VALUE: "24", SUFFIX: "س", LABEL: "لنتائج المختبر" }] },
        { id: "services", menu: "الخدمات", report: "ws-features", title: "خدماتنا", sec: ["ws-Sec--menu", "ws-Head--center"], rep: ["ws-Features--icons"],
          header: '<p class="ws-Eyebrow">الخدمات</p><p class="ws-Lead">كل ما تحتاجه عائلتك في مكان واحد.</p>', rows: [
            { ICON: "fa-user-md", TITLE: "طب الأسرة", TEXT: "فحوصات دورية ومتابعة الأمراض المزمنة لكل أفراد العائلة." },
            { ICON: "fa-child", TITLE: "طب الأطفال", TEXT: "متابعة النمو والتطعيمات بإشراف أطباء متخصصين." },
            { ICON: "fa-smile-o", TITLE: "طب الأسنان", TEXT: "تنظيف وتقويم وزراعة الأسنان بأحدث التقنيات." },
            { ICON: "fa-flask", TITLE: "المختبر", TEXT: "تحاليل شاملة ونتائج سريعة تصلك إلكترونيا." },
            { ICON: "fa-heartbeat", TITLE: "القلب", TEXT: "تخطيط القلب والفحص بالموجات فوق الصوتية." },
            { ICON: "fa-medkit", TITLE: "الطوارئ البسيطة", TEXT: "استقبال الحالات العاجلة غير الحرجة طوال ساعات العمل." }] },
        { id: "about", menu: "من نحن", report: "ws-zigzag", title: "من نحن", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--hidden"], rows: [
            { EYEBROW: "من نحن", TITLE: "رعاية *إنسانية* قبل كل شيء.", TEXT: "منذ عام ٢٠١٢ نخدم أحياء شمال الرياض بفريق يضع راحة المريض أولا، ويشرح كل خطوة بوضوح.", LINK: "#doctors", LINK_LABEL: "تعرف على الأطباء", ...im("clinic-room", "غرفة كشف مضيئة") },
            { EYEBROW: "التقنية", TITLE: "ملفك الطبي معك أينما كنت.", TEXT: "احجز موعدك، واطلع على نتائجك ووصفاتك من جوالك في أي وقت.", ...im("clinic-lab", "مختبر بأجهزة حديثة") }] },
        { id: "doctors", menu: "الأطباء", report: "ws-team", title: "أطباؤنا", sec: ["ws-Sec--menu", "ws-Head--center"], rows: [
            { NAME: "د. نورة القحطاني", ROLE: "استشارية طب الأسرة", ...im("doctor-1", "د. نورة القحطاني") },
            { NAME: "د. أحمد السبيعي", ROLE: "استشاري طب الأطفال", ...im("doctor-2", "د. أحمد السبيعي") },
            { NAME: "د. ريم العتيبي", ROLE: "أخصائية طب الأسنان", ...im("doctor-3", "د. ريم العتيبي") }] },
        { id: "hours", menu: "أوقات العمل", report: "ws-hours", title: "أوقات *العمل*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rep: ["ws-Hours--cards"],
          rows: DAYS_AR.map((d, i) => ({ DAY_NAME: d, HOURS: i === 5 ? "مغلق" : (i === 6 ? "٤:٠٠ م - ١١:٠٠ م" : "٨:٠٠ ص - ١١:٠٠ م"), NOTE: i === 4 ? "حتى منتصف الليل للطوارئ" : null, DAY_NUMBER: String(i === 0 ? 7 : i) })) },
        { id: "reviews", report: "ws-testimonials", title: "آراء المرضى", sec: ["ws-Head--center"], rows: [
            { QUOTE: "استقبال رائع ومواعيد دقيقة، والدكتورة نورة شرحت لي كل شيء بهدوء.", NAME: "أم فيصل", ROLE: "مريضة منذ ٢٠١٨", RATING: "5" },
            { QUOTE: "نتيجة التحليل وصلتني على الجوال في نفس اليوم. خدمة ممتازة.", NAME: "عبدالله م.", ROLE: "مراجع", RATING: "5" }] },
        { id: "faq", menu: "الأسئلة", report: "ws-faq", title: "الأسئلة الشائعة", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rows: [
            { QUESTION: "هل تقبلون التأمين الطبي؟", ANSWER: "نعم، نتعامل مع معظم شركات التأمين في المملكة. اتصل بنا للتأكد من شبكتك." },
            { QUESTION: "هل يمكنني الحجز عبر واتساب؟", ANSWER: "نعم، اضغط على زر واتساب أسفل الصفحة وسيرد عليك فريق الاستقبال." },
            { QUESTION: "هل توجد مواقف للسيارات؟", ANSWER: "نعم، مواقف مجانية خلف المبنى." }] },
        { id: "map", report: "ws-map", title: "موقعنا", sec: ["ws-Head--center"], rows: [
            { MAP_URL: "https://www.openstreetmap.org/export/embed.html?bbox=46.62%2C24.77%2C46.66%2C24.80&layer=mapnik", TITLE: "عيادات الشفاء", ADDRESS: "طريق الملك عبدالعزيز، حي الياسمين، الرياض", TEXT: "بجوار مسجد الياسمين.", LINK: "https://www.openstreetmap.org/", LINK_LABEL: "الاتجاهات" }] },
        { id: "contact", menu: "احجز", title: "احجز *موعدك*", form: true, sec: ["ws-Sec--menu"], css: "ws-Contact",
          header: '<p class="ws-Lead">اترك بياناتك وسنتصل بك لتأكيد الموعد.</p>' }
    ],
    contact: [
        { ICON: "fa-phone", LABEL: "الهاتف", VALUE: "٩٢٠٠٠٠٠٠٠", LINK: "tel:920000000" },
        { ICON: "fa-whatsapp", LABEL: "واتساب", VALUE: "+966 50 000 0000", LINK: "https://wa.me/966500000000" },
        { ICON: "fa-map-marker", LABEL: "العنوان", VALUE: "حي الياسمين، الرياض" }],
    social: socials("whatsapp", "instagram", "x"),
    footerCols: [{ id: "f-clinic", title: "العيادة", rows: [{ LABEL: "الخدمات", LINK: "#services" }, { LABEL: "الأطباء", LINK: "#doctors" }, { LABEL: "أوقات العمل", LINK: "#hours" }] }],
    legal: [{ LABEL: "الخصوصية", LINK: "#" }, { LABEL: "الشروط", LINK: "#" }],
    html: { logo: logo("عيادات الشفاء", "ش"), footerAbout: footAbout("عيادات الشفاء", "ش", "رعاية طبية للعائلة في شمال الرياض."), copyright: "<span>&copy; عيادات الشفاء. جميع الحقوق محفوظة.</span>" },
    form: { fields: [
        { n: "NAME", t: "textField", l: "الاسم", span: 6, req: true }, { n: "PHONE", t: "textField", l: "رقم الجوال", span: 6, req: true },
        { n: "EMAIL", t: "textField", l: "البريد الإلكتروني", span: 12, email: true },
        { n: "MESSAGE", t: "textarea", l: "الخدمة والموعد المفضل", span: 12, req: true }],
        button: "إرسال الطلب", success: "شكرا لك. سنتصل بك قريبا لتأكيد الموعد." },
    ogImage: "clinic-hero"
};

// ---------------------------------------------------------------- Harbor & Stone (page 14): real estate
const harbor = {
    key: "realestate", page: 14, alias: "REAL-ESTATE", name: "Starter - Real Estate", label: "Real Estate", brand: "Harbor & Stone", icon: "fa-home",
    title: "Harbor & Stone - Homes for Sale and Rent",
    description: "Harbor & Stone is a family-run estate agency: homes for sale and rent, valuations and property management.",
    look: "ws-Design--luxury ws-Accent--amber ws-Font--luxe ws-Header--transparent", preset: "estate",
    menu: {
        options: ["ws-Menu--cta", "ws-Menu--overlay"],
        entries: [
            { l: "Homes", h: "#homes", c: [{ l: "For sale", h: "#homes" }, { l: "For rent", h: "#homes" }, { l: "New developments", h: "#homes" }] },
            { l: "Services", h: "#services" }, { l: "Agents", h: "#agents" }, { l: "Reviews", h: "#reviews" }, { l: "Visit", h: "#visit" },
            { l: "Mortgage calculator", h: "https://example.com/mortgage", ext: true },
            { l: "Book a valuation", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Harbor & Stone", sec: HERO, rep: ["ws-Hero--fullbleed", "ws-Hero--slide"], rows: [
            { TITLE: "Find a home you will *love* coming back to.", SUBTITLE: "Homes for sale and rent", TEXT: "Hand-picked houses and apartments, and agents who know every street.", BUTTON_LABEL: "Browse homes", BUTTON_LINK: "#homes", BUTTON2_LABEL: "Book a valuation", BUTTON2_LINK: "#contact", ...im("home-hero-1") },
            { TITLE: "Selling? We will get you *more*.", SUBTITLE: "Valuations", TEXT: "Our homes sell for 4% above asking on average.", BUTTON_LABEL: "Free valuation", BUTTON_LINK: "#contact", ...im("home-hero-2") }] },
        { id: "homes", menu: "Homes", report: "ws-products", title: "Featured *homes*", sec: ["ws-Sec--menu", "ws-Head--split"],
          header: '<p class="ws-Eyebrow">Listings</p><p class="ws-Lead">New this week. Viewings in person or by video call.</p>', rows: [
            { NAME: "Garden house, Al Nakheel", TEXT: "4 bedrooms - 3 bathrooms - 410 m2", PRICE: "SAR 3,950,000", CATEGORY: "For sale", BADGE: "New", ...im("home-1") },
            { NAME: "Bright apartment, Olaya", TEXT: "2 bedrooms - 2 bathrooms - 140 m2", PRICE: "SAR 9,500 / month", CATEGORY: "For rent", ...im("home-2") },
            { NAME: "Penthouse with a view", TEXT: "3 bedrooms - roof terrace - 220 m2", PRICE: "SAR 4,600,000", CATEGORY: "For sale", ...im("home-3") },
            { NAME: "Family villa, Hittin", TEXT: "5 bedrooms - kitchen garden - 520 m2", PRICE: "SAR 6,200,000", CATEGORY: "New developments", BADGE: "Off plan", ...im("home-4") },
            { NAME: "Villa with pool", TEXT: "6 bedrooms - pool - 680 m2", PRICE: "SAR 28,000 / month", CATEGORY: "For rent", ...im("home-5") },
            { NAME: "Townhouse, Diplomatic Quarter", TEXT: "3 bedrooms - courtyard - 260 m2", PRICE: "SAR 2,850,000", CATEGORY: "For sale", ...im("home-6") }] },
        { id: "numbers", report: "ws-stats", title: "Harbor & Stone in numbers", sec: ["ws-Tone--dark", "ws-Pad--tight", "ws-Head--hidden"], rep: ["ws-Stats--center"], rows: [
            { VALUE: "860", LABEL: "Homes sold" }, { VALUE: "4", SUFFIX: "%", PREFIX: "+", LABEL: "Above asking, on average" }, { VALUE: "21", LABEL: "Days to sell" }, { VALUE: "35", LABEL: "Years in the city" }] },
        { id: "services", menu: "Services", report: "ws-zigzag", title: "How we help", sec: ["ws-Sec--menu", "ws-Head--hidden"], rows: [
            { EYEBROW: "Buying", TITLE: "We find it before it is *listed*.", TEXT: "Tell us what you want and we call you first when a home matches, often before it reaches the portals.", LINK: "#contact", LINK_LABEL: "Register your search", ...im("home-2") },
            { EYEBROW: "Selling", TITLE: "Photography, staging and a *fair* fee.", TEXT: "Professional photos, a floor plan and a video tour for every home. One fixed fee, paid only when you sell.", LINK: "#contact", LINK_LABEL: "Book a valuation", ...im("home-4") },
            { EYEBROW: "Renting", TITLE: "Property management without the *worry*.", TEXT: "Tenant checks, rent collection and repairs handled by a team you can call.", ...im("home-6") }] },
        { id: "agents", menu: "Agents", report: "ws-team", title: "Your *agents*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rep: ["ws-Team--round"], rows: [
            { NAME: "Hessa Al-Rashid", ROLE: "Founder and Director", LINK: LI, ...im("person-5") }, { NAME: "Yousef Karim", ROLE: "Sales", LINK: LI, ...im("person-4") },
            { NAME: "Clara Martins", ROLE: "Lettings", LINK: LI, ...im("person-1") }, { NAME: "Majed Saleh", ROLE: "Property management", LINK: LI, ...im("person-6") }] },
        { id: "reviews", menu: "Reviews", report: "ws-testimonials", title: "From our *clients*", sec: ["ws-Sec--menu", "ws-Head--center"], rows: [
            { QUOTE: "Sold in eleven days, above asking. Hessa handled everything while we were abroad.", NAME: "The Al-Fahad family", ROLE: "Sold a villa in Hittin", RATING: "5", ...im("person-2") },
            { QUOTE: "They found us an apartment that was never even advertised. Honest and quick.", NAME: "Emma and Tariq", ROLE: "Bought in Olaya", RATING: "5", ...im("person-3") }] },
        { id: "visit", menu: "Visit", report: "ws-map", title: "Visit our *office*", sec: ["ws-Sec--menu", "ws-Tone--soft"], rep: ["ws-Maps--full"], rows: [
            { MAP_URL: "https://www.openstreetmap.org/export/embed.html?bbox=46.66%2C24.69%2C46.70%2C24.72&layer=mapnik", TITLE: "Harbor & Stone", ADDRESS: "Tahlia Street 40, Riyadh", TEXT: "Saturday to Thursday, 9:00 to 21:00", LINK: "https://www.openstreetmap.org/", LINK_LABEL: "Directions" }] },
        { id: "contact", menu: "Contact", title: "Book a free *valuation*", form: true, sec: ["ws-Sec--menu"], css: "ws-Contact",
          header: '<p class="ws-Lead">An agent visits within 48 hours and gives you a written valuation.</p>' }
    ],
    contact: [
        { ICON: "fa-phone", LABEL: "Phone", VALUE: "+966 11 000 2299", LINK: "tel:+966110002299" },
        { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "homes@example.com", LINK: "mailto:homes@example.com" },
        { ICON: "fa-map-marker", LABEL: "Office", VALUE: "Tahlia Street 40, Riyadh" }],
    social: socials("instagram", "linkedin", "youtube"),
    footerCols: [{ id: "f-homes", title: "Homes", rows: [{ LABEL: "For sale", LINK: "#homes" }, { LABEL: "For rent", LINK: "#homes" }, { LABEL: "Valuations", LINK: "#contact" }] }],
    legal: LEGAL,
    html: { logo: logo("Harbor &amp; Stone", "H"), footerAbout: footAbout("Harbor &amp; Stone", "H", "A family-run estate agency since 1989."), copyright: "<span>&copy; Harbor &amp; Stone Real Estate</span>" },
    form: { ...FORM_EN, fields: [...FORM_EN.fields.slice(0, 3), { n: "MESSAGE", t: "textarea", l: "Address of the property", span: 12, req: true }], button: "Request valuation", success: "Thank you. An agent will call you today to arrange a visit." },
    ogImage: "home-hero-1"
};

// ---------------------------------------------------------------- Northwind Data Summit (page 15): an event
const summit = {
    key: "event", page: 15, alias: "CONFERENCE", name: "Starter - Event", label: "Conference", brand: "Northwind Summit", icon: "fa-calendar",
    title: "Northwind Data Summit 2027 - 9 and 10 March, Riyadh",
    description: "Two days of talks and workshops on data, AI and the cloud. 40 speakers, 1,200 attendees. Early tickets on sale now.",
    look: "ws-Design--techgrid ws-Accent--cyan ws-Font--tech ws-Header--pill", preset: "summit",
    menu: {
        options: ["ws-Menu--cta", "ws-Menu--center"],
        entries: [
            { l: "Programme", h: "#agenda", c: [{ l: "Day 1 - 9 March", h: "#agenda" }, { l: "Day 2 - 10 March", h: "#agenda" }, { l: "Workshops", h: "#agenda" }] },
            { l: "Speakers", h: "#speakers" }, { l: "Tickets", h: "#tickets" }, { l: "Venue", h: "#venue" }, { l: "Sponsors", h: "#sponsors" },
            { l: "2026 talks", h: "https://www.youtube.com/", ext: true },
            { l: "Get tickets", h: "#tickets" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Northwind Data Summit", sec: HERO, rep: ["ws-Hero--centered", "ws-Hero--strong"], rows: [
            { TITLE: "Where data people *meet*.", SUBTITLE: "9 - 10 March 2027 - Riyadh", TEXT: "Two days, 40 speakers and 1,200 engineers, analysts and leaders.", BUTTON_LABEL: "Get tickets", BUTTON_LINK: "#tickets", BUTTON2_LABEL: "See the programme", BUTTON2_LINK: "#agenda", ...im("event-hero-1") },
            { TITLE: "Workshops you can *use* on Monday.", SUBTITLE: "Hands-on", TEXT: "Twelve half-day workshops, limited to 30 seats each.", BUTTON_LABEL: "View workshops", BUTTON_LINK: "#agenda", ...im("event-hero-2") }] },
        { id: "numbers", report: "ws-stats", title: "The summit in numbers", sec: ["ws-Pad--tight", "ws-Head--hidden"], rep: ["ws-Stats--cards"], rows: [
            { VALUE: "40", LABEL: "Speakers" }, { VALUE: "1200", LABEL: "Attendees" }, { VALUE: "12", LABEL: "Workshops" }, { VALUE: "2", LABEL: "Days" }] },
        { id: "agenda", menu: "Programme", report: "ws-events", title: "The *programme*", sec: ["ws-Sec--menu", "ws-Head--split"], rep: ["ws-Filter"],
          header: '<p class="ws-Eyebrow">Agenda</p><p class="ws-Lead">Doors open at 8:30 both days. All talks are in English with Arabic subtitles.</p>', rows: [
            { EVENT_DATE: "9 Mar", EVENT_TIME: "09:30", TITLE: "Opening keynote: the next ten years of data", SPEAKER: "Rana Aziz", LOCATION: "Main hall", CATEGORY: "Day 1" },
            { EVENT_DATE: "9 Mar", EVENT_TIME: "11:00", TITLE: "Lakehouse or warehouse? Lessons from three migrations", SPEAKER: "Tom Becker", LOCATION: "Hall B", CATEGORY: "Day 1" },
            { EVENT_DATE: "9 Mar", EVENT_TIME: "14:00", TITLE: "Workshop: building a RAG app on your own data", SPEAKER: "Lina Park", LOCATION: "Lab 1", CATEGORY: "Workshops" },
            { EVENT_DATE: "10 Mar", EVENT_TIME: "09:30", TITLE: "Keynote: responsible AI in government", SPEAKER: "Dr. Faisal Al-Mutairi", LOCATION: "Main hall", CATEGORY: "Day 2" },
            { EVENT_DATE: "10 Mar", EVENT_TIME: "11:30", TITLE: "Real-time analytics at national scale", SPEAKER: "Aisha Rahman", LOCATION: "Hall B", CATEGORY: "Day 2" },
            { EVENT_DATE: "10 Mar", EVENT_TIME: "14:00", TITLE: "Workshop: data quality you can measure", SPEAKER: "Marco Rossi", LOCATION: "Lab 2", CATEGORY: "Workshops" }] },
        { id: "speakers", menu: "Speakers", report: "ws-team", title: "Speakers", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rows: [
            { NAME: "Rana Aziz", ROLE: "Chief Data Officer, Atlas Bank", ...im("person-5") }, { NAME: "Tom Becker", ROLE: "Principal Engineer, Orbital", ...im("person-4") },
            { NAME: "Lina Park", ROLE: "AI Lead, Fieldnote", ...im("person-3") }, { NAME: "Faisal Al-Mutairi", ROLE: "Director of AI, Digital Government", ...im("person-6") },
            { NAME: "Aisha Rahman", ROLE: "VP Analytics, Northgrid", ...im("person-1") }, { NAME: "Marco Rossi", ROLE: "Data Quality Lead, Kestrel", ...im("person-2") }] },
        { id: "video", report: "ws-video", title: "Highlights from *2026*", sec: ["ws-Head--center", "ws-Width--narrow"], rows: [
            { VIDEO_URL: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", TITLE: "Northwind Data Summit 2026 in three minutes", ...im("event-hero-2") }] },
        { id: "tickets", menu: "Tickets", report: "ws-pricing", title: "Tickets", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rep: ["ws-Plans--accent"],
          header: '<p class="ws-Lead">Early prices until 31 December. Group discounts for five or more.</p>', rows: [
            { NAME: "Student", PRICE: "SAR 250", PERIOD: "2 days", DESCRIPTION: "With a valid student card.", FEATURES: "All talks|Lunch both days|Recordings", BUTTON_LABEL: "Buy", BUTTON_LINK: "#contact", IS_FEATURED: "N" },
            { NAME: "Conference", PRICE: "SAR 1,450", PERIOD: "2 days", DESCRIPTION: "Everything most people need.", FEATURES: "All talks|One workshop|Lunch and dinner|Recordings", BUTTON_LABEL: "Buy", BUTTON_LINK: "#contact", IS_FEATURED: "Y", BADGE: "Early price" },
            { NAME: "All access", PRICE: "SAR 2,900", PERIOD: "2 days", DESCRIPTION: "For teams who want it all.", FEATURES: "All talks|Every workshop|Speaker dinner|Front-row seats", BUTTON_LABEL: "Buy", BUTTON_LINK: "#contact", IS_FEATURED: "N" }] },
        { id: "venue", menu: "Venue", report: "ws-zigzag", title: "The venue", sec: ["ws-Sec--menu", "ws-Head--hidden"], rows: [
            { EYEBROW: "Venue", TITLE: "Riyadh Front *Exhibition* Centre", TEXT: "Ten minutes from the airport, with hotels and a metro station next door. Prayer rooms, a family room and step-free access throughout.", LINK: "#map", LINK_LABEL: "Map and directions", ...im("event-venue") }] },
        { id: "map", report: "ws-map", title: "Getting there", sec: ["ws-Head--hidden"], rep: ["ws-Maps--full"], rows: [
            { MAP_URL: "https://www.openstreetmap.org/export/embed.html?bbox=46.70%2C24.83%2C46.76%2C24.87&layer=mapnik", TITLE: "Riyadh Front Exhibition Centre", ADDRESS: "Airport Road, Riyadh", LINK: "https://www.openstreetmap.org/", LINK_LABEL: "Directions" }] },
        { id: "sponsors", menu: "Sponsors", report: "ws-logos", title: "Sponsors", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rep: ["ws-Logos--grid"],
          rows: ["Atlas Bank", "Orbital", "Northgrid", "Fieldnote", "Kestrel", "Lumen", "Harborline", "Petra"].map(n => ({ NAME: n })) },
        { id: "faq", report: "ws-faq", title: "Questions", sec: ["ws-Head--center"], rows: [
            { QUESTION: "Can I get a refund?", ANSWER: "Tickets can be transferred to a colleague at any time, and refunded until 1 February." },
            { QUESTION: "Will talks be recorded?", ANSWER: "Yes. Every ticket includes the recordings, available a week after the summit." },
            { QUESTION: "Is there a dress code?", ANSWER: "No. Come as you are." }] },
        { id: "contact", menu: "Contact", title: "Questions about *tickets*?", form: true, sec: ["ws-Sec--menu", "ws-Tone--soft"], css: "ws-Contact",
          header: '<p class="ws-Lead">Group bookings, invoices and speaker enquiries.</p>' }
    ],
    contact: [
        { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "summit@example.com", LINK: "mailto:summit@example.com" },
        { ICON: "fa-calendar", LABEL: "Dates", VALUE: "9 - 10 March 2027" },
        { ICON: "fa-map-marker", LABEL: "Venue", VALUE: "Riyadh Front Exhibition Centre" }],
    social: socials("linkedin", "x", "youtube"),
    footerCols: [{ id: "f-summit", title: "Summit", rows: [{ LABEL: "Programme", LINK: "#agenda" }, { LABEL: "Speakers", LINK: "#speakers" }, { LABEL: "Tickets", LINK: "#tickets" }, { LABEL: "Become a sponsor", LINK: "#contact" }] }],
    legal: [{ LABEL: "Code of conduct", LINK: "#" }, ...LEGAL],
    html: { logo: logo("Northwind Summit", "N"), footerAbout: footAbout("Northwind Summit", "N", "9 - 10 March 2027, Riyadh."), copyright: "<span>&copy; Northwind Events</span>" },
    form: FORM_EN, ogImage: "event-hero-1"
};

// ---------------------------------------------------------------- Lina Haddad (page 16): a portfolio
const lina = {
    key: "portfolio", page: 16, alias: "PORTFOLIO", name: "Starter - Portfolio", label: "Portfolio", brand: "Lina Haddad", icon: "fa-user",
    title: "Lina Haddad - Product Designer",
    description: "Lina Haddad is an independent product and brand designer in Jeddah. Selected work, services and contact.",
    look: "ws-Design--swiss ws-Accent--rose ws-Font--grotesk", preset: "portfolio",
    menu: {
        options: ["ws-Menu--cta", "ws-Menu--left"],
        entries: [
            { l: "Work", h: "#work", c: [{ l: "Branding", h: "#work" }, { l: "Web", h: "#work" }, { l: "Product", h: "#work" }] },
            { l: "About", h: "#about" }, { l: "Services", h: "#services" }, { l: "Experience", h: "#experience" },
            { l: "Dribbble", h: "https://dribbble.com/", ext: true },
            { l: "Hire me", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Lina Haddad", sec: HERO, rep: ["ws-Hero--split", "ws-Hero--medium"], rows: [
            { TITLE: "I design products people *enjoy* using.", SUBTITLE: "Product and brand designer - Jeddah", TEXT: "Ten years of apps, identities and websites for startups and banks.", BUTTON_LABEL: "Selected work", BUTTON_LINK: "#work", BUTTON2_LABEL: "Hire me", BUTTON2_LINK: "#contact", ...im("portfolio-hero") }] },
        { id: "work", menu: "Work", report: "ws-gallery", title: "Selected *work*", sec: ["ws-Sec--menu", "ws-Head--split"], rep: ["ws-Works--editorial"], rows: [
            { TITLE: "Kestrel Coffee", CATEGORY: "Branding", META: "Identity and packaging - 2025", ...im("work-4") }, { TITLE: "Lumen Bank app", CATEGORY: "Product", META: "Mobile banking - 2025", ...im("work-3") },
            { TITLE: "Orbital website", CATEGORY: "Web", META: "Marketing site - 2024", ...im("work-2") }, { TITLE: "Northgrid dashboard", CATEGORY: "Product", META: "Data product - 2024", ...im("work-5") },
            { TITLE: "Vantage Hotels", CATEGORY: "Branding", META: "Identity - 2023", ...im("work-6") }, { TITLE: "Fieldnote", CATEGORY: "Web", META: "Website and brand - 2023", ...im("work-1") }] },
        { id: "about", menu: "About", title: "About", html: "about", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--hidden"] },
        { id: "services", menu: "Services", report: "ws-features", title: "How I can *help*", sec: ["ws-Sec--menu"], rep: ["ws-Features--rows"], rows: [
            { ICON: "fa-mobile", TITLE: "Product design", TEXT: "Research, flows and polished interfaces for web and mobile apps." },
            { ICON: "fa-magic", TITLE: "Brand identity", TEXT: "Logos, colour and type systems with clear guidelines." },
            { ICON: "fa-desktop", TITLE: "Websites", TEXT: "Design and build of fast marketing sites in Webflow or Oracle APEX." }] },
        { id: "experience", menu: "Experience", report: "ws-timeline", title: "Experience", sec: ["ws-Sec--menu", "ws-Tone--soft"], rep: ["ws-Timeline--list"], rows: [
            { YEAR: "2022 - now", TITLE: "Independent designer", TEXT: "Product and brand work for clients in the Gulf and Europe." },
            { YEAR: "2018 - 2022", TITLE: "Lead Product Designer, Lumen Bank", TEXT: "Led the redesign of the mobile app used by two million customers." },
            { YEAR: "2015 - 2018", TITLE: "Designer, Halcyon Studio", TEXT: "Brand identities and websites for startups." }] },
        { id: "clients-say", report: "ws-testimonials", title: "Kind *words*", sec: ["ws-Head--center"], rep: ["ws-Quotes--spotlight"], rows: [
            { QUOTE: "Lina turned a messy brief into an app our customers love. Ratings went from 3.1 to 4.7.", NAME: "Daniel Brook", ROLE: "Head of Digital, Lumen Bank", RATING: "5", ...im("person-2") },
            { QUOTE: "Thoughtful, fast and a joy to work with.", NAME: "Priya Nair", ROLE: "Founder, Fieldnote", RATING: "5", ...im("person-3") }] },
        { id: "contact", menu: "Contact", title: "Let's *talk*", form: true, sec: ["ws-Sec--menu", "ws-Tone--soft"], css: "ws-Contact",
          header: '<p class="ws-Lead">Available for new projects from January.</p>' }
    ],
    contact: [
        { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "lina@example.com", LINK: "mailto:lina@example.com" },
        { ICON: "fa-map-marker", LABEL: "Based in", VALUE: "Jeddah, working worldwide" }],
    social: socials("dribbble", "behance", "linkedin", "instagram"),
    footerCols: [], legal: [],
    html: {
        logo: logo("Lina Haddad", "LH"), footerAbout: footAbout("Lina Haddad", "LH", "Product and brand designer."), copyright: "<span>&copy; Lina Haddad</span>",
        about: `<div class="ws-Split">
  ${media("person-3", "Lina Haddad")}
  <div class="ws-Stack">
    <p class="ws-Eyebrow">About</p>
    <h2 class="ws-Title">Hi, I am *Lina*.</h2>
    <p class="ws-Lead">I help teams turn complicated ideas into simple products. I studied architecture, which is why I still start every project with a pencil.</p>
    <ul class="ws-Checks"><li>Ten years in product and brand design</li><li>Arabic and English interfaces</li><li>Works directly with your developers</li></ul>
  </div>
</div>`
    },
    form: { ...FORM_EN, fields: [FORM_EN.fields[0], FORM_EN.fields[1], { n: "MESSAGE", t: "textarea", l: "Tell me about your project", span: 12, req: true }] },
    ogImage: "portfolio-hero"
};

// ---------------------------------------------------------------- Ledgerline (page 17): a SaaS product
const ledger = {
    key: "saas", page: 17, alias: "SAAS", name: "Starter - SaaS", label: "SaaS Product", brand: "Ledgerline", icon: "fa-rocket",
    title: "Ledgerline - Invoicing and Bookkeeping for Small Businesses",
    description: "Send invoices, get paid faster and keep your books ready for VAT. Free for 30 days, no card needed.",
    look: "ws-Design--saas ws-Accent--violet ws-Font--friendly ws-Header--pill ws-Fx--theme", preset: "saas",
    menu: {
        options: ["ws-Menu--cta"],
        entries: [
            { l: "Features", h: "#features" }, { l: "Customers", h: "#customers" }, { l: "Compare", h: "#compare" }, { l: "Pricing", h: "#pricing" },
            { l: "Resources", h: "#", c: [{ l: "Help centre", h: "https://example.com/help", ext: true }, { l: "Questions", h: "#faq" }, { l: "Status", h: "https://example.com/status", ext: true }] },
            { l: "Start free", h: "#contact" }
        ]
    },
    sections: [
        { id: "hero", slot: "hero", report: "ws-hero", title: "Ledgerline", sec: HERO, rep: ["ws-Hero--split"], rows: [
            { TITLE: "Invoices out. Money *in*. Books done.", SUBTITLE: "For small businesses", TEXT: "Ledgerline sends your invoices, chases late payers and keeps your books ready for VAT.", BUTTON_LABEL: "Start free for 30 days", BUTTON_LINK: "#contact", BUTTON2_LABEL: "See pricing", BUTTON2_LINK: "#pricing", ...im("saas-hero") }] },
        { id: "logos", report: "ws-logos", title: "Used by 12,000 businesses", sec: ["ws-Pad--tight", "ws-Head--center"], css: "ws-Sec--small", rep: ["ws-Speed--slow"],
          rows: ["Kestrel", "Fieldnote", "Tidewater", "Monogram", "Northpeak", "Vantage", "Orbital"].map(n => ({ NAME: n })) },
        { id: "features", menu: "Features", report: "ws-features", title: "Everything you need, *nothing* you don't", sec: ["ws-Sec--menu", "ws-Head--center"], rep: ["ws-Features--bento"], rows: [
            { ICON: "fa-file-text-o", TITLE: "Invoices in a minute", TEXT: "Branded, VAT-ready invoices with a pay-now link." },
            { ICON: "fa-bell-o", TITLE: "Polite reminders", TEXT: "Late payers get friendly reminders, so you don't have to." },
            { ICON: "fa-university", TITLE: "Bank sync", TEXT: "Payments match their invoices automatically." },
            { ICON: "fa-pie-chart", TITLE: "Clear reports", TEXT: "Cash flow, profit and VAT at a glance." },
            { ICON: "fa-users", TITLE: "Invite your accountant", TEXT: "Free access for your accountant, with an audit trail." }] },
        { id: "how", report: "ws-zigzag", title: "How it works", sec: ["ws-Tone--soft", "ws-Head--hidden"], rows: [
            { EYEBROW: "Get paid", TITLE: "Send an invoice from your *phone*.", TEXT: "Customers pay by card, Apple Pay or bank transfer. You see it the moment they do.", ...im("saas-1") },
            { EYEBROW: "Stay ready", TITLE: "Books that are always *up to date*.", TEXT: "Every payment and expense lands in the right place, so VAT returns take minutes.", LINK: "#features", LINK_LABEL: "All features", ...im("saas-2") }] },
        { id: "numbers", report: "ws-stats", title: "Results", sec: ["ws-Pad--tight", "ws-Head--hidden"], rep: ["ws-Stats--center"], rows: [
            { VALUE: "12000", SUFFIX: "+", LABEL: "Businesses" }, { VALUE: "9", LABEL: "Days faster to get paid" }, { VALUE: "4", SUFFIX: "h", LABEL: "Saved every month" }, { VALUE: "4.8", LABEL: "App Store rating" }] },
        { id: "customers", menu: "Customers", report: "ws-testimonials", title: "Loved by *owners*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rep: ["ws-Quotes--wall"], rows: [
            { QUOTE: "I used to spend Sunday nights on invoices. Now it takes ten minutes on Monday.", NAME: "Noura Al-Saud", ROLE: "Owner, Bloom Florist", RATING: "5", ...im("person-1") },
            { QUOTE: "Our customers pay a week earlier since we switched. That changed our cash flow.", NAME: "Chris Evans", ROLE: "Director, Kestrel Coffee", RATING: "5", ...im("person-4") },
            { QUOTE: "My accountant loves it, which says a lot.", NAME: "Hamad Q.", ROLE: "Freelance architect", RATING: "5", ...im("person-6") }] },
        { id: "compare", menu: "Compare", report: "ws-compare", title: "Why *Ledgerline*", sec: ["ws-Sec--menu", "ws-Head--center", "ws-Width--narrow"], rep: ["ws-Compare--hl1"], rows: [
            { FEATURE: "", COL1: "Ledgerline", COL2: "Spreadsheets", COL3: "Big accounting suites", IS_HEADER: "Y" },
            { FEATURE: "VAT-ready invoices", COL1: "Y", COL2: "N", COL3: "Y" },
            { FEATURE: "Automatic reminders", COL1: "Y", COL2: "N", COL3: "Y" },
            { FEATURE: "Set up in 10 minutes", COL1: "Y", COL2: "Y", COL3: "N" },
            { FEATURE: "Arabic and English", COL1: "Y", COL2: "Y", COL3: "N" },
            { FEATURE: "Price per month", COL1: "From SAR 29", COL2: "Free", COL3: "SAR 250+" }] },
        { id: "pricing", menu: "Pricing", report: "ws-pricing", title: "Simple *pricing*", sec: ["ws-Sec--menu", "ws-Tone--soft", "ws-Head--center"], rows: [
            { NAME: "Starter", PRICE: "SAR 29", PERIOD: "per month", DESCRIPTION: "For freelancers.", FEATURES: "20 invoices a month|Card payments|1 user", BUTTON_LABEL: "Start free", BUTTON_LINK: "#contact", IS_FEATURED: "N" },
            { NAME: "Business", PRICE: "SAR 79", PERIOD: "per month", DESCRIPTION: "For growing teams.", FEATURES: "Unlimited invoices|Bank sync|Reminders|5 users", BUTTON_LABEL: "Start free", BUTTON_LINK: "#contact", IS_FEATURED: "Y", BADGE: "Most popular" },
            { NAME: "Plus", PRICE: "SAR 149", PERIOD: "per month", DESCRIPTION: "For more than one company.", FEATURES: "Everything in Business|Multi-company|Priority support|Unlimited users", BUTTON_LABEL: "Talk to sales", BUTTON_LINK: "#contact", IS_FEATURED: "N" }] },
        { id: "faq", report: "ws-faq", title: "Questions", sec: ["ws-Head--center"], rows: [
            { QUESTION: "Do I need a card to try it?", ANSWER: "No. The trial is free for 30 days and asks for no payment details." },
            { QUESTION: "Is Ledgerline approved for e-invoicing?", ANSWER: "Yes. Invoices meet the ZATCA e-invoicing requirements, phase 2." },
            { QUESTION: "Can I export my data?", ANSWER: "Any time, as Excel or CSV. Your data is yours." }] },
        { id: "contact", menu: "Start free", title: "Start your free *trial*", form: true, sec: ["ws-Sec--menu", "ws-Tone--gradient"], css: "ws-Contact",
          header: '<p class="ws-Lead">Leave your details and we will set up your account today.</p>' }
    ],
    contact: [
        { ICON: "fa-envelope-o", LABEL: "Sales", VALUE: "sales@example.com", LINK: "mailto:sales@example.com" },
        { ICON: "fa-life-ring", LABEL: "Support", VALUE: "help@example.com", LINK: "mailto:help@example.com" }],
    social: socials("x", "linkedin", "youtube", "github"),
    footerCols: [
        { id: "f-product", title: "Product", rows: [{ LABEL: "Features", LINK: "#features" }, { LABEL: "Pricing", LINK: "#pricing" }, { LABEL: "Compare", LINK: "#compare" }] },
        { id: "f-help", title: "Help", rows: [{ LABEL: "Help centre", LINK: "https://example.com/help" }, { LABEL: "Status", LINK: "https://example.com/status" }, { LABEL: "Contact", LINK: "#contact" }] }],
    legal: LEGAL,
    html: { logo: logo("Ledgerline", "L"), footerAbout: footAbout("Ledgerline", "L", "Invoicing and bookkeeping for small businesses."), copyright: "<span>&copy; Ledgerline</span>" },
    form: { ...FORM_EN, fields: [FORM_EN.fields[0], FORM_EN.fields[1], { n: "COMPANY", t: "textField", l: "Business name", span: 12, req: true }], button: "Start free trial", success: "Welcome aboard. Check your email to finish setting up your account." },
    ogImage: "saas-hero"
};

export const SITES = [halcyon, meridian, lume, shifa, harbor, summit, lina, ledger];
