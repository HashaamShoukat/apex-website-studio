# QA harness

Renders the demo website (page 10) from the real `.apx` files - the Modern One Page page template, the Modern Section region
template, Universal Theme's Blank with Attributes and the Website report templates - with the real Universal Theme 26.1 CSS and
JavaScript, so the designs can be checked without an APEX instance. Report rows come from `apexlang/_src/demo.mjs`, the same rows
the page's SQL queries return. Used for every screenshot, thumbnail and check.

## Setup (once)

1. **APEX 26.1 static files** - download `apex_26.1_en.zip` from Oracle, unzip `apex/images`, and link it as `qa/www/i`:
   `ln -s /path/to/apex/images qa/www/i`
2. **Universal Theme in APEXlang** - from SQLcl 26.x: unzip `mmd/26.1.0+3102/apexlang.zip` from `sqlcl/lib/ext/apexlang-compiler.jar`, unzip it,
   and set `UT_APEXLANG` to its `apexlangmeta/central-themes/8842.261/shared-components/themes/universal-theme` folder.
3. Playwright with Chromium (`npm i -g playwright`).

## Run

```bash
cd apexlang && node _src/build.mjs && node _src/pages.mjs && node _src/studio-pages.mjs && cd ..
node qa/render.mjs                # qa/www/site.html - the demo website
node qa/server.cjs 8652 &         # serves www/, /static (the app's static files), maps f?p=APP:PAGE:SESSION URLs to the harness pages
node qa/sweep.cjs                 # every Gallery look on desktop, tablet and phone: horizontal scroll, console errors, leftover #COLUMN#, menu
node qa/thumbs.cjs                # gallery/<id>.jpg (full-size shots shrunk in a canvas); run node _src/build.mjs again to list them
node qa/studio-mock.mjs && node qa/studio-test.cjs   # Gallery and Designer logic against the demo website
node qa/docs-images.cjs           # README images
node qa/shot.cjs site.html out.png 1440 900 full     # one screenshot
```

The look under test travels in the URL hash like in the Designer: `site.html#ws=<page options>&r=<static id>:<report or section options>,...`.
