// Website Studio templates and their template options. [css class, option name (<= 30 bytes), help]
// Group ids are the template option group static ids (template-option-groups.apx), referenced as @page/<id>, @region/<id>, @report/<id>.
export const ACCENTS = [["ocean", "Ocean"], ["indigo", "Indigo"], ["violet", "Violet"], ["emerald", "Emerald"], ["rose", "Rose"], ["amber", "Amber"],
                        ["slate", "Slate"], ["wine", "Wine"], ["tangerine", "Tangerine"], ["cyan", "Cyan"]];

export const DESIGNS = [
    ["clean", "Clean", "White pages, soft shadows and rounded cards"],
    ["editorial", "Editorial", "Paper colours, serif headlines, fine rules and square corners"],
    ["bold", "Bold", "Neo-brutalist: ink outlines and hard offset shadows"],
    ["soft", "Soft UI", "Neumorphic: cards rise out of a soft grey page"],
    ["glass", "Glass", "Frosted cards over a colour wash in the accent colours"],
    ["midnight", "Midnight", "Always dark, with glowing buttons"],
    ["minimal", "Minimal", "No cards: hairlines, large type and white space"]
];

export const FONTS = [
    ["", "System", "The visitor's system font. Nothing to download."],
    ["grotesk", "Grotesk", "Bricolage Grotesque headlines, DM Sans text"],
    ["serif", "Serif", "Fraunces headlines, Instrument Sans text"],
    ["luxe", "Luxe", "Cormorant Garamond headlines, Montserrat text"],
    ["tech", "Tech", "Sora headlines, IBM Plex Sans text"],
    ["poster", "Poster", "Anton capitals, Archivo text"],
    ["friendly", "Friendly", "Outfit for headlines and text"]
];

// ---------- Modern One Page (page template) ----------
export const PAGE = {
    defaults: ["ws-Fx--sticky", "ws-Fx--reveal", "ws-Fx--count", "ws-Fx--top"],
    groups: [
        { id: "ws-design", name: "Design", seq: 5, nul: "Clean", help: "The overall look of the website. Accent Color, Color Scheme, Typeface and Corners still change it.",
          options: DESIGNS.slice(1).map(([id, n, h]) => ["ws-Design--" + id, n, h]) },
        { id: "ws-accent", name: "Accent Color", seq: 10, nul: "Theme Color", help: "Buttons, highlights, icons and the built-in artwork. Theme Color uses your theme style's primary colour.",
          options: ACCENTS.map(([id, n]) => ["ws-Accent--" + id, n]) },
        { id: "ws-scheme", name: "Color Scheme", seq: 20, nul: "Light", help: "Midnight is always dark. Sections set to Dark or Accent keep their own colours.",
          options: [["ws-Scheme--dark", "Dark"], ["ws-Scheme--auto", "Follow Device Setting"]] },
        { id: "ws-font", name: "Typeface", seq: 30, nul: "System", help: "Headline and text fonts. Every choice except System loads its fonts from Google Fonts.",
          options: FONTS.slice(1).map(([id, n, h]) => ["ws-Font--" + id, n, h]) },
        { id: "ws-header", name: "Header", seq: 40, nul: "Classic", help: "Transparent lays the header over the first section (use it with a Slider or Full Bleed hero); it turns solid when the visitor scrolls.",
          options: [["ws-Header--centered", "Centered Logo"], ["ws-Header--pill", "Floating Pill"], ["ws-Header--transparent", "Transparent over Hero"]] },
        { id: "ws-corners", name: "Corners", seq: 50, nul: "Rounded", options: [["ws-Corners--square", "Square"], ["ws-Corners--soft", "Soft"], ["ws-Corners--round", "Extra Round"]] },
        { id: "ws-space", name: "Section Spacing", seq: 60, nul: "Comfortable", options: [["ws-Space--compact", "Compact"], ["ws-Space--airy", "Airy"]] },
        { id: "ws-footer", name: "Footer", seq: 70, nul: "Dark", options: [["ws-Footer--light", "Light"], ["ws-Footer--accent", "Accent Color"]] }
    ],
    singles: [
        ["ws-Fx--sticky", "Sticky Header", 100, "The header stays at the top while the visitor scrolls."],
        ["ws-Fx--reveal", "Reveal on Scroll", 110, "Sections fade in as they scroll into view. Visitors who prefer reduced motion see them at once."],
        ["ws-Fx--count", "Count Up Numbers", 120, "Numbers in the Website - Numbers report count up when they come into view."],
        ["ws-Fx--top", "Back to Top Button", 130, "A round button in the corner after the visitor has scrolled down."],
        ["ws-Fx--progress", "Scroll Progress Bar", 140, "A thin bar in the accent colour at the top of the page."]
    ]
};

// ---------- Modern Section (region template) ----------
export const SECTION = {
    defaults: ["ws-Sec--menu"],
    groups: [
        { id: "ws-tone", name: "Background", seq: 10, nul: "Page", help: "Soft is a slightly tinted band, Dark and Accent invert the colours, Gradient runs between the two accent colours.",
          options: [["ws-Tone--soft", "Soft"], ["ws-Tone--dark", "Dark"], ["ws-Tone--accent", "Accent"], ["ws-Tone--gradient", "Gradient"]] },
        { id: "ws-pad", name: "Spacing", seq: 20, nul: "Normal", help: "None removes the top and bottom space, for a hero or a full-width band.",
          options: [["ws-Pad--tight", "Tight"], ["ws-Pad--roomy", "Roomy"], ["ws-Pad--none", "None"]] },
        { id: "ws-head", name: "Heading", seq: 30, nul: "Left", help: "The region title is the section heading. Put <p class=\"ws-Eyebrow\">...</p> and <p class=\"ws-Lead\">...</p> at the start of the region's Header text for a small label above and an intro below it.",
          options: [["ws-Head--center", "Centered"], ["ws-Head--split", "Split"], ["ws-Head--hidden", "Hidden"]] },
        { id: "ws-width", name: "Width", seq: 40, nul: "Normal", options: [["ws-Width--narrow", "Narrow"], ["ws-Width--wide", "Wide"], ["ws-Width--full", "Full Width"]] }
    ],
    singles: [
        ["ws-Sec--menu", "Show in Menu", 100, "Adds the section to the header menu, labelled with the region title. The section's Static ID is the link anchor."],
        ["ws-Divider", "Top Divider", 110, "A hairline above the section."]
    ]
};

// ---------- the Website report templates (Classic Report, named column) ----------
// cols: the query's column names (all optional); row: the row template; top: the opening tag.
const AUTO = { id: "wsr-autoplay", name: "Autoplay", nul: "6 Seconds", options: [["ws-Auto--4", "4 Seconds"], ["ws-Auto--9", "9 Seconds"], ["ws-Auto--off", "Off"]] };
export const REPORTS = [
    { id: "ws-hero", name: "Website - Hero", base: "ws-Hero", tag: "div",
      cols: ["TITLE", "SUBTITLE", "TEXT", "IMAGE_URL", "BUTTON_LABEL", "BUTTON_LINK", "BUTTON2_LABEL", "BUTTON2_LINK"],
      help: "The opening section. One row is one slide; with more than one row it becomes a slider.",
      preset: [],
      groups: [{ id: "wsr-hero-layout", name: "Layout", nul: "Slider", help: "Slider and Full Bleed put the text over the image; Split and Centered put it next to or above it.",
                 options: [["ws-Hero--split", "Split"], ["ws-Hero--centered", "Centered"], ["ws-Hero--fullbleed", "Full Bleed"]], nulClass: "ws-Hero--slider" }, AUTO],
      row: `<div class="ws-Slide">
  <div class="ws-Slide-media ws-Media" data-img="#IMAGE_URL#" role="img" aria-label="#TITLE#"></div>
  <div class="ws-Slide-body">
    <p class="ws-Eyebrow" data-opt="text">#SUBTITLE#</p>
    <h1 class="ws-Display">#TITLE#</h1>
    <p class="ws-Lead" data-opt="text">#TEXT#</p>
    <div class="ws-Actions"><a class="ws-Btn" href="#BUTTON_LINK#">#BUTTON_LABEL#</a><a class="ws-Btn ws-Btn--ghost" href="#BUTTON2_LINK#">#BUTTON2_LABEL#</a></div>
  </div>
</div>` },
    { id: "ws-stats", name: "Website - Numbers", base: "ws-Stats", tag: "div",
      cols: ["VALUE", "PREFIX", "SUFFIX", "LABEL", "TEXT"], help: "Key figures that count up when they scroll into view (page option Count Up Numbers).",
      groups: [{ id: "wsr-stats-layout", name: "Layout", nul: "Row", options: [["ws-Stats--cards", "Cards"]] }],
      singles: [["ws-Stats--center", "Center Text", 10]],
      row: `<div class="ws-Stat">
  <div class="ws-Stat-n">#PREFIX#<span class="ws-Count" data-to="#VALUE#">#VALUE#</span>#SUFFIX#</div>
  <div class="ws-Stat-l">#LABEL#</div>
  <p class="ws-Stat-t" data-opt="text">#TEXT#</p>
</div>` },
    { id: "ws-features", name: "Website - Services", base: "ws-Features", tag: "div",
      cols: ["ICON", "TITLE", "TEXT", "LINK", "LINK_LABEL"], help: "Services, features or benefits. ICON is a Font APEX class such as fa-lightbulb-o.",
      groups: [{ id: "wsr-features-layout", name: "Layout", nul: "Cards", options: [["ws-Features--rows", "Rows"], ["ws-Features--bento", "Bento"], ["ws-Features--icons", "Icons Only"]] },
               { id: "wsr-columns", name: "Columns", nul: "3", options: [["ws-Cols--2", "2"], ["ws-Cols--4", "4"]] }],
      row: `<article class="ws-Card ws-Feature">
  <span class="ws-Icon fa #ICON#" data-icon="fa-star-o" aria-hidden="true"></span>
  <h3>#TITLE#</h3>
  <p data-opt="text">#TEXT#</p>
  <a class="ws-More" href="#LINK#">#LINK_LABEL#</a>
</article>` },
    { id: "ws-team", name: "Website - Team", base: "ws-Team", tag: "div",
      cols: ["NAME", "ROLE", "IMAGE_URL", "BIO", "LINK", "LINK_ICON"], help: "People with a photo (or their initials), role and a profile link. LINK_ICON defaults to fa-linkedin.",
      groups: [{ id: "wsr-team-layout", name: "Layout", nul: "Portrait Cards", options: [["ws-Team--round", "Round Photos"], ["ws-Team--list", "Compact List"]] }],
      row: `<article class="ws-Person">
  <div class="ws-Person-top">
    <div class="ws-Person-photo ws-Media" data-img="#IMAGE_URL#" data-initials="#NAME#" role="img" aria-label="#NAME#"></div>
    <a class="ws-Person-link" href="#LINK#" data-opt="href" aria-label="#NAME#"><span class="fa #LINK_ICON#" data-icon="fa-linkedin" aria-hidden="true"></span></a>
  </div>
  <h3>#NAME#</h3>
  <p class="ws-Role">#ROLE#</p>
  <p class="ws-Bio" data-opt="text">#BIO#</p>
</article>` },
    { id: "ws-testimonials", name: "Website - Testimonials", base: "ws-Quotes", tag: "div",
      cols: ["QUOTE", "NAME", "ROLE", "IMAGE_URL", "RATING"], help: "What customers say. RATING is 0 to 5 stars (empty hides the stars).",
      groups: [{ id: "wsr-quotes-layout", name: "Layout", nul: "Carousel", options: [["ws-Quotes--wall", "Wall"], ["ws-Quotes--spotlight", "Spotlight"]], nulClass: "ws-Quotes--carousel" }, AUTO],
      row: `<figure class="ws-Quote">
  <span class="ws-Stars" data-r="#RATING#" aria-hidden="true"></span>
  <blockquote>#QUOTE#</blockquote>
  <figcaption><span class="ws-Avatar ws-Media" data-img="#IMAGE_URL#" data-initials="#NAME#"></span><span><b>#NAME#</b><small>#ROLE#</small></span></figcaption>
</figure>` },
    { id: "ws-logos", name: "Website - Logos", base: "ws-Logos", tag: "div",
      cols: ["NAME", "IMAGE_URL", "LINK"], help: "Clients, partners or press. Without IMAGE_URL the name is shown as a word mark.",
      groups: [{ id: "wsr-logos-layout", name: "Layout", nul: "Scrolling Marquee", options: [["ws-Logos--grid", "Grid"], ["ws-Logos--row", "Row"]], nulClass: "ws-Logos--marquee" }],
      row: `<a class="ws-Logo-item" href="#LINK#"><span class="ws-Logo-img" data-img="#IMAGE_URL#" data-alt="#NAME#"></span><span class="ws-Logo-name">#NAME#</span></a>` },
    { id: "ws-pricing", name: "Website - Pricing", base: "ws-Plans", tag: "div",
      cols: ["NAME", "PRICE", "PERIOD", "DESCRIPTION", "FEATURES", "BUTTON_LABEL", "BUTTON_LINK", "IS_FEATURED", "BADGE"],
      help: "Plans. FEATURES is one feature per line (or separated by | or ;). IS_FEATURED = Y highlights a plan.",
      preset: ["ws-Plans--lift"],
      groups: [{ id: "wsr-plans-style", name: "Featured Plan", nul: "Dark", options: [["ws-Plans--accent", "Accent Color"]] }],
      singles: [["ws-Plans--lift", "Lift the Featured Plan", 10]],
      row: `<article class="ws-Card ws-Plan" data-featured="#IS_FEATURED#">
  <span class="ws-Badge" data-opt="text">#BADGE#</span>
  <h3>#NAME#</h3>
  <p class="ws-Plan-d" data-opt="text">#DESCRIPTION#</p>
  <div class="ws-Price"><b>#PRICE#</b><span>#PERIOD#</span></div>
  <a class="ws-Btn" href="#BUTTON_LINK#">#BUTTON_LABEL#</a>
  <div data-list="#FEATURES#"></div>
</article>` },
    { id: "ws-timeline", name: "Website - Timeline", base: "ws-Timeline", tag: "div",
      cols: ["YEAR", "TITLE", "TEXT"], help: "Milestones of your history.",
      groups: [{ id: "wsr-timeline-layout", name: "Layout", nul: "Alternating", options: [["ws-Timeline--list", "List"]], nulClass: "ws-Timeline--alternate" }],
      row: `<div class="ws-Mile">
  <span class="ws-Mile-y">#YEAR#</span>
  <div><h3>#TITLE#</h3><p data-opt="text">#TEXT#</p></div>
</div>` },
    { id: "ws-steps", name: "Website - Process", base: "ws-Steps", tag: "ol",
      cols: ["TITLE", "TEXT", "DURATION"], help: "How you work, numbered in the order of the query.",
      groups: [{ id: "wsr-steps-layout", name: "Layout", nul: "Connected", options: [["ws-Steps--cards", "Cards"]], nulClass: "ws-Steps--line" }],
      row: `<li class="ws-Step">
  <span class="ws-Step-n" aria-hidden="true"></span>
  <h3>#TITLE#</h3>
  <p data-opt="text">#TEXT#</p>
  <span class="ws-Step-t" data-opt="text">#DURATION#</span>
</li>` },
    { id: "ws-faq", name: "Website - FAQ", base: "ws-Faqs", tag: "div",
      cols: ["QUESTION", "ANSWER"], help: "Questions that open to show the answer.",
      groups: [{ id: "wsr-faq-layout", name: "Layout", nul: "List", options: [["ws-Faqs--columns", "Two Columns"]] }],
      row: `<details class="ws-Faq"><summary>#QUESTION#<span class="ws-Plus" aria-hidden="true"></span></summary><div class="ws-Faq-a">#ANSWER#</div></details>` },
    { id: "ws-jobs", name: "Website - Careers", base: "ws-Jobs", tag: "div",
      cols: ["TITLE", "TEAM", "LOCATION", "TYPE", "DESCRIPTION", "APPLY_LINK", "APPLY_LABEL"], help: "Open roles that open to show the description and an apply button. Filter Buttons groups them by TEAM.",
      preset: ["ws-Filter"],
      groups: [{ id: "wsr-jobs-layout", name: "Layout", nul: "List", options: [["ws-Jobs--cards", "Cards"]] }],
      singles: [["ws-Filter", "Filter Buttons", 10]],
      row: `<details class="ws-Job" data-tag="#TEAM#">
  <summary><span class="ws-Job-main"><b>#TITLE#</b><span class="ws-Job-meta"><span class="ws-Job-team" data-opt="text">#TEAM#</span><span data-opt="text"><span class="fa fa-map-marker" aria-hidden="true"></span>#LOCATION#</span><span data-opt="text"><span class="fa fa-clock-o" aria-hidden="true"></span>#TYPE#</span></span></span><span class="ws-Plus" aria-hidden="true"></span></summary>
  <div class="ws-Job-d"><p data-opt="text">#DESCRIPTION#</p><a class="ws-Btn" href="#APPLY_LINK#">#APPLY_LABEL#</a></div>
</details>` },
    { id: "ws-gallery", name: "Website - Portfolio", base: "ws-Works", tag: "div",
      cols: ["TITLE", "CATEGORY", "IMAGE_URL", "LINK", "META"], help: "Projects or photos. Filter Buttons groups them by CATEGORY.",
      preset: ["ws-Filter"],
      groups: [{ id: "wsr-works-layout", name: "Layout", nul: "Grid", options: [["ws-Works--editorial", "Editorial"], ["ws-Works--large", "Large"]] }],
      singles: [["ws-Filter", "Filter Buttons", 10]],
      row: `<a class="ws-Work" href="#LINK#" data-tag="#CATEGORY#">
  <span class="ws-Work-img ws-Media" data-img="#IMAGE_URL#" role="img" aria-label="#TITLE#"></span>
  <span class="ws-Work-c"><span><b>#TITLE#</b><small>#META#</small></span></span>
</a>` },
    { id: "ws-links", name: "Website - Links", base: "ws-Links", tag: "div",
      cols: ["LABEL", "LINK", "ICON"], help: "Social media icons, footer link lists or link tiles. ICON is a Font APEX class such as fa-instagram.",
      groups: [{ id: "wsr-links-layout", name: "Layout", nul: "Round Icons", options: [["ws-Links--list", "List"], ["ws-Links--inline", "Inline"], ["ws-Links--tiles", "Tiles"]], nulClass: "ws-Links--icons" }],
      singles: [["ws-Size--big", "Large Icons", 10]],
      row: `<a class="ws-Link" href="#LINK#" rel="noopener"><span class="fa #ICON#" data-icon="" aria-hidden="true"></span><span class="ws-Link-l">#LABEL#</span></a>` },
    { id: "ws-contact", name: "Website - Contact Details", base: "ws-Infos", tag: "div",
      cols: ["ICON", "LABEL", "VALUE", "LINK"], help: "Address, phone, email and opening hours. LINK makes the value a link (mailto:, tel:, a map URL).",
      groups: [{ id: "wsr-infos-layout", name: "Layout", nul: "List", options: [["ws-Infos--cards", "Cards"]] }],
      row: `<div class="ws-Info"><span class="ws-Icon fa #ICON#" data-icon="fa-info-circle" aria-hidden="true"></span><div><small>#LABEL#</small><a href="#LINK#">#VALUE#</a></div></div>` }
];

// option group ids per template type (template-option-groups.apx)
export const GROUP_TYPES = { page: PAGE.groups, region: SECTION.groups };
