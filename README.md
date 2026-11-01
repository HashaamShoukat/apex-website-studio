# Website Studio for Oracle APEX

[![APEX 26.1+](https://img.shields.io/badge/Oracle%20APEX-26.1%2B-blue)](https://apex.oracle.com) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

One-page websites built in Oracle APEX - **a page template, a section template and 14 report templates** for the hero slider, services, numbers that count up, team, testimonials, clients, pricing, timeline, process, careers, FAQ, portfolio, contact details and social links. **Every list comes from a SQL query.** 7 designs, 10 accent colours, light and dark, 6 typefaces. Every look is a template option: nothing to code.

![Demo website](docs/images/website.png)

Website Studio is a small APEX application: a **Gallery** of ready-made looks, a **Designer** that previews every option live on phone, tablet and desktop and hands you the options as APEXlang, a **demo website** with every section, and the templates themselves, which you copy into your own application:

| Template | Type | What it is |
|---|---|---|
| **Modern One Page** | Page | The website: a header with a menu built from the sections, a hero, the sections, a footer |
| **Modern Section** | Region | One band of the page - the region title is the heading, the Static ID the menu anchor |
| **Website - Hero, Numbers, Services, Team, Testimonials, Logos, Pricing, Timeline, Process, FAQ, Careers, Portfolio, Links, Contact Details** | Classic Report | Each turns the rows of a SQL query into a section |

## Designs

| Design | Look |
|---|---|
| Clean | White pages, soft shadows and rounded cards |
| Editorial | Paper colours, serif headlines, fine rules and square corners |
| Bold | Neo-brutalist - ink outlines and hard offset shadows |
| Soft UI | Neumorphic - cards rise out of a soft grey page |
| Glass | Frosted cards over a colour wash in the accent colours |
| Midnight | Always dark, with glowing buttons |
| Minimal | No cards - hairlines, large type and white space |

Every design takes 10 **accent colours** (or your theme colour), **light / dark / follow the device**, and:

- **Typefaces** - System, Grotesk, Serif, Luxe, Tech, Poster, Friendly (all but System from Google Fonts);
- **Header** - classic, centred logo, a floating pill, or transparent over the hero; sticky; a scroll progress bar;
- **Sections** - background (page, soft, dark, accent, gradient), spacing, heading left / centred / split / hidden, width;
- **Report layouts** - hero as slider, split, centred or full bleed; services as cards, rows, bento or icons; testimonials as carousel, wall or spotlight; team as portraits, round photos or a list; portfolio as grid, editorial or large; logos as a scrolling marquee, grid or row; filter buttons for the portfolio and careers;
- **Behaviour** - reveal on scroll, count-up numbers, auto-playing slides with swipe and keyboard, back-to-top button, corners and section spacing.

Images are optional: without an `IMAGE_URL` the templates draw artwork in the accent colours, or a person's initials, so a website looks finished before the photos arrive.

![Looks](docs/images/looks.png)

<details><summary>On a phone</summary>

![Phones](docs/images/phones.png)
</details>

## Install

Website Studio is an APEX 26.1 application in [APEXlang](apexlang/). There are no database objects.

1. Import it with SQLcl 26.1: `apex import -input apexlang` (in this repository's root), or
2. once a release export is published: download `website-studio.sql`, then **App Builder > Import** with any application ID.

Run it - every page is public.

The templates, option groups and pages are built from [`apexlang/_src`](apexlang/_src): `cd apexlang && node _src/build.mjs` (templates and static files), `node _src/pages.mjs` (the demo website) and `node _src/studio-pages.mjs` (Gallery, Designer, How to Use). Checks and screenshots: [`qa/`](qa/README.md).

## Use it in your application

1. **Copy the templates.** In *your* application: **Shared Components > Templates > Create > As a Copy of an Existing Template**, copy from **Website Studio**: the page template **Modern One Page**, the region template **Modern Section** and the **Website - ...** report templates you need. Tick *Subscribe* for later updates.
2. **Upload the static files.** The templates load `website-studio/website.css` and `website-studio/website.js` from **Shared Components > Static Application Files** (the copy does not bring them along). Upload them from [`apexlang/shared-components/static-files/website-studio`](apexlang/shared-components/static-files/website-studio) into a directory named `website-studio`.
3. **Build the page.** A blank page with **Page Template = Modern One Page** (public, if visitors should not sign in), and the **Template Options** from the Designer:

```
appearance {
    pageTemplate: @modern-one-page
    templateOptions: [
        #DEFAULT#
        ws-Design--editorial
        ws-Accent--wine
        ws-Font--serif
    ]
}
```

4. **Add sections.** Regions with the **Modern Section** template in the *Body* slot - each with a Static ID (its menu anchor) and *Show in Menu* on. For a list of things, make the region a **Classic Report**, return the template's columns and pick the report template:

```sql
select name, role, photo_url as image_url, linkedin_url as link
  from team_members
 order by display_order
```

```
componentAppearance {
    templateType: theme
    template: @ws-team
    templateOptions: [
        #DEFAULT#
        ws-Team--round
    ]
}
```

| Report template | Columns (all optional) |
|---|---|
| Website - Hero | `TITLE` `SUBTITLE` `TEXT` `IMAGE_URL` `BUTTON_LABEL` `BUTTON_LINK` `BUTTON2_LABEL` `BUTTON2_LINK` - one row per slide |
| Website - Numbers | `VALUE` `PREFIX` `SUFFIX` `LABEL` `TEXT` |
| Website - Services | `ICON` `TITLE` `TEXT` `LINK` `LINK_LABEL` |
| Website - Team | `NAME` `ROLE` `IMAGE_URL` `BIO` `LINK` `LINK_ICON` |
| Website - Testimonials | `QUOTE` `NAME` `ROLE` `IMAGE_URL` `RATING` (0 - 5) |
| Website - Logos | `NAME` `IMAGE_URL` `LINK` |
| Website - Pricing | `NAME` `PRICE` `PERIOD` `DESCRIPTION` `FEATURES` (one per line, or `\|` separated) `BUTTON_LABEL` `BUTTON_LINK` `IS_FEATURED` (Y/N) `BADGE` |
| Website - Timeline | `YEAR` `TITLE` `TEXT` |
| Website - Process | `TITLE` `TEXT` `DURATION` |
| Website - FAQ | `QUESTION` `ANSWER` |
| Website - Careers | `TITLE` `TEAM` `LOCATION` `TYPE` `DESCRIPTION` `APPLY_LINK` `APPLY_LABEL` |
| Website - Portfolio | `TITLE` `CATEGORY` `IMAGE_URL` `LINK` `META` |
| Website - Links | `LABEL` `LINK` `ICON` - social icons, footer link columns, link tiles |
| Website - Contact Details | `ICON` `LABEL` `VALUE` `LINK` |

5. **The rest.** The hero is a Classic Report in the *Hero* slot (Modern Section with Spacing *None*, Width *Full Width*, Heading *Hidden*). Free text uses Static Content with helper classes (`ws-Eyebrow`, `ws-Lead`, `ws-Split`, `ws-Btn`, `ws-Checks`, `ws-Statement` ...). The contact form is ordinary page items in a Modern Section with the CSS class `ws-Contact` - any process you like stores or emails the message. Footer columns go in the *Footer* slot, the copyright in *Footer Bottom*, a logo in *Logo* and a call-to-action button in *Header Buttons*.

The demo website (page `WEBSITE`) has every section; its queries are plain `select ... from dual` you can swap for your tables. `*word*` in a title highlights the word. Texts can be translated with the text messages `WEBSITE_STUDIO.MENU`, `.BACK_TO_TOP`, `.ALL`, `.PREVIOUS`, `.NEXT`, `.SLIDE` and `.APPLY`.

![Gallery](docs/images/gallery.png)

## Notes

- Font APEX has no brand icons, so Website Studio draws `fa-instagram`, `fa-linkedin`, `fa-x-twitter`, `fa-facebook`, `fa-youtube-play`, `fa-github`, `fa-tiktok`, `fa-dribbble`, `fa-behance`, `fa-pinterest`, `fa-whatsapp` and `fa-threads` itself.
- A column the query does not return is simply left out, so every column is optional.
- Visitors who prefer reduced motion get no animations; Windows high-contrast mode is respected; the menu, slider and accordions work with the keyboard.
- Transparent over Hero needs the Slider or Full Bleed hero; with any other first section it behaves like Classic.

## Support

Questions, bugs and ideas: [GitHub Issues](https://github.com/HashaamShoukat/apex-website-studio/issues).

[MIT](LICENSE) © 2026 Hashaam Shoukat
