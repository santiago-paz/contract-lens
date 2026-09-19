---
version: alpha
name: Contract Lens landing page
description: The visual system of trycontractlens.com. It covers app/page.tsx and components/landing only, not the dashboard.
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
  mist: "#e8edf3"
  sand: "#f1ebe0"
  sage: "#e6ece6"
typography:
  display:
    fontFamily: "Source Serif 4, Iowan Old Style, Palatino Linotype, Georgia, serif"
    fontSize: "4.25rem"
    fontWeight: 500
    lineHeight: 1.05
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
    lineHeight: 1.5
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
  small:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Arial, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.14em"
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
  icon: "8px"
  field: "10px"
  figure: "12px"
  sheet: "14px"
  card: "16px"
  panel: "20px"
  panel-lg: "28px"
  pill: "9999px"
spacing:
  gutter: "24px"
  grid: "20px"
  card: "24px"
  stack: "48px"
  stack-lg: "64px"
  section: "80px"
  section-lg: "112px"
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
    rounded: "{rounded.field}"
    padding: "12px 16px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "{spacing.card}"
  product-screen:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sheet}"
  hero-panel:
    backgroundColor: "{colors.mist}"
    rounded: "{rounded.panel-lg}"
    padding: "48px"
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
  band-ledger:
    backgroundColor: "{colors.ledger}"
    textColor: "{colors.ink}"
  band-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.paper}"
  nav-bar:
    backgroundColor: "rgba(255, 255, 255, 0.9)"
    textColor: "{colors.body}"
    height: "64px"
  brand-mark:
    backgroundColor: "{colors.beck}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    size: "32px"
  icon-disc:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "40px"
---

# Design System: Contract Lens landing page

## Overview

**Creative North Star: "The Second Pair of Eyes"**

The name comes from the four-eyes principle (Vier-Augen-Prinzip): one person does the work, and a second person checks it. Contract Lens splits the work the same way. The software reads the contract, and the lawyer checks what it found. The landing page follows that split. Its pictures are the product's own screens, built in code with sample data: the analysis log, the filled-in record, the list of expiring contracts and an open alert. A reader can check every claim on the page against what the app does.

The mood is sober, plain and exact. The page is white, with one warm grey band and two deep navy blocks. A book serif sets the headlines, and a plain sans sets everything a visitor reads in detail or presses. Buttons, cards and fields are soft and plain: round pills, 16px cards and hairline borders, with no movement on hover. The one red is kept for the § mark and for things that need attention soon. The page should look like the software a firm would use. It never imitates a physical object such as a ledger, a form, a stamp or a binder.

Motion stays quiet. The hero's analysis run is the only timed sequence. Everything else is a short rise: a section header fades in and moves up 12px over 450ms, once, when a quarter of it is in view. Buttons change color and never move. The page honors reduced motion everywhere.

This file covers the landing page only: `app/page.tsx` and `components/landing/`, plus the share card and the favicon, which reuse its tokens. The dashboard under `app/(dashboard)/` has an older, separate look: Geist type, black borders, hard offset shadows and a neon green accent. Its utilities share `app/globals.css` with the landing tokens, so keep the two apart. The landing is light only and has no dark theme.

**Key Characteristics:**
- A white page with one warm grey band and two full-bleed navy blocks.
- Source Serif 4 at weight 500 for h1 and h2, and IBM Plex Sans for everything else.
- Ink pill buttons that turn navy on hover.
- Flat text cards with hairline borders, and product screens that float on one soft shadow.
- Red only on the mark and on signals: a close date, an open alert, an error.
- Product screens with sample data, labeled as samples.
- One timed sequence: the hero's analysis run.

## Colors

The palette is a white page with cool text greys, warm surface greys, one deep navy and one red kept for signals. The text greys lean blue, toward the navy, while the band and the hairlines lean slightly warm.

### Primary
- **Ink Black** (#16181d): Headlines, strong text, the primary button and the focus ring on light surfaces. It's a near-black with a slight blue cast, so it sits well beside the navy. On white it reaches 17.8:1.

### Secondary
- **Firm Navy** (#1a2742): Fills the two full-bleed blocks, the firm section and the contact section. It's also the hover color of the primary button. Text on navy is white: 75% for summaries and body text (9.0:1), 68% for eyebrows (7.6:1) and 80% for icons. Divider lines on navy are white at 20%. From 1024px, a faint texture of white hairlines, 16px apart at 13%, fades out from the top right corner of each block.

### Tertiary
- **Commentary Red** (#a3202f): The code calls it the red of the commentaries. It fills the § mark and the chip for a contract that ends within a week. It outlines the chip for one that ends within a month. It also marks an open alert (the status dot and the deadline label), the recognized-type dot in the upload step, and the icon in the form's error message. On white it reaches 7.5:1, so it works for small text.
- **Red Wash** (#fbeef0): The fill of the form's error message, under a border of Commentary Red at 40%.

### Neutral
- **White** (#ffffff): The page, every card and every product screen.
- **Warm Grey** (#f4f4f1): The band behind "How it works" and "Deadlines", the summary strip at the foot of the record, and the hover fill of the secondary button.
- **Dark Slate** (#3f444c): Body text, section summaries and nav links. On white it reaches 9.8:1.
- **Muted Slate** (#5f6670): Eyebrows, field labels, captions, footnotes and the quiet chips. It reaches 5.8:1 on white, 5.3:1 on Warm Grey and at least 4.8:1 on the three tints. Placeholders use it at 70%, which drops to 3.1:1.
- **Hairline Grey** (#e1e2dd): Every border and divider on light ground: card outlines, table rows, the input border and the line under the nav bar.
- **Mist Blue** (#e8edf3): The hero panel behind the product screens, the icon discs, the well of the first step card and the text selection.
- **Sand** (#f1ebe0) and **Sage** (#e6ece6): The wells of the second and third step cards. They appear nowhere else.

`app/globals.css` also defines `navy-deep` (#121b30) and `beck-deep` (#85192a). Nothing on the landing uses them.

### Named Rules
**The Red Means Soon Rule.** Commentary Red marks the brand and whatever needs attention soon: a close date, an open alert, an error. Buttons, links, headlines and backgrounds are never red.

**The Block Rule.** Firm Navy fills whole sections from edge to edge. It's never a card, a chip or a text color. The one exception is the primary button's hover.

## Typography

**Display Font:** Source Serif 4 (with Iowan Old Style, Palatino Linotype, Georgia, serif)

**Body Font:** IBM Plex Sans (with Helvetica Neue, Arial, system-ui, sans-serif)

**Character:** The serif, at weight 500, gives each claim a calm, bookish voice. IBM Plex Sans is a plain working face for everything else: labels, lists, buttons and fields.

Both fonts load through `next/font` and reach the page as `--font-source-serif` and `--font-plex`. Source Serif 4 loads its optical size axis, and the landing sets `font-optical-sizing: auto`. Plex loads weights 400, 500 and 600.

### Hierarchy
- **Display** (500, 2.625rem, then 3.5rem from 640px and 4.25rem from 1024px, line height 1.05, -0.02em): The hero headline only. It's centered and balanced, and 56rem wide at most.
- **Headline** (500, 2rem, then 2.5rem from 640px and 2.75rem from 1024px, line height 1.1, -0.02em): Section titles (h2).
- **Title** (Plex 600, 1.0625rem, line height 1.5, -0.005em): Titles of cards and steps (h3).
- **Lead** (400, 1.0625rem, then 1.125rem from 1024px, line height 1.6): The hero lead and section summaries, in Dark Slate, 40 to 42rem wide at most. Paragraphs that run outside a card use 1.0625rem at the same line height.
- **Body** (400, 0.9375rem, line height 1.6): Text inside cards.
- **Small** (400, 0.8125rem, line height 1.5): Captions under figures, footnotes, form labels (at weight 500) and the note beside the submit button.
- **Label** (500, 0.6875rem, 0.14em, uppercase): Eyebrows above section titles and the header labels of product screens. It's Muted Slate on light ground and white at 68% on navy. Field labels inside product screens use the same size at 0.12em.
- **Button** (500, 0.9375rem, line height 1): Every button. Small buttons drop to 0.875rem.

Inside product screens the type runs smaller, the way a real app looks at reduced size: 11px labels, 12 to 13.5px text and 14px field values. Dates, counts and the step counter use tabular figures, so the digits line up.

### Named Rules
**The Headline-Only Serif Rule.** The serif sets h1, h2, the § in the mark, the step numbers and the links in the mobile menu, and nothing else. Anything a visitor reads in detail or presses is IBM Plex Sans.

**The Full Sentence Rule.** The h1 and every h2 are full sentences in sentence case, and they end with a period. Card titles, buttons and labels take no period. Only the 11px labels are uppercase.

## Layout

The page is one column of full-width sections. Each section centers its content in a 1200px container with 24px gutters at every width. Sections have 80px of padding above and below, and 112px from 1024px. The layout needs only three breakpoints (640px, 768px and 1024px), because nothing grows past 1200px.

A section opens with a header: the eyebrow, the headline 16px below it, and the summary 20px below that. The header is 40rem wide at most, or 36rem in the split layout. The content starts 48px under the header, or 64px from 1024px. The `Section` component offers three layouts. Stack puts the content under a left-aligned header, and it's the default. Split puts the header in 5 of 12 columns beside the content from 1024px, and the header sticks 112px from the top while the content scrolls. The contact section uses it. Center centers the header, but no section uses it today.

The hero is centered. Its text block is 56rem wide at most, with 128px of space above it (160px from 1024px) to clear the fixed nav bar. The figure sits 56px lower (80px from 1024px) on a Mist Blue panel.

The sections run in this order: hero (white), how it works (warm grey), what it reads (white), deadlines (warm grey), the firm (navy), confidentiality (white), contact (navy) and the footer (white).

Card grids use a 20px gap. The step cards sit three across from 768px. The contract type cards go two across at 768px and three at 1024px. The confidentiality cards go two across at 640px and four at 1024px. The firm's three points sit three across from 768px, with 40px between columns. From 1024px, the expiring list and the alert sit side by side at 1.6 to 1, and the hero's two screens at 1 to 1.25.

On a phone everything stacks into one column. Tables drop columns before they shrink: the partner column hides below 768px and moves under the contract title, and the notice column hides below 640px. A jump to a section stops 64px short of the top, so the fixed bar never covers the heading.

Every string exists in English and German, and the German runs longer. No layout may depend on the length of the English copy, and button labels never wrap.

### Named Rules
**The Alternating Ground Rule.** Neighboring sections never share a background. White, warm grey and navy take turns, so the page needs no divider lines between sections.

## Elevation & Depth

The page is flat, with one exception. Text cards lie flat on the page with a hairline border and no shadow. Product screens float: they're white sheets on one soft, low shadow, so they read as the app itself, set on the page. The contact form floats too, because it's a working screen. Tinted ground does the rest. The Mist Blue hero panel and the tinted wells of the step cards set screens apart without more shadows.

The nav bar is the only see-through surface: white at 90% with a 12px backdrop blur. A hairline appears under it once the page scrolls 8px.

### Shadow Vocabulary
- **Sheet** (`box-shadow: 0 0 0 1px rgba(22, 24, 29, 0.05), 0 18px 40px -18px rgba(26, 39, 66, 0.28)`): A faint 1px ring plus a navy-tinted shadow that falls below the sheet. It's the `shadow-sheet` utility. The hero's two screens, the three small screens in the step cards, the expiring list, the open alert and the contact form use it.

### Named Rules
**The Screens Float Rule.** Only product screens and the contact form get the sheet shadow. A card that holds text never has one, and nothing else on the page casts a shadow.

## Shapes

Every corner that sits inside a section is rounded, and the radius grows with the size of the thing. Only full-width surfaces are square: the section bands, the nav bar and the mobile menu. Every button is a full pill (9999px), and so is every chip, icon disc and status dot. Text links aren't pills. Icon tiles take 8px, fields 10px, the small screens in the step cards 12px and the hero's screens 14px. Cards, the expiring list and the alert take 16px. The contact sheet takes 20px. The hero panel takes 20px below 1024px and 28px from there. It wraps its 14px screens in 48px of padding, so the outer curve stays larger than the inner one.

Borders are 1px hairlines everywhere. The only dashed line is the drop zone in the upload step, in Ink at 25%.

Icons come from Lucide, at 16 to 20px, mostly at stroke 1.75. They sit on their own or inside a 40px Mist Blue disc.

### Named Rules
**The Pill Rule.** If it's a button, it's a pill, and chips are pills too. Links stay plain text.

## Components

### Buttons
Soft and plain: a pill in one color that never moves.
- **Shape:** A full pill (9999px) with a 1px border in the fill color.
- **Primary:** Ink Black fill and white text, Plex 15px at weight 500, with 15px by 24px of padding (47px tall). It marks the main action in three places: "Request a demo" in the nav bar and in the hero, and the form's submit button.
- **Hover / Focus:** Hover turns the fill Firm Navy. Colors change over 150ms, and nothing moves or grows. Keyboard focus draws a 2px Ink outline 3px outside the pill, white on navy.
- **Secondary:** A clear pill with a #cfd1cc border and Ink text. On hover it fills Warm Grey, and the border turns Ink. It's used for "Sign in" in the mobile menu and for "Send another message".
- **Small:** 11px by 18px of padding and 14px text, for the nav and the form's success state.
- **Disabled:** 60% opacity and a not-allowed cursor. While the form sends, the submit button shows a spinner.

`app/globals.css` also defines a white `btn-light` for navy blocks. Nothing uses it today.

### Chips
- **Urgency chips:** The end date of a contract, in a pill. Within a week the chip is Commentary Red with white text. Within a month it has red text and a red border at 60%. Beyond that it has Muted Slate text and a Hairline Grey border. The text is 12px at weight 500 with tabular figures, or 11px inside small screens. The map lives in `components/landing/chips.ts`.
- **Neutral chips:** The alert's type and the manager's three answers are Hairline Grey outlines with Ink or Muted Slate text. They picture the app's controls, but they don't do anything on the landing.

### Cards / Containers
- **Corner Style:** 16px.
- **Background:** White.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px Hairline Grey.
- **Internal Padding:** 24px, and 28px from 640px on the contract type cards.

Step cards open with a 224px well in Mist Blue, Sand or Sage that holds a small product screen. A serif step number in Muted Slate, the title and the body follow. Contract type cards list their fields under the title, split by hairlines. Confidentiality cards start with a 40px Mist Blue icon disc. The firm's points on navy aren't cards: each one has a white hairline at 20% on top, an icon in white at 80%, a title and body text. The hero panel is Mist Blue with a 20px radius and 16px of padding on a phone, 32px of padding from 640px, and a 28px radius with 48px of padding from 1024px.

### Inputs / Fields
- **Style:** White fill, a 1px Hairline Grey border, a 10px radius and 12px by 16px of padding. The text is Plex 15px in Ink. Placeholders are Muted Slate at 70%.
- **Labels:** Plex 13px at weight 500 in Ink, 6px above the field.
- **Focus:** The border turns Ink, and the 2px Ink focus ring appears 3px outside.
- **Error:** A box above the submit row with a Red Wash fill, a Commentary Red border at 40%, a red warning icon and 13px Ink text. It shares the field's 10px radius.
- **Success:** The form gives way to a short note that the message went out: an Ink disc with a white check, a 24px title, one line of text and a small secondary button.

The form keeps the light palette and the dark focus ring, because it sits on a white sheet inside the navy block. The sheet has a 20px radius, the sheet shadow and 24px of padding (32px from 640px).

### Navigation
- **Bar:** Fixed and 64px tall, white at 90% with a backdrop blur. The hairline under it fades in over 300ms once the page scrolls 8px.
- **From 1024px:** Three columns. The brand sits left, the four section links sit in the exact center, and the right side holds the EN / DE toggle, "Sign in" and a small primary button. The links are Plex 14px at weight 500 in Dark Slate, and they turn Ink on hover.
- **Below 1024px:** The brand, the language toggle and a 40px round menu button with a hairline border. The menu opens as a full-screen white sheet under the bar. Its section links are serif at 28px, split by hairlines, with full-width primary and secondary buttons below them. Escape closes it, and the page behind it stops scrolling.
- **Language toggle:** "EN / DE" at 13px and weight 500. The active language is Ink, the other is Muted Slate, and the slash is Hairline Grey.
- **Behavior:** Section links scroll smoothly, and they jump when the visitor prefers reduced motion. A click with a modifier key keeps the browser's default. The skip link stays hidden until it gets focus, then shows as a dark pill in the top left corner.
- **Footer:** White with a hairline on top. The brand and a 15px tagline in Muted Slate sit on the left. Two columns of 14px links in Dark Slate sit on the right, underlined on hover. A bottom row holds the copyright and the language toggle at 12px.

### Section Header
Every section opens with the eyebrow, the serif headline and the summary. On navy the headline turns white and the summary turns white at 75%. The three lines rise in 80ms apart.

### Brand Mark
The § sits in Source Serif 4 at weight 600 and 19px, white on a 32px Commentary Red disc. The name "Contract Lens" follows in Plex 15px at weight 600 and -0.01em, marked `translate="no"`. The favicon (`app/icon.svg`) and the share card (`app/opengraph-image.tsx`) use the same mark.

### Product Screens
The page's pictures are the app's own screens, built in code with sample data.
- **Sheet:** White with the sheet shadow, and a 14px radius in the hero or 16px elsewhere.
- **Header row:** An uppercase label (11px, 0.14em, Muted Slate) or a 13px semibold title on the left, meta text at 12px on the right, and a hairline below.
- **Rows:** Split by hairlines, with 20px of padding at the sides and 12px above and below. Field labels are 11px uppercase at 0.12em in Muted Slate. Values are 14px at weight 500 in Ink.
- **Ground:** Each screen sits on a tint: the Mist Blue panel in the hero, a well in a step card, or the Warm Grey band.
- **Samples:** Each screen is `aria-hidden`, and its `figure` carries an aria-label that starts with "Sample:". The companies and people in them are invented, and the aria-labels mark them as samples.

### Analysis Run
The hero's analysis plays once, when the figure is 35% in view, and takes about 4.6 seconds. The log lines land at 0.4, 0.9, 1.5, 2.0, 4.2 and 4.6 seconds. The running line shows a pulsing dot, and each finished line gets an Ink disc with a white check. From 2.4 seconds the record's fields fill in one by one, 280ms apart, and grey bars hold their place until each value lands. A 2px progress bar grows in two steps, and the summary strip fades in last. With reduced motion, the finished figure appears at once.

## Do's and Don'ts

### Do:
- **Do** set h1 and h2 in Source Serif 4 at weight 500 with -0.02em tracking, and everything else in IBM Plex Sans.
- **Do** write the h1 and every h2 as a full sentence in sentence case, with a period at the end.
- **Do** make every button a pill. Use one Ink primary button per section, plus the one in the nav bar, with Firm Navy on hover.
- **Do** show the product through its own screens: white sheets with the sheet shadow on a tinted ground, sample data, and an aria-label that starts with "Sample:".
- **Do** keep Commentary Red for the mark and for signals: a filled chip within a week, an outlined chip within a month, grey beyond that.
- **Do** alternate white, Warm Grey and Firm Navy, so no two neighboring sections share a background.
- **Do** keep text at WCAG AA or better: Ink, Dark Slate or Muted Slate on white and Warm Grey, and white at 68% or more on navy.
- **Do** use tabular figures for dates, counts and the step counter.
- **Do** check every layout in German as well, because German copy runs longer.
- **Do** show the finished state when the visitor prefers reduced motion.

### Don't:
- **Don't** imitate a physical object: no ruled ledger sheets, typewriter type, stamps, binders, paper forms or hand-drawn marks. The landing should look like the app a firm would use.
- **Don't** bring the dashboard's look onto the landing: no neon green (#CCFF00), 2px black borders, hard offset shadows (`shadow-hard`), uppercase Geist Mono headings or the `press` movement.
- **Don't** draw lines, highlights or marks from a field to a passage in a contract, because the product doesn't link fields to passages.
- **Don't** make a button, link, headline or background red.
- **Don't** put a shadow on a text card, or use any shadow other than the sheet shadow.
- **Don't** add decoration the page doesn't have, such as gradients, glows or background shapes.
- **Don't** set headings or buttons in Title Case or all caps. Only the 11px labels are uppercase.
- **Don't** set a headline in the sans or a paragraph in the serif.
