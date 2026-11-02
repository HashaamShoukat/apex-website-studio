// Downloads the photos of the starter websites from Unsplash into Static Application Files and writes docs/CREDITS.md.
//   node tools/fetch-photos.mjs            (Node 18 or later; needs internet access to images.unsplash.com)
//   then: cd apexlang && node _src/build.mjs   (lists the new files in static-files.apx), and import the app again.
// Every photo is cropped and compressed on the Unsplash CDN (w, h, fit=crop, q, fm=jpg), so nothing needs to be installed.
// Each entry of apexlang/_src/photos.mjs lists alternative photo ids; the first that downloads is used.
// Licence: Unsplash License (https://unsplash.com/license) - free to use, copy, modify and redistribute, also commercially,
// without permission or attribution; photos may not be sold without significant modification or used to build a competing service.
import fs from "node:fs";
import path from "node:path";
import { PHOTOS } from "../apexlang/_src/photos.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const FILES = path.join(ROOT, "apexlang/shared-components/static-files");
const BUDGET = 6 * 1024 * 1024;                     // all photos together
const MAX = w => (w >= 1400 ? 240 : 90) * 1024;      // one photo: heroes 240 KB, the rest 90 KB
const force = process.argv.includes("--force");

// crop=faces,entropy keeps faces in portraits; without a face it falls back to the busiest part of the photo
const url = (id, p, q) => `https://images.unsplash.com/${id}?w=${p.w}&h=${p.h}&fit=crop&crop=faces,entropy&q=${q}&fm=jpg&auto=format`;
async function get(u) {
    const r = await fetch(u, { headers: { "User-Agent": "website-studio-fetch-photos" } });
    if (!r.ok) { throw new Error(r.status + " " + r.statusText); }
    return Buffer.from(await r.arrayBuffer());
}
const rows = [];
let total = 0, failed = 0;
for (const p of PHOTOS) {
    const out = path.join(FILES, p.file);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    let done = null;
    if (!force && fs.existsSync(out)) {
        done = { id: p.ids[0], size: fs.statSync(out).size };   // already there (run with --force to download again)
    }
    for (const id of done ? [] : p.ids) {
        try {
            // lower the quality until the photo fits its size limit
            for (const q of [64, 56, 48, 40]) {
                const buf = await get(url(id, p, q));
                if (buf[0] !== 0xff || buf[1] !== 0xd8) { throw new Error("not a JPEG"); }
                if (buf.length <= MAX(p.w) || q === 40) { fs.writeFileSync(out, buf); done = { id, size: buf.length, q }; break; }
            }
            break;
        } catch (e) { console.warn(`  ${p.file}: ${id} failed (${e.message}), trying the next one`); }
    }
    if (!done) { failed++; console.error(`x ${p.file}: no photo could be downloaded`); continue; }
    total += done.size;
    console.log(`ok ${p.file} ${Math.round(done.size / 1024)} KB (${done.id})`);
    rows.push(`| \`${p.file}\` | ${p.alt} | [${done.id}](https://images.unsplash.com/${done.id}) | Unsplash License |`);
}
fs.writeFileSync(path.join(ROOT, "docs/CREDITS.md"), `# Photo credits

The photos of the starter websites are Static Application Files in \`apexlang/shared-components/static-files/website-studio/img\`.
They come from [Unsplash](https://unsplash.com) and are used under the [Unsplash License](https://unsplash.com/license):
free to use, copy, modify and redistribute, also for commercial purposes, without asking permission or giving credit.
They may not be sold without significant modification, or compiled to build a similar or competing service.

They were downloaded, cropped and compressed by \`tools/fetch-photos.mjs\` (the Unsplash CDN does the cropping).
Each source link opens the original photo.

Total size: ${(total / 1024 / 1024).toFixed(2)} MB for ${rows.length} photos (budget 6 MB).

| File | What it shows | Source | Licence |
|---|---|---|---|
${rows.join("\n")}
`);
console.log(`\n${rows.length} photos, ${(total / 1024 / 1024).toFixed(2)} MB${failed ? `, ${failed} missing` : ""}. docs/CREDITS.md written.`);
if (total > BUDGET) { console.warn("Over the 6 MB budget: lower the w/h values in apexlang/_src/photos.mjs and run again with --force."); }
console.log("Next: cd apexlang && node _src/build.mjs   (adds the photos to static-files.apx)");
