---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["components/landing"]
---

# Surface brief: the landing page

Scope: app/page.tsx, app/de/page.tsx and components/landing, in English and German. Visitor mode: Persuade. The dashboard is out of scope.

Audience and job: lawyers and office staff at small German law firms must see within seconds that this reads contracts and tracks dates with a person in charge, believe it because every picture is a real screen and the data flow is stated plainly, and ask for a demo. Reviewers (product and design teams, freelance clients) judge craft, flows and writing.

Decisions confirmed by Santiago on 2026-10-12:
- The identity stays (navy, ink, white, Source Serif 4 and IBM Plex Sans, the section-sign mark, product screens as pictures) and gets pushed hard.
- The data-flow section says plainly that the database is in the United States.
- Browsers that prefer German land on a real /de page. English stays the default for everyone else.

Tools: GSAP with ScrollTrigger and SplitText (through @gsap/react); Three.js, vanilla and lazy-loaded, for one ruler field. Dropped on purpose: Lenis (it hijacks the scroll and none of the benchmark sites ship it), Lottie (there are no authored animation files, and GSAP draws the same motion with less weight), Flip and DrawSVG (not needed), framer-motion on the landing (CSS covers the menu fade and the form swap).

Never shown: field-to-passage links, a timeline chart of contracts, computed notice dates, reminders, per-field confirm controls, customers, logos, numbers, certifications, EU hosting, vendor or model names.

Unresolved: Impressum and privacy pages need Santiago's details. Whether the product reads German contracts well is unverified, so no copy claims it. German copy has had no review by a German lawyer. The /de server HTML says lang="en" until the bootstrap script sets it, because the root layout is shared with the dashboard.

## Direction contract

THESIS: The page behaves like the product. It reads fast, waits for a person to check, and keeps a ruler of dates. It refuses the legal-AI default (dark, glowing, a chat box), its opposite (a grey brochure with gavels), and the repeated headline over a grid of cards.

OWN-WORLD: Ink #16181d, Firm Navy #1a2742 with a lit pool, paper white, warm grey, Mist, and Commentary Red for signals only. Source Serif 4 at 500 for headlines, IBM Plex Sans for everything else, no mono. Product windows are white sheets with a hairline highlight and offset shadows. The ruler tick is the one motif at every scale: the WebGL field in the hero and the contact block, the progress bars of the tour, the faint hairlines on the FAQ band. Navy layers take rounded tops (2rem), and Your data is the second navy layer after the tour.

STORY: A lawyer watches a file go in and a record come out, sees a person correct and save it, sees the dates and the recorded decision, reads plainly where the text goes, and asks for a demo.

FIRST VIEWPORT: At 1440 by 900, the left five columns sit on paper: a serif headline at 3.5rem in three lines, the lead, an ink pill "Request a demo" and a text link. On the right a navy panel (28px radius, 16px inset) holds a WebGL ruler field and two product sheets in slight perspective. The Analysis sheet crosses the panel's left edge, so the product sits across the line between paper and navy. On load the analysis runs, the ticks sweep, the fields fill, a pulse closes it, and "Save record" waits. Replay and pause sit together at the bottom right of the panel.

FORM: Extension of the established world. No concept roll, because Santiago pinned the identity and rejected rolls on 2026-09-19. Seed key: none. Order: hero, a scroll-lit statement of the four questions (it replaced a marquee of field names), pinned tour (check, watch, decide, one sticky stage in a 360vh runway, stacked and finished on short, narrow or reduced-motion screens), checklist tabs with a failure tab for other contract types, data flow (navy, diagram first, four steps under it, then the facts), permission matrix, FAQ on a warm band, contact on navy with the ruler field behind it, footer. English at /, German at /de.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. The share cards are rendered by code (lib/share-card.tsx), so there is no raster to document.
