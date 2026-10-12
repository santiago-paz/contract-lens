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

Tools: GSAP with ScrollTrigger, SplitText, Flip and DrawSVG; Lenis; Three.js (vanilla, lazy). Lottie is skipped on purpose: there are no authored animation files, and GSAP draws the same icon motion with less weight.

Never shown: field-to-passage links, a timeline chart of contracts, computed notice dates, reminders, per-field confirm controls, customers, logos, numbers, certifications, EU hosting.

Unresolved: Impressum and privacy pages need Santiago's details. Whether the product reads German contracts well is unverified, so no copy claims it.

## Direction contract

THESIS: The page behaves like the product. It reads fast, waits for a person to check, and keeps a ruler of dates. It refuses the legal-AI default (dark, glowing, a chat box), its opposite (a grey brochure with gavels), and the repeated headline over a grid of cards.

OWN-WORLD: Ink #16181d, Firm Navy #1a2742 with a lit pool, paper white, warm grey, Mist, and Commentary Red for signals only. Source Serif 4 at 500 for headlines, IBM Plex Sans for everything else, no mono. Product windows are white sheets with a hairline highlight and offset shadows. The ruler tick is the one motif at every scale: the WebGL field, the marquee separators, the tour rail, the permission matrix. Navy layers take rounded tops.

STORY: A lawyer watches a file go in and a record come out, sees a person correct and save it, sees the dates and the recorded decision, reads plainly where the text goes, and asks for a demo.

FIRST VIEWPORT: At 1440 by 900, the left five columns sit on paper: a serif headline at 3.5rem in three lines, the lead, an ink pill "Request a demo" and a text link. On the right a floating navy panel (32px radius, 16px inset) holds a WebGL ruler field and two product sheets in slight perspective, with the record sheet overlapping the panel's left edge. On load the analysis runs, the ticks sweep, the fields fill, a pulse closes it, and "Save record" waits.

FORM: Extension of the established world. No concept roll, because Santiago pinned the identity and rejected rolls on 2026-09-19. Seed key: none. Order: hero, marquee of field names, pinned tour (check, watch, decide), checklist tabs, data flow, permission matrix, FAQ, contact, footer.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
