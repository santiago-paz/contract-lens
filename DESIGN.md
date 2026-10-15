---
version: alpha
name: Contract Lens landing page
description: "The visual system of trycontractlens.com in English and German. It covers app/page.tsx, app/de/page.tsx, components/landing and the sign-in and sign-up pages in components/auth, not the dashboard."
colors:
  ink: "#16181d"
  navy: "#1a2742"
  beck: "#a3202f"
  beck-tint: "#fbeef0"
  paper: "#ffffff"
  ledger: "#f4f4f1"
  body: "#3f444c"
  muted: "#5f6670"
  rule: "#e1e2dd"
  rule-strong: "#8f949b"
  mist: "#e8edf3"
  navy-crest: "#1c2946"
  layer-lit: "#27365b"
  layer-floor: "#151f37"
  stage-lit: "#2d3f69"
  stage-floor: "#131c33"
  ledger-crest: "#f7f7f4"
  ledger-lit: "#fafaf8"
  ledger-floor: "#f0f0ec"
  ruler-tick: "#b9c8e6"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(3rem, 3.9vw, 3.75rem)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-0.02em"
  statement:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.875rem, 4.4vw, 3.25rem)"
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  title:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.005em"
  lead:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  row:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.45
  small:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  window-title:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
  window-value:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  label:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 400
    letterSpacing: "0.12em"
  button:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1
  button-small:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  bar: "2px"
  cell: "6px"
  tile: "8px"
  field: "10px"
  window: "14px"
  sheet: "16px"
  sheet-lg: "20px"
  well: "24px"
  stage: "28px"
  layer: "32px"
  pill: "9999px"
spacing:
  gutter: "24px"
  window-x: "20px"
  stack: "48px"
  stack-lg: "64px"
  section: "80px"
  section-lg: "112px"
  statement: "96px"
  statement-lg: "144px"
  layer-tuck: "32px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 24px"
  button-primary-hover:
    backgroundColor: "{colors.navy}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "15px 24px"
  button-secondary-hover:
    backgroundColor: "{colors.ledger}"
  button-small:
    typography: "{typography.button-small}"
    padding: "11px 18px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.field}"
    padding: "12px 16px"
  window-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  window-navy:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.window}"
  sample-strip:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.muted}"
    padding: "8px 20px"
  segmented-well:
    backgroundColor: "{colors.ledger}"
    rounded: "{rounded.well}"
    padding: "4px"
  segmented-thumb:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.row}"
    rounded: "{rounded.pill}"
    padding: "8px 16px"
  chip-week:
    backgroundColor: "{colors.beck}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  chip-month:
    backgroundColor: "transparent"
    textColor: "{colors.beck}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  chip-quarter:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "2px 10px"
  layer-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.layer}"
  stage-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
    rounded: "{rounded.stage}"
  flow-node:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.window}"
    padding: "1.1rem 1.25rem"
  band-ledger:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.ink}"
  nav-bar:
    backgroundColor: "rgba(255, 255, 255, 0.9)"
    textColor: "{colors.body}"
    height: "64px"
  brand-mark:
    backgroundColor: "{colors.beck}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "32px"
  control-round:
    backgroundColor: "rgba(19, 28, 51, 0.78)"
    textColor: "rgba(255, 255, 255, 0.82)"
    rounded: "{rounded.pill}"
    size: "36px"
---

# Design System: Contract Lens landing page

## Overview

**Creative North Star: "The Second Pair of Eyes"**

The name comes from the four-eyes principle (Vier-Augen-Prinzip). One person does the work, and a second person checks it. Contract Lens splits the work the same way. The software reads the contract, and the lawyer checks what it found. The page follows that split. Its pictures are the product's own screens, built in code with sample data: the analysis log, the filled-in record, the file preview, the list of expiring contracts, an alert and its history. A reader can check every claim on the page against what the app does.

The mood is sober, plain and exact. It is one light page with navy layers. The hero puts the product across the line between paper on the left and a floating navy stage on the right. The white sections that follow are flat paper, because that is where a visitor reads. Navy is for layers: the stage, the pinned tour, the data-flow diagram and the contact block. Each layer has a pool of light on one side and a ruler of fine ticks, the page's measure. One warm grey band holds the questions. A book serif sets the headlines, and a plain sans sets everything a visitor reads in detail or presses. Buttons and chips are pills. Windows have soft corners and a soft shadow. Boxes that hold text have hairlines and no shadow. Red is kept for the § mark and for signals. The page should look like the software a firm would use. It never imitates a physical object.

Motion follows the product's story. The hero's analysis runs once after load. The statement lights word by word as the visitor scrolls. The tour pins one stage and plays three scenes as the visitor scrolls. The lines in the data-flow diagram fill in the direction the data moves. The scroll stays the browser's own, and no smooth-scroll library takes over the wheel. A pause control stops the motion that runs on its own. The default markup is the finished state, so a visitor without script, or with reduced motion, sees the finished page.

This file covers the English page (`app/page.tsx`), the German page (`app/de/page.tsx`), `components/landing/`, the sign-in and sign-up pages in `components/auth/`, and the share card, which reuses the tokens. `.landing` in `app/globals.css` scopes the look, so it names a look and not a route: the auth pages wrap in it too. The dashboard under `app/(dashboard)/` has an older, separate look: Geist type, black borders, hard offset shadows and a neon green accent. Its utilities share `app/globals.css` with the landing tokens, so keep the two apart. The landing is light only and has no dark theme.

**Key Characteristics:**
- One light page: paper sections, three navy layers with 32px rounded tops, one floating navy stage in the hero, and one warm grey band.
- Source Serif 4 at weight 500 for the headlines and the statement, and IBM Plex Sans for everything else. No mono face.
- Product windows are the pictures: white sheets with soft shadows, sample data and a visible sample label.
- The ruler tick is the one motif at every scale: the WebGL field on the stage and in the contact block, the progress bars in the tour and the data-flow steps, and the faint hairlines on the warm band and the navy layers.
- Ink pill buttons that turn navy on hover.
- Red only on the mark and on signals: a close date, an open alert, a failure, an error.
- Motion tells the product's story, with the finished state as the default and a pause control.
- English at `/` and German at `/de`, with the same layout.

## Colors

The palette is white paper with cool text greys, one deep navy, one warm grey band and one red kept for signals. The text greys lean blue, toward the navy. The band and the hairlines lean slightly warm.

### Primary
- **Ink Black** (#16181d): Headlines, strong text, the primary button, the focus ring on light surfaces, the check discs in the windows and every selected state. It is a near-black with a slight blue cast, so it sits well beside the navy. On white it reaches 17.8:1.

### Secondary
- **Firm Navy** (#1a2742): Fills the navy layers (the pinned tour, the data-flow diagram, the contact block), the hero stage and the sign-in block. It is also the hover color of the primary button. Text on navy is white at set opacities: 75% for summaries and body text (9.0:1 on Firm Navy, 7.5:1 on the lit pool), 80% for diagram labels and 92% for chip text. Hairlines and tracks on navy are white at about 20%.

### Tertiary
- **Commentary Red** (#a3202f): Fills the § mark. It fills the chip for a contract that ends within a week and outlines the chip for one that ends within a month (at 60%). It marks the failure line in the checklist tabs, the open alert's status dot while the tour plays, and the form's error message (a border at 40% and the icon). On white it reaches 7.5:1, so it works for small text.
- **Red Wash** (#fbeef0): The fill of the error message.

### Neutral
- **White** (#ffffff): The page, every window and every sheet.
- **Warm Grey** (#f4f4f1): The questions band, the wells of the segmented controls, the sample strips at the foot of windows, the summary strip in the record, read-only fields and the hover fill of the secondary button.
- **Dark Slate** (#3f444c): Body text, section summaries, nav links and log lines. On white it reaches 9.8:1.
- **Muted Slate** (#5f6670): Labels, captions, footnotes, meta text, placeholders and the quiet chips. It reaches 5.8:1 on white, 5.3:1 on Warm Grey and 4.9:1 on Mist Blue.
- **Hairline Grey** (#e1e2dd): Every border and divider on light ground, and the track of the analysis progress bar.
- **Field Grey** (#8f949b): The edge of a form field, the underline of a text link and the dashed edge of an empty value. It reaches 3.05:1 on white, because the edge of a field is the control itself.
- **Mist Blue** (#e8edf3): The reader's highlight band in the tour, the well behind the file preview, the picked column of the permissions matrix, the file tile and text selection inside a window.

### Ground
The navy layers, the hero stage and the warm band are painted, not filled. Each ramp is narrow on purpose, so a layer reads as a lit surface and never as a gradient.

- **Navy layer** (the tour stage, the data flow, the contact block and the sign-in block): Navy Crest (#1c2946) at the top, Firm Navy at 42%, Layer Floor (#151f37) at the foot. A wide pool of Layer Lit (#27365b) sits behind the headline, centered at 18% across, or 82% in the contact block. A hairline of white at 10% catches the top edge. The pool is the lightest point on the layer, and white at 75% still reaches 7.5:1 on it.
- **Hero stage:** Its own recipe, a little brighter. Navy Crest at the top, Firm Navy at 46%, Stage Floor (#131c33) at the foot, a pool of Stage Lit (#2d3f69) at the upper right (82% across), a fainter pool at the lower left and the same white hairline on top.
- **Warm band** (the questions): Ledger Crest (#f7f7f4) at the top, Warm Grey at 44%, Ledger Floor (#f0f0ec) at the foot, with a lift of Ledger Lit (#fafaf8) at 12% across.
- **The measure:** Vertical ticks at the page's own 24px pitch, with a heavier mark every fifth (120px). On navy they are white at 7% and 13%. On the warm band they are Ink at 5% and 8.5%. The field starts in the corner opposite the light and fades out before it reaches the lit side. It is 48px wider than its layer on each side and drifts 20px either way while the layer crosses the viewport, on the CSS view timeline, so it needs no script. Where that timeline is unsupported it holds still, and reduced motion stops it. On the stage the CSS ticks rise from the bottom edge. On the stage and in the contact block a live WebGL field replaces or covers them (see Components: Ruler field and pause control).

### Selection
Selected text on navy and on the stage is a white veil at 28% under white text. Inside a white window it is Mist Blue under Ink.

### Named Rules
**The Red Means Soon Rule.** Commentary Red marks the brand and whatever needs attention: a contract that ends soon, an open alert, a failure, an error. Buttons, links, headlines and backgrounds are never red.

**The Layer Rule.** Firm Navy fills layers: a whole section, or the hero's stage panel. It is never a card, a chip, a button or a text color. The one exception is the primary button's hover.

**The Measure Sits In The Shade Rule.** The tick field starts in the corner opposite the light and fades out before it reaches the lit side. The lit side of a layer stays clean.

**The Paper Stays Paper Rule.** Light and the measure belong to the navy layers and the warm band. The white sections, the hero's paper side and the footer take neither, because they are what a visitor reads on.

## Typography

**Display Font:** Source Serif 4 (with Iowan Old Style, Palatino Linotype, Georgia, serif)

**Body Font:** IBM Plex Sans (with Helvetica Neue, Arial, system-ui, sans-serif)

**Character:** The serif at weight 500 gives each claim a calm, bookish voice. IBM Plex Sans is a plain working face for everything else: labels, lists, buttons and fields. There is no mono face.

Both fonts load through `next/font` (`components/landing/fonts.ts`) and reach the page as `--font-source-serif` and `--font-plex`. Source Serif 4 loads its optical size axis, and the landing sets `font-optical-sizing: auto`. IBM Plex Sans is a variable font, so text on navy can sit at weight 430. The dashboard keeps Geist.

### Hierarchy
- **Display** (500, clamp(3rem, 3.9vw, 3.75rem) from 1200px, line height 1.04, -0.02em): The hero headline only. It is 2.25rem to 2.625rem on phones (following 9.6vw) and 3.25rem from 640px. It is balanced and 11em wide at most.
- **Statement** (500, clamp(1.875rem, 4.4vw, 3.25rem), line height 1.14, -0.02em): The one paragraph set in the serif: the five questions and the answer. It is 58rem wide at most.
- **Headline** (500, 1.875rem, then 2.5rem from 640px and 2.75rem from 1024px, line height 1.1, -0.02em): Section titles (h2). The sign-in and sign-up h1 uses 2rem, 2.375rem from 640px and 2.625rem from 1024px.
- **Title** (Plex 600, 1.0625rem, line height 1.35, -0.005em): Titles of tour steps, data-flow steps and facts (h3), and the questions in the FAQ.
- **Lead** (400, 1.0625rem, then 1.125rem from 1024px, line height 1.6): The hero lead (27rem wide at most) and section summaries (36rem at most), in Dark Slate. On navy the summary is white at 75%.
- **Body** (400, 0.9375rem, line height 1.6): Step copy, FAQ answers and the footer tagline.
- **Row** (400, 0.875rem, line height 1.45): Nav links, the text link under the hero buttons (at weight 500), the labels of the segmented controls and the row labels of the matrix.
- **Small** (400, 0.8125rem, line height 1.5): Captions, footnotes, form labels (at weight 500) and the language toggle (at weight 500).
- **Label** (400, 0.6875rem, 0.12em, uppercase, Muted Slate): Field labels, column heads and section labels inside windows only.
- **Button** (500, 0.9375rem, line height 1): Every button. Small buttons drop to 0.875rem.

Inside windows the type runs small, the way a real app looks at reduced size: 10px in the file preview, 11px labels and notes, 12px meta text, 13px titles and rows (titles at weight 600), 14px values (at weight 500) and a 17px alert date. Dates, counts and step counters use tabular figures.

### Named Rules
**The Headline-Only Serif Rule.** The serif sets h1, h2, the statement, the numbers of the data-flow steps, the sent-note title and the links in the mobile menu, and nothing else. Anything a visitor reads in detail or presses is IBM Plex Sans. The § in the mark is not type at all: it is drawn.

**The Full Sentence Rule.** The h1 and every h2 are full sentences in sentence case, and they end with a period. Step titles, buttons and labels take no period. Only the 11px labels inside windows are uppercase.

**The Light On Navy Rule.** Body text on navy is Plex at weight 430, line height 1.65 and tracking 0.005em, in white at 75%. Light text on a dark ground reads thinner, so it gets a touch more weight, room and space.

## Layout

The page is one column of full-width sections. Each section centers its content in a 1200px container with 24px gutters. A standard section has 80px of padding above and below, and 112px from 1024px. The statement has 96px, and 144px from 1024px. The sections run in this order: hero (paper), statement (paper), pinned tour (navy layer), checklist tabs (paper), data flow (navy layer), permissions matrix (paper), questions (warm grey band), contact (navy layer) and the footer (paper).

A section header is the headline with a summary 20px below it. The questions band has no summary. The header is 40rem wide at most, or 36rem in the split layout. In the stack layout the content starts 48px under the header, or 64px from 1024px. From 1024px the split layout puts the header in 5 of 12 columns beside the content in 7, with 48px between them, and the header sticks 112px from the top while the content scrolls. The checklist tabs flip the split, so the content sits on the left. The questions band and the contact block use the split.

The hero is a two-column grid from 1200px: 5 parts of paper and 7 of stage. The text starts at the container's left edge, and the stage reaches 16px from the right edge and the bottom. The grid is as tall as the window, at least 760px, less the 88px above it and the 16px below it. The 88px clear the fixed nav bar. Under 1200px the stage drops below the text as a full-width panel. On a short window of 1200px or more, the figure shrinks to keep clear of the stage's caption: zoom 0.93 at 860px tall or less, 0.85 at 780px and 0.76 at 700px.

Navy layers sit over each other. The tour, the data flow and the contact block each pull up 32px over the section above and take a 32px rounded top, so the corners of the section above show behind them. Layers have no divider lines.

The live tour is a runway 360vh tall with one sticky stage as tall as the window. The three steps run down the left in 5 parts, and the scenes take turns in the same cell on the right, in 7 parts, with 56px between the columns. The light and the measure ride on the stage, so they stay put while the scenes play. On short windows the stage tightens: from 800px tall its padding and copy shrink. At 760px or less the summary goes and the headline drops to 2rem. At 700px or less the stage starts at the top and the file preview gives up padding. The stacked tour is a header, then each step with its scene in its finished state, 56px apart.

On a phone everything stacks into one column. The matrix shows only the picked role's column below 768px.

### Breakpoints
- **480px:** The data-flow chips step up from 11px to 12px.
- **640px (`sm`):** Headlines step up. Form fields sit two across. The contact sheet takes 32px of padding.
- **700px to 1199px:** The hero's two sheets sit side by side in the full-width stage. Below 700px they stack.
- **768px (`md`):** The data-flow diagram runs across in five columns, and the facts sit two across. Below 768px the matrix shows one role.
- **1024px (`lg`):** The full nav bar, the split layouts, 112px section padding, the larger lead and four data-flow steps across.
- **1100px wide and 640px tall:** The tour goes live (a script media query, with motion allowed).
- **1200px:** The hero's two-column stage. The replay and pause controls move to the bottom right of the stage.
- **1200px to 1359px:** The stage caption narrows to 13.5rem at 12px.
- **1280px (`xl`):** The nav gaps widen.

### Language
Every string exists in English and German, and the German runs longer. No layout may depend on the length of the English copy, and button labels never wrap. English lives at `/` and German at `/de`. `proxy.ts` rewrites `/` to `/de` for a browser that prefers German, unless the `cl_lang` cookie says English. With no cookie, the first English or German tag in the browser's list decides, highest quality first. The EN / DE toggle is a plain link that writes `cl_lang` before it follows the link. Both pages carry hreflang tags, `app/sitemap.ts` lists both with their alternates, `app/robots.ts` blocks `/api/` and `/admin/`, and each language has its own share card.

German label columns are wider (`--record-label` 10.25rem against 8.5rem, `--tour-label` 9.5rem against 7rem). German paragraphs hyphenate (words of 10 characters or more, with 4 before and after the break), and every paragraph avoids a lone word on its last line. `translations/nbsp.ts` runs once over all copy except the page title and description. It keeps a number with its unit, an amount with its currency, a month with its year, a legal form with its name, an initial with its surname, § with its number, the brand name and "Ihr" with the word after it on one line.

## Elevation & Depth

Depth comes from three things: navy layers that tuck over the section above, the light on each ground, and product windows that float on soft shadows. Paper sections are flat. Boxes that hold text, such as the permissions matrix and the questions, have a hairline and no shadow. Every shadow falls below its object and is soft. None is hard, and none glows.

The only see-through surfaces are the nav bar (white at 90% with a 12px blur) and the two small controls on the stage (navy at 78% with a 6px blur). The controls need a backing because a tick passing behind a label would cut through it. Once the page scrolls 8px, a hairline and a short spill of shadow fade in under the nav bar over 300ms, so the page reads as passing beneath the bar.

### Shadow Vocabulary
- **Window on navy** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.06), 0 2px 5px rgba(8, 13, 28, 0.25), 0 26px 50px -14px rgba(6, 10, 24, 0.55), 0 70px 100px -40px rgba(6, 10, 24, 0.6)`): A white highlight on the top edge, a faint ring and three layers of shadow that fall below. The hero's two sheets and the three tour windows use it.
- **Flow node** (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 2px 5px rgba(8, 13, 28, 0.25), 0 22px 40px -16px rgba(6, 10, 24, 0.55)`): The same recipe, lighter, for the four nodes of the data-flow diagram.
- **Sheet on paper** (`box-shadow: 0 0 0 1px rgba(22, 24, 29, 0.05), 0 18px 40px -18px rgba(26, 39, 66, 0.28)`): The `shadow-sheet` utility. A faint ring and a navy-tinted shadow below. The checklist sheet, the contact form and the sign-in sheet use it.
- **Nav** (`box-shadow: 0 1px 2px -1px rgba(26, 39, 66, 0.05), 0 10px 24px -14px rgba(26, 39, 66, 0.24)`): The nav bar's spill. `shadow-nav-none` holds the same geometry at no alpha, so the bar fades the shadow in.
- **Thumb** (`box-shadow: 0 1px 2px rgba(22, 24, 29, 0.14), 0 4px 10px -4px rgba(26, 39, 66, 0.2)`): The sliding thumb of the checklist tabs. The picked role in the role picker takes only the first layer.
- **Waiting ring** (`box-shadow: 0 0 0 5px rgba(22, 24, 29, 0.14)`, pulsing to none): When the analysis is done, "Save record" pulses this ring every 2.6 seconds to show that it waits for a person. Pausing motion stops it.

### Named Rules
**The Windows Float Rule.** Product windows, the contact form sheet, the diagram's nodes and the nav bar get shadows. A box that holds text or a table never does.

## Shapes

Every corner that sits inside a section is rounded, and the radius grows with the size of the thing. Only full-width surfaces are square: the section bands, the nav bar and the mobile menu. Every button is a full pill (9999px), and so are chips, round controls and status dots. Text links are not pills. Bars, tracks and dashes take 2px. The empty-value cell takes 6px. The file tile and the reader's highlight band take 8px. Fields and the error message take 10px. Windows on navy and the diagram's nodes take 14px. Sheets on paper and the permissions matrix take 16px. The contact sheet takes 20px. The wells of the segmented controls take 24px. The hero stage takes 24px below 1200px and 28px from there. The navy layers take a 32px rounded top and a square foot.

Borders are 1px hairlines. The only dashed line marks an empty value ("Not specified"), in Field Grey. The ruler tick is the page's one recurring mark: a 1px vertical line.

Icons come from Lucide, at 10 to 20px, with strokes from 1.75 to 3: check, file, lock, pause, play, replay, menu, close, warning, eye and eye-off, and a spinner. They sit on their own, in a small disc (the checks in the analysis log) or in a 36px tile (the file).

### Named Rules
**The Pill Rule.** If it's a button, it's a pill, and chips are pills too. The wells that hold pills take 24px, and their options can wrap to a second row. Links stay plain text.

## Components

### Buttons
Soft and plain: a pill in one color that never moves.
- **Shape:** A full pill (9999px) with a 1px border in the fill color.
- **Primary:** Ink fill and white text, Plex 15px at weight 500, with 15px by 24px of padding (47px tall). It marks the main action: "Request a demo" in the nav bar (small), in the hero and in the mobile menu, and "Send message" in the form. On the sign-in pages it runs full width.
- **Hover / Focus:** Hover turns the fill Firm Navy over 150ms. Nothing moves or grows. Keyboard focus draws a 2px Ink outline 3px outside the pill. The outline is white on navy and on the stage, and Ink again inside a white sheet on navy.
- **Secondary:** A clear pill with a #cfd1cc border and Ink text. On hover it fills Warm Grey and the border turns Ink. It is used for "Sign in" in the mobile menu and for "Send another message".
- **Small:** 11px by 18px of padding and 14px text. The nav bar and the form's sent state use it.
- **Disabled:** 60% opacity and a not-allowed cursor. While the form sends, the submit button shows a spinner.
- **Text link:** The hero's "See how it works" is Plex 14px at weight 500 in Ink, with a 1px Field Grey underline 7px below the text. The underline turns Ink on hover.
- **Round controls:** The pause control (36px) and the replay pill sit on the stage. Both have a navy backing at 78%, a 6px blur, a hairline of white at 22% and white text at 82%. Hover lifts the backing and the hairline. The menu button below 1024px is a 40px round with a Hairline Grey border.

### Chips and pills
- **Urgency chips:** The end date of a contract, in a pill. Within a week the chip is Commentary Red with white text. Within a month it has red text and a red border at 60%. Beyond that it has Muted Slate text and a Hairline Grey border. The text is 12px at weight 500 with tabular figures. The map lives in `components/landing/chips.ts`.
- **Filter pills:** The four filters of the expiring list (Expired, This week, 30 days, 90 days) are text pills at 12px with a count. The picked one is Ink with white text, and the others are Muted Slate. They picture the app's controls and do nothing on the page.
- **Answer chips:** An alert's three answers are 13px pills with a Hairline Grey border. The chosen one is Ink with white text. They picture the app's controls too.
- **Flow chips:** Two pills hang off the line to the database. The locked one is solid white with Ink text, a lock icon and weight 500. The other is outlined in white at 45%. Their text is 11px, or 12px from 480px.

### Segmented controls
The checklist tabs and the role picker share one form. A Warm Grey well (24px radius, 4px of padding) holds pill options in Plex 14px at weight 500. The selected option is white with Ink text and a small shadow, and the others are Muted Slate and turn Ink on hover. In the tabs a white thumb slides between the options over 450ms. It is measured, so any label width fits. In the role picker the selected option takes the white fill itself. Both are real controls: arrow keys, Home and End move the tabs, and the picker uses `aria-pressed`.

### Product windows
The page's pictures are the product's own windows, built in code with sample data.
- **On navy:** White, 14px radius, the Window-on-navy shadow. The hero's two sheets and the three tour windows.
- **On paper:** White, 16px radius, the Sheet-on-paper shadow. The checklist sheet and the sign-in sheet.
- **Header row:** The title at 13px and weight 600 on the left, meta text at 12px in Muted Slate on the right, and a hairline below. Padding is 20px at the sides and 12px or 14px above and below.
- **Rows:** Split by hairlines, with 20px of padding at the sides. Field labels are 11px uppercase at 0.12em in Muted Slate. Values are 14px at weight 500 in Ink. The record rows put the label in a fixed column (8.5rem, or 10.25rem in German).
- **Strips:** The foot of a window can carry a Warm Grey strip with 11px Muted Slate text above a hairline. The hero record ends in its summary strip and the "Save record" pill, an Ink pill at 12px and weight 500.
- **Empty values:** A value the contract left empty shows "Not specified" in a 6px cell with a dashed Field Grey edge. In the tour the person types the value in.
- **Log lines:** An Ink disc (14px) with a white check marks a finished line. The running line has a Mist Blue disc with a pulsing Ink dot.
- **Samples:** Each window is `aria-hidden`, and its `figure` carries an aria-label that starts with "Sample:" ("Beispiel:"). The label is also visible, but its form differs. The three tour windows end in a "Sample data." strip ("Beispieldaten."). The checklist sheet carries the note in its header row. The hero carries a "Sample:" caption on the stage. The sign-in sheet carries a "Sample data." caption. The companies and people in the windows are invented.

### Navigation
- **Bar:** Fixed and 64px tall, white at 90% with a 12px blur. It sits flat at the top of the page. Once the page scrolls 8px, a hairline and the nav shadow fade in together over 300ms.
- **From 1024px:** Three columns. The brand sits left, the four section links sit in the exact center, and the right side holds the EN / DE toggle, "Sign in" and a small primary button. The links are Plex 14px at weight 500 in Dark Slate and turn Ink on hover. The link for the section under the middle of the window is Ink and carries a 2px Ink rule 6px below the label, which draws in over 350ms.
- **Below 1024px:** The brand, the language toggle and a 40px round menu button. The menu opens as a full-screen white sheet under the bar, with a 280ms fade. Its links are serif at 28px, split by hairlines, with full-width primary and secondary buttons below them. Escape closes it, and the page behind it stops scrolling.
- **Language toggle:** "EN / DE" at 13px and weight 500. The current language is Ink. The other is Muted Slate and links to the other page. The slash is Hairline Grey.
- **Behavior:** Section links scroll smoothly, or jump when the visitor prefers reduced motion, and they move focus into the section. A click with a modifier key keeps the browser's default. The skip link stays hidden until it gets focus, then shows as an Ink pill in the top left corner. A jump stops 64px short of the top, so the bar never covers the heading.
- **Footer:** White with a hairline on top. The brand and a 15px tagline in Muted Slate sit on the left. Two columns of 14px links in Dark Slate sit on the right, underlined on hover. A bottom row holds the copyright, a credit link and the language toggle at 13px.

### Hero stage
Paper on the left, and a floating navy panel on the right, with the product across the line between them.
- **Panel:** A navy panel with the stage ground (see Colors), a 28px radius from 1200px (24px below) and a 16px inset from the right edge and the bottom.
- **Sheets:** The analysis sheet and the record sheet float on the panel, flat and square to the screen. They do not tilt, and the pointer does not move them. From 1200px the analysis sheet crosses the panel's left edge by 48px, so the product sits across the line between paper and navy.
- **Caption:** A 13px caption in white at 72% names the figure as a sample. From 1200px it sits at the top left of the panel, clear of the sheets.
- **Controls:** The replay pill and the pause control sit together at the bottom right of the panel from 1200px, and at the top right below that. The replay pill stays hidden until a run has finished, and it is not drawn under reduced motion.
- **Entrance:** Plain CSS, so it never waits for script. Each sentence of the headline rises out of its own mask over 1s, 110ms apart. The lead and the buttons fade up over 0.9s, 120ms apart. The panel scales in over 1.1s, and the sheets rise over 1.1s at 0.35s and 0.5s.
- **Run:** One GSAP timeline starts 0.95s after load and plays once. The log lines land at 0.4, 0.9, 1.5, 2.0, 4.2 and 4.6 seconds, each typed in by a wipe. The record's fields fill in from 2.4s, 280ms apart, and grey placeholder bars hold their place until each value lands. The progress bar grows in two steps, and the step label counts them. The summary arrives at about 4.1s. "Save record" arrives at 4.7s and then pulses its ring. The replay pill returns at 5.6s. With reduced motion, the finished figure appears at once.

### Statement
The five questions every contract raises, and the one line that answers them, set large in the serif as one paragraph. As the visitor scrolls past, the words light up one after another: SplitText splits the paragraph into words, and the scroll scrubs their opacity from 0.48 to 1. Nothing moves from its place. The unlit words stay at 3:1 against the page. Without script, or with reduced motion, the whole statement is lit.

### Pinned tour
One window and three scenes: a person checks the record, watches the dates and decides on an alert. The scroll scrubs one GSAP timeline over the runway.
- **Left column:** Three steps, each under a 2px rail in white at 20% that fills in white while its scene plays. The step in progress is white, and the others sit at 72% opacity.
- **Check:** The file preview (German contract text on a white sheet inside a Mist Blue well) sits beside the record. A pale band moves down the rows. Then the empty Payment terms field fills in by typing, and the "Save record" pill presses and turns to "Saved".
- **Watch:** The expiring list. The filters pick in turn, and rows collapse and return (each row is 56px high), ending on the 90-day list.
- **Decide:** One alert. The first answer fills Ink, two more events join the history, the status turns from Open to Closed, and the status dot turns from red to Ink.
- **Stacked:** Under 1100px wide, under 640px tall, or with reduced motion, there is no runway. The steps stack, each with its scene in its finished state, and the rails are not drawn.

### Checklist tabs
A segmented control picks the kind of contract (NDA, Service agreement, Licence agreement) or Other contract. Under it, a sheet shows the sample checklist for that type. A field the contract leaves empty shows "Not specified". The fourth tab shows what happens to any other contract: the log stops with the product's own message in Commentary Red (a red X disc and the message), and a note on a Warm Grey strip says the record is filled in by hand. The first time the sheet is 35% in view it fills in field by field: rows rise 8px, 60ms apart, and values wipe in. A change of tab replays the fill.

### Data-flow diagram
A navy layer shows where a contract goes. Four white nodes (Your firm, Contract Lens, AI providers, Database) are joined by labelled lines. The database node says "United States" ("USA" in German).
- **Nodes:** White, 14px radius, the Flow-node shadow and a small lamp in the top right corner. The lamp is Ink once the data has reached the node, and an outlined ring before.
- **Lines:** 2px white tracks with an arrowhead and a label above or beside them. A line fills in the direction the data moves. The line from the providers back to Contract Lens points left.
- **Lock chip:** The line to the database carries two chips. The solid one, with a lock, is what is encrypted: the file, the summary and the conditions. The outlined one is the filled-in fields, which travel beside it, unlocked.
- **Steps:** Four steps sit under the diagram, four across from 1024px. Each has a 2px bar on top that fills as the diagram reaches it, a serif number, a title and a body. A hairline of white at 20% sits above two facts, Access and Deletion.
- **Motion:** The diagram plays once, when 40% of it is in view: the file line, then the text and fields lines, then the line to the database, in about 7 seconds. Without script, or with reduced motion, the finished diagram shows, every line full and every step lit.
- **Narrow:** On phones the firm, Contract Lens and the database stand in one column, the providers sit beside Contract Lens, and the lines run down. From 768px the firm, Contract Lens and the providers run across, and the database sits under Contract Lens.

### Permissions matrix
A white box with a hairline border and a 16px radius holds a table of seven abilities against five roles (Viewer, Member, Manager, Admin, Owner). A check says can, and a short dash (10px by 2px, in #80858c) says cannot. Each role can do what the roles before it can, so the checks form a staircase from the top left. Above the table, a segmented control picks a role, and that role's column takes Mist Blue. Manager is picked first. On phones only the picked role's column shows. The checks pop in column by column when the matrix is 40% in view, and a new pick pops in that column's checks.

### Questions
The questions sit on the warm grey band in the split layout: the headline on the left, six questions on the right. Each is a native details element, so it works without script, and only one stays open at a time. A plus mark of two 2px bars turns into a minus when the question opens, and it darkens on hover. The answer eases open over 0.4s where the browser supports it. The band carries the light and the faint ruler hairlines. The same text is in the page's FAQ structured data.

### Contact block
A navy layer in the split layout: the headline and the summary on the left, a white form sheet on the right, and a WebGL ruler field behind both.
- **Sheet:** White, 20px radius, the Sheet-on-paper shadow, 24px of padding (32px from 640px).
- **Fields:** White fill, a 1px Field Grey border, a 10px radius and 12px by 16px of padding. The text is Plex 15px in Ink, and placeholders are Muted Slate. Labels are Plex 13px at weight 500 in Ink, 6px above the field.
- **Focus:** The border turns Ink, and the 2px Ink ring appears 3px outside.
- **Error:** A box above the submit row with a Red Wash fill, a Commentary Red border at 40%, a red warning icon and 13px Ink text. It shares the field's 10px radius.
- **Success:** The form gives way to a note: an Ink disc with a white check, a 28px serif title, one line and a small secondary button. The swap eases in over 280ms.
- **Submit row:** A 13px note in Muted Slate and the primary button. On phones the button runs full width.

### Ruler field and pause control
The ruler tick is the one motif at every scale. On the hero stage and behind the contact block it is a live field: ticks at the 24px pitch with a heavier, taller mark every fifth, stood on a floor and seen at a shallow angle. It is decoration, not a chart. Twelve of its ticks are red. They are placed at random and carry no data, so they are not a precedent for red anywhere else.
- **Material:** One Three.js scene with one draw call. Every tick is an instance of one quad, kept the same thin width at every depth. Ticks are pale blue (see the ruler-tick color), and every fifth is white.
- **Behavior:** It sways slowly. On the hero stage the pointer is a lens that lifts the ticks under it. The hero's analysis drives it: a band sweeps across while the software reads, and a ring spreads when the reading is done. It tips back and fades as its block scrolls away. The contact block runs calmer.
- **Loading:** Three.js loads when the browser is idle and the field is within 160px of the viewport. The field draws only while it is on screen and the tab is visible. The CSS ticks of the block are the fallback. On the stage they fade out once the field runs, and they come back if it stops.
- **Governor:** After 60 frames, a median frame time over 42ms drops the pixel ratio to 1. After 120 frames, a median over 55ms in the second batch stops the field for good, and the CSS ticks stay. A lost WebGL context does the same. Under reduced motion the field does not start.
- **Pause control:** A 36px round button on the stage (top right below 1200px, bottom right from 1200px) and in the contact block (bottom left). It reads "Pause motion" or "Resume motion" and sets `data-motion-paused` on the `html` element. It freezes the sway, the idle drift of the lens and the pulse on "Save record". The lens still follows the pointer, because that motion is the visitor's own. It is not drawn when the visitor already asked for reduced motion.

### Brand mark
The § is drawn, not set in a typeface. It sits white on a 32px Commentary Red disc. The drawing lives in `lib/brand-mark.ts`, which `scripts/generate-icons.mjs` writes from `scripts/brand-mark.mjs`, and it is the only copy of the mark. The sign is 41 units tall in a 64 unit disc, and its stroke runs from 4.0 to 6.4 units. It is cut that way so it holds at 16px in a browser tab, where a typeset § fills in. The name "Contract Lens" follows in Plex 15px at weight 600 and -0.01em, marked `translate="no"`, 10px from the disc.

`components/landing/Logo.tsx` and the share card draw the path directly. The generator also writes `app/icon.svg`, `app/favicon.ico` (16, 32 and 48px) and `app/apple-icon.png` (180px). The iOS tile drops the disc for a full red square and grows the sign 6%.

### Sign-in and sign-up
`/login` and `/register` share one shell, `components/auth/AuthShell.tsx`. It is the share card's composition, made live: paper on the left and a navy block on the right, split 7 to 5 from 1024px.
- **Paper side:** The mark at the top, then the headline and the form in a 28rem column. The paper side takes neither light nor measure.
- **Navy block:** `tone-navy`, so it has the same light and measure as the page's navy layers. One product window floats on it, the list of expiring contracts, under a "Sample data." caption that says what the list shows. Its rows are the landing's own English sample rows, read from `components/landing/translations`, so the two pages cannot drift apart.
- **On a phone:** The paper side fills the first screen, and the navy block follows under it.
- **Headline:** Source Serif at 2rem, 2.375rem from 640px and 2.625rem from 1024px, one full sentence with a period. Sign-up adds a lead line.
- **Form:** The landing's field, error box and pill button, with the submit button at full width. A password field has a reveal button inside its right edge: an 18px eye on a 36px round target, Muted Slate, Ink on hover. A read-only field (the invited email) fills Warm Grey. Under the form, a hairline and a 13px note: on sign-in it says an account needs an invitation from the firm and links to the contact form, and on sign-up it links back to sign-in.
- **Access:** Sign-up is closed to the public. `/register` serves the form to a live invitation link and a 404 to everyone else, and the sign-in page links to no sign-up.
- **Language:** English only, like the rest of the app, so these pages carry no language toggle.

### Share card
`lib/share-card.tsx` draws the page in miniature at 1200 by 630, once for each language (`app/opengraph-image.tsx` and `app/de/opengraph-image.tsx`). Paper takes the left 680px and a navy block takes the right 520px. The paper side holds the mark, the hero's headline in Source Serif at 56px, the lead at 19px and the address at the foot. It carries no light and no measure. The navy block has the layer ground: the crest-to-floor grade, a pool of light at 18% across, the white hairline on the top edge and the measure, which fades in toward the right. A record sheet (424px wide, 14px radius) floats on it with a soft shadow (`0 26px 56px -22px rgba(9, 14, 26, 0.62)`).

### Motion and fallbacks
The default markup is the finished state. Motion only adds to it.
- `Bootstrap.tsx` runs one inline script before the page's markup. It adds the `js` class to the `html` element and, on the German page, sets the document language. If the page's own code has not signalled `__landingReady` after 4.5 seconds, the script removes `js` again.
- Under `.js` and until `data-run` is set, the CSS holds the hero's analysis at its starting state: log lines, values, summary and foot hidden, and the progress bar empty. `data-run` hands control to the timeline (`play`) or marks the finished figure (`done`, under reduced motion).
- `tour-live` is added to the tour only on screens at least 1100px wide and 640px tall that allow motion.
- `data-motion-paused` on the `html` element is the visitor's pause choice.
- Every scroll-driven effect is built inside a `prefers-reduced-motion: no-preference` media query, and the global reduced-motion rule collapses CSS animation and transitions to their end state.
- The tools are GSAP with ScrollTrigger and SplitText (through `@gsap/react`), and Three.js loaded on demand for the ruler field. There is no smooth-scroll library, and nothing takes over the wheel.

## Do's and Don'ts

### Do:
- **Do** set h1, h2 and the statement in Source Serif 4 at weight 500 with -0.02em tracking, and everything else in IBM Plex Sans.
- **Do** write the h1 and every h2 as a full sentence in sentence case, with a period at the end.
- **Do** make every button a pill: Ink fill, white text and Firm Navy on hover, with no movement.
- **Do** show the product through its own windows: white sheets with a soft shadow, sample data and a visible sample label ("Sample data." or "Beispieldaten.").
- **Do** keep Commentary Red for the mark and for signals: a filled chip within a week, an outlined chip within a month, a failure, an error.
- **Do** give each navy layer on the landing a 32px rounded top that pulls up 32px over the section above, with a pool of light and the measure.
- **Do** set body text on navy in Plex at weight 430 and white at 75%.
- **Do** use 2px bars for progress: white on navy, Ink on a Hairline Grey track.
- **Do** use tabular figures for dates, counts and step counters.
- **Do** check every layout in German as well, because German copy runs longer.
- **Do** start every effect from the finished state, keep the scroll the browser's own, and give anything that moves on its own a way to pause.
- **Do** keep text at WCAG AA or better, and keep large unlit text at 3:1 or better.

### Don't:
- **Don't** imitate a physical object: no ruled ledger sheets, typewriter type, stamps, binders, paper forms or hand-drawn marks. The landing should look like the app a firm would use.
- **Don't** bring the dashboard's look onto the landing: no neon green (#CCFF00), 2px black borders, hard offset shadows (`shadow-hard`), mono headings or the `press` movement.
- **Don't** draw a line, highlight or mark from a field to a passage in a contract, a timeline chart of contracts, a computed notice date, a reminder or a per-field confirm control, because the product has none of them.
- **Don't** show customers, logos, usage numbers, certifications or vendor and model names, and don't claim EU hosting. The data-flow diagram says the database is in the United States.
- **Don't** make a button, link, headline or background red.
- **Don't** put a shadow on a box that holds text or a table, and don't use a hard shadow.
- **Don't** add glow, blurred blobs or background shapes. The lit pool, the measure and the ruler field are the page's only atmosphere, and they stay low in contrast.
- **Don't** put light or the measure on a paper section, and don't turn the measure into a two-axis grid. It is a ruler, not graph paper.
- **Don't** set headings or buttons in Title Case or all caps. Don't put a small uppercase label above a section title. The 11px uppercase label belongs inside product windows, where the app uses it.
- **Don't** set a headline in the sans, or running text in the serif. The statement is the one paragraph in the serif, because it is set as a headline.
- **Don't** take over the scroll or add a smooth-scroll library.
