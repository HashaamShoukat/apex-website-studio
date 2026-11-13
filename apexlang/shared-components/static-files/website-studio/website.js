/* Website Studio - behaviour of Modern One Page, Website - Menu and the Website report templates.
   Everything is switched by template options (CSS classes). Reports are Classic Reports: a column the query does not
   return stays as its #COLUMN# placeholder, and this script treats it as empty, so every column is optional.
   Public API: wsSite.init() (called by the page template), wsSite.refresh(element) after a partial page refresh. */
(function (W, d) {
    "use strict";
    var b = d.body, PH = /^#[A-Z][A-Z0-9_$]*#$/, reduce = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var rtl = function () { return (d.documentElement.getAttribute("dir") || b.getAttribute("dir") || "").toLowerCase() === "rtl"; };
    var FONTS = {
        grotesk: "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;700",
        serif: "family=Fraunces:ital,wght@0,500;0,600;1,500&family=Instrument+Sans:wght@400;500;600",
        luxe: "family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600",
        tech: "family=Sora:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600",
        poster: "family=Anton&family=Archivo:wght@400;500;600;700",
        friendly: "family=Outfit:wght@400;500;600;700",
        arabic: "family=IBM+Plex+Sans+Arabic:wght@400;500;600;700",
        cairo: "family=Cairo:wght@400;500;600;700;800",
        kufi: "family=Reem+Kufi:wght@500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600",
        classic: "family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Source+Sans+3:wght@400;500;600",
        space: "family=Space+Grotesk:wght@400;500;600;700",
        hand: "family=Caveat:wght@600;700&family=Nunito:wght@400;600;700"
    };
    var TEXT = { menu: "Menu", top: "Back to top", all: "All", prev: "Previous", next: "Next", slide: "Slide", apply: "Apply for this role",
                 more: "More", close: "Close", play: "Play", dark: "Dark mode", map: "Map", pause: "Pause slides", resume: "Play slides", search: "Search",
                 none: "Nothing found", yes: "Yes", no: "No", days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", photo: "Photo" };
    // built-in Arabic texts for pages in Arabic (text messages, when they exist, still win)
    if (/^ar\b/i.test(d.documentElement.lang || "")) {
        TEXT = { menu: "القائمة", top: "العودة للأعلى", all: "الكل", prev: "السابق", next: "التالي", slide: "شريحة", apply: "تقدم لهذه الوظيفة",
                 more: "المزيد", close: "إغلاق", play: "تشغيل", dark: "الوضع الداكن", map: "الخريطة", pause: "إيقاف الشرائح", resume: "تشغيل الشرائح", search: "بحث",
                 none: "لا توجد نتائج", yes: "نعم", no: "لا", days: "أيام", hours: "ساعات", minutes: "دقائق", seconds: "ثوانٍ", photo: "صورة" };
    }

    function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
    function val(s) { s = s == null ? "" : String(s).trim(); return PH.test(s) || /#[A-Z][A-Z0-9_]*#/.test(s) ? "" : s; }
    function msg(key) {
        // optional translations: text messages WEBSITE_STUDIO.MENU, .BACK_TO_TOP, .ALL, .PREVIOUS, .NEXT, .SLIDE, .APPLY, .MORE, .CLOSE, .PLAY, .DARK_MODE, .MAP,
        // .PAUSE, .RESUME, .SEARCH, .NONE, .YES, .NO, .DAYS, .HOURS, .MINUTES, .SECONDS, .PHOTO
        var keys = { top: "BACK_TO_TOP", dark: "DARK_MODE", prev: "PREVIOUS" };
        try { var k = "WEBSITE_STUDIO." + (keys[key] || key.toUpperCase()), m = W.apex && apex.lang && apex.lang.getMessage(k); if (m && m !== k) { return m; } } catch (e) { /* no apex.lang */ }
        return TEXT[key];
    }

    /* ---------- look from the URL (Designer preview): #ws=<page classes>&r=<target>:<classes>,...
       A target is a static id (one section or report) or @<report template> (every report of that template, e.g. @ws-hero). ---------- */
    var PAGE_FAMILY = /^ws-(Design|Accent|Scheme|Font|Header|Corners|Space|Fx|Footer|Ph|Reveal)--/;
    var SEC_FAMILY = /^ws-(Tone|Pad|Head|Width|Edge)--/;
    var BASE = { "ws-hero": "ws-Hero", "ws-stats": "ws-Stats", "ws-features": "ws-Features", "ws-team": "ws-Team", "ws-testimonials": "ws-Quotes", "ws-logos": "ws-Logos",
                 "ws-pricing": "ws-Plans", "ws-timeline": "ws-Timeline", "ws-steps": "ws-Steps", "ws-faq": "ws-Faqs", "ws-jobs": "ws-Jobs", "ws-gallery": "ws-Works",
                 "ws-links": "ws-Links", "ws-contact": "ws-Infos", "ws-news": "ws-News", "ws-products": "ws-Products", "ws-photos": "ws-Photos", "ws-zigzag": "ws-Zigzag",
                 "ws-events": "ws-Events", "ws-hours": "ws-Hours", "ws-compare": "ws-Compare", "ws-video": "ws-Videos", "ws-map": "ws-Maps", "ws-banner": "ws-Banners",
                 "ws-tabs": "ws-Tabs", "ws-countdown": "ws-Countdown", "ws-skills": "ws-Skills", "ws-ticker": "ws-Ticker", "website-menu": "ws-Menu" };
    function hashLook() {
        // a damaged link (a lone "%") must not stop the page: such a value counts as not given
        var h = location.hash, g = function (k) { var m = new RegExp("[#&]" + k + "=([^&]*)").exec(h); try { return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } };
        return { page: g("ws"), regions: g("r"), dir: g("dir") };
    }
    // only names that can be template options (letters, digits, - and _) are taken from the URL
    function safe(c) { return /^[!-]?[A-Za-z][\w-]*$/.test(c); }
    // the option groups of the report and list templates: { group id: [classes] } (filled in by _src/build.mjs)
    var GROUPS = {"wsr-hero-layout":["ws-Hero--slider","ws-Hero--split","ws-Hero--centered","ws-Hero--fullbleed"],"wsr-hero-height":["ws-Hero--full","ws-Hero--medium","ws-Hero--compact"],"wsr-hero-overlay":["ws-Hero--light","ws-Hero--strong"],"wsr-hero-move":["ws-Hero--slide"],"wsr-autoplay":["ws-Auto--4","ws-Auto--9","ws-Auto--off"],"wsr-stats-layout":["ws-Stats--cards"],"wsr-features-layout":["ws-Features--rows","ws-Features--bento","ws-Features--icons"],"wsr-columns":["ws-Cols--2","ws-Cols--4"],"wsr-team-layout":["ws-Team--round","ws-Team--list"],"wsr-quotes-layout":["ws-Quotes--carousel","ws-Quotes--wall","ws-Quotes--spotlight"],"wsr-logos-layout":["ws-Logos--marquee","ws-Logos--grid","ws-Logos--row"],"wsr-logos-speed":["ws-Speed--slow","ws-Speed--fast"],"wsr-plans-style":["ws-Plans--accent"],"wsr-timeline-layout":["ws-Timeline--alternate","ws-Timeline--list"],"wsr-steps-layout":["ws-Steps--line","ws-Steps--cards"],"wsr-faq-layout":["ws-Faqs--columns"],"wsr-jobs-layout":["ws-Jobs--cards"],"wsr-works-layout":["ws-Works--editorial","ws-Works--large"],"wsr-links-layout":["ws-Links--icons","ws-Links--list","ws-Links--inline","ws-Links--tiles"],"wsr-infos-layout":["ws-Infos--cards"],"wsr-news-layout":["ws-News--featured","ws-News--list"],"wsr-products-layout":["ws-Products--menu","ws-Products--compact"],"wsr-photos-layout":["ws-Photos--masonry","ws-Photos--strip"],"wsr-zigzag-start":["ws-Zigzag--text"],"wsr-events-layout":["ws-Events--cards"],"wsr-hours-layout":["ws-Hours--cards"],"wsr-compare-hl":["ws-Compare--hl1","ws-Compare--hl2","ws-Compare--hl3","ws-Compare--hl4"],"wsr-video-layout":["ws-Videos--cards"],"wsr-map-layout":["ws-Maps--full"],"wsr-banner-style":["ws-Banners--dark","ws-Banners--image","ws-Banners--outline"],"wsr-banner-layout":["ws-Banners--center"],"wsr-tabs-style":["ws-Tabs--pills","ws-Tabs--side"],"wsr-countdown-layout":["ws-Countdown--center"],"wsr-countdown-style":["ws-Countdown--plain","ws-Countdown--tiles"],"wsr-skills-layout":["ws-Skills--columns","ws-Skills--rings"],"wsr-ticker-style":["ws-Ticker--dark","ws-Ticker--plain","ws-Ticker--outline"],"wsr-ticker-speed":["ws-Speed--slow","ws-Speed--fast"],"wsm-align":["ws-Menu--center","ws-Menu--left"],"wsm-max":["ws-Menu--max3","ws-Menu--max4","ws-Menu--max5","ws-Menu--max6","ws-Menu--max7"],"wsm-mobile":["ws-Menu--overlay","ws-Menu--drawer"]};
    // c: a class (it replaces the other classes of its option group), -class (removes it) or !group-id (clears the group)
    function setFamily(el, c) {
        if (c.charAt(0) === "-") { el.classList.remove(c.slice(1)); return; }
        if (c.charAt(0) === "!") { (GROUPS[c.slice(1)] || []).forEach(function (x) { el.classList.remove(x); }); return; }
        var fam = null;
        Object.keys(GROUPS).some(function (k) { if (GROUPS[k].indexOf(c) >= 0) { fam = GROUPS[k]; return true; } return false; });
        if (fam) { fam.forEach(function (x) { el.classList.remove(x); }); }
        else if (SEC_FAMILY.test(c)) { var f = c.replace(/--.*$/, "--"); el.className.split(/\s+/).forEach(function (x) { if (x.indexOf(f) === 0) { el.classList.remove(x); } }); }
        el.classList.add(c);
    }
    var dir0;
    function applyLook(look) {
        // dir=rtl or dir=ltr: the Designer shows any website right to left (or an Arabic one left to right)
        if (!dir0) { dir0 = [d.documentElement.getAttribute("dir"), b.getAttribute("dir")]; }
        [d.documentElement, b].forEach(function (el, k) {
            var v = look.dir === "rtl" || look.dir === "ltr" ? look.dir : dir0[k];
            if (v) { el.setAttribute("dir", v); } else { el.removeAttribute("dir"); }
        });
        if (look.page !== null) {
            b.className.split(/\s+/).forEach(function (c) { if (PAGE_FAMILY.test(c)) { b.classList.remove(c); } });
            look.page.split(/[\s+,]+/).forEach(function (c) { if (c && safe(c) && PAGE_FAMILY.test(c)) { b.classList.add(c); } });
        }
        if (look.regions) {
            look.regions.split(",").forEach(function (part) {
                var i = part.indexOf(":"), id = part.slice(0, i), cls = part.slice(i + 1).split(/[\s+]+/).filter(safe);
                if (id.charAt(0) === "@") {
                    // every report of one template
                    var base = BASE[id.slice(1)];
                    if (base) { $$(".ws-R." + base).forEach(function (rep) { cls.forEach(function (c) { setFamily(rep, c); }); }); }
                    return;
                }
                var sec = id && d.getElementById(id), rep = sec && sec.querySelector(".ws-R");
                if (!sec) { return; }
                // each class replaces the classes of its own family only (ws-Tone--soft replaces ws-Tone--dark, ws-Hero--split replaces ws-Hero--slider)
                cls.forEach(function (c) { setFamily(SEC_FAMILY.test(c) || !rep ? sec : rep, c); });
            });
        }
        fonts();
    }

    /* ---------- fonts ---------- */
    function fonts() {
        var m = /(?:^|\s)ws-Font--(\w+)/.exec(b.className), q = m && FONTS[m[1]], link = d.getElementById("ws-fonts");
        if (!q) { if (link) { link.parentNode.removeChild(link); } return; }
        var href = "https://fonts.googleapis.com/css2?" + q + "&display=swap";
        if (!link) { link = d.createElement("link"); link.id = "ws-fonts"; link.rel = "stylesheet"; d.head.appendChild(link); }
        if (link.getAttribute("href") !== href) { link.setAttribute("href", href); }
    }

    /* ---------- placeholders and empty parts ---------- */
    function clean(root) {
        var walker = d.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, empty = [];
        while ((n = walker.nextNode())) { if (PH.test(n.nodeValue.trim())) { empty.push(n); } }
        empty.forEach(function (t) { t.nodeValue = ""; });
        $$("*", root).forEach(function (el) {
            for (var i = el.attributes.length - 1; i >= 0; i--) {
                var a = el.attributes[i];
                if (a.name === "class") { if (/#[A-Z][A-Z0-9_]*#/.test(a.value)) { el.setAttribute("class", a.value.replace(/#[A-Z][A-Z0-9_]*#/g, "").replace(/\s+/g, " ").trim()); } }
                else if (PH.test(a.value.trim())) { el.setAttribute(a.name, ""); }
            }
        });
        $$(".ws-Job", root).forEach(function (job) { var a = job.querySelector(".ws-Btn"); if (a && !val(a.textContent) && val(a.getAttribute("href"))) { a.textContent = msg("apply"); } });
        $$(".ws-Btn, .ws-More", root).forEach(function (a) { if (!val(a.textContent)) { a.parentNode.removeChild(a); } });
        $$("a[href]", root).forEach(function (a) { if (!val(a.getAttribute("href"))) { a.removeAttribute("href"); } });
        $$("a[target='']", root).forEach(function (a) { a.removeAttribute("target"); });
        $$("[data-opt]", root).forEach(function (el) {
            var kind = el.getAttribute("data-opt"), keep = kind === "href" ? el.hasAttribute("href") : !!val(el.textContent);
            if (!keep) { el.parentNode.removeChild(el); }
        });
        $$(".ws-Actions", root).forEach(function (a) { if (!a.children.length) { a.parentNode.removeChild(a); } });
        $$(".ws-Info a:not([href])", root).forEach(function (a) { a.className = "ws-Info-v"; });
        $$(".ws-Product h3 a:not([href])", root).forEach(function (a) { a.replaceWith(d.createTextNode(a.textContent)); });
        // an icon column the query does not return: the data-icon default, or no icon
        $$(".fa", root).forEach(function (i) {
            if (i.className.replace(/\b(fa|ws-Icon)\b/g, "").trim()) { return; }
            var def = i.getAttribute("data-icon");
            if (def) { i.classList.add(def); } else if (def !== null) { i.parentNode.removeChild(i); } else { i.classList.add("fa-circle-o"); }
        });
        // the default layout of a report: its class when no layout option is chosen
        $$("[data-ws-null]", root.matches && root.matches("[data-ws-null]") ? root.parentNode : root).forEach(function (r) {
            // the default applies when no option of its own group is chosen (the other options of the template do not count)
            var nul = r.getAttribute("data-ws-null"), fam = null;
            Object.keys(GROUPS).some(function (k) { if (GROUPS[k][0] === nul) { fam = GROUPS[k]; return true; } return false; });
            if (!fam || !fam.some(function (c) { return r.classList.contains(c); })) { r.classList.add(nul); }
        });
    }

    /* ---------- images ----------
       IMAGE_URL (data-img): any URL, or #APP_FILES#file. IMAGE_FILE (data-file): a file name in Static Application Files.
       The #APP_FILES# folder: the body's data-ws-files (page template) or else the folder website.css was loaded from. */
    var filesDir = null;
    function appFiles() {
        if (filesDir !== null) { return filesDir; }
        var f = b.getAttribute("data-ws-files") || "";
        if (!f || /#APP_FILES#/.test(f)) {
            f = "";
            $$("link[rel=stylesheet]").some(function (l) {
                var m = /^(.*\/)?website-studio\/website(\.min)?\.css(\?.*)?$/.exec(l.getAttribute("href") || "");
                if (m) { f = m[1] || ""; return true; }
                return false;
            });
        }
        filesDir = f;
        return f;
    }
    function source(el) {
        var raw = (el.getAttribute("data-img") || "").trim(), url = val(raw), file = val(el.getAttribute("data-file"));
        if (!url && /^#APP_FILES#[^#]/.test(raw)) { url = raw; }
        if (url) { return url.replace(/^#APP_FILES#/, appFiles()); }
        if (file) { return /^(https?:)?\/\//.test(file) || file.charAt(0) === "/" ? file : appFiles() + file.replace(/^#APP_FILES#/, ""); }
        return "";
    }
    var phN = 0, lazy = "IntersectionObserver" in W ? new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { lazy.unobserve(e.target); load(e.target); } });
    }, { rootMargin: "600px 0px" }) : null;
    function placeholder(el) {
        el.classList.remove("has-img", "is-loading");
        el.style.backgroundImage = "";
        if (!el.classList.contains("ws-Ph")) { el.classList.add("ws-Ph", "ws-Ph--n" + ((phN++ % 6) + 1)); }
    }
    function load(el) {
        var src = el.__wsSrc;
        if (!src || el.__wsLoaded) { return; }
        el.__wsLoaded = true;
        var probe = new Image();
        probe.onload = function () { el.style.backgroundImage = "url(\"" + src.replace(/["\\\n]/g, encodeURIComponent) + "\")"; el.classList.remove("is-loading", "ws-Ph"); el.classList.add("has-img"); };
        probe.onerror = function () { placeholder(el); };
        probe.src = src;
    }
    function media(root) {
        $$("[data-img], [data-file]", root).forEach(function (el) {
            if (el.__wsImg) { return; }
            el.__wsImg = true;
            var src = source(el), alt = val(el.getAttribute("data-alt"));
            if (el.classList.contains("ws-Logo-img")) {
                if (src) { var img = d.createElement("img"); img.src = src; img.alt = alt; img.loading = "lazy"; img.onerror = function () { img.remove(); }; el.parentNode.replaceChild(img, el); }
                else { el.parentNode.removeChild(el); }
                return;
            }
            if (alt) { el.setAttribute("aria-label", alt); }
            if (!val(el.getAttribute("aria-label"))) { el.setAttribute("aria-hidden", "true"); el.removeAttribute("role"); }
            var pos = val(el.getAttribute("data-pos"));
            if (pos) { el.style.backgroundPosition = pos; }
            var ini = el.getAttribute("data-initials");
            if (ini !== null) {
                var words = val(ini).split(/\s+/).filter(Boolean);
                if (words.length) { el.setAttribute("data-initials", (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase()); }
                else { el.removeAttribute("data-initials"); }
            }
            if (!src) { placeholder(el); return; }
            el.__wsSrc = src;
            el.classList.add("is-loading");
            // the first slide of the hero loads at once; everything else when it comes near the screen
            var hero = el.closest(".ws-Hero"), first = hero && el.closest(".ws-Slide") === hero.querySelector(".ws-Slide");
            if (first || !lazy) { load(el); } else { lazy.observe(el); }
            video(el);
        });
    }
    // a hero background video (VIDEO_URL: .mp4 / .webm), muted and looping, the image is its poster
    function video(el) {
        var v = val(el.getAttribute("data-video"));
        if (!v || reduce || !/\.(mp4|webm|m4v)(\?|#|$)/i.test(v)) { return; }
        v = webUrl(v);
        if (!v) { return; }
        var vid = d.createElement("video");
        vid.className = "ws-Bg-video"; vid.muted = true; vid.loop = true; vid.autoplay = true; vid.playsInline = true; vid.setAttribute("playsinline", ""); vid.setAttribute("aria-hidden", "true");
        vid.src = v;
        el.appendChild(vid);
        var p = vid.play && vid.play(); if (p && p.catch) { p.catch(function () { /* autoplay refused: the image stays */ }); }
    }

    /* ---------- emphasis: *word* in titles becomes <em> ---------- */
    function emphasis(root) {
        $$(".ws-Title, .ws-Display, .ws-Statement, .ws-Quote blockquote, .ws-Zig-t, .ws-Banner-t", root).forEach(function (el) {
            if (el.children.length || el.textContent.indexOf("*") < 0) { return; }
            var t = el.textContent, out = "", re = /\*([^*]+)\*/g, last = 0, m, esc = function (s) { var x = d.createElement("span"); x.textContent = s; return x.innerHTML; };
            while ((m = re.exec(t))) { out += esc(t.slice(last, m.index)) + "<em>" + esc(m[1]) + "</em>"; last = re.lastIndex; }
            el.innerHTML = out + esc(t.slice(last));
        });
    }

    /* ---------- section heading: an eyebrow and a lead at the start of the body move into the heading ---------- */
    function heads(root) {
        $$(".ws-Sec", root).forEach(function (sec) {
            var head = sec.querySelector(":scope > .ws-Wrap > .ws-Head"), body = sec.querySelector(":scope > .ws-Wrap > .ws-Body"), title = head && head.querySelector(".ws-Title");
            if (!head || !body || sec.__wsHead) { return; }
            sec.__wsHead = true;
            var eb = body.querySelector(":scope > .ws-Eyebrow"), lead = body.querySelector(":scope > .ws-Lead");
            if (eb && eb === body.firstElementChild) { head.insertBefore(eb, title); }
            if (lead && (lead === body.firstElementChild)) { head.appendChild(lead); }
            if (title && !val(title.textContent)) { title.parentNode.removeChild(title); }
            if (!head.children.length) { head.parentNode.removeChild(head); }
        });
    }

    /* ---------- reports ---------- */
    function stars(root) {
        $$(".ws-Stars", root).forEach(function (s) {
            var r = parseFloat(val(s.getAttribute("data-r")));
            if (!(r > 0)) { s.parentNode.removeChild(s); return; }
            s.style.setProperty("--r", Math.min(5, r));
            s.setAttribute("role", "img"); s.setAttribute("aria-label", r + " / 5"); s.removeAttribute("aria-hidden");
        });
    }
    function plans(root) {
        $$(".ws-Plan", root).forEach(function (p) {
            if (/^(y|yes|1|true)$/i.test(val(p.getAttribute("data-featured")))) { p.classList.add("is-featured"); }
            var box = p.querySelector("[data-list]");
            if (!box) { return; }
            var items = val(box.getAttribute("data-list")).split(/\r?\n|\||;/).map(function (s) { return s.trim(); }).filter(Boolean);
            if (!items.length) { box.parentNode.removeChild(box); return; }
            var ul = d.createElement("ul"); ul.className = "ws-Plan-f";
            items.forEach(function (t) { var li = d.createElement("li"); li.textContent = t; ul.appendChild(li); });
            box.parentNode.replaceChild(ul, box);
        });
    }
    function counters(root) {
        if (!("IntersectionObserver" in W)) { return; }
        $$(".ws-Count", root).forEach(function (el) {
            var raw = val(el.getAttribute("data-to") || el.textContent), num = raw.replace(/[^\d.\-]/g, ""), to = parseFloat(num);
            if (!b.classList.contains("ws-Fx--count") || reduce || isNaN(to) || el.__ws) { return; }
            el.__ws = true;
            var dec = (num.split(".")[1] || "").length, grp = /\d[,\s]\d{3}/.test(raw);
            var fmt = function (v) { var s = v.toFixed(dec); return grp ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : s; };
            var io = new IntersectionObserver(function (es) {
                es.forEach(function (e) {
                    if (!e.isIntersecting) { return; }
                    io.disconnect();
                    var t0 = performance.now(), dur = 1800;
                    (function step(now) { var k = Math.min(1, (now - t0) / dur), ez = 1 - Math.pow(1 - k, 4); el.textContent = fmt(to * ez); if (k < 1) { requestAnimationFrame(step); } })(t0);
                });
            }, { threshold: .4 });
            io.observe(el);
        });
    }
    function filters(root) {
        $$(".ws-R.ws-Filter", root).forEach(function (rep) {
            if (rep.__wsF) { return; }
            rep.__wsF = true;
            var items = $$("[data-tag]", rep), tags = [];
            items.forEach(function (i) { var t = val(i.getAttribute("data-tag")); if (t && tags.indexOf(t) < 0) { tags.push(t); } });
            if (tags.length < 2) { return; }
            var bar = d.createElement("div");
            bar.className = "ws-Chips"; bar.setAttribute("role", "group");
            var mk = function (label, tag, n) {
                var bt = d.createElement("button"); bt.type = "button"; bt.textContent = label; bt.setAttribute("data-f", tag); bt.setAttribute("aria-pressed", tag === "*" ? "true" : "false");
                if (n) { var s = d.createElement("sup"); s.textContent = n; bt.appendChild(s); }
                bar.appendChild(bt);
            };
            mk(msg("all"), "*", items.length);
            tags.forEach(function (t) { mk(t, t); });
            bar.addEventListener("click", function (e) {
                var bt = e.target.closest("button"); if (!bt) { return; }
                var f = bt.getAttribute("data-f");
                $$("button", bar).forEach(function (x) { x.setAttribute("aria-pressed", x === bt ? "true" : "false"); });
                items.forEach(function (i) { i.hidden = !(f === "*" || val(i.getAttribute("data-tag")) === f); });
            });
            rep.parentNode.insertBefore(bar, rep);
        });
    }
    // Logos (Scrolling Marquee) and Ticker: the entries run in an endless band. The band is the entries repeated until
    // they are wider than the screen, twice, and it moves by half its width.
    function marquee(root) {
        $$(".ws-Logos--marquee, .ws-Ticker", root).forEach(function (rep) {
            if (rep.__wsM || reduce) { return; }
            rep.__wsM = true;
            var items = Array.prototype.slice.call(rep.children), track = d.createElement("div"), logos = rep.classList.contains("ws-Logos");
            if (!items.length || (logos && items.length < 3)) { rep.classList.remove("ws-Logos--marquee"); return; }
            track.className = "ws-Track";
            items.forEach(function (i) { track.appendChild(i); });
            rep.appendChild(track);
            var copy = function (i) { var c = i.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.setAttribute("tabindex", "-1"); track.appendChild(c); return c; };
            var half = items.slice(), one = track.scrollWidth, room = rep.clientWidth || W.innerWidth, n = one > 0 ? Math.min(logos ? 3 : 8, Math.ceil(room / one)) : 1;
            for (var k = 1; k < n; k++) { items.forEach(function (i) { half.push(copy(i)); }); }
            half.forEach(copy);
            var per = rep.classList.contains("ws-Speed--slow") ? 8 : rep.classList.contains("ws-Speed--fast") ? 2.6 : 4.5;
            track.style.setProperty("--ws-speed", Math.max(14, half.length * per) + "s");
            rep.classList.add("is-marquee");
        });
    }
    // Opening Hours: today's row (DAY_NUMBER 1 = Monday ... 7 = Sunday, or the day name)
    function hours(root) {
        var now = new Date(), iso = now.getDay() === 0 ? 7 : now.getDay(), names = [];
        try { names = [now.toLocaleDateString(d.documentElement.lang || undefined, { weekday: "long" }), now.toLocaleDateString("en", { weekday: "long" }), now.toLocaleDateString("en", { weekday: "short" })].map(function (x) { return x.toLowerCase(); }); } catch (e) { /* old browser */ }
        $$(".ws-Hours", root).forEach(function (rep) {
            var days = $$(".ws-Day", rep), hit = days.filter(function (r) { return +val(r.getAttribute("data-day")) === iso; })[0];
            if (!hit) { hit = days.filter(function (r) { var n = (r.querySelector(".ws-Day-n") || {}).textContent || ""; return names.indexOf(n.trim().toLowerCase()) >= 0; })[0]; }
            if (hit) { hit.classList.add("is-today"); hit.setAttribute("aria-current", "date"); }
        });
    }
    // Comparison: the header row, Y/N as tick and dash, empty plan columns hidden
    function compare(root) {
        $$(".ws-Compare", root).forEach(function (rep) {
            if (rep.__wsC) { return; }
            rep.__wsC = true;
            rep.setAttribute("role", "table");
            var rows = $$(".ws-Cmp-row", rep), used = [false, false, false, false];
            rows.forEach(function (r) {
                if (/^(y|yes|1|true)$/i.test(val(r.getAttribute("data-head")))) { r.classList.add("is-head"); }
                $$(".ws-Cmp-c", r).forEach(function (c, i) {
                    var t = val(c.textContent);
                    if (t) { used[i] = true; }
                    if (!r.classList.contains("is-head")) {
                        var yes = /^(y|yes|true)$/i.test(t);
                        if (yes || /^(n|no|false|-)$/i.test(t)) {
                            var mark = d.createElement("span"); mark.className = yes ? "ws-Yes" : "ws-No"; mark.setAttribute("role", "img"); mark.setAttribute("aria-label", msg(yes ? "yes" : "no"));
                            c.textContent = ""; c.appendChild(mark);
                        }
                    }
                });
            });
            var n = used.lastIndexOf(true) + 1;
            rep.style.setProperty("--ws-cols", n || 1);
            rows.forEach(function (r) { $$(".ws-Cmp-c", r).forEach(function (c, i) { if (i >= n) { c.remove(); } }); });
            var head = rows.filter(function (r) { return r.classList.contains("is-head"); })[0];
            if (head && head !== rep.firstElementChild) { rep.insertBefore(head, rep.firstElementChild); }
        });
    }
    // a URL from a query that goes into a frame or a player: web addresses and files of this site only (never javascript: or data:)
    function webUrl(u) {
        u = String(u || "").trim().replace(/^#APP_FILES#/, appFiles());
        return /^(https?:)?\/\//i.test(u) || (!/^[a-z][a-z0-9+.-]*:/i.test(u) && u) ? u : "";
    }
    // Video: a cover with a play button; YouTube / Vimeo / a file only load when pressed
    function videos(root) {
        $$(".ws-Video", root).forEach(function (fig) {
            var url = webUrl(val(fig.getAttribute("data-video"))), btn = fig.querySelector(".ws-Video-play");
            if (!btn || fig.__wsV) { return; }
            fig.__wsV = true;
            if (!url) { btn.disabled = true; return; }
            btn.setAttribute("aria-label", msg("play") + ": " + (btn.getAttribute("aria-label") || ""));
            btn.addEventListener("click", function () {
                var yt = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/.exec(url), vm = /vimeo\.com\/(?:video\/)?(\d+)/.exec(url), el;
                if (yt || vm) {
                    el = d.createElement("iframe");
                    el.src = yt ? "https://www.youtube-nocookie.com/embed/" + yt[1] + "?autoplay=1&rel=0" : "https://player.vimeo.com/video/" + vm[1] + "?autoplay=1";
                    el.allow = "autoplay; fullscreen; picture-in-picture"; el.setAttribute("allowfullscreen", ""); el.title = btn.getAttribute("aria-label");
                } else {
                    el = d.createElement("video"); el.src = url; el.controls = true; el.autoplay = true; el.playsInline = true;
                }
                el.className = "ws-Video-frame";
                btn.replaceWith(el);
                if (el.focus) { el.focus(); }
            });
        });
    }
    // Map: the embed loads when it comes near the screen
    function maps(root) {
        $$(".ws-Map-frame", root).forEach(function (fr) {
            var url = webUrl(val(fr.getAttribute("data-map")));
            if (fr.__wsMap) { return; }
            fr.__wsMap = true;
            if (!url) { fr.classList.add("ws-Ph", "ws-Ph--n2"); return; }
            var go = function () { var f = d.createElement("iframe"); f.src = url; f.loading = "lazy"; f.title = val(fr.getAttribute("data-title")) || msg("map"); f.referrerPolicy = "no-referrer-when-downgrade"; fr.appendChild(f); };
            if ("IntersectionObserver" in W) { var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: "300px 0px" }); io.observe(fr); } else { go(); }
        });
    }
    // Photo Gallery: a lightbox with arrows, swipe and Escape
    var box = null;
    function lightbox(root) {
        $$(".ws-Photos", root).forEach(function (rep) {
            if (rep.__wsL) { return; }
            rep.__wsL = true;
            rep.addEventListener("click", function (e) {
                var btn = e.target.closest(".ws-Photo-btn"); if (!btn) { return; }
                var list = $$(".ws-Photo", rep).filter(function (f) { return !f.hidden && !f.closest("[aria-hidden=true]"); }), i = list.indexOf(btn.closest(".ws-Photo"));
                openBox(list, i, btn);
            });
        });
    }
    function openBox(list, i, opener) {
        if (!box) {
            box = d.createElement("div");
            box.className = "ws-Lightbox"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("tabindex", "-1");
            box.innerHTML = '<span class="ws-Lightbox-count" aria-live="polite"></span><figure class="ws-Lightbox-fig"><img alt=""><figcaption></figcaption></figure>' +
                '<button type="button" class="ws-Lightbox-close"><span aria-hidden="true">&times;</span></button>' +
                '<button type="button" class="ws-Arrow ws-Lightbox-prev"><span aria-hidden="true">&#8592;</span></button><button type="button" class="ws-Arrow ws-Lightbox-next"><span aria-hidden="true">&#8594;</span></button>';
            b.appendChild(box);
        }
        var img = box.querySelector("img"), cap = box.querySelector("figcaption"), count = box.querySelector(".ws-Lightbox-count"), cur = Math.max(0, i), x0 = null;
        var many = list.length > 1, sec = opener && opener.closest(".ws-Sec"), title = sec && sec.querySelector(".ws-Title");
        box.setAttribute("aria-label", (title && val(title.textContent)) || msg("photo"));
        box.querySelector(".ws-Lightbox-prev").hidden = box.querySelector(".ws-Lightbox-next").hidden = !many;
        box.querySelector(".ws-Lightbox-close").setAttribute("aria-label", msg("close"));
        box.querySelector(".ws-Lightbox-prev").setAttribute("aria-label", msg("prev"));
        box.querySelector(".ws-Lightbox-next").setAttribute("aria-label", msg("next"));
        function show() {
            var fig = list[cur], m = fig.querySelector(".ws-Media");
            if (m && !m.__wsLoaded) { load(m); }
            img.src = (m && m.__wsSrc) || ""; img.alt = (m && m.getAttribute("aria-label")) || "";
            if (!img.getAttribute("src")) { img.removeAttribute("src"); }
            cap.textContent = ((fig.querySelector("figcaption") || {}).textContent || "").trim();
            box.classList.toggle("is-empty", !img.getAttribute("src"));
            count.textContent = many ? (cur + 1) + " / " + list.length : "";
        }
        function go(k) { cur = (k + list.length) % list.length; show(); }
        // while the lightbox is open the rest of the page cannot be reached: it is inert, and Tab stays on the lightbox buttons
        var rest = Array.prototype.filter.call(b.children, function (el) { return el !== box && !el.inert && el.tagName !== "SCRIPT"; });
        rest.forEach(function (el) { el.inert = true; });
        function close() {
            box.hidden = true; d.removeEventListener("keydown", key, true); b.classList.remove("ws-Locked");
            rest.forEach(function (el) { el.inert = false; });
            if (opener && opener.isConnected) { opener.focus(); }
        }
        function key(e) {
            if (e.key === "Escape") { e.preventDefault(); close(); }
            else if (e.key === "ArrowRight") { go(cur + (rtl() ? -1 : 1)); } else if (e.key === "ArrowLeft") { go(cur + (rtl() ? 1 : -1)); }
            else if (e.key === "Tab") {
                var stops = $$("button", box).filter(function (x) { return !x.hidden; }), at = stops.indexOf(d.activeElement);
                e.preventDefault();
                stops[(at + (e.shiftKey ? -1 : 1) + stops.length) % stops.length].focus();
            }
        }
        box.querySelector(".ws-Lightbox-close").onclick = close;
        box.querySelector(".ws-Lightbox-prev").onclick = function () { go(cur - 1); };
        box.querySelector(".ws-Lightbox-next").onclick = function () { go(cur + 1); };
        box.onclick = function (e) { if (e.target === box) { close(); } };
        box.ontouchstart = function (e) { x0 = e.touches[0].clientX; };
        box.ontouchend = function (e) { if (x0 === null) { return; } var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(cur + ((dx < 0) !== rtl() ? 1 : -1)); } x0 = null; };
        box.hidden = false; b.classList.add("ws-Locked");
        d.addEventListener("keydown", key, true);
        show();
        box.querySelector(".ws-Lightbox-close").focus();
    }

    // Tabs: one row is one tab. The buttons are built from LABEL (or TITLE); arrow keys move between them.
    var uid = 0;
    function tabs(root) {
        $$(".ws-Tabs", root).forEach(function (rep) {
            var panels = $$(":scope > .ws-Tab", rep);
            if (rep.__wsT || !panels.length) { return; }
            rep.__wsT = true;
            var bar = d.createElement("div"), btns = [], id = "ws-tabs-" + (++uid);
            bar.className = "ws-Tabs-bar"; bar.setAttribute("role", "tablist");
            if (!panels.some(function (p) { var m = p.querySelector(".ws-Media"); return m && (m.__wsSrc || m.classList.contains("has-img")); })) { rep.classList.add("ws-Tabs--text"); }
            var show = function (k, focus) {
                panels.forEach(function (p, n) { p.hidden = n !== k; btns[n].setAttribute("aria-selected", n === k ? "true" : "false"); btns[n].tabIndex = n === k ? 0 : -1; });
                $$(".ws-Media.is-loading", panels[k]).forEach(function (el) { if (lazy) { lazy.unobserve(el); } load(el); });
                if (focus) { btns[k].focus(); }
            };
            panels.forEach(function (p, k) {
                var bt = d.createElement("button"), icon = val(p.getAttribute("data-tab-icon")), h = p.querySelector(".ws-Zig-t");
                bt.type = "button"; bt.className = "ws-Tabs-btn"; bt.id = id + "-t" + k; bt.setAttribute("role", "tab"); bt.setAttribute("aria-controls", id + "-p" + k);
                if (icon && /^[\w -]+$/.test(icon)) { var ic = d.createElement("span"); ic.className = "fa " + icon; ic.setAttribute("aria-hidden", "true"); bt.appendChild(ic); }
                bt.appendChild(d.createTextNode(val(p.getAttribute("data-label")) || (h ? h.textContent.replace(/\*/g, "") : "") || String(k + 1)));
                bt.addEventListener("click", function () { show(k); });
                p.id = id + "-p" + k; p.setAttribute("role", "tabpanel"); p.setAttribute("aria-labelledby", bt.id); p.tabIndex = 0;
                btns.push(bt); bar.appendChild(bt);
            });
            bar.addEventListener("keydown", function (e) {
                var at = btns.indexOf(d.activeElement), step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
                if (at < 0) { return; }
                if (e.key === "Home") { e.preventDefault(); show(0, true); } else if (e.key === "End") { e.preventDefault(); show(btns.length - 1, true); }
                else if (step) { e.preventDefault(); if (rtl() && /Left|Right/.test(e.key)) { step = -step; } show((at + step + btns.length) % btns.length, true); }
            });
            rep.insertBefore(bar, rep.firstChild);
            rep.classList.add("is-tabs");
            show(0);
        });
    }
    // Countdown: TARGET_DATE is a date and time such as 2027-03-09T08:30:00+03:00 (to_char(d, 'YYYY-MM-DD"T"HH24:MI:SS') || '+03:00')
    function countdown(root) {
        $$(".ws-Cd", root).forEach(function (cd) {
            var clock = cd.querySelector(".ws-Cd-clock"), raw = val(cd.getAttribute("data-to")), to = Date.parse(raw.replace(/^(\d{4}-\d\d-\d\d) (\d)/, "$1T$2"));
            if (cd.__wsCd || !clock) { return; }
            cd.__wsCd = true;
            if (isNaN(to)) { clock.parentNode.removeChild(clock); return; }
            var cells = ["days", "hours", "minutes", "seconds"].map(function (k) {
                var c = d.createElement("div"), n = d.createElement("b"), l = d.createElement("span");
                c.className = "ws-Cd-cell"; l.textContent = msg(k); c.appendChild(n); c.appendChild(l); clock.appendChild(c);
                return n;
            });
            var two = function (n) { return (n < 10 ? "0" : "") + n; }, timer = null;
            var tick = function () {
                var left = Math.max(0, Math.floor((to - Date.now()) / 1000)), parts = [Math.floor(left / 86400), Math.floor(left % 86400 / 3600), Math.floor(left % 3600 / 60), left % 60];
                if (!cd.isConnected) { clearInterval(timer); return; }
                cells.forEach(function (n, k) { var t = k ? two(parts[k]) : String(parts[k]); if (n.textContent !== t) { n.textContent = t; } });
                clock.setAttribute("aria-label", parts[0] + " " + msg("days") + ", " + parts[1] + " " + msg("hours") + ", " + parts[2] + " " + msg("minutes"));
                if (left === 0) {
                    clearInterval(timer);
                    var done = val(cd.getAttribute("data-done"));
                    cd.classList.add("is-done");
                    if (done) { clock.textContent = done; clock.classList.add("ws-Cd-done"); clock.removeAttribute("aria-label"); }
                }
            };
            clock.setAttribute("role", "timer");
            timer = setInterval(tick, 1000);
            tick();
        });
    }
    // Skills: a bar (or ring) filled to VALUE percent when it comes into view
    function skills(root) {
        $$(".ws-Skill", root).forEach(function (sk) {
            if (sk.__wsSk) { return; }
            sk.__wsSk = true;
            var v = Math.max(0, Math.min(100, parseFloat(val(sk.getAttribute("data-v"))) || 0)), bar = sk.querySelector(".ws-Skill-bar"), t = sk.querySelector(".ws-Skill-t");
            sk.style.setProperty("--ws-v", v);
            if (bar) { bar.setAttribute("aria-valuenow", v); var lb = sk.querySelector("b"); if (lb) { bar.setAttribute("aria-label", lb.textContent.trim()); } }
            if (t && !val(t.textContent)) { t.textContent = v + "%"; }
            if (reduce || !("IntersectionObserver" in W)) { sk.classList.add("is-in"); return; }
            var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); sk.classList.add("is-in"); } }, { threshold: .3 });
            io.observe(sk);
        });
    }
    // FAQ: the Search Box option, and the questions as structured data for search engines
    function faqs(root) {
        $$(".ws-Faqs", root).forEach(function (rep) {
            var items = $$(".ws-Faq", rep);
            if (rep.__wsQ || !items.length) { return; }
            rep.__wsQ = true;
            try {
                var ld = d.createElement("script");
                ld.type = "application/ld+json";
                ld.textContent = JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(function (f) {
                    var q = f.querySelector("summary"), a = f.querySelector(".ws-Faq-a");
                    return { "@type": "Question", name: (q ? q.textContent : "").trim(), acceptedAnswer: { "@type": "Answer", text: (a ? a.textContent : "").trim() } };
                }) });
                rep.appendChild(ld);
            } catch (e) { /* no JSON */ }
            if (!rep.classList.contains("ws-Faqs--search")) { return; }
            var wrap = d.createElement("div"), input = d.createElement("input"), none = d.createElement("p");
            wrap.className = "ws-Search"; input.type = "search"; input.className = "ws-Search-in"; input.placeholder = msg("search"); input.setAttribute("aria-label", msg("search")); input.autocomplete = "off";
            none.className = "ws-Search-none ws-Muted"; none.textContent = msg("none"); none.hidden = true; none.setAttribute("role", "status");
            wrap.appendChild(input);
            input.addEventListener("input", function () {
                var words = input.value.toLowerCase().split(/\s+/).filter(Boolean), hits = 0;
                items.forEach(function (f) { var t = f.textContent.toLowerCase(), on = words.every(function (w) { return t.indexOf(w) >= 0; }); f.hidden = !on; if (on) { hits++; } });
                none.hidden = hits > 0;
            });
            // the Enter key must not submit the page
            input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); } });
            rep.parentNode.insertBefore(wrap, rep);
            rep.parentNode.insertBefore(none, rep.nextSibling);
        });
    }

    /* ---------- slider: Hero (rows = slides) and Testimonials carousel ---------- */
    function slider(rep, sel) {
        var slides = $$(":scope > " + sel, rep);
        if (slides.length < 2 || rep.__wsS) { return; }
        rep.__wsS = true;
        var m = /ws-Auto--(\w+)/.exec(rep.className), secs = m ? (m[1] === "off" ? 0 : parseInt(m[1], 10) || 6) : (rep.classList.contains("ws-Quotes") ? 8 : 6);
        var ms = reduce ? 0 : secs * 1000, i = 0, timer = null;
        rep.classList.add("is-slider");
        rep.setAttribute("role", "region"); rep.setAttribute("aria-roledescription", "carousel");
        var ctl = d.createElement("div"), dots = [];
        ctl.className = "ws-Ctl";
        var count = d.createElement("span"); count.className = "ws-Ctl-count"; count.innerHTML = "<b>01</b> / " + (slides.length < 10 ? "0" : "") + slides.length;
        var dotBox = d.createElement("div"); dotBox.className = "ws-Dots";
        slides.forEach(function (s, k) {
            s.setAttribute("role", "group"); s.setAttribute("aria-roledescription", "slide"); s.setAttribute("aria-label", (k + 1) + " / " + slides.length);
            var dot = d.createElement("button"); dot.type = "button"; dot.className = "ws-Dot"; dot.setAttribute("aria-label", msg("slide") + " " + (k + 1)); dot.appendChild(d.createElement("i"));
            dot.addEventListener("click", function () { go(k); });
            dots.push(dot); dotBox.appendChild(dot);
        });
        var arrow = function (dir) {
            var a = d.createElement("button"); a.type = "button"; a.className = "ws-Arrow ws-Arrow--" + dir; a.setAttribute("aria-label", msg(dir));
            a.innerHTML = '<span aria-hidden="true">' + (dir === "prev" ? "&#8592;" : "&#8594;") + "</span>";
            a.addEventListener("click", function () { go(i + (dir === "prev" ? -1 : 1)); });
            return a;
        };
        // a pause button: the slides stay still until the visitor presses play again
        var stopped = false, hover = false, inside = false, pause = d.createElement("button");
        pause.type = "button"; pause.className = "ws-Arrow ws-Pause"; pause.innerHTML = '<span aria-hidden="true"></span>';
        var label = function () { pause.setAttribute("aria-label", msg(stopped ? "resume" : "pause")); pause.classList.toggle("is-stopped", stopped); };
        // pressing play starts the slides at once, also while the pointer or the focus is still on the button
        pause.addEventListener("click", function () { stopped = !stopped; if (!stopped) { hover = inside = false; } label(); sync(); });
        label();
        if (rep.classList.contains("ws-Hero")) { ctl.appendChild(count); }
        if (rep.classList.contains("ws-Quotes")) { ctl.appendChild(arrow("prev")); ctl.appendChild(dotBox); ctl.appendChild(arrow("next")); }
        else { ctl.appendChild(dotBox); ctl.appendChild(arrow("prev")); ctl.appendChild(arrow("next")); }
        if (ms) { ctl.appendChild(pause); }
        rep.appendChild(ctl);
        rep.style.setProperty("--ws-ms", ms + "ms");
        function show(back) {
            slides.forEach(function (s, k) {
                s.classList.toggle("is-active", k === i);
                s.classList.toggle("is-before", back ? k > i : k < i);
                s.setAttribute("aria-hidden", k === i ? "false" : "true"); if ("inert" in s) { s.inert = k !== i; }
            });
            dots.forEach(function (dt, k) { dt.classList.toggle("is-active", k === i); dt.setAttribute("aria-current", k === i ? "true" : "false"); });
            count.firstChild.textContent = (i < 9 ? "0" : "") + (i + 1);
            // a slide's picture loads just before the slide shows
            [i, (i + 1) % slides.length].forEach(function (k) { $$(".ws-Media.is-loading", slides[k]).forEach(function (el) { if (lazy) { lazy.unobserve(el); } load(el); }); });
        }
        function restart() { rep.classList.remove("ws-Run"); void rep.offsetWidth; rep.classList.add("ws-Run"); }
        // the slides move on their own only while nobody is using them: not paused, no pointer over them, no keyboard focus inside
        function sync() {
            clearInterval(timer); timer = null;
            var run = ms && !stopped && !hover && !inside;
            rep.classList.toggle("ws-Paused", !!ms && !run);
            if (!run) { return; }
            restart();
            timer = setInterval(function () {
                // the report was replaced by a partial page refresh: stop
                if (!rep.isConnected) { clearInterval(timer); return; }
                go(i + 1, true);
            }, ms);
        }
        function go(k, auto) {
            var back = k < i;
            i = (k + slides.length) % slides.length; show(back);
            if (auto) { restart(); } else { sync(); }
        }
        rep.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") { hover = true; sync(); } });
        rep.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") { hover = false; sync(); } });
        rep.addEventListener("focusin", function () { inside = true; sync(); });
        rep.addEventListener("focusout", function (e) { if (!rep.contains(e.relatedTarget)) { inside = false; sync(); } });
        rep.addEventListener("keydown", function (e) {
            if (e.key === "ArrowLeft") { go(i + (rtl() ? 1 : -1)); } else if (e.key === "ArrowRight") { go(i + (rtl() ? -1 : 1)); }
        });
        // a sideways swipe changes the slide; scrolling the page up or down does not
        var x0 = null, y0 = 0;
        rep.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
        rep.addEventListener("touchend", function (e) {
            if (x0 === null) { return; }
            var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) { go(i + ((dx < 0) !== rtl() ? 1 : -1)); }
            x0 = null;
        });
        show(); sync();
    }

    /* ---------- the header menu ----------
       1. a Website - Menu list in the Menu slot (static or SQL list; parent entries get a drop-down)
       2. otherwise built from the Modern Section regions with Show in Menu */
    // the section a menu link goes to on this page: "#id", or this page's own URL with "#id" (the menu of a multi-page
    // website); APEX marks a link to the open page as current, but such a link is current only while its section is on screen
    function sectionOf(a) {
        var h = a.getAttribute("href") || "", i = h.indexOf("#");
        if (i < 0 || !/^#[\w-]+$/.test(h.slice(i))) { return null; }
        if (i === 0) { return h.slice(1); }
        var u, here = location, page = function (x) { return (new URLSearchParams(x.search).get("p") || "").split(":").slice(0, 2).join(":"); };
        try { u = new URL(h, here.href); } catch (e) { return null; }
        return u.origin === here.origin && u.pathname === here.pathname && page(u) === page(here) ? h.slice(i + 1) : null;
    }
    var menuDone = false;
    function menu() {
        var nav = d.getElementById("ws-nav"), burger = d.querySelector(".ws-Burger");
        if (!nav) { return; }
        var list = d.querySelector(".ws-Menu-slot .ws-Menu") || nav.querySelector(".ws-Menu");
        if (list && list.parentNode !== nav) { nav.innerHTML = ""; nav.appendChild(list); }
        if (list && list.hasAttribute("data-ws-menu")) { b.classList.add("ws-Has-list"); }
        if (!list) {
            list = d.createElement("ul");
            list.className = "ws-Menu ws-Menu--auto";
            $$(".ws-Sec.ws-Sec--menu[id]").filter(function (s) { return s.getClientRects().length; }).forEach(function (s) {
                var t = s.getAttribute("data-menu") || (s.querySelector(".ws-Title") || {}).textContent || "";
                t = val(t).replace(/\*/g, "");
                if (!t) { return; }
                var li = d.createElement("li"), a = d.createElement("a");
                li.className = "ws-Menu-item"; a.className = "ws-Menu-link"; a.href = "#" + s.id; a.textContent = t;
                li.appendChild(a); list.appendChild(li);
            });
            nav.innerHTML = "";
            if (list.children.length) { nav.appendChild(list); }
        }
        var slot = d.querySelector(".ws-Menu-slot"); if (slot) { slot.hidden = true; }
        // the menu options act on the whole header
        b.className.split(/\s+/).forEach(function (c) { if (/^ws-MenuOpt--/.test(c)) { b.classList.remove(c); } });
        list.className.split(/\s+/).forEach(function (c) { var m = /^ws-Menu--(center|left|overlay|drawer)$/.exec(c); if (m) { b.classList.add("ws-MenuOpt--" + m[1]); } });
        b.classList.toggle("ws-No-menu", !list.children.length);
        if (!list.children.length || menuDone) { return; }
        menuDone = true;
        // anchors on this page are "current" while their section is on screen, not because APEX marked the page
        $$("a", list).forEach(function (a) {
            if (sectionOf(a)) { a.closest("li").classList.remove("is-current"); a.removeAttribute("aria-current"); }
        });
        // Last Entry as Button
        var tops = $$(":scope > li", list);
        if (list.classList.contains("ws-Menu--cta") && tops.length) { tops[tops.length - 1].classList.add("ws-Menu-cta"); }
        // Visible Entries: the rest go into More on wide screens (the phone menu shows them in the More accordion)
        var mx = /ws-Menu--max(\d)/.exec(list.className), plain = tops.filter(function (li) { return !li.classList.contains("ws-Menu-cta"); });
        if (mx && plain.length > +mx[1]) {
            var more = d.createElement("li"), sub = d.createElement("ul");
            more.className = "ws-Menu-item ws-Menu-item--parent ws-Menu-more";
            more.innerHTML = '<a class="ws-Menu-link" href="#"></a><button type="button" class="ws-Menu-toggle" aria-expanded="false"><span class="u-vh"></span></button>';
            more.querySelector("a").textContent = msg("more"); more.querySelector(".u-vh").textContent = msg("more");
            sub.className = "ws-Menu-sub";
            plain.slice(+mx[1]).forEach(function (li) {
                // a moved parent keeps its children one level down
                sub.appendChild(li);
            });
            more.appendChild(sub);
            list.insertBefore(more, list.querySelector(":scope > .ws-Menu-cta"));
        }
        // drop-downs: hover and click on wide screens, an accordion in the phone menu; Escape closes
        var wide = function () { return W.matchMedia("(min-width: 901px)").matches; };
        var closeAll = function (except) {
            $$(".ws-Menu-item--parent.is-open", list).forEach(function (o) { if (!except || !o.contains(except)) { o.classList.remove("is-open"); o.querySelector(":scope > .ws-Menu-toggle").setAttribute("aria-expanded", "false"); } });
        };
        $$(".ws-Menu-item--parent", list).forEach(function (li) {
            var btn = li.querySelector(":scope > .ws-Menu-toggle"), a = li.querySelector(":scope > .ws-Menu-link"), sub = li.querySelector(":scope > .ws-Menu-sub");
            if (!btn || !sub) { return; }
            sub.id = sub.id || "ws-sub-" + Math.random().toString(36).slice(2, 8); btn.setAttribute("aria-controls", sub.id);
            var set = function (open) {
                if (open) { closeAll(li); }
                li.classList.toggle("is-open", open); btn.setAttribute("aria-expanded", open ? "true" : "false");
            };
            btn.addEventListener("click", function (e) { e.stopPropagation(); set(!li.classList.contains("is-open")); });
            // a parent without its own page (href "#" or empty) opens its drop-down
            if (a && (!a.getAttribute("href") || a.getAttribute("href") === "#")) {
                a.setAttribute("role", "button"); a.setAttribute("aria-expanded", "false");
                a.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); set(!li.classList.contains("is-open")); a.setAttribute("aria-expanded", li.classList.contains("is-open") ? "true" : "false"); });
            }
            li.addEventListener("keydown", function (e) {
                if (e.key === "Escape" && li.classList.contains("is-open")) { set(false); btn.focus(); e.stopPropagation(); }
                if (e.key === "ArrowDown" && e.target === btn) { e.preventDefault(); set(true); var f = sub.querySelector("a"); if (f) { f.focus(); } }
            });
            li.addEventListener("focusout", function (e) { if (wide() && !li.contains(e.relatedTarget)) { set(false); } });
            var hoverT;
            li.addEventListener("mouseenter", function () { if (wide() && W.matchMedia("(hover: hover)").matches) { clearTimeout(hoverT); set(true); } });
            li.addEventListener("mouseleave", function () { if (wide() && W.matchMedia("(hover: hover)").matches) { hoverT = setTimeout(function () { set(false); }, 200); } });
        });
        d.addEventListener("click", function (e) { if (!e.target.closest(".ws-Menu")) { closeAll(); } });
        if (burger) {
            burger.setAttribute("aria-label", msg("menu"));
            burger.onclick = function () { var open = b.classList.toggle("ws-Nav-open"); burger.setAttribute("aria-expanded", open ? "true" : "false"); };
        }
        d.addEventListener("keydown", function (e) {
            if (e.key !== "Escape") { return; }
            if (list.querySelector(".is-open")) { closeAll(); return; }
            if (b.classList.contains("ws-Nav-open")) { b.classList.remove("ws-Nav-open"); if (burger) { burger.setAttribute("aria-expanded", "false"); burger.focus(); } }
        });
        nav.addEventListener("click", function (e) {
            var a = e.target.closest("a[href]");
            if (a && a.getAttribute("href") !== "#") { b.classList.remove("ws-Nav-open"); closeAll(); if (burger) { burger.setAttribute("aria-expanded", "false"); } }
        });
        // the current section while scrolling
        if (!("IntersectionObserver" in W)) { return; }
        var links = $$("a[href]", list).filter(function (a) { return sectionOf(a); }), secs = [];
        links.forEach(function (a) { var s = d.getElementById(sectionOf(a)); if (s && secs.indexOf(s) < 0) { secs.push(s); } });
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) {
                if (!e.isIntersecting) { return; }
                links.forEach(function (a) {
                    var on = sectionOf(a) === e.target.id;
                    a.classList.toggle("is-current", on);
                    if (on) { a.setAttribute("aria-current", "location"); } else { a.removeAttribute("aria-current"); }
                });
                // a parent shows as current while one of its children is
                $$(".ws-Menu-item--parent", list).forEach(function (p) { p.classList.toggle("is-current-parent", !!p.querySelector(".ws-Menu-sub a.is-current")); });
            });
        }, { rootMargin: "-45% 0px -50% 0px" });
        secs.forEach(function (s) { io.observe(s); });
    }

    /* ---------- header extras: light/dark toggle, WhatsApp button ---------- */
    function extras() {
        var t = d.querySelector(".ws-ThemeBtn");
        if (t) {
            var isDark = function () {
                return b.classList.contains("ws-Scheme--dark") || /(?:^|\s)ws-Design--(midnight|techgrid|aurora|blueprint)(?:\s|$)/.test(b.className) ||
                    (b.classList.contains("ws-Scheme--auto") && !!W.matchMedia && W.matchMedia("(prefers-color-scheme: dark)").matches);
            };
            t.setAttribute("aria-label", msg("dark"));
            t.setAttribute("aria-pressed", isDark() ? "true" : "false");
            t.onclick = function () {
                var dark = !isDark();
                b.classList.remove("ws-Scheme--auto", "ws-Scheme--dark");
                if (dark) { b.classList.add("ws-Scheme--dark"); }
                t.setAttribute("aria-pressed", dark ? "true" : "false");
                try { localStorage.setItem("ws-scheme", dark ? "dark" : "light"); } catch (e) { /* private mode */ }
            };
        }
        // APEX messages show as a toast (website.css): a click closes one, a success message leaves after 6 seconds
        $$(".apex-page-success, .apex-page-error").forEach(function (box) {
            if (box.__ws) { return; }
            box.__ws = true;
            var close = function () {
                var a = box.querySelector(".ws-Alert");
                if (a) { a.classList.add("ws-Alert--leaving"); }
                setTimeout(function () { box.classList.remove("u-visible"); box.classList.add("u-hidden"); if (a) { a.classList.remove("ws-Alert--leaving"); } }, 300);
            };
            box.addEventListener("click", close);
            if (box.classList.contains("apex-page-success") && box.querySelector(".ws-Alert")) { setTimeout(close, 6000); }
        });
        var chat = d.querySelector(".ws-Chat");
        if (chat && !chat.__ws) {
            chat.__ws = true;
            var raw = chat.getAttribute("data-number") || "", num = raw.replace(/[^\d]/g, "");
            if (!num || /&/.test(raw)) { chat.remove(); } else { chat.href = "https://wa.me/" + num; }
        }
    }

    /* ---------- scroll: header state, progress bar, back to top ---------- */
    function scrolling() {
        var bar = d.querySelector(".ws-Progress"), top = d.querySelector(".ws-ToTop"), header = d.querySelector(".ws-Header");
        if (top) { top.setAttribute("aria-label", msg("top")); top.onclick = function () { W.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }; }
        var last = W.scrollY || 0;
        function on() {
            var y = W.scrollY || d.documentElement.scrollTop, h = d.documentElement.scrollHeight - W.innerHeight;
            b.classList.toggle("ws-is-scrolled", y > 8);
            if (bar) { bar.style.width = (h > 0 ? Math.min(100, y / h * 100) : 0) + "%"; }
            if (top) { top.classList.toggle("is-on", y > 700); }
            // Hide Header on Scroll: away while reading down, back as soon as the visitor scrolls up (never while the phone menu is open)
            if (Math.abs(y - last) > 6) {
                b.classList.toggle("ws-is-down", b.classList.contains("ws-Fx--autohide") && y > last && y > 240 && !b.classList.contains("ws-Nav-open") && !(header && header.contains(d.activeElement)));
                last = y;
            }
        }
        // the header's height (the announcement bar included) is the scroll offset of the menu links and the place of the messages
        function size() { if (header) { d.documentElement.style.setProperty("--ws-header-h", header.offsetHeight + "px"); } }
        if (!scrolling.done) {
            scrolling.done = true;
            W.addEventListener("scroll", on, { passive: true });
            W.addEventListener("resize", size);
            if (header) { header.addEventListener("focusin", function () { b.classList.remove("ws-is-down"); }); }
        }
        size();
        on();
    }
    // the Announcement slot: a bar above the menu that the visitor can close (it stays closed for this visit, until its text changes)
    function announce() {
        var bar = d.querySelector(".ws-Announce");
        if (!bar || bar.__ws) { return; }
        bar.__ws = true;
        var text = val(bar.textContent).replace(/\s+/g, " "), key = "ws-announce:" + location.pathname.split("/").slice(0, 5).join("/") + ":" + text.length + ":" + text.slice(0, 40);
        var gone = false;
        try { gone = sessionStorage.getItem(key) === "1"; } catch (e) { /* private mode */ }
        if (!text || gone) { bar.hidden = true; return; }
        b.classList.add("ws-Has-announce");
        var x = d.createElement("button");
        x.type = "button"; x.className = "ws-Announce-x"; x.setAttribute("aria-label", msg("close")); x.innerHTML = '<span aria-hidden="true">&times;</span>';
        x.addEventListener("click", function () {
            bar.hidden = true; b.classList.remove("ws-Has-announce");
            try { sessionStorage.setItem(key, "1"); } catch (e) { /* private mode */ }
            scrolling();
        });
        bar.appendChild(x);
    }

    /* ---------- reveal on scroll: only what starts below the fold ---------- */
    function reveal(root) {
        if (!b.classList.contains("ws-Fx--reveal") || reduce || !("IntersectionObserver" in W)) { return; }
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("ws-rv"); io.unobserve(e.target); } });
        }, { threshold: .06, rootMargin: "0px 0px -4% 0px" });
        // only the sections of the page; the header and footer are always shown
        $$(".ws-Main .ws-Head, .ws-Main .ws-R > *:not(.ws-Ctl):not(.ws-Track), .ws-Main .ws-Split > *, .ws-Main .ws-Pillars > *, .ws-Main .ws-Statement, .ws-Main .ws-Body > .ws-Grid", root).forEach(function (el) {
            if (el.__wsRv || el.closest(".is-slider, .ws-Logos--marquee, .ws-Compare, .ws-Photos--strip")) { return; }
            el.__wsRv = true;
            if (el.getBoundingClientRect().top < W.innerHeight * .92) { return; }
            var k = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
            el.style.setProperty("--ws-d", Math.min(k, 6) * 0.07 + "s");
            el.classList.add("ws-rvt", "ws-rv");
            io.observe(el);
        });
    }

    function refresh(root) {
        root = root || d;
        $$(".ws-R", root).forEach(function (r) { if (!r.hasAttribute("data-ws-base")) { r.setAttribute("data-ws-base", r.className.split(/\s+/).filter(function (c) { return c === "ws-R" || !/--/.test(c); }).join(" ")); } clean(r); });
        $$(".ws-Sec, .ws-Footer, .ws-Hero-slot", root === d ? d : root).forEach(function (s) { clean(s); });
        media(root); emphasis(root); heads(root); stars(root); plans(root); hours(root); compare(root); videos(root); maps(root); lightbox(root);
        tabs(root); countdown(root); skills(root); faqs(root);
        $$(".ws-Hero", root).forEach(function (r) { slider(r, ".ws-Slide"); });
        $$(".ws-Quotes--carousel", root).forEach(function (r) { slider(r, ".ws-Quote"); });
        marquee(root); filters(root); counters(root); reveal(root);
    }

    function init() {
        if (init.done) { return; }
        init.done = true;
        var look = hashLook();
        if (look.page !== null || look.regions || look.dir) { applyLook(look); }
        fonts();
        // a transparent header needs a picture behind it: over any other first section it behaves like Classic
        if (b.classList.contains("ws-Header--transparent") && !d.querySelector(".ws-Hero-slot .ws-Hero--slider, .ws-Hero-slot .ws-Hero--fullbleed, .ws-Hero-slot .ws-Hero:not([class*='ws-Hero--'])")) {
            b.classList.remove("ws-Header--transparent");
        }
        if (d.querySelector(".ws-Brand-slot") && val(d.querySelector(".ws-Brand-slot").textContent)) { b.classList.add("ws-Has-brand"); }
        refresh(d);
        menu();
        extras();
        announce();
        scrolling();
        b.classList.remove("ws-Loading");
        // the Designer changes the hash: page options apply at once, section options reload the page
        W.addEventListener("hashchange", function () {
            var nl = hashLook();
            if (nl.regions !== look.regions || nl.dir !== look.dir) { location.reload(); return; }
            look = nl; applyLook(nl); menu(); extras();
        });
        if (W.apex && apex.jQuery) { apex.jQuery(d).on("apexafterrefresh", function (e) { refresh(e.target); }); }
    }

    W.wsSite = { init: init, refresh: refresh, applyLook: applyLook };
    if (!W.apex) { if (d.readyState !== "loading") { init(); } else { d.addEventListener("DOMContentLoaded", init); } }
})(window, document);
