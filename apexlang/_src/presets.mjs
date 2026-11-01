// Ready-made looks for the Gallery: page template options plus the layout of some sections of the demo website.
// page: Modern One Page options (#DEFAULT# is always kept); r: { static id: [classes] } for sections and their reports.
// The look travels in the URL hash: #ws=<page classes>&r=<id>:<classes>,<id>:<classes> (the Designer uses the same).
export const PAGE_DEFAULTS = "ws-Fx--sticky ws-Fx--reveal ws-Fx--count ws-Fx--top";
export const PRESETS = [
    { id: "studio", name: "Studio", tags: "light clean", page: "ws-Accent--tangerine ws-Font--grotesk", r: {} },
    { id: "editorial", name: "Editorial", tags: "light editorial", page: "ws-Design--editorial ws-Accent--wine ws-Font--serif ws-Header--centered",
      r: { hero: ["ws-Hero--centered"], services: ["ws-Features--rows"], "clients-say": ["ws-Quotes--spotlight"] } },
    { id: "bold", name: "Bold", tags: "light bold", page: "ws-Design--bold ws-Accent--amber ws-Font--grotesk",
      r: { hero: ["ws-Hero--split"], services: ["ws-Features--bento"], "clients-say": ["ws-Quotes--wall"] } },
    { id: "midnight", name: "Midnight", tags: "dark midnight", page: "ws-Design--midnight ws-Accent--violet ws-Font--tech ws-Header--pill",
      r: { hero: ["ws-Hero--fullbleed"], work: ["ws-Works--editorial"] } },
    { id: "glass", name: "Glass", tags: "light glass", page: "ws-Design--glass ws-Accent--cyan ws-Font--friendly ws-Header--pill ws-Corners--round",
      r: { hero: ["ws-Hero--centered"], team: ["ws-Team--round"] } },
    { id: "soft", name: "Soft UI", tags: "light soft", page: "ws-Design--soft ws-Accent--indigo ws-Font--friendly ws-Corners--round",
      r: { hero: ["ws-Hero--split"], process: ["ws-Steps--cards"] } },
    { id: "minimal", name: "Minimal", tags: "light minimal", page: "ws-Design--minimal ws-Accent--slate ws-Font--tech ws-Space--airy",
      r: { hero: ["ws-Hero--centered"], services: ["ws-Features--rows"], history: ["ws-Timeline--list"] } },
    { id: "luxe-night", name: "Luxe Night", tags: "dark luxe", page: "ws-Scheme--dark ws-Accent--amber ws-Font--luxe ws-Header--transparent ws-Corners--square",
      r: { hero: ["ws-Hero--fullbleed"], work: ["ws-Works--large"] } },
    { id: "poster", name: "Poster", tags: "light bold", page: "ws-Accent--rose ws-Font--poster ws-Corners--square ws-Header--transparent", r: {} },
    { id: "ocean", name: "Ocean", tags: "light clean", page: "ws-Accent--ocean ws-Header--pill",
      r: { hero: ["ws-Hero--split"], "clients-say": ["ws-Quotes--wall"], team: ["ws-Team--round"] } },
    { id: "emerald", name: "Emerald", tags: "light clean", page: "ws-Accent--emerald ws-Font--serif ws-Header--transparent ws-Footer--accent", r: {} },
    { id: "editorial-dark", name: "Editorial - Dark", tags: "dark editorial", page: "ws-Design--editorial ws-Scheme--dark ws-Accent--tangerine ws-Font--serif",
      r: { hero: ["ws-Hero--centered"], services: ["ws-Features--rows"] } },
    { id: "bold-dark", name: "Bold - Dark", tags: "dark bold", page: "ws-Design--bold ws-Scheme--dark ws-Accent--cyan ws-Font--grotesk",
      r: { hero: ["ws-Hero--split"], services: ["ws-Features--bento"] } },
    { id: "soft-dark", name: "Soft UI - Dark", tags: "dark soft", page: "ws-Design--soft ws-Scheme--dark ws-Accent--violet ws-Font--friendly ws-Corners--round",
      r: { hero: ["ws-Hero--centered"], team: ["ws-Team--round"] } },
    { id: "corporate", name: "Corporate", tags: "light clean", page: "ws-Accent--indigo ws-Font--serif ws-Corners--soft ws-Footer--light",
      r: { hero: ["ws-Hero--split"], "clients-say": ["ws-Quotes--spotlight"], team: ["ws-Team--list"] } },
    { id: "glass-dark", name: "Glass - Dark", tags: "dark glass", page: "ws-Design--glass ws-Scheme--dark ws-Accent--rose ws-Font--tech ws-Header--pill",
      r: { hero: ["ws-Hero--fullbleed"], services: ["ws-Features--bento"] } }
].map(p => ({ ...p, hash: "#ws=" + encodeURIComponent((PAGE_DEFAULTS + " " + p.page).trim()) + (Object.keys(p.r).length ? "&r=" + encodeURIComponent(Object.entries(p.r).map(([k, v]) => k + ":" + v.join("+")).join(",")) : "") }));
