import type { ContractTypeCard, DeadlineRow, SpecimenDocument } from './types';

const specimen: SpecimenDocument = {
  fileName: "service-agreement-nordlicht.pdf",
  pageNote: "Excerpt",
  title: "Service Agreement",
  paragraphs: [
    {
      segments: [
        "between ",
        { mark: 0, text: "Habermann Logistik GmbH, Hamburg, and Nordlicht Software GmbH, Kiel" },
        " (together “the Parties”).",
      ],
    },
    {
      heading: "§ 1 Subject",
      segments: ["The Provider operates and maintains the warehouse management system described in Annex 1 for the Client."],
    },
    {
      heading: "§ 3 Term",
      segments: [
        { mark: 1, text: "This Agreement commences on 1 January 2025 and runs for an initial term of 24 months." },
        " ",
        { mark: 2, text: "It renews for successive periods of twelve months unless either Party terminates it in writing with three months' notice to the end of the term." },
      ],
    },
    {
      heading: "§ 7 Fees",
      segments: ["Invoices are payable within 30 days of receipt by bank transfer."],
    },
    {
      heading: "§ 9 Liability",
      segments: [
        { mark: 3, text: "The Provider's total liability under this Agreement is limited to EUR 50,000 per contract year." },
        " This limit does not apply to intent or gross negligence.",
      ],
    },
  ],
};

const contractTypes: ContractTypeCard[] = [
  {
    name: "Confidentiality agreement (NDA)",
    fields: [
      "Parties",
      "Effective date and expiry",
      "How long confidentiality lasts",
      "Mutual or one-sided",
      "Place of jurisdiction",
      "Flags for non-compete, non-solicitation and liquidated damages clauses",
    ],
  },
  {
    name: "Service agreement",
    fields: [
      "Client and provider",
      "Start and end date, or the initial term",
      "Automatic renewal",
      "Notice period for termination without cause",
      "Payment terms: method, timing, currency",
      "Who owns the work product",
      "Liability cap",
      "Who indemnifies whom",
    ],
  },
  {
    name: "Licence agreement",
    fields: [
      "Licensor and licensee",
      "The licensed software",
      "Licence type: perpetual, subscription, evaluation, open source",
      "Usage limits",
      "Exclusive or non-exclusive",
      "Renewal date",
      "Audit rights and their notice period",
      "Territory",
    ],
  },
  {
    name: "Everything else",
    note: "General terms, leases, employment contracts and the rest",
    fields: ["Title", "Parties", "Key dates", "Governing law"],
  },
];

const deadlineRows: DeadlineRow[] = [
  { title: "Maintenance contract, lift", partner: "Aufzugtechnik Sauer GmbH", notice: "3 months", ends: "in 5 days", urgency: "week" },
  { title: "Software licence, case management", partner: "Advotec Systems AG", notice: "30 days", ends: "in 19 days", urgency: "month" },
  { title: "Office lease, Friedrichstraße", partner: "Immobilien Kessler KG", notice: "6 months", ends: "in 47 days", urgency: "quarter" },
  { title: "Framework agreement, translations", partner: "Lingua Nord GmbH", notice: "1 month", ends: "in 83 days", urgency: "quarter" },
];

export const en = {
  nav: {
    howItWorks: "How it works",
    whatItReads: "What it reads",
    deadlines: "Deadlines",
    confidentiality: "Confidentiality",
    signIn: "Sign in",
    requestDemo: "Request a demo",
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    languageLabel: "Language",
  },
  hero: {
    eyebrow: "Contract management for small law firms in Germany",
    titleLine1: "Upload a contract.",
    titleLine2: "Get the facts and the deadlines back.",
    lead: "Contract Lens reads a PDF or Word file and fills in the record: parties, term, notice period, renewal, payment terms, liability. You check each field against the original page, so the last word stays with you. The dates go into one list, and an alert arrives while there is still time to act.",
    cta: "Request a demo",
    secondary: "Watch the walkthrough",
    figureLabel: "Sample: a service agreement and the record Contract Lens fills in from it",
    figureCaption: "A service agreement and the record Contract Lens fills in from it. Each mark in the document feeds one field, and the notice date follows from the term and the notice period.",
  },
  extract: {
    doc: specimen,
    recordTitle: "Contract record",
    recognizedLabel: "Recognized as",
    recognized: "Service agreement",
    fields: [
      { label: "Parties", value: "Habermann Logistik GmbH and Nordlicht Software GmbH" },
      { label: "Term", value: "1 Jan 2025 to 31 Dec 2026" },
      { label: "Renewal and notice", value: "Renews for 12 months. Notice: 3 months to the end of the term" },
      { label: "Liability cap", value: "EUR\u00a050,000 per contract year" },
    ],
    deadlineLabel: "Give notice by",
    deadlineDate: "30 Sep 2026",
    alertNote: "Alert set for 1 Sep 2026",
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From file to record in three steps.",
    summary: "Contract Lens does the reading. You do the checking.",
    steps: [
      {
        title: "Upload the file",
        body: "PDF or Word, up to 10\u00a0MB. Contract Lens pulls out the text and recognizes the kind of contract: an NDA, a service agreement, a licence agreement, or something else.",
      },
      {
        title: "Check the record",
        body: "The fields come back filled in and sit next to the original page, so you confirm or correct each one before you save. Where the contract is silent, the field stays empty, because the software does not guess.",
      },
      {
        title: "Track the dates",
        body: "End dates, renewals and notice periods appear in one list, sorted by what comes first. You set an alert on the date that matters, and it stays open until a colleague answers it.",
      },
    ],
    videoTitle: "The walkthrough",
    videoBody: "Sign in, upload a contract, and watch the record fill in.",
    play: "Play the walkthrough",
    playAria: "Play the product walkthrough video",
  },
  whatItReads: {
    eyebrow: "What it reads",
    title: "The checklist depends on the kind of contract.",
    summary: "Contract Lens recognizes the type first, then reads with the checklist for that type.",
    body: "A confidentiality agreement raises different questions than a software licence, so each type has its own list of fields. Every field may stay empty: if the contract says nothing on a point, the record says so too.",
    types: contractTypes,
    footnote: "Every record also gets a title and a summary in two sentences, whatever the type.",
  },
  deadlines: {
    eyebrow: "Deadlines",
    title: "The alert waits for an answer.",
    summary: "An alert stays open until a manager answers it, and the answer goes on record.",
    body: "Every end date, renewal and notice period appears in one list, sorted by what comes first: overdue, this week, this month, the next 90 days. When a date matters, you set an alert on it. A manager then has to answer: continue the contract, terminate it, or ask a question back. Until that happens the alert stays open, it can be escalated, and every step is logged with a name and a time.",
    listLabel: "Sample: the list of expiring contracts",
    list: {
      title: "Expiring contracts",
      buckets: [
        { label: "Overdue", count: 0 },
        { label: "This week", count: 1 },
        { label: "This month", count: 2 },
        { label: "90 days", count: 4 },
      ],
      columns: { contract: "Contract", partner: "Partner", notice: "Notice period", ends: "Ends" },
      rows: deadlineRows,
    },
    alertLabel: "Sample: an open alert",
    alert: {
      title: "Alert",
      status: "Open, no answer",
      contract: "Framework agreement, IT support",
      deadlineLabel: "Give notice by",
      deadlineDate: "30 Sep 2026",
      detail: "The agreement ends on 31 Dec 2026 with three months' notice.",
      actions: ["Continue contract", "Terminate contract", "Question"],
      log: "Set by S. Brandt on 1 Sep 2026",
    },
  },
  firm: {
    eyebrow: "The firm",
    title: "One record per contract, shared by the whole firm.",
    summary: "Roles decide who reads, who edits and who answers.",
    points: [
      {
        title: "Roles",
        body: "Invite colleagues by email and give each one a role. A viewer reads. A member edits their own contracts. A manager answers alerts and edits everyone's. An admin runs the firm's account.",
      },
      {
        title: "Tasks",
        body: "A task hangs on the contract it belongs to, with a due date and an owner, so a renewal never depends on someone's memory.",
      },
      {
        title: "The log",
        body: "Every change to a record is written down with a name and a time. The same goes for every alert and every answer to it.",
      },
    ],
  },
  confidentiality: {
    eyebrow: "Confidentiality",
    title: "What happens to the file.",
    summary: "Encrypted when stored, read once by the AI, deleted when you ask.",
    items: [
      {
        term: "Storage",
        body: "Files, summaries and conditions are encrypted before they are written to the database. The connection between your browser and Contract Lens is encrypted as well.",
      },
      {
        term: "The AI",
        body: "The document is read once to fill in the record and encrypted again right after. Your contracts are never used to train a model.",
      },
      {
        term: "Access",
        body: "Only members of your firm can open a record, and only within their role. Firms are kept apart from each other.",
      },
      {
        term: "Deletion",
        body: "Processing follows the GDPR. When you ask, we delete your data.",
      },
    ],
  },
  contact: {
    eyebrow: "Contact",
    title: "See it on one of your own contracts.",
    body: "Write a few lines about your firm and how you keep track of contracts today. We reply within one business day, and the demo runs on a contract you bring.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Work email",
    emailPlaceholder: "name@firm.de",
    message: "Message",
    messagePlaceholder: "How do you keep track of contracts today?",
    note: "We use your address only to reply.",
    submit: "Send message",
    submitting: "Sending…",
    sentTitle: "Message received.",
    sentBody: "We reply within one business day.",
    sendAnother: "Send another message",
    errorInvalid: "One of the fields is empty or too short. Check them and send again.",
    errorThrottled: "This connection has sent too many messages. Try again in an hour.",
    errorFailed: "We could not send your message. Please try again.",
  },
  footer: {
    tagline: "Contract management for small law firms in Germany.",
    privacy: "Privacy",
    terms: "Terms",
    copyright: "Contract Lens. All rights reserved.",
  },
  cookieConsent: {
    title: "Cookies",
    text: "We use cookies the site needs to work, for example to keep you signed in. Optional analytics only run if you accept.",
    accept: "Accept",
    decline: "Decline",
    closeAria: "Close and decline optional cookies",
  },
};
