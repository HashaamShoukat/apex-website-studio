// Website Studio templates and their template options. [css class, option name (<= 30 bytes), help]
// Group ids are the template option group static ids (template-option-groups.apx), referenced as @page/<id>, @region/<id>, @report/<id>, @list/<id>.
export const ACCENTS = [["ocean", "Ocean"], ["indigo", "Indigo"], ["violet", "Violet"], ["emerald", "Emerald"], ["rose", "Rose"], ["amber", "Amber"],
                        ["slate", "Slate"], ["wine", "Wine"], ["tangerine", "Tangerine"], ["cyan", "Cyan"]];

export const DESIGNS = [
    ["clean", "Clean", "White pages, soft shadows and rounded cards"],
    ["editorial", "Editorial", "Paper colours, serif headlines, fine rules and square corners"],
    ["bold", "Bold", "Neo-brutalist: ink outlines and hard offset shadows"],
    ["soft", "Soft UI", "Neumorphic: cards rise out of a soft grey page"],
    ["glass", "Glass", "Frosted cards over a colour wash in the accent colours"],
    ["midnight", "Midnight", "Always dark, with glowing buttons"],
    ["minimal", "Minimal", "No cards: hairlines, large type and white space"],
    ["corporate", "Corporate", "Structured and image-led: navy and grey, square buttons, a ruled heading"],
    ["saas", "Startup / SaaS", "A soft gradient mesh, framed product shots and glowing cards"],
    ["luxury", "Elegant / Luxury", "Cream or black, thin serif headings, gold details, no rounded corners"],
    ["playful", "Playful", "Rounded and bright: sticker labels, tinted cards and offset shadows"],
    ["organic", "Organic / Nature", "Earthy colours, soft organic shapes and a paper texture"],
    ["techgrid", "Tech Grid", "Dark, fine grid lines, monospace details and sharp corners"],
    ["swiss", "Swiss", "A strict grid, big sans-serif type, red details and hairline rules"],
    ["retro", "Retro Print", "Newsprint colours, ink borders, halftone dots and stamped labels"]
];

export const FONTS = [
    ["", "System", "The visitor's system font. Nothing to download."],
    ["grotesk", "Grotesk", "Bricolage Grotesque headlines, DM Sans text"],
    ["serif", "Serif", "Fraunces headlines, Instrument Sans text"],
    ["luxe", "Luxe", "Cormorant Garamond headlines, Montserrat text"],
    ["tech", "Tech", "Sora headlines, IBM Plex Sans text"],
    ["poster", "Poster", "Anton capitals, Archivo text"],
    ["friendly", "Friendly", "Outfit for headlines and text"],
    ["arabic", "Arabic", "IBM Plex Sans Arabic for Arabic and Latin text"]
];

// ---------- Modern One Page (page template) ----------
export const PAGE = {
    defaults: ["ws-Fx--sticky", "ws-Fx--reveal", "ws-Fx--count", "ws-Fx--top"],
    groups: [
        { id: "ws-design", name: "Design", seq: 5, nul: "Clean", help: "The overall look of the website. Accent Color, Color Scheme, Typeface and Corners still change it.",
          options: DESIGNS.slice(1).map(([id, n, h]) => ["ws-Design--" + id, n, h]) },
        { id: "ws-accent", name: "Accent Color", seq: 10, nul: "Theme Color", help: "Buttons, highlights and icons. Theme Color uses your theme style's primary colour (some designs bring their own colour instead).",
          options: ACCENTS.map(([id, n]) => ["ws-Accent--" + id, n]) },
        { id: "ws-scheme", name: "Color Scheme", seq: 20, nul: "Light", help: "Midnight and Tech Grid are always dark. Sections set to Dark or Accent keep their own colours.",
          options: [["ws-Scheme--dark", "Dark"], ["ws-Scheme--auto", "Follow Device Setting"]] },
        { id: "ws-font", name: "Typeface", seq: 30, nul: "System", help: "Headline and text fonts. Every choice except System loads its fonts from Google Fonts. Arabic suits right-to-left websites.",
          options: FONTS.slice(1).map(([id, n, h]) => ["ws-Font--" + id, n, h]) },
        { id: "ws-header", name: "Header", seq: 40, nul: "Classic", help: "Transparent lays the header over the first section (use it with a Slider or Full Bleed hero); it turns solid when the visitor scrolls.",
          options: [["ws-Header--centered", "Centered Logo"], ["ws-Header--pill", "Floating Pill"], ["ws-Header--transparent", "Transparent over Hero"]] },
        { id: "ws-corners", name: "Corners", seq: 50, nul: "Rounded", options: [["ws-Corners--square", "Square"], ["ws-Corners--soft", "Soft"], ["ws-Corners--round", "Extra Round"]] },
        { id: "ws-space", name: "Section Spacing", seq: 60, nul: "Comfortable", options: [["ws-Space--compact", "Compact"], ["ws-Space--airy", "Airy"]] },
        { id: "ws-footer", name: "Footer", seq: 70, nul: "Dark", options: [["ws-Footer--light", "Light"], ["ws-Footer--accent", "Accent Color"]] },
        { id: "ws-ph", name: "Placeholder Images", seq: 80, nul: "Soft Gradient", help: "What a row without an image shows (IMAGE_URL and IMAGE_FILE empty). People always show their initials.",
          options: [["ws-Ph--pattern", "Subtle Pattern"], ["ws-Ph--shapes", "Duotone Shapes"], ["ws-Ph--plain", "Plain Colour"]] }
    ],
    singles: [
        ["ws-Fx--sticky", "Sticky Header", 100, "The header stays at the top while the visitor scrolls."],
        ["ws-Fx--reveal", "Reveal on Scroll", 110, "Sections fade in as they scroll into view. Visitors who prefer reduced motion see them at once."],
        ["ws-Fx--count", "Count Up Numbers", 120, "Numbers in the Website - Numbers report count up when they come into view."],
        ["ws-Fx--top", "Back to Top Button", 130, "A round button in the corner after the visitor has scrolled down."],
        ["ws-Fx--progress", "Scroll Progress Bar", 140, "A thin bar in the accent colour at the top of the page."],
        ["ws-Fx--theme", "Light/Dark Toggle", 150, "A button in the header that switches between light and dark; the choice is remembered in the browser."],
        ["ws-Fx--chat", "WhatsApp Button", 160, "A floating WhatsApp button. The number comes from the substitution string WHATSAPP_NUMBER (international format, digits only)."]
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
        ["ws-Sec--menu", "Show in Menu", 100, "Without a Website - Menu list in the Menu slot, the header menu is built from the sections with this option: the label is data-menu=\"...\" (Custom Attributes) or the region title, the link the Static ID."],
        ["ws-Divider", "Top Divider", 110, "A hairline above the section."]
    ]
};

// ---------- Website - Menu (list template) ----------
// Put a List region (template Blank with Attributes) in the Menu slot of Modern One Page. A static list (entries with parent entries)
// or a SQL list (level, label, target ...) both work. User attribute 1 = CSS classes of the entry (ws-Menu-cta = button),
// user attribute 2 = link target (_blank opens a new tab).
export const MENU = {
    id: "website-menu", name: "Website - Menu",
    groups: [
        { id: "wsm-align", name: "Alignment", nul: "Right", options: [["ws-Menu--center", "Center"], ["ws-Menu--left", "Left"]] },
        { id: "wsm-max", name: "Visible Entries", nul: "All", help: "On wide screens, top-level entries after this number go into a More drop-down.",
          options: [["ws-Menu--max4", "4, then More"], ["ws-Menu--max5", "5, then More"], ["ws-Menu--max6", "6, then More"], ["ws-Menu--max7", "7, then More"]] },
        { id: "wsm-mobile", name: "On Phones", nul: "Drop-down Panel", help: "How the menu opens from the burger button on small screens.",
          options: [["ws-Menu--overlay", "Full-screen Overlay"], ["ws-Menu--drawer", "Side Drawer"]] }
    ],
    singles: [["ws-Menu--cta", "Last Entry as Button", 10, "Shows the last top-level entry as a button (or give any entry the CSS class ws-Menu-cta in user attribute 1)."]]
};

// ---------- image columns: one markup for every template that shows a picture ----------
// IMAGE_URL: any URL. IMAGE_FILE: a file name in Static Application Files (website.js adds the #APP_FILES# folder).
// IMAGE_ALT: the text alternative. IMAGE_POSITION: a CSS background-position such as "center top".
export const IMG_COLS = ["IMAGE_URL", "IMAGE_FILE", "IMAGE_ALT", "IMAGE_POSITION"];
const img = (cls, alt = "#TITLE#", extra = "") => `<div class="${cls} ws-Media" data-img="#IMAGE_URL#" data-file="#IMAGE_FILE#" data-pos="#IMAGE_POSITION#" data-alt="#IMAGE_ALT#" role="img" aria-label="${alt}"${extra}></div>`;

// ---------- the Website report templates (Classic Report, named column) ----------
// cols: the query's column names (all optional); row: the row template; top: the opening tag.
const AUTO = { id: "wsr-autoplay", name: "Autoplay", nul: "6 Seconds", options: [["ws-Auto--4", "4 Seconds"], ["ws-Auto--9", "9 Seconds"], ["ws-Auto--off", "Off"]] };
const FILTER = ["ws-Filter", "Filter Buttons", 10, "Buttons above the list that show one category at a time."];
export const REPORTS = [
    { id: "ws-hero", name: "Website - Hero", base: "ws-Hero", tag: "div",
      cols: ["TITLE", "SUBTITLE", "TEXT", ...IMG_COLS, "VIDEO_URL", "BUTTON_LABEL", "BUTTON_LINK", "BUTTON2_LABEL", "BUTTON2_LINK"],
      help: "The opening section. One row is one slide; with more than one row it becomes a slider. VIDEO_URL (an .mp4 or .webm file) plays muted behind the text, with the image as its poster.",
      preset: ["ws-Hero--zoom"],
      groups: [{ id: "wsr-hero-layout", name: "Layout", nul: "Slider", help: "Slider and Full Bleed put the text over the image; Split and Centered put it next to or above it.",
                 options: [["ws-Hero--split", "Split"], ["ws-Hero--centered", "Centered"], ["ws-Hero--fullbleed", "Full Bleed"]], nulClass: "ws-Hero--slider" },
               { id: "wsr-hero-height", name: "Height", nul: "Large", help: "The height of the Slider and Full Bleed layouts.",
                 options: [["ws-Hero--full", "Full Screen"], ["ws-Hero--medium", "Medium"]] },
               { id: "wsr-hero-overlay", name: "Image Overlay", nul: "Normal", help: "How much the image is darkened behind the text (Slider and Full Bleed).",
                 options: [["ws-Hero--light", "Light"], ["ws-Hero--strong", "Strong"]] },
               { id: "wsr-hero-move", name: "Transition", nul: "Fade", options: [["ws-Hero--slide", "Slide"]] }, AUTO],
      singles: [["ws-Hero--zoom", "Slow Zoom", 10, "The picture zooms out slowly while a slide is shown (Ken Burns)."]],
      row: `<div class="ws-Slide">
  ${img("ws-Slide-media", "#TITLE#", ' data-video="#VIDEO_URL#"')}
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
      cols: ["NAME", "ROLE", ...IMG_COLS, "BIO", "LINK", "LINK_ICON"], help: "People with a photo (or their initials), role and a profile link. LINK_ICON defaults to fa-linkedin.",
      groups: [{ id: "wsr-team-layout", name: "Layout", nul: "Portrait Cards", options: [["ws-Team--round", "Round Photos"], ["ws-Team--list", "Compact List"]] }],
      row: `<article class="ws-Person">
  <div class="ws-Person-top">
    ${img("ws-Person-photo", "#NAME#", ' data-initials="#NAME#"')}
    <a class="ws-Person-link" href="#LINK#" data-opt="href" aria-label="#NAME#"><span class="fa #LINK_ICON#" data-icon="fa-linkedin" aria-hidden="true"></span></a>
  </div>
  <h3>#NAME#</h3>
  <p class="ws-Role">#ROLE#</p>
  <p class="ws-Bio" data-opt="text">#BIO#</p>
</article>` },
    { id: "ws-testimonials", name: "Website - Testimonials", base: "ws-Quotes", tag: "div",
      cols: ["QUOTE", "NAME", "ROLE", ...IMG_COLS, "RATING"], help: "What customers say. RATING is 0 to 5 stars (empty hides the stars).",
      groups: [{ id: "wsr-quotes-layout", name: "Layout", nul: "Carousel", options: [["ws-Quotes--wall", "Wall"], ["ws-Quotes--spotlight", "Spotlight"]], nulClass: "ws-Quotes--carousel" }, AUTO],
      row: `<figure class="ws-Quote">
  <span class="ws-Stars" data-r="#RATING#" aria-hidden="true"></span>
  <blockquote>#QUOTE#</blockquote>
  <figcaption>${img("ws-Avatar", "#NAME#", ' data-initials="#NAME#"')}<span><b>#NAME#</b><small>#ROLE#</small></span></figcaption>
</figure>` },
    { id: "ws-logos", name: "Website - Logos", base: "ws-Logos", tag: "div",
      cols: ["NAME", "IMAGE_URL", "IMAGE_FILE", "LINK"], help: "Clients, partners or press. Without an image the name is shown as a word mark.",
      groups: [{ id: "wsr-logos-layout", name: "Layout", nul: "Scrolling Marquee", options: [["ws-Logos--grid", "Grid"], ["ws-Logos--row", "Row"]], nulClass: "ws-Logos--marquee" },
               { id: "wsr-logos-speed", name: "Marquee Speed", nul: "Normal", options: [["ws-Speed--slow", "Slow"], ["ws-Speed--fast", "Fast"]] }],
      singles: [["ws-Logos--reverse", "Scroll the Other Way", 10, "The marquee moves the other way (it already turns round on right-to-left pages)."]],
      row: `<a class="ws-Logo-item" href="#LINK#"><span class="ws-Logo-img" data-img="#IMAGE_URL#" data-file="#IMAGE_FILE#" data-alt="#NAME#"></span><span class="ws-Logo-name">#NAME#</span></a>` },
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
      cols: ["TITLE", "TEXT", "DURATION"], help: "How you work, numbered in the order of the rows.",
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
      singles: [FILTER],
      row: `<details class="ws-Job" data-tag="#TEAM#">
  <summary><span class="ws-Job-main"><b>#TITLE#</b><span class="ws-Job-meta"><span class="ws-Job-team" data-opt="text">#TEAM#</span><span data-opt="text"><span class="fa fa-map-marker" aria-hidden="true"></span>#LOCATION#</span><span data-opt="text"><span class="fa fa-clock-o" aria-hidden="true"></span>#TYPE#</span></span></span><span class="ws-Plus" aria-hidden="true"></span></summary>
  <div class="ws-Job-d"><p data-opt="text">#DESCRIPTION#</p><a class="ws-Btn" href="#APPLY_LINK#">#APPLY_LABEL#</a></div>
</details>` },
    { id: "ws-gallery", name: "Website - Portfolio", base: "ws-Works", tag: "div",
      cols: ["TITLE", "CATEGORY", ...IMG_COLS, "LINK", "META"], help: "Projects with a picture and a link. Filter Buttons groups them by CATEGORY.",
      preset: ["ws-Filter"],
      groups: [{ id: "wsr-works-layout", name: "Layout", nul: "Grid", options: [["ws-Works--editorial", "Editorial"], ["ws-Works--large", "Large"]] }],
      singles: [FILTER],
      row: `<a class="ws-Work" href="#LINK#" data-tag="#CATEGORY#">
  ${img("ws-Work-img")}
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
      row: `<div class="ws-Info"><span class="ws-Icon fa #ICON#" data-icon="fa-info-circle" aria-hidden="true"></span><div><small>#LABEL#</small><a href="#LINK#">#VALUE#</a></div></div>` },
    // ---------- new in v2 ----------
    { id: "ws-news", name: "Website - News", base: "ws-News", tag: "div",
      cols: ["TITLE", "TEXT", ...IMG_COLS, "POST_DATE", "CATEGORY", "LINK"], help: "News or blog posts. POST_DATE is shown as it comes from the query (format it with to_char).",
      groups: [{ id: "wsr-news-layout", name: "Layout", nul: "Cards", options: [["ws-News--featured", "First Post Large"], ["ws-News--list", "List"]] }],
      row: `<a class="ws-Card ws-Post" href="#LINK#">
  ${img("ws-Post-img")}
  <span class="ws-Post-b"><span class="ws-Post-meta"><span class="ws-Tag" data-opt="text">#CATEGORY#</span><time data-opt="text">#POST_DATE#</time></span><b class="ws-Post-t">#TITLE#</b><span class="ws-Post-x" data-opt="text">#TEXT#</span></span>
</a>` },
    { id: "ws-products", name: "Website - Products", base: "ws-Products", tag: "div",
      cols: ["NAME", "TEXT", "PRICE", ...IMG_COLS, "CATEGORY", "BADGE", "LINK"], help: "Products, or the dishes of a menu, with a price. Filter Buttons groups them by CATEGORY.",
      preset: ["ws-Filter"],
      groups: [{ id: "wsr-products-layout", name: "Layout", nul: "Cards", options: [["ws-Products--menu", "Menu List"], ["ws-Products--compact", "Compact"]] }],
      singles: [FILTER],
      row: `<article class="ws-Card ws-Product" data-tag="#CATEGORY#">
  ${img("ws-Product-img", "#NAME#")}
  <span class="ws-Badge" data-opt="text">#BADGE#</span>
  <div class="ws-Product-b"><h3><a href="#LINK#">#NAME#</a></h3><span class="ws-Product-dots" aria-hidden="true"></span><b class="ws-Product-p" data-opt="text">#PRICE#</b><p data-opt="text">#TEXT#</p></div>
</article>` },
    { id: "ws-photos", name: "Website - Photo Gallery", base: "ws-Photos", tag: "div",
      cols: [...IMG_COLS, "TITLE", "CAPTION"], help: "Photos that open full size in a lightbox (arrow keys, swipe, Escape closes).",
      groups: [{ id: "wsr-photos-layout", name: "Layout", nul: "Grid", options: [["ws-Photos--masonry", "Masonry"], ["ws-Photos--strip", "Scrolling Strip"]] }],
      row: `<figure class="ws-Photo"><button type="button" class="ws-Photo-btn" aria-label="#TITLE#">${img("ws-Photo-img")}</button><figcaption data-opt="text">#CAPTION#</figcaption></figure>` },
    { id: "ws-zigzag", name: "Website - Image and Text", base: "ws-Zigzag", tag: "div",
      cols: ["EYEBROW", "TITLE", "TEXT", ...IMG_COLS, "LINK", "LINK_LABEL"], help: "Rows of a picture next to text, alternating sides (zig-zag).",
      groups: [{ id: "wsr-zigzag-start", name: "First Row", nul: "Image First", options: [["ws-Zigzag--text", "Text First"]] }],
      row: `<div class="ws-Zig">
  ${img("ws-Zig-img")}
  <div class="ws-Zig-b"><p class="ws-Eyebrow" data-opt="text">#EYEBROW#</p><h3 class="ws-Zig-t">#TITLE#</h3><p class="ws-Muted" data-opt="text">#TEXT#</p><a class="ws-More" href="#LINK#">#LINK_LABEL#</a></div>
</div>` },
    { id: "ws-events", name: "Website - Events", base: "ws-Events", tag: "div",
      cols: ["EVENT_DATE", "EVENT_TIME", "TITLE", "TEXT", "LOCATION", "SPEAKER", "LINK", "LINK_LABEL", "CATEGORY"], help: "An agenda or events list. EVENT_DATE and EVENT_TIME are shown as they come from the query.",
      groups: [{ id: "wsr-events-layout", name: "Layout", nul: "Agenda", options: [["ws-Events--cards", "Cards"]] }],
      singles: [FILTER],
      row: `<article class="ws-Event" data-tag="#CATEGORY#">
  <div class="ws-Event-when"><b data-opt="text">#EVENT_TIME#</b><span data-opt="text">#EVENT_DATE#</span></div>
  <div class="ws-Event-b"><h3>#TITLE#</h3><p class="ws-Muted" data-opt="text">#TEXT#</p><p class="ws-Event-meta"><span data-opt="text"><span class="fa fa-user-o" aria-hidden="true"></span>#SPEAKER#</span><span data-opt="text"><span class="fa fa-map-marker" aria-hidden="true"></span>#LOCATION#</span></p></div>
  <a class="ws-More" href="#LINK#">#LINK_LABEL#</a>
</article>` },
    { id: "ws-hours", name: "Website - Opening Hours", base: "ws-Hours", tag: "div",
      cols: ["DAY_NAME", "HOURS", "NOTE", "DAY_NUMBER"], help: "Opening hours. DAY_NUMBER (1 = Monday ... 7 = Sunday) highlights today; without it the day name is compared with today's name.",
      groups: [{ id: "wsr-hours-layout", name: "Layout", nul: "Table", options: [["ws-Hours--cards", "Cards"]] }],
      row: `<div class="ws-Day" data-day="#DAY_NUMBER#"><b class="ws-Day-n">#DAY_NAME#</b><span class="ws-Day-h">#HOURS#</span><small class="ws-Day-note" data-opt="text">#NOTE#</small></div>` },
    { id: "ws-compare", name: "Website - Comparison", base: "ws-Compare", tag: "div",
      cols: ["FEATURE", "COL1", "COL2", "COL3", "COL4", "IS_HEADER"], help: "A comparison table: one row per feature, one column per plan (COL1 to COL4). The row with IS_HEADER = Y holds the plan names. Y and N become a tick and a dash.",
      groups: [{ id: "wsr-compare-hl", name: "Highlight Column", nul: "None", options: [["ws-Compare--hl1", "Column 1"], ["ws-Compare--hl2", "Column 2"], ["ws-Compare--hl3", "Column 3"], ["ws-Compare--hl4", "Column 4"]] }],
      row: `<div class="ws-Cmp-row" data-head="#IS_HEADER#" role="row"><span class="ws-Cmp-f" role="rowheader">#FEATURE#</span><span class="ws-Cmp-c" role="cell">#COL1#</span><span class="ws-Cmp-c" role="cell">#COL2#</span><span class="ws-Cmp-c" role="cell">#COL3#</span><span class="ws-Cmp-c" role="cell">#COL4#</span></div>` },
    { id: "ws-video", name: "Website - Video", base: "ws-Videos", tag: "div",
      cols: ["VIDEO_URL", "TITLE", "TEXT", ...IMG_COLS], help: "Videos from YouTube, Vimeo or an .mp4 file. Nothing loads until the visitor presses play; the image is the cover.",
      groups: [{ id: "wsr-video-layout", name: "Layout", nul: "Large", options: [["ws-Videos--cards", "Cards"]] }],
      row: `<figure class="ws-Video" data-video="#VIDEO_URL#">
  <button type="button" class="ws-Video-play" aria-label="#TITLE#">${img("ws-Video-img")}<span class="ws-Video-icon" aria-hidden="true"></span></button>
  <figcaption><b data-opt="text">#TITLE#</b><span class="ws-Muted" data-opt="text">#TEXT#</span></figcaption>
</figure>` },
    { id: "ws-map", name: "Website - Map", base: "ws-Maps", tag: "div",
      cols: ["MAP_URL", "TITLE", "ADDRESS", "TEXT", "LINK", "LINK_LABEL"], help: "A map from an embed URL (Google Maps or OpenStreetMap) next to the address. The map loads when it scrolls into view.",
      groups: [{ id: "wsr-map-layout", name: "Layout", nul: "Map and Address", options: [["ws-Maps--full", "Full-width Map"]] }],
      row: `<div class="ws-Map">
  <div class="ws-Map-frame" data-map="#MAP_URL#" data-title="#TITLE#"></div>
  <div class="ws-Map-b"><h3 data-opt="text">#TITLE#</h3><p class="ws-Map-a" data-opt="text">#ADDRESS#</p><p class="ws-Muted" data-opt="text">#TEXT#</p><a class="ws-Btn ws-Btn--ghost" href="#LINK#">#LINK_LABEL#</a></div>
</div>` }
];

// option group ids per template type (template-option-groups.apx)
export const GROUP_TYPES = { page: PAGE.groups, region: SECTION.groups };
