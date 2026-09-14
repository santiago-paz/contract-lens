import type { ContractTypeCard, DeadlineRow, SpecimenDocument } from './types';

const specimen: SpecimenDocument = {
  fileName: "dienstleistungsvertrag-nordlicht.pdf",
  pageNote: "Auszug",
  title: "Dienstleistungsvertrag",
  paragraphs: [
    {
      segments: [
        "zwischen der ",
        { mark: 0, text: "Habermann Logistik GmbH, Hamburg, und der Nordlicht Software GmbH, Kiel" },
        " (gemeinsam „die Parteien“).",
      ],
    },
    {
      heading: "§ 1 Vertragsgegenstand",
      segments: ["Der Auftragnehmer betreibt und wartet für den Auftraggeber das in Anlage 1 beschriebene Lagerverwaltungssystem."],
    },
    {
      heading: "§ 3 Laufzeit",
      segments: [
        { mark: 1, text: "Dieser Vertrag beginnt am 1. Januar 2025 und hat eine feste Laufzeit von 24 Monaten." },
        " ",
        { mark: 2, text: "Er verlängert sich jeweils um zwölf Monate, wenn ihn nicht eine Partei mit einer Frist von drei Monaten zum Ende der Laufzeit schriftlich kündigt." },
      ],
    },
    {
      heading: "§ 7 Vergütung",
      segments: ["Rechnungen sind innerhalb von 30 Tagen nach Zugang per Überweisung zu zahlen."],
    },
    {
      heading: "§ 9 Haftung",
      segments: [
        { mark: 3, text: "Die Gesamthaftung des Auftragnehmers aus diesem Vertrag ist auf 50.000 EUR je Vertragsjahr begrenzt." },
        " Diese Begrenzung gilt nicht bei Vorsatz und grober Fahrlässigkeit.",
      ],
    },
  ],
};

const contractTypes: ContractTypeCard[] = [
  {
    name: "Geheimhaltungsvereinbarung (NDA)",
    fields: [
      "Parteien",
      "Beginn und Ablauf",
      "Dauer der Geheimhaltungspflicht",
      "Wechselseitig oder einseitig",
      "Gerichtsstand",
      "Hinweise auf Wettbewerbsverbot, Abwerbeverbot und pauschalierten Schadensersatz",
    ],
  },
  {
    name: "Dienstleistungsvertrag",
    fields: [
      "Auftraggeber und Auftragnehmer",
      "Beginn und Ende oder die erste Laufzeit",
      "Automatische Verlängerung",
      "Kündigungsfrist für die ordentliche Kündigung",
      "Zahlungsbedingungen: Art, Fälligkeit, Währung",
      "Wem die Arbeitsergebnisse gehören",
      "Haftungsobergrenze",
      "Wer wen freistellt",
    ],
  },
  {
    name: "Lizenzvertrag",
    fields: [
      "Lizenzgeber und Lizenznehmer",
      "Die lizenzierte Software",
      "Lizenzart: unbefristet, Abonnement, Testlizenz, Open Source",
      "Nutzungsgrenzen",
      "Exklusiv oder nicht exklusiv",
      "Verlängerungsdatum",
      "Auditrechte und ihre Ankündigungsfrist",
      "Gebiet",
    ],
  },
  {
    name: "Alles andere",
    note: "AGB, Mietverträge, Arbeitsverträge und der Rest",
    fields: ["Titel", "Parteien", "Wichtige Termine", "Anwendbares Recht"],
  },
];

const deadlineRows: DeadlineRow[] = [
  { title: "Wartungsvertrag Aufzug", partner: "Aufzugtechnik Sauer GmbH", notice: "3 Monate", ends: "in 5 Tagen", urgency: "week" },
  { title: "Softwarelizenz Aktenverwaltung", partner: "Advotec Systems AG", notice: "30 Tage", ends: "in 19 Tagen", urgency: "month" },
  { title: "Büromiete Friedrichstraße", partner: "Immobilien Kessler KG", notice: "6 Monate", ends: "in 47 Tagen", urgency: "quarter" },
  { title: "Rahmenvertrag Übersetzungen", partner: "Lingua Nord GmbH", notice: "1 Monat", ends: "in 83 Tagen", urgency: "quarter" },
];

export const de = {
  nav: {
    howItWorks: "Funktionsweise",
    whatItReads: "Was gelesen wird",
    deadlines: "Fristen",
    confidentiality: "Vertraulichkeit",
    signIn: "Anmelden",
    requestDemo: "Demo anfragen",
    skipToContent: "Zum Inhalt springen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    languageLabel: "Sprache",
  },
  hero: {
    eyebrow: "Vertragsmanagement für kleine Kanzleien",
    titleLine1: "Vertrag hochladen.",
    titleLine2: "Fakten und Fristen zurückbekommen.",
    lead: "Contract Lens liest eine PDF- oder Word-Datei und füllt die Vertragsakte aus: Parteien, Laufzeit, Kündigungsfrist, Verlängerung, Zahlungsbedingungen, Haftung. Sie prüfen jedes Feld neben der Originalseite, denn das letzte Wort bleibt bei Ihnen. Die Termine landen in einer Liste, und der Alarm meldet sich, solange noch Zeit zum Handeln ist.",
    cta: "Demo anfragen",
    secondary: "Rundgang ansehen",
    figureLabel: "Beispiel: ein Dienstleistungsvertrag und die Akte, die Contract Lens daraus ausfüllt",
    figureCaption: "Ein Dienstleistungsvertrag und die Akte, die Contract Lens daraus ausfüllt. Jede Markierung im Dokument füllt ein Feld, und der Kündigungstermin ergibt sich aus Laufzeit und Kündigungsfrist.",
  },
  extract: {
    doc: specimen,
    recordTitle: "Vertragsakte",
    recognizedLabel: "Erkannt als",
    recognized: "Dienstleistungsvertrag",
    fields: [
      { label: "Parteien", value: "Habermann Logistik GmbH und Nordlicht Software GmbH" },
      { label: "Laufzeit", value: "1. Jan. 2025 bis 31. Dez. 2026" },
      { label: "Verlängerung und Frist", value: "Verlängert sich um 12 Monate. Kündigungsfrist: 3 Monate zum Laufzeitende" },
      { label: "Haftungsobergrenze", value: "50.000\u00a0EUR je Vertragsjahr" },
    ],
    deadlineLabel: "Kündigung spätestens am",
    deadlineDate: "30. Sep. 2026",
    alertNote: "Vorfrist: 1. Sep. 2026",
  },
  howItWorks: {
    eyebrow: "Funktionsweise",
    title: "Von der Datei zur Akte in drei Schritten.",
    summary: "Contract Lens liest. Sie prüfen.",
    steps: [
      {
        title: "Datei hochladen",
        body: "PDF oder Word, bis 10\u00a0MB. Contract Lens zieht den Text heraus und erkennt die Vertragsart: Geheimhaltungsvereinbarung, Dienstleistungsvertrag, Lizenzvertrag oder etwas anderes.",
      },
      {
        title: "Akte prüfen",
        body: "Die Felder kommen ausgefüllt zurück und stehen neben der Originalseite, sodass Sie jedes Feld bestätigen oder korrigieren, bevor Sie speichern. Schweigt der Vertrag zu einem Punkt, bleibt das Feld leer, weil die Software nicht rät.",
      },
      {
        title: "Termine verfolgen",
        body: "Enddaten, Verlängerungen und Kündigungsfristen stehen in einer Liste, sortiert nach dem, was zuerst ansteht. Sie setzen einen Alarm auf das Datum, auf das es ankommt, und er bleibt offen, bis eine Kollegin oder ein Kollege antwortet.",
      },
    ],
    videoTitle: "Der Rundgang",
    videoBody: "Anmelden, Vertrag hochladen und zusehen, wie sich die Akte füllt.",
    play: "Rundgang abspielen",
    playAria: "Produkt-Rundgang abspielen",
  },
  whatItReads: {
    eyebrow: "Was gelesen wird",
    title: "Die Checkliste hängt von der Vertragsart ab.",
    summary: "Contract Lens erkennt zuerst die Art und liest dann mit der passenden Checkliste.",
    body: "Eine Geheimhaltungsvereinbarung wirft andere Fragen auf als eine Softwarelizenz, deshalb hat jede Vertragsart ihre eigene Liste von Feldern. Jedes Feld darf leer bleiben: Sagt der Vertrag zu einem Punkt nichts, steht das auch so in der Akte.",
    types: contractTypes,
    footnote: "Jede Akte bekommt außerdem einen Titel und eine Zusammenfassung in zwei Sätzen, unabhängig von der Art.",
  },
  deadlines: {
    eyebrow: "Fristen",
    title: "Der Alarm wartet auf eine Antwort.",
    summary: "Ein Alarm bleibt offen, bis ein Manager antwortet, und die Antwort steht in der Akte.",
    body: "Jedes Enddatum, jede Verlängerung und jede Kündigungsfrist steht in einer Liste, sortiert nach dem, was zuerst ansteht: überfällig, diese Woche, dieser Monat, die nächsten 90 Tage. Kommt es auf ein Datum an, setzen Sie einen Alarm darauf. Ein Manager muss dann antworten: Vertrag fortführen, kündigen oder eine Rückfrage stellen. Bis dahin bleibt der Alarm offen, er kann eskaliert werden, und jeder Schritt wird mit Name und Uhrzeit festgehalten.",
    listLabel: "Beispiel: die Liste der auslaufenden Verträge",
    list: {
      title: "Auslaufende Verträge",
      buckets: [
        { label: "Überfällig", count: 0 },
        { label: "Diese Woche", count: 1 },
        { label: "Dieser Monat", count: 2 },
        { label: "90 Tage", count: 4 },
      ],
      columns: { contract: "Vertrag", partner: "Vertragspartner", notice: "Kündigungsfrist", ends: "Endet" },
      rows: deadlineRows,
    },
    alertLabel: "Beispiel: ein offener Alarm",
    alert: {
      title: "Alarm",
      status: "Offen, keine Antwort",
      contract: "Rahmenvertrag IT-Support",
      deadlineLabel: "Kündigung spätestens am",
      deadlineDate: "30. Sep. 2026",
      detail: "Der Vertrag endet am 31. Dez. 2026 mit drei Monaten Kündigungsfrist.",
      actions: ["Vertrag fortführen", "Vertrag kündigen", "Rückfrage"],
      log: "Gesetzt von S. Brandt am 1. Sep. 2026",
    },
  },
  firm: {
    eyebrow: "Die Kanzlei",
    title: "Eine Akte je Vertrag, für die ganze Kanzlei.",
    summary: "Rollen legen fest, wer liest, wer bearbeitet und wer antwortet.",
    points: [
      {
        title: "Rollen",
        body: "Laden Sie Kolleginnen und Kollegen per E-Mail ein und geben Sie jeder Person eine Rolle. Ein Betrachter liest. Ein Mitglied bearbeitet die eigenen Verträge. Ein Manager beantwortet Alarme und bearbeitet alle Verträge. Ein Admin verwaltet das Konto der Kanzlei.",
      },
      {
        title: "Aufgaben",
        body: "Eine Aufgabe hängt an dem Vertrag, zu dem sie gehört, mit Fälligkeit und Zuständigkeit, damit keine Verlängerung vom Gedächtnis Einzelner abhängt.",
      },
      {
        title: "Das Protokoll",
        body: "Jede Änderung an einer Akte wird mit Name und Uhrzeit festgehalten. Dasselbe gilt für jeden Alarm und jede Antwort darauf.",
      },
    ],
  },
  confidentiality: {
    eyebrow: "Vertraulichkeit",
    title: "Was mit der Datei passiert.",
    summary: "Verschlüsselt gespeichert, einmal von der KI gelesen, auf Wunsch gelöscht.",
    items: [
      {
        term: "Speicherung",
        body: "Dateien, Zusammenfassungen und Konditionen werden verschlüsselt, bevor sie in die Datenbank geschrieben werden. Die Verbindung zwischen Ihrem Browser und Contract Lens ist ebenfalls verschlüsselt.",
      },
      {
        term: "Die KI",
        body: "Das Dokument wird einmal gelesen, um die Akte auszufüllen, und direkt danach wieder verschlüsselt. Ihre Verträge werden nie zum Training eines Modells verwendet.",
      },
      {
        term: "Zugriff",
        body: "Nur Mitglieder Ihrer Kanzlei können eine Akte öffnen, und nur im Rahmen ihrer Rolle. Kanzleien sind voneinander getrennt.",
      },
      {
        term: "Löschung",
        body: "Die Verarbeitung folgt der DSGVO. Auf Ihren Wunsch löschen wir Ihre Daten.",
      },
    ],
  },
  contact: {
    eyebrow: "Kontakt",
    title: "Sehen Sie es an einem Ihrer eigenen Verträge.",
    body: "Schreiben Sie ein paar Zeilen zu Ihrer Kanzlei und dazu, wie Sie Verträge heute im Blick behalten. Wir antworten innerhalb eines Werktags, und die Demo läuft an einem Vertrag, den Sie mitbringen.",
    name: "Name",
    namePlaceholder: "Ihr Name",
    email: "Geschäftliche E-Mail",
    emailPlaceholder: "name@kanzlei.de",
    message: "Nachricht",
    messagePlaceholder: "Wie behalten Sie Verträge heute im Blick?",
    note: "Wir verwenden Ihre Adresse nur für die Antwort.",
    submit: "Nachricht senden",
    submitting: "Wird gesendet…",
    sentTitle: "Nachricht erhalten.",
    sentBody: "Wir antworten innerhalb eines Werktags.",
    sendAnother: "Weitere Nachricht senden",
    errorInvalid: "Ein Feld ist leer oder zu kurz. Bitte prüfen und erneut senden.",
    errorThrottled: "Von dieser Verbindung wurden zu viele Nachrichten gesendet. Bitte in einer Stunde erneut versuchen.",
    errorFailed: "Ihre Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
  },
  footer: {
    tagline: "Vertragsmanagement für kleine Kanzleien in Deutschland.",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    copyright: "Contract Lens. Alle Rechte vorbehalten.",
  },
  cookieConsent: {
    title: "Cookies",
    text: "Wir verwenden Cookies, die die Seite zum Funktionieren braucht, zum Beispiel für die Anmeldung. Optionale Statistik läuft nur, wenn Sie zustimmen.",
    accept: "Akzeptieren",
    decline: "Ablehnen",
    closeAria: "Schließen und optionale Cookies ablehnen",
  },
};
