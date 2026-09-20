# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Contract Lens is for lawyers and office staff at small law firms in Germany. Santiago's market notes in Plan.md aim at firms with one to five lawyers.

The intended split of work follows the roles in the code. Office staff upload contracts and watch the dates. A lawyer with the manager role answers the alerts and decides what happens to each contract.

A firm keeps two kinds of contract here: contracts it drafted or checked for clients, and its own, such as the office lease, software licences and supplier contracts. Both sit in the same list. A record has no field for the client or the matter, so the app can't tell the two kinds apart.

No firm uses Contract Lens yet. The people who judge it today are reviewers of Santiago's work:

- Product and design teams, who judge the flows, the interface and the writing.
- Freelance clients, who judge whether one person can ship a whole product.

Reviewers can read the landing at trycontractlens.com and the public repo at github.com/santiago-paz/contract-lens. Sign-up is open, so they can also create a firm and try the app.

## Product Purpose

Contract Lens reads a contract file and fills in a record for its type. Then it helps the firm watch end dates and decide what to do about them. It has a list of contracts that end soon, alerts that a manager answers, and tasks on each contract.

The README puts the idea in one line: an AI that extracts rather than chats. The user uploads a file and never writes a prompt.

For now Contract Lens is mainly a portfolio piece. It succeeds when a reviewer finds a working product that does exactly what its pages say, with a clear interface and plain writing. It has no customers, and winning firms isn't the main goal right now. Plan.md holds market research and pricing ideas, but none of it is live or decided.

## Positioning

Contract Lens fills in a fixed checklist for each type of contract. The user then checks every field next to the file, and nothing is stored until they save. There's no chat and no prompt to write.

- Each type has its own checklist, because an NDA raises different questions than a software licence. When the contract is silent on a point, the model is told to leave the field empty.
- Alerts put decisions on record. A manager answers with continue, terminate or a question, and closing the alert is a separate step. The history keeps a name and a date for each step.

## Operating Context

In the upload flow the user adds a PDF or Word file. A live log shows each step: open the document, read the text, contract type, details, fields filled in, done. The user confirms the type, checks the record next to a preview of the file, and saves.

After that the firm works in these places:

- Contracts: each user's own list, and the whole firm's.
- Expiring contracts: contracts that have ended or end within 90 days, each with its notice period. Filters cut the list to expired, this week, 30 days or 90 days.
- Alerts: set by hand on a contract, with a deadline and a label (End date, Renewal, Notice period or Custom). The history shows who set, answered and closed each one, and when.
- Tasks: a title, plus an optional due date and an optional link to a contract.
- Members: invite people by email and give each one a role.

Roles, from least to most access:

- viewer: reads.
- member: adds contracts, edits their own and sets alerts.
- manager: edits and deletes any contract, and answers and closes alerts.
- admin: also invites and removes members.
- owner: also deletes the firm.

Owners and admins also see an AI test page at /admin/playground.

The landing is in English and German, with English first. The app is in English only, and it stays that way for now.

Three sidebar links (Created by me, Recently created, Partners) lead to an "under development" page.

## Capabilities and Constraints

Contract Lens reads three types: NDAs, service agreements and licence agreements. Any other contract stops the analysis with an error, and the user fills in the record by hand. The fields for each type live in actions/contract-extraction/schemas/. Every type also gets a suggested title and a two-sentence summary.

It takes PDF or Word (.docx) files up to 10 MB. The file picker also accepts .doc, but the app can't get text out of those files.

The analysis returns field values, a suggested title and a summary. It gives no page numbers, quotes or marked passages. So no screen and no marketing image may link a field to a passage in the contract.

What Contract Lens does not do (checked in the code on 2026-09-18):

- It sends no reminders and no alert emails. Alerts exist only inside the app. The only emails it sends are team invitations and the contact form.
- It doesn't work out a "give notice by" date from an end date and a notice period.
- It sets no zero-retention or no-training options with the AI providers.
- In the database it encrypts only the file, the summary and the conditions.
- No screen can escalate an alert, though the server action exists.
- Tasks have no assignee and no reminders.
- Colleagues see no change log. Each user sees only their own activity, plus the alert history.

End dates are free text. The expiring list skips any end date it can't read as a date.

The database runs on Supabase in the US (us-east-1), and contract files are stored in it, encrypted. The text of each contract goes to outside AI models through the Vercel AI Gateway: openai/gpt-4o-mini picks the type and deepseek/deepseek-r1 fills in the fields. So never claim EU hosting or zero retention, because neither is true. Don't claim the product meets GDPR or professional secrecy rules either, because nobody has checked.

The site has no Impressum and no privacy policy. A site aimed at German firms needs both, and both need Santiago's details. It runs no analytics and shows no cookie banner.

Not decided: EU hosting, pricing, and whether the app gets a German version later.

## Brand Commitments

The name is Contract Lens and the domain is trycontractlens.com. Mail goes out from contact@trycontractlens.com and invites@trycontractlens.com.

The mark is the § sign on a red disc. The sign is drawn rather than set in a typeface, so it still reads at 16px in a browser tab. The drawing lives in lib/brand-mark.ts and is the only copy: components/landing/Logo.tsx and app/opengraph-image.tsx draw it, and scripts/generate-icons.mjs writes app/icon.svg, app/favicon.ico and app/apple-icon.png from it.

Blackletter is a retired name. It appears only in an unlinked walkthrough video in Vercel Blob storage (contract-lens-walkthrough-v3.mp4). Don't use it.

Santiago's voice rules for landing, marketing and app copy:

- Write for lawyers and office staff, not for technical readers. Keep "RAG", "pipeline", "AES-256", "stateless" and model names out of visible text.
- Use short, plain words, and sentence case for headings and buttons.
- In English, the plain hyphen is the only dash. Write "because", "but" and "so" rather than "as", "however" and "therefore".
- German copy uses Sie and German legal terms (Kündigungsfrist, Laufzeit, Vorfrist, Haftungsobergrenze) rather than translated tech terms.
- Run the humanizer and dashfix skills on every piece of copy.

Santiago asked that the site never show what the product isn't. Check each claim in the code before copy states it.

## Evidence on Hand

Real:

- The working product at trycontractlens.com, with open sign-up.
- The public repo at github.com/santiago-paz/contract-lens, with the README and docs/demo.gif (2026-08-07). The GIF shows the upload and analysis flow in the app's current look.
- docs/multi-tenant-diagram.html, a diagram of the multi-tenant setup.
- The landing figures in components/landing/. They're built from real behavior: the analysis log, the record, the expiring list and an alert.
- The share card in app/opengraph-image.tsx.

Invented and marked as samples: the companies and people in the landing figures, such as Nordlicht Software GmbH, Habermann Logistik GmbH, S. Brandt and the four firms in the expiring list. Keep the sample label on them.

Not usable:

- public/screenshots-app/1.png to 4.png, which nothing links to.
- The walkthrough video in Blob storage, which shows the retired Blackletter brand.
- The market figures in Plan.md, such as the share of German firms that use contract software. They have no sources, so they can't back a claim.

Absent, and never to be made up: customers, pilot firms, testimonials, client logos, usage numbers, accuracy rates, press, case studies, certifications and prices.

## Product Principles

1. Claim only what exists. Every line and image on the landing, in the app and in the README matches what the code does today. A reviewer who signs up finds what the page promised.
2. The software reads, and a person decides. Show what the analysis found and let the user check it against the file. Never fake certainty, sources or links to passages.
3. Speak the lawyer's language: plain words and German legal terms, never engineering terms.
4. Say plainly where contract data goes: who can open it, what is encrypted, and that the text goes to outside AI providers.
5. Finish before adding. Reviewers judge what they can click, so a dead link or a half-built page costs more than a missing feature. Finish a flow or hide it.
