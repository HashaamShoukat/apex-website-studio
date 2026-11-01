// Harness server: qa/www (with /i -> APEX 26.1 images), /static -> the app's static files, and APEX-style
// f?p=APP:PAGE:SESSION URLs mapped to the harness pages. node qa/server.cjs [port]
const http = require("http"), fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "www"), STATIC = path.join(__dirname, "../apexlang/shared-components/static-files"), port = +process.argv[2] || 8652;
const PAGES = { WEBSITE: "site.html", "10": "site.html", DESIGNER: "designer.html", "2": "designer.html", HOME: "gallery.html", "1": "gallery.html", "HOW-TO-USE": "how.html", "3": "how.html" };
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".gif": "image/gif", ".ttf": "font/ttf" };
http.createServer((req, res) => {
  const u = new URL(req.url, "http://x");
  let file = path.join(ROOT, decodeURIComponent(u.pathname));
  if (u.pathname === "/f" && u.searchParams.get("p")) { file = path.join(ROOT, PAGES[u.searchParams.get("p").split(":")[1]] || "site.html"); }
  else if (u.pathname.startsWith("/static/")) { file = path.join(STATIC, decodeURIComponent(u.pathname.slice(8))); }
  else if (u.pathname.startsWith("/gallery/")) { file = path.join(STATIC, decodeURIComponent(u.pathname)); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end("not found"); return; }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" }); res.end(data);
  });
}).listen(port, () => console.log("harness on http://localhost:" + port));
