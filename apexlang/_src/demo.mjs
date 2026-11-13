// The demo website (page 10): a brand and design studio. Every report section is a SQL query; the rows below become
// "select ... from dual union all ..." queries in the page and the data of the QA harness, so both show the same content.
export const BRAND = "Halcyon";

// [static id, menu label, region title, template, report options, section options, header html, rows, region css classes]
export const SECTIONS = [
    { id: "hero", slot: "hero", report: "ws-hero", title: "Halcyon", sec: ["ws-Pad--none", "ws-Width--full", "ws-Head--hidden"], rep: [],
      rows: [
        { TITLE: "We design brands people *remember*.", SUBTITLE: "Brand and digital studio - Lisbon", TEXT: "Strategy, identity and websites for companies with something to say.",
          BUTTON_LABEL: "See our work", BUTTON_LINK: "#work", BUTTON2_LABEL: "Book a call", BUTTON2_LINK: "#contact" },
        { TITLE: "Websites that *work* as hard as you do.", SUBTITLE: "Websites", TEXT: "Fast, accessible sites your team can update without calling a developer.",
          BUTTON_LABEL: "Our services", BUTTON_LINK: "#services" },
        { TITLE: "From first sketch to *global* launch.", SUBTITLE: "Since 2011", TEXT: "One senior team from kickoff to the day you go live, and after.",
          BUTTON_LABEL: "Start a project", BUTTON_LINK: "#contact" }
      ] },
    { id: "clients", report: "ws-logos", title: "Trusted by teams at", sec: ["ws-Pad--tight", "ws-Head--center"], css: "ws-Sec--small",
      rows: ["Northpeak", "Orbital", "Lumen Bank", "Kestrel", "Fieldnote", "Vantage", "Tidewater", "Monogram"].map(n => ({ NAME: n })) },
    { id: "about", menu: "About", title: "About us", html: "about", sec: ["ws-Sec--menu", "ws-Head--hidden"] },
    { id: "numbers", report: "ws-stats", title: "Halcyon in numbers", sec: ["ws-Tone--soft", "ws-Pad--tight", "ws-Head--hidden"],
      rows: [{ VALUE: "140", SUFFIX: "+", LABEL: "Brands launched" }, { VALUE: "13", LABEL: "Years in business" },
             { VALUE: "24", LABEL: "People in the studio" }, { VALUE: "98", SUFFIX: "%", LABEL: "Clients who come back" }] },
    { id: "services", menu: "Services", report: "ws-features", title: "Six disciplines, *one* team.", sec: ["ws-Sec--menu"],
      header: '<p class="ws-Eyebrow">What we do</p><p class="ws-Lead">Most of our clients start with one project and stay for three. Here is where we can help.</p>',
      rows: [
        { ICON: "fa-compass", TITLE: "Brand strategy", TEXT: "Positioning, naming and messaging grounded in interviews with your customers." },
        { ICON: "fa-magic", TITLE: "Visual identity", TEXT: "Logos, type, colour and motion systems that hold up from favicon to billboard." },
        { ICON: "fa-code", TITLE: "Websites", TEXT: "Fast, accessible marketing sites built on a CMS your team can actually use.", LINK: "#work", LINK_LABEL: "See websites we built" },
        { ICON: "fa-object-group", TITLE: "Product design", TEXT: "Interfaces and design systems for web and mobile apps, tested with real users." },
        { ICON: "fa-line-chart", TITLE: "Content and growth", TEXT: "Editorial calendars, campaign art and landing pages that convert." },
        { ICON: "fa-users", TITLE: "Workshops", TEXT: "Half-day sessions that get founders and teams aligned before a rebrand." }
      ] },
    { id: "vision", title: "Our vision", html: "vision", sec: ["ws-Tone--dark", "ws-Head--hidden"] },
    { id: "work", menu: "Work", report: "ws-gallery", title: "Recent *projects*", sec: ["ws-Sec--menu", "ws-Head--split"],
      header: '<p class="ws-Eyebrow">Selected work</p><p class="ws-Lead">Identities, websites and products from the last two years.</p>',
      rows: [
        { TITLE: "Tidewater Ferries", CATEGORY: "Branding", META: "Identity - 2024" }, { TITLE: "Lumen Bank", CATEGORY: "Web", META: "Website - 2024" },
        { TITLE: "Fieldnote", CATEGORY: "Product", META: "App design - 2023" }, { TITLE: "Kestrel Coffee", CATEGORY: "Branding", META: "Packaging - 2023" },
        { TITLE: "Orbital Labs", CATEGORY: "Web", META: "Website - 2023" }, { TITLE: "Vantage Hotels", CATEGORY: "Branding", META: "Identity - 2022" }
      ] },
    { id: "process", report: "ws-steps", title: "A clear process, *no* surprises", sec: ["ws-Tone--soft"],
      header: '<p class="ws-Eyebrow">How we work</p><p class="ws-Lead">Every project follows the same four stages, so you always know what happens next and what it costs.</p>',
      rows: [
        { TITLE: "Discover", TEXT: "Interviews, audits and a workshop to learn what makes you different.", DURATION: "2 weeks" },
        { TITLE: "Define", TEXT: "A strategy and creative brief we both sign off before any design starts.", DURATION: "1 week" },
        { TITLE: "Design", TEXT: "Concepts, rounds of refinement and testing with your customers.", DURATION: "4 to 6 weeks" },
        { TITLE: "Deliver", TEXT: "Launch, guidelines, files and training so your team owns the result.", DURATION: "2 weeks" }
      ] },
    { id: "clients-say", report: "ws-testimonials", title: "Clients who *stayed*", sec: ["ws-Head--center"],
      header: '<p class="ws-Eyebrow">Customers</p>',
      rows: [
        { QUOTE: "Halcyon understood our business faster than our own board did. The new brand paid for itself in the first quarter.", NAME: "Sofia Marques", ROLE: "CEO, Tidewater Ferries", RATING: "5" },
        { QUOTE: "They are the rare studio that is as good at listening as they are at design. Our site conversion doubled after launch.", NAME: "Daniel Brook", ROLE: "Head of Marketing, Lumen Bank", RATING: "5" },
        { QUOTE: "Calm, honest and very talented. Three projects in and we would not go anywhere else.", NAME: "Priya Nair", ROLE: "Founder, Fieldnote", RATING: "5" }
      ] },
    { id: "team", menu: "Team", report: "ws-team", title: "The people you will *actually* work with", sec: ["ws-Sec--menu", "ws-Tone--soft"],
      header: '<p class="ws-Eyebrow">Team</p>',
      rows: [
        { NAME: "Ines Duarte", ROLE: "Founder and Creative Director", LINK: "https://www.linkedin.com/" },
        { NAME: "Tomas Ferreira", ROLE: "Design Director", LINK: "https://www.linkedin.com/" },
        { NAME: "Amara Okafor", ROLE: "Head of Strategy", LINK: "https://www.linkedin.com/" },
        { NAME: "Leo Brandt", ROLE: "Engineering Lead", LINK: "https://www.linkedin.com/" }
      ] },
    { id: "history", report: "ws-timeline", title: "Thirteen years, *one* desk at a time", sec: ["ws-Head--center"],
      header: '<p class="ws-Eyebrow">Our story</p>',
      rows: [
        { YEAR: "2011", TITLE: "Founded in Alfama", TEXT: "Two designers, one borrowed printer and a first client who still works with us." },
        { YEAR: "2015", TITLE: "First international client", TEXT: "A rebrand for a Berlin fintech took us beyond Portugal." },
        { YEAR: "2019", TITLE: "Studio of the Year", TEXT: "A regional design award for our work with a ferry operator." },
        { YEAR: "2024", TITLE: "Porto studio opens", TEXT: "Ten new people and a riverside room with very good light." }
      ] },
    { id: "careers", menu: "Careers", report: "ws-jobs", title: "Do the best work of your *life*", sec: ["ws-Sec--menu", "ws-Tone--soft"],
      header: '<p class="ws-Eyebrow">Careers</p><p class="ws-Lead">We hire slowly and keep people for a long time. Our average tenure is six years.</p>',
      rows: [
        { TITLE: "Senior Brand Designer", TEAM: "Design", LOCATION: "Lisbon", TYPE: "Full-time", DESCRIPTION: "Lead identity projects from concept to guidelines, and mentor two mid-level designers.", APPLY_LINK: "mailto:jobs@example.com?subject=Senior%20Brand%20Designer" },
        { TITLE: "Frontend Engineer", TEAM: "Engineering", LOCATION: "Remote (EU)", TYPE: "Full-time", DESCRIPTION: "Build fast, accessible marketing sites with our designers.", APPLY_LINK: "mailto:jobs@example.com?subject=Frontend%20Engineer" },
        { TITLE: "Brand Strategist", TEAM: "Strategy", LOCATION: "Porto", TYPE: "Full-time", DESCRIPTION: "Run research and workshops, and write the strategies our design work stands on.", APPLY_LINK: "mailto:jobs@example.com?subject=Brand%20Strategist" },
        { TITLE: "Design Intern", TEAM: "Design", LOCATION: "Lisbon", TYPE: "6-month internship", DESCRIPTION: "Paid internship for a recent graduate. You work on real client projects from week one.", APPLY_LINK: "mailto:jobs@example.com?subject=Design%20Intern" }
      ] },
    { id: "pricing", menu: "Pricing", report: "ws-pricing", title: "Simple, *fixed* prices", sec: ["ws-Sec--menu", "ws-Head--center"],
      header: '<p class="ws-Eyebrow">Pricing</p><p class="ws-Lead">Every engagement has a fixed fee agreed up front. No hourly billing, no surprise invoices.</p>',
      rows: [
        { NAME: "Brand Sprint", PRICE: "EUR 6,900", PERIOD: "one-off", DESCRIPTION: "For new companies that need to look credible, fast.", FEATURES: "Two-week sprint|Logo and word mark|Colour and type system|One-page guidelines", BUTTON_LABEL: "Book a sprint", BUTTON_LINK: "#contact", IS_FEATURED: "N" },
        { NAME: "Brand and Website", PRICE: "EUR 18,500", PERIOD: "one-off", DESCRIPTION: "Our most popular project: a full identity and a site to launch it.", FEATURES: "Strategy workshop|Complete visual identity|8-page website on your CMS|Full guidelines and assets|60 days of launch support", BUTTON_LABEL: "Start a project", BUTTON_LINK: "#contact", IS_FEATURED: "Y", BADGE: "Most popular" },
        { NAME: "Partnership", PRICE: "EUR 4,200", PERIOD: "per month", DESCRIPTION: "A senior team on call for ongoing design and campaigns.", FEATURES: "Up to 40 hours a month|Dedicated designer and strategist|Monthly planning session|Cancel with 30 days notice", BUTTON_LABEL: "Talk to us", BUTTON_LINK: "#contact", IS_FEATURED: "N" }
      ] },
    { id: "faq", report: "ws-faq", title: "Questions we *often* hear", sec: ["ws-Tone--soft", "ws-Head--center"],
      header: '<p class="ws-Eyebrow">FAQ</p>',
      rows: [
        { QUESTION: "How long does a typical project take?", ANSWER: "A brand sprint takes two weeks. A full identity and website usually takes ten to fourteen weeks from kickoff to launch." },
        { QUESTION: "Do you work with clients outside Portugal?", ANSWER: "Yes. About half of our clients are elsewhere in Europe and North America. We run most sessions remotely and travel for key workshops." },
        { QUESTION: "Can we update the website ourselves?", ANSWER: "Always. We build on a CMS your team can edit and include a recorded training session with every site." },
        { QUESTION: "Do you offer payment in instalments?", ANSWER: "Yes. Projects are billed in three parts: at kickoff, at design approval and at launch." }
      ] },
    { id: "start", title: "Have a project in *mind*?", html: "cta", sec: ["ws-Tone--gradient", "ws-Head--center", "ws-Width--narrow", "ws-Edge--slant"],
      header: '<p class="ws-Lead">Tell us about it. We reply to every message within two working days.</p>' },
    { id: "contact", menu: "Contact", title: "Let's make something *good*", form: true, sec: ["ws-Sec--menu"], css: "ws-Contact",
      header: '<p class="ws-Eyebrow">Contact</p><p class="ws-Lead">Tell us a little about your project and we will get back to you.</p>' },
];

// contact details shown next to the form (a sub region of the contact section)
export const CONTACT = [
    { ICON: "fa-envelope-o", LABEL: "Email", VALUE: "hello@example.com", LINK: "mailto:hello@example.com" },
    { ICON: "fa-phone", LABEL: "Phone", VALUE: "+351 21 000 4821", LINK: "tel:+351210004821" },
    { ICON: "fa-map-marker", LABEL: "Studio", VALUE: "Rua da Saudade 18, Lisboa", LINK: "https://www.openstreetmap.org/search?query=Rua%20da%20Saudade%2018%20Lisboa" },
    { ICON: "fa-clock-o", LABEL: "Hours", VALUE: "Mon to Thu, 9:00 to 18:00" }
];
export const SOCIAL = [
    { LABEL: "Instagram", LINK: "https://www.instagram.com/", ICON: "fa-instagram" }, { LABEL: "LinkedIn", LINK: "https://www.linkedin.com/", ICON: "fa-linkedin" },
    { LABEL: "Dribbble", LINK: "https://dribbble.com/", ICON: "fa-dribbble" }, { LABEL: "YouTube", LINK: "https://www.youtube.com/", ICON: "fa-youtube-play" }
];
export const FOOTER_COLS = [
    { id: "f-studio", title: "Studio", rows: [{ LABEL: "About", LINK: "#about" }, { LABEL: "Work", LINK: "#work" }, { LABEL: "Careers", LINK: "#careers" }, { LABEL: "Contact", LINK: "#contact" }] },
    { id: "f-services", title: "Services", rows: [{ LABEL: "Brand strategy", LINK: "#services" }, { LABEL: "Visual identity", LINK: "#services" }, { LABEL: "Websites", LINK: "#services" }, { LABEL: "Product design", LINK: "#services" }] },
    { id: "f-hello", title: "Say hello", rows: [{ LABEL: "hello@example.com", LINK: "mailto:hello@example.com" }, { LABEL: "+351 21 000 4821", LINK: "tel:+351210004821" }, { LABEL: "Rua da Saudade 18, Lisboa", LINK: "#contact" }] }
];
export const LEGAL = [{ LABEL: "Privacy", LINK: "#" }, { LABEL: "Cookies", LINK: "#" }, { LABEL: "Imprint", LINK: "#" }];

export const HTML = {
    logo: `<a class="ws-Brand" href="#top"><span class="ws-Logo-mark" aria-hidden="true">H</span>${BRAND}</a>`,
    about: `<div class="ws-Split">
  <div class="ws-Media" data-img="" role="img" aria-label="The Halcyon studio in Lisbon"></div>
  <div class="ws-Stack">
    <p class="ws-Eyebrow">About us</p>
    <h2 class="ws-Title">A small studio with a *long* memory.</h2>
    <p class="ws-Lead">We started Halcyon in 2011 in a two-desk room above a bakery in Alfama. Today we are 24 people across Lisbon and Porto, and we still sketch every idea on paper first.</p>
    <p class="ws-Muted">We work with a handful of clients at a time, so the people you meet in the pitch are the people who do the work.</p>
    <ul class="ws-Checks">
      <li>Senior team on every project</li>
      <li>Strategy, identity, web and product under one roof</li>
      <li>Carbon-neutral studio since 2020</li>
    </ul>
    <a class="ws-More" href="#team">Meet the team</a>
  </div>
</div>`,
    vision: `<div class="ws-Stack">
  <p class="ws-Eyebrow">Our vision</p>
  <p class="ws-Statement">Every company deserves a brand it can be *proud* to put its name on.</p>
</div>
<div class="ws-Pillars">
  <div><h3>Vision</h3><p>A world where small, honest companies look as good as the giants, and earn trust because of it.</p></div>
  <div><h3>Mission</h3><p>Give each client a senior team, a clear process and work that still feels right in ten years.</p></div>
  <div><h3>Values</h3><p>Say what we mean. Sweat the details. Leave every project, and every person, better than we found them.</p></div>
</div>`,
    cta: `<div class="ws-Actions ws-Center"><a class="ws-Btn" href="#contact">Start a project</a><a class="ws-Btn ws-Btn--ghost" href="mailto:hello@example.com">hello@example.com</a></div>`,
    footerAbout: `<a class="ws-Brand" href="#top"><span class="ws-Logo-mark" aria-hidden="true">H</span>${BRAND}</a>
<p>Brand and digital design studio in Lisbon and Porto.</p>`,
    copyright: `<span>&copy; ${BRAND} Studio Lda. All rights reserved.</span>`
};

// the SQL a report region runs: one select per row, in order
// "page:ALIAS#anchor" is a link to another page of the application (multi-page websites): apex_page.get_url adds the session
const lit = v => v == null || v === "" ? "null"
    : /^page:/.test(v) ? (([p, a]) => `apex_page.get_url(p_page => '${p}')${a ? ` || '#${a}'` : ""}`)(String(v).slice(5).split("#"))
    : "'" + String(v).replace(/'/g, "''") + "'";
export function sql(rows) {
    const cols = [...new Set(rows.flatMap(r => Object.keys(r)))];
    return rows.map((r, i) => "select " + cols.map(c => `${lit(r[c])} as ${c.toLowerCase()}`).join(",\n       ") + `,\n       ${i + 1} as sort_order\n  from dual`)
        .join("\nunion all\n") + "\norder by sort_order";
}
export const columnsOf = rows => [...new Set(rows.flatMap(r => Object.keys(r)))].concat("SORT_ORDER");
