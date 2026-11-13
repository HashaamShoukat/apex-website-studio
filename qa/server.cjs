// Harness server: qa/www (with /i -> APEX 26.1 images), /static -> the app's static files, and APEX-style
// f?p=APP:PAGE:SESSION URLs mapped to the harness pages. node qa/server.cjs [port]
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "www"), STATIC = path.join(__dirname, "../apexlang/shared-components/static-files"), port = +process.argv[2] || 8652;
const PAGES = { WEBSITE: "site.html", "10": "site.html", COMPANY: "company.html", "11": "company.html", RESTAURANT: "restaurant.html", "12": "restaurant.html",
  CLINIC: "clinic.html", "13": "clinic.html", "REAL-ESTATE": "real-estate.html", "14": "real-estate.html", CONFERENCE: "conference.html", "15": "conference.html",
  PORTFOLIO: "portfolio.html", "16": "portfolio.html", SAAS: "saas.html", "17": "saas.html", DESIGNER: "designer.html", "2": "designer.html", HOME: "gallery.html", "1": "gallery.html", "HOW-TO-USE": "how.html", "3": "how.html" };
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".gif": "image/gif", ".ttf": "font/ttf" };
// a file below one of the two served folders, or null (a path that climbs out with .. is refused)
const inside = (root, rel) => { const file = path.resolve(root, "." + path.sep + rel), r = path.relative(root, file); return r && !r.startsWith("..") && !path.isAbsolute(r) ? file : null; };
http.createServer((req, res) => {
  let u, name;
  try { u = new URL(req.url, "http://x"); name = decodeURIComponent(u.pathname); } catch (e) { res.writeHead(400); res.end("bad request"); return; }
  let file = inside(ROOT, name);
  if (u.pathname === "/f" && u.searchParams.get("p")) { file = path.join(ROOT, PAGES[u.searchParams.get("p").split(":")[1]] || "site.html"); }
  else if (name.startsWith("/static/")) { file = inside(STATIC, name.slice(8)); }
  else if (name.startsWith("/gallery/")) { file = inside(STATIC, name); }
  if (!file) { res.writeHead(404); res.end("not found"); return; }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    // ?dir=rtl serves a page right to left (the RTL QA run)
    if (u.searchParams.get("dir") === "rtl" && path.extname(file) === ".html") { data = Buffer.from(String(data).replace(/<html /, '<html dir="rtl" ')); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" }); res.end(data);
  });
}).listen(port, "127.0.0.1", () => console.log("harness on http://localhost:" + port));
