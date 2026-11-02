/* Website Studio - behaviour of Modern One Page and the Website report templates.
   Everything is switched by template options (CSS classes). Reports are Classic Reports: a column the query does not
   return stays as its #COLUMN# placeholder, and this script treats it as empty, so every column is optional.
   Public API: wsSite.init() (called by the page template), wsSite.refresh(element) after a partial page refresh. */
(function (W, d) {
    "use strict";
    var b = d.body, PH = /^#[A-Z][A-Z0-9_$]*#$/, reduce = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var FONTS = {
        grotesk: "family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=DM+Sans:wght@400;500;700",
        serif: "family=Fraunces:ital,wght@0,500;0,600;1,500&family=Instrument+Sans:wght@400;500;600",
        luxe: "family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600",
        tech: "family=Sora:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600",
        poster: "family=Anton&family=Archivo:wght@400;500;600;700",
        friendly: "family=Outfit:wght@400;500;600;700"
    };
    var TEXT = { menu: "Menu", top: "Back to top", all: "All", prev: "Previous", next: "Next", slide: "Slide", apply: "Apply for this role" };

    function $$(sel, root) { return Array.prototype.slice.call((root || d).querySelectorAll(sel)); }
    function val(s) { s = s == null ? "" : String(s).trim(); return PH.test(s) ? "" : s; }
    function msg(key) {
        // optional translations: text messages WEBSITE_STUDIO.MENU, .BACK_TO_TOP, .ALL, .PREVIOUS, .NEXT, .SLIDE, .APPLY
        try { var k = "WEBSITE_STUDIO." + key.toUpperCase(), m = W.apex && apex.lang && apex.lang.getMessage(k); if (m && m !== k) { return m; } } catch (e) { /* no apex.lang */ }
        return TEXT[key];
    }

    /* ---------- look from the URL (Designer preview): #ws=<page classes>&r=<static id>:<classes>,<static id>:<classes> ---------- */
    var PAGE_FAMILY = /^ws-(Design|Accent|Scheme|Font|Header|Corners|Space|Fx|Footer)--/;
    var SEC_FAMILY = /^ws-(Tone|Pad|Head|Width)--/;
    function hashLook() {
        var h = location.hash, g = function (k) { var m = new RegExp("[#&]" + k + "=([^&]*)").exec(h); return m ? decodeURIComponent(m[1]) : null; };
        return { page: g("ws"), regions: g("r") };
    }
    function applyLook(look) {
        if (look.page !== null) {
            b.className.split(/\s+/).forEach(function (c) { if (PAGE_FAMILY.test(c)) { b.classList.remove(c); } });
            look.page.split(/[\s+,]+/).forEach(function (c) { if (c) { b.classList.add(c); } });
        }
        if (look.regions) {
            look.regions.split(",").forEach(function (part) {
                var i = part.indexOf(":"), id = part.slice(0, i), cls = part.slice(i + 1).split(/[\s+]+/).filter(Boolean),
                    sec = id && d.getElementById(id), rep = sec && sec.querySelector(".ws-R");
                if (!sec) { return; }
                // each class replaces the classes of its own family only (ws-Tone--soft replaces ws-Tone--dark, ws-Hero--split replaces ws-Hero--slider)
                cls.forEach(function (c) {
                    var el = SEC_FAMILY.test(c) || !rep ? sec : rep, fam = c.replace(/--.*$/, "--");
                    el.className.split(/\s+/).forEach(function (x) { if (x.indexOf(fam) === 0) { el.classList.remove(x); } });
                    el.classList.add(c);
                });
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
        $$("[data-opt]", root).forEach(function (el) {
            var kind = el.getAttribute("data-opt"), keep = kind === "href" ? el.hasAttribute("href") : !!val(el.textContent);
            if (!keep) { el.parentNode.removeChild(el); }
        });
        $$(".ws-Actions", root).forEach(function (a) { if (!a.children.length) { a.parentNode.removeChild(a); } });
        $$(".ws-Info a:not([href])", root).forEach(function (a) { a.className = "ws-Info-v"; });
        // an icon column the query does not return: the data-icon default, or no icon
        $$(".fa", root).forEach(function (i) {
            if (i.className.replace(/\b(fa|ws-Icon)\b/g, "").trim()) { return; }
            var def = i.getAttribute("data-icon");
            if (def) { i.classList.add(def); } else if (def !== null) { i.parentNode.removeChild(i); } else { i.classList.add("fa-circle-o"); }
        });
        // the default layout of a report: its class when no layout option is chosen
        $$("[data-ws-null]", root.matches && root.matches("[data-ws-null]") ? root.parentNode : root).forEach(function (r) {
            var base = (r.getAttribute("data-ws-base-class") || "") + "--";
            if (!r.className.split(/\s+/).some(function (c) { return c.indexOf(base) === 0; })) { r.classList.add(r.getAttribute("data-ws-null")); }
        });
    }

    /* ---------- images: data-img -> background; none -> artwork or initials ---------- */
    var artN = 0;
    function media(root) {
        $$("[data-img]", root).forEach(function (el) {
            var src = val(el.getAttribute("data-img"));
            if (el.classList.contains("ws-Logo-img")) {
                if (src) { var img = d.createElement("img"); img.src = src; img.alt = val(el.getAttribute("data-alt")); img.loading = "lazy"; el.parentNode.replaceChild(img, el); }
                else { el.parentNode.removeChild(el); }
                return;
            }
            if (src) {
                el.style.backgroundImage = "url(\"" + src.replace(/["\\\n]/g, encodeURIComponent) + "\")";
                el.classList.add("has-img");
            } else if (!el.classList.contains("has-img")) {
                el.classList.add("ws-Art", "ws-Art--" + ((artN++ % 6) + 1));
            }
            var ini = el.getAttribute("data-initials");
            if (ini !== null) {
                var words = val(ini).split(/\s+/).filter(Boolean);
                el.setAttribute("data-initials", words.length ? (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase() : "");
                if (!words.length) { el.removeAttribute("data-initials"); }
            }
        });
    }

    /* ---------- emphasis: *word* in titles becomes <em> ---------- */
    function emphasis(root) {
        $$(".ws-Title, .ws-Display, .ws-Statement, .ws-Quote blockquote", root).forEach(function (el) {
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
            var raw = val(el.getAttribute("data-to") || el.textContent), clean = raw.replace(/[^\d.\-]/g, ""), to = parseFloat(clean);
            if (!b.classList.contains("ws-Fx--count") || reduce || isNaN(to) || el.__ws) { return; }
            el.__ws = true;
            var dec = (clean.split(".")[1] || "").length, grp = /\d[,\s]\d{3}/.test(raw);
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
    function marquee(root) {
        $$(".ws-Logos--marquee", root).forEach(function (rep) {
            if (rep.__wsM || reduce) { return; }
            rep.__wsM = true;
            var items = Array.prototype.slice.call(rep.children), track = d.createElement("div");
            if (items.length < 3) { rep.classList.remove("ws-Logos--marquee"); return; }
            track.className = "ws-Track";
            items.forEach(function (i) { track.appendChild(i); });
            items.forEach(function (i) { var c = i.cloneNode(true); c.setAttribute("aria-hidden", "true"); c.setAttribute("tabindex", "-1"); track.appendChild(c); });
            track.style.setProperty("--ws-speed", Math.max(20, items.length * 5) + "s");
            rep.appendChild(track);
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
        var arrow = function (dir) { var a = d.createElement("button"); a.type = "button"; a.className = "ws-Arrow"; a.setAttribute("aria-label", msg(dir)); a.innerHTML = '<span aria-hidden="true">' + (dir === "prev" ? "&#8592;" : "&#8594;") + "</span>"; a.addEventListener("click", function () { go(i + (dir === "prev" ? -1 : 1)); }); return a; };
        if (rep.classList.contains("ws-Hero")) { ctl.appendChild(count); }
        if (rep.classList.contains("ws-Quotes")) { ctl.appendChild(arrow("prev")); ctl.appendChild(dotBox); ctl.appendChild(arrow("next")); }
        else { ctl.appendChild(dotBox); ctl.appendChild(arrow("prev")); ctl.appendChild(arrow("next")); }
        rep.appendChild(ctl);
        rep.style.setProperty("--ws-ms", ms + "ms");
        function show() {
            slides.forEach(function (s, k) { s.classList.toggle("is-active", k === i); s.setAttribute("aria-hidden", k === i ? "false" : "true"); if ("inert" in s) { s.inert = k !== i; } });
            dots.forEach(function (dt, k) { dt.classList.toggle("is-active", k === i); dt.setAttribute("aria-current", k === i ? "true" : "false"); });
            count.firstChild.textContent = (i < 9 ? "0" : "") + (i + 1);
        }
        function start() {
            clearInterval(timer);
            if (!ms) { return; }
            rep.classList.remove("ws-Run"); void rep.offsetWidth; rep.classList.add("ws-Run");
            timer = setInterval(function () { go(i + 1, true); }, ms);
        }
        function go(k, auto) { i = (k + slides.length) % slides.length; show(); if (!auto) { start(); } else { rep.classList.remove("ws-Run"); void rep.offsetWidth; rep.classList.add("ws-Run"); } }
        rep.addEventListener("mouseenter", function () { if (ms) { clearInterval(timer); rep.classList.add("ws-Paused"); } });
        rep.addEventListener("mouseleave", function () { if (ms) { rep.classList.remove("ws-Paused"); start(); } });
        rep.addEventListener("focusin", function () { if (ms) { clearInterval(timer); rep.classList.add("ws-Paused"); } });
        rep.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft") { go(i - 1); } else if (e.key === "ArrowRight") { go(i + 1); } });
        var x0 = null;
        rep.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        rep.addEventListener("touchend", function (e) { if (x0 === null) { return; } var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(i + (dx < 0 ? 1 : -1)); } x0 = null; });
        show(); start();
    }

    /* ---------- menu from the sections ---------- */
    function menu() {
        var nav = d.getElementById("ws-nav"), burger = d.querySelector(".ws-Burger");
        if (!nav) { return; }
        var secs = $$(".ws-Sec.ws-Sec--menu[id]").filter(function (s) { return s.offsetParent !== null || s.getClientRects().length; });
        nav.innerHTML = "";
        secs.forEach(function (s) {
            var t = s.getAttribute("data-menu") || (s.querySelector(".ws-Title") || {}).textContent || "";
            t = val(t).replace(/\*/g, "");
            if (!t) { return; }
            var a = d.createElement("a"); a.href = "#" + s.id; a.textContent = t; nav.appendChild(a);
        });
        if (burger) {
            burger.setAttribute("aria-label", msg("menu"));
            burger.onclick = function () { var open = b.classList.toggle("ws-Nav-open"); burger.setAttribute("aria-expanded", open ? "true" : "false"); };
        }
        nav.onclick = function (e) { if (e.target.closest("a")) { b.classList.remove("ws-Nav-open"); if (burger) { burger.setAttribute("aria-expanded", "false"); } } };
        if (!("IntersectionObserver" in W) || !nav.children.length) { return; }
        var links = $$("a", nav), io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { links.forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id); }); } });
        }, { rootMargin: "-45% 0px -50% 0px" });
        secs.forEach(function (s) { io.observe(s); });
    }

    /* ---------- scroll: header state, progress bar, back to top ---------- */
    function scrolling() {
        var bar = d.querySelector(".ws-Progress"), top = d.querySelector(".ws-ToTop"), header = d.querySelector(".ws-Header");
        if (top) { top.setAttribute("aria-label", msg("top")); top.onclick = function () { W.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); }; }
        function on() {
            var y = W.scrollY || d.documentElement.scrollTop, h = d.documentElement.scrollHeight - W.innerHeight;
            b.classList.toggle("ws-is-scrolled", y > 8);
            if (bar) { bar.style.width = (h > 0 ? Math.min(100, y / h * 100) : 0) + "%"; }
            if (top) { top.classList.toggle("is-on", y > 700); }
        }
        W.addEventListener("scroll", on, { passive: true });
        if (header) { d.documentElement.style.setProperty("--ws-header-h", header.offsetHeight + "px"); }
        on();
    }

    /* ---------- reveal on scroll: only what starts below the fold ---------- */
    function reveal(root) {
        if (!b.classList.contains("ws-Fx--reveal") || reduce || !("IntersectionObserver" in W)) { return; }
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("ws-rv"); io.unobserve(e.target); } });
        }, { threshold: .06, rootMargin: "0px 0px -4% 0px" });
        // only the sections of the page; the header and footer are always shown
        $$(".ws-Main .ws-Head, .ws-Main .ws-R > *:not(.ws-Ctl):not(.ws-Track), .ws-Main .ws-Split > *, .ws-Main .ws-Pillars > *, .ws-Main .ws-Statement, .ws-Main .ws-Body > .ws-Grid", root).forEach(function (el) {
            if (el.__wsRv || el.closest(".is-slider, .ws-Logos--marquee")) { return; }
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
        media(root); emphasis(root); heads(root); stars(root); plans(root);
        $$(".ws-Hero", root).forEach(function (r) { slider(r, ".ws-Slide"); });
        $$(".ws-Quotes--carousel", root).forEach(function (r) { slider(r, ".ws-Quote"); });
        marquee(root); filters(root); counters(root); reveal(root);
    }

    function init() {
        if (init.done) { return; }
        init.done = true;
        var look = hashLook();
        if (look.page !== null || look.regions) { applyLook(look); }
        fonts();
        // a transparent header needs a picture behind it: over any other first section it behaves like Classic
        if (b.classList.contains("ws-Header--transparent") && !d.querySelector(".ws-Hero-slot .ws-Hero--slider, .ws-Hero-slot .ws-Hero--fullbleed, .ws-Hero-slot .ws-Hero:not([class*='ws-Hero--'])")) {
            b.classList.remove("ws-Header--transparent");
        }
        if (d.querySelector(".ws-Brand-slot") && val(d.querySelector(".ws-Brand-slot").textContent)) { b.classList.add("ws-Has-brand"); }
        refresh(d);
        menu();
        scrolling();
        b.classList.remove("ws-Loading");
        // the Designer changes the hash: page options apply at once, section options reload the page
        W.addEventListener("hashchange", function () {
            var nl = hashLook();
            if (nl.regions !== look.regions) { location.reload(); return; }
            look = nl; applyLook(nl); menu();
        });
        if (W.apex && apex.jQuery) { apex.jQuery(d).on("apexafterrefresh", function (e) { refresh(e.target); }); }
    }

    W.wsSite = { init: init, refresh: refresh, applyLook: applyLook };
    if (!W.apex) { if (d.readyState !== "loading") { init(); } else { d.addEventListener("DOMContentLoaded", init); } }
})(window, document);
