import type { ContractTypeCard, DeadlineRow } from './types';

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
];

const deadlineRows: DeadlineRow[] = [
  { title: "Maintenance contract, lift", partner: "Aufzugtechnik Sauer GmbH", notice: "3 months", ends: "in 5 days", urgency: "week" },
  { title: "Software licence, case management", partner: "Advotec Systems AG", notice: "30 days", ends: "in 19 days", urgency: "month" },
  { title: "Office lease, Friedrichstraße", partner: "Immobilien Kessler KG", notice: "6 months", ends: "in 47 days", urgency: "quarter" },
  { title: "Framework agreement, translations", partner: "Lingua Nord GmbH", notice: "1 month", ends: "in 83 days", urgency: "quarter" },
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
    titleLine1: "Upload a contract.",
    titleLine2: "Get the facts and the deadlines back.",
    lead: "Contract Lens is made for small law firms in Germany. It reads a PDF or Word file and fills in the record. You check every field before you save.",
    cta: "Request a demo",
    figureLabel: "Sample: a service agreement being read, and the record Contract Lens fills in from it",
    figureCaption: "Sample: a service agreement. Contract Lens recognizes the type first, then fills in the checklist for that type.",
  },
  extract: {
    title: "Analysis",
    fileName: "service-agreement-nordlicht.pdf",
    fileMeta: "PDF",
    stepLabel: "Step {done} of {total}",
    lines: [
      "Opening the document",
      "Reading the text",
      "Contract type: Service agreement",
      "Reading the details",
      "6 fields filled in",
      "Done",
    ],
    recordTitle: "Contract record",
    recognizedLabel: "Recognized as",
    recognized: "Service agreement",
    fields: [
      { label: "Title", value: "Service agreement, Nordlicht Software GmbH" },
      { label: "Parties", value: "Habermann Logistik GmbH and Nordlicht Software GmbH" },
      { label: "Start", value: "1 January 2025" },
      { label: "End or term", value: "24 months" },
      { label: "Notice period", value: "3 months to the end of the term" },
      { label: "Liability cap", value: "EUR 50,000 per contract year" },
    ],
    saveRecord: "Save record",
    summaryLabel: "Summary",
    summary: "Nordlicht Software operates and maintains the warehouse management system of Habermann Logistik. The agreement runs for 24 months from 1 January 2025 and renews for twelve months at a time unless one party gives three months' notice.",
  },
  howItWorks: {
    title: "From file to record in three steps.",
    summary: "Contract Lens does the reading. You do the checking.",
    steps: [
      {
        title: "Upload the file",
        body: "PDF or Word (.docx), up to 10 MB. Contract Lens pulls out the text and recognizes the kind of contract. It reads three kinds: NDAs, service agreements and licence agreements.",
      },
      {
        title: "Check the record",
        body: "You confirm the kind of contract, then check the filled-in fields next to the original page. Nothing goes into the firm's records until you save.",
      },
      {
        title: "Track the dates",
        body: "The list of expiring contracts shows what ends within 90 days, with the notice period next to each. You set an alert on any date that matters, and a manager answers it.",
      },
    ],
  },
  whatItReads: {
    title: "The checklist depends on the kind of contract.",
    summary: "A confidentiality agreement raises different questions than a software licence, so each type has its own list of fields. If the contract says nothing on a point, the software is told to leave that field empty rather than guess.",
    types: contractTypes,
    footnote: "All three checklists also include a title and a summary in two sentences. Other contracts, such as leases or employment contracts, are not read automatically.",
  },
  deadlines: {
    title: "An alert stays open until a manager closes it.",
    summary: "When a date matters, you set an alert on it. A manager then answers with one of three choices: continue the contract, terminate it, or ask a question. Each step goes on record with a name and a date. Contracts that have expired or end within 90 days appear in one list, with the time left and the notice period.",
    listLabel: "Sample: the list of expiring contracts",
    list: {
      title: "Expiring contracts",
      buckets: [
        { label: "Expired", count: 0 },
        { label: "This week", count: 1 },
        { label: "30 days", count: 2 },
        { label: "90 days", count: 4 },
      ],
      columns: { contract: "Contract", partner: "Partner", notice: "Notice period", ends: "Ends" },
      rows: deadlineRows,
    },
    alertLabel: "Sample: an open alert",
    alert: {
      title: "Alert",
      status: "Open",
      contract: "Framework agreement, IT support",
      deadlineLabel: "Deadline",
      deadlineDate: "30 Sep 2026",
      deadlineType: "Notice period",
      answerLabel: "Answer",
      actions: ["Continue contract", "Terminate contract", "Question"],
      log: "Set by S. Brandt on 1 Sep 2026",
    },
  },
  firm: {
    title: "One record per contract, shared by the whole firm.",
    summary: "Roles decide who reads, who edits and who answers, and every alert keeps a record of each step.",
    points: [
      {
        title: "Roles",
        body: "Invite colleagues by email and give each one a role. A viewer reads. A member adds contracts and edits their own. A manager edits everyone's and answers alerts. An admin also invites and removes members.",
      },
      {
        title: "Tasks",
        body: "A task sits on the contract it belongs to, with a due date if you set one. Everyone who opens the contract sees its tasks.",
      },
    ],
    alert: {
      figureLabel: "Sample: the history of one alert, from the day it was set to the day a manager closed it",
      title: "Alert",
      status: "Closed",
      contract: "Framework agreement, IT support",
      deadlineLabel: "Deadline",
      deadlineDate: "30 Sep 2026",
      deadlineType: "Notice period",
      historyLabel: "History",
      events: [
        { action: "Set", by: "S. Brandt", date: "1 Sep 2026" },
        { action: "Answered: Continue contract", by: "Dr. K. Weber", date: "3 Sep 2026" },
        { action: "Closed", by: "Dr. K. Weber", date: "4 Sep 2026" },
      ],
    },
  },
  confidentiality: {
    title: "What happens to the file.",
    summary: "The file is stored encrypted, and only your firm can open it.",
    items: [
      {
        term: "Storage",
        body: "Files, summaries and conditions are encrypted before they are written to the database. The connection between your browser and Contract Lens is encrypted as well.",
      },
      {
        term: "The AI",
        body: "Contract Lens sends the text of the contract to AI models from outside providers to fill in the record. The file is stored only when you save.",
      },
      {
        term: "Access",
        body: "Only members of your firm can open a record, and only within their role. Firms are kept apart from each other.",
      },
      {
        term: "Deletion",
        body: "A manager can delete a contract, and its file goes with it. When you ask, we delete your data.",
      },
    ],
  },
  contact: {
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
    copyright: "Contract Lens. All rights reserved.",
  },
};
