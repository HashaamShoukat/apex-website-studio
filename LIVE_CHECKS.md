# Live checks for Website Studio v2

Website Studio v2 was built from the APEX 26.1 metamodel and checked in the QA harness, which renders the real `.apx` templates with Universal Theme 26.1 and Chromium. These are the points that needed a real APEX 26.1 instance. They were checked on 2 November 2026 by importing the app (as app 213) into APEX 26.1 and testing it in Chrome with Playwright.

## Result

Everything below works on APEX 26.1. The live run found five problems, and all five are fixed in the source:

1. **The app did not import.** The Designer's page JavaScript was 49.8 KB, but APEX allows at most 32,767 bytes per property. The look and the picture SQL of every starter website now live in a static file, `website-studio/designer-sites.js` (written by `_src/studio-pages.mjs`), which the Designer loads through its JavaScript File URLs.
2. **The phone drawer (page 13) was only 113 px tall.** The header's `backdrop-filter` made the header the containing box of the fixed drawer. The header now drops its blur while the overlay or drawer is open (`website.css`, "On Phones").
3. **APEX messages were hidden under the header.** The form's error list and the "Thank you" message appeared at the top of the page, behind a sticky or transparent header. They now show as a toast below the header. A click closes the toast, and a success message closes by itself after 6 seconds (`website.css` and `website.js` `extras`).
4. **A crowded centered header covered the logo.** On page 11 the menu ran under the logo. The menu column of the centered header is never narrower than the menu now, and `qa/sweep.cjs` checks for a logo under the menu.
5. **"5, then More" did not show More when one entry was left over.** The More drop-down now appears as soon as there are more entries than the option says. A "3, then More" option was added, and page 11 uses it, so its logo stays centered.

## 1. Import

- [x] `apex validate` and `apex import -input apexlang` run without errors.
- [x] **List region type**: `type: list` with `source { list: @... }` and `componentAppearance { listTemplate: @website-menu }` renders the Website - Menu list.
- [x] **List template**: `templateClass: pullDownMenu` and `#LINK_ATTR#` work.
- [x] **SQL list**: the restaurant's `connect by` list shows Starters, Mains and Desserts under Menu.
- [x] **User attribute 2 and link attributes**: "Journal" on page 10 has `target="_blank" rel="noopener"`. The SQL list (page 12, "Order online") has `target="_blank"` but no `rel`; browsers treat `_blank` as `noopener` anyway.
- [x] **Page HTML Header**: the title, description, Open Graph tags and the photo preload are written.
- [x] **Honeypot item**: invisible (clipped to nothing). A filled-in honeypot sends nothing and shows the same "Thank you" as a real message.

## 2. In the browser

- [x] **Substitutions in the HTML Header**: `#APP_FILES#` is substituted. The preload works. `og:image` is a relative URL (`r/masterdata/213/files/static/v.../...jpg`), but social sites need a full one. To fix this, put your site's full address in front of it in the page's HTML Header.
- [x] **IMAGE_FILE**: `data-ws-files` is substituted on `<body>`, and every photo loads on all eight websites.
- [x] **Menu slot**: the list moves into the header. Checked on every site: drop-downs (click, hover, Escape), the phone accordion, More on page 11, the overlay on page 14, the drawer on page 13 (after fix 2) and the centered menu on page 15.
- [x] **Current entry**: the studio's side navigation marks Gallery and How to Use. The website menus mark the section on screen.
- [x] **Arabic page**: page 13 has `dir="rtl"` and `lang="ar"` on `<html>` and `<body>`. The header, slider, drawer, WhatsApp button and back-to-top are mirrored, and the menu texts are in Arabic.
- [x] **WhatsApp button**: shows only on page 13. It links to `https://wa.me/966500000000`; replace the `WHATSAPP_NUMBER` substitution with the real number.
- [x] **Light/dark toggle** (pages 13 and 17): the choice survives a reload.
- [x] **Designer**: all eight websites load in the preview. Each one's SQL panel is filled (3 to 5 queries). Page and section options reach the preview. *Copy APEXlang* and *Copy SQL* work.
- [x] **Gallery**: the 8 site and 27 look thumbnails show; none are missing.
- [x] **Contact forms**: required fields show APEX's errors in the section, and the success message shows after sending (after fix 3).

The sweep ran on the live pages: every starter website in every look, on desktop and phone (448 runs), with the photos blocked except on the demo website. It checks horizontal scrolling, content wider than the screen, leftover `#COLUMN#` text, the menu and its drop-downs, the slider, unresolved pictures and console errors. It found no problems. The 24 own-look runs (8 websites on desktop, tablet and phone) also passed with photos.

### Multi-page websites (pages 20 to 53)

- [x] All 28 pages pass on desktop, tablet and phone. The live checks cover overflow, errors, leftover `#COLUMN#` or `&APP_ID.` text, photos, the menu, the logo over the menu, and the logo link to the home page.
- [x] The menu marks the entry of the open page.
- [x] **Menu entries to a section of the open page**, such as "Hours" on the clinic's booking page: APEX marks these current too. `website.js` (`sectionOf`) now treats them like `#section` links, so they light up only while their section is on screen.
- [x] `apex_page.get_url` links in reports (hero buttons, footer columns) carry the session. All 20 internal links on these pages open, and every `#section` they name exists.
- [x] Only the contact pages have the form.
- [x] APEX's friendly URLs set the page's base URI to `/ords/`, so a bare `#section` link resolves to `/ords/#section` in script. Clicking one still scrolls the page and stays on it.

## 3. Content you may want to change

- **Map embeds** (`openstreetmap.org/export/embed.html`) and the YouTube link on page 15 are examples.
- **`WHATSAPP_NUMBER`**, email addresses and phone numbers are placeholders (`example.com`, `+966 ... 0000`).

## 4. Photos

The 56 photos are in `apexlang/shared-components/static-files/website-studio/img` (5.3 MB). Their sources are in [docs/CREDITS.md](docs/CREDITS.md).

- Every photo was checked by eye. The captions and alt texts now describe what each photo shows. Where a photo did not match the content, the content was changed: three dishes on page 12 and one house on page 14.
- Portraits are cropped around the face (`crop=faces,entropy`).
- The two conference hero photos were swapped, so the speaker on stage comes first.
- The heroes are 1440 px wide. Hero photos stay under 240 KB each and the rest under 90 KB. The budget is now 6 MB, because 5 MB would have needed visibly lower quality.

## 5. Not covered

- `apex_mail` is only shown in a comment.
- The BLOB application process in *How to Use* (section 5c) was written from the APEX documentation and has not been run.
