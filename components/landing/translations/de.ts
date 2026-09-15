import type { ContractTypeCard, DeadlineRow } from './types';

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
];

const deadlineRows: DeadlineRow[] = [
  { title: "Wartungsvertrag Aufzug", partner: "Aufzugtechnik Sauer GmbH", notice: "3 Monate", ends: "in 5 Tagen", urgency: "week" },
  { title: "Softwarelizenz Aktenverwaltung", partner: "Advotec Systems AG", notice: "30 Tage", ends: "in 19 Tagen", urgency: "month" },
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
    lead: "Contract Lens liest eine PDF- oder Word-Datei und füllt die Vertragsakte aus: Parteien, Laufzeit, Kündigungsfrist, Verlängerung, Zahlungsbedingungen, Haftung. Sie prüfen jedes Feld neben der Originalseite, denn das letzte Wort bleibt bei Ihnen. Verträge, die innerhalb von 90 Tagen enden, stehen in einer Liste, und Sie setzen einen Alarm auf jedes Datum, auf das es ankommt.",
    cta: "Demo anfragen",
    figureLabel: "Beispiel: ein Dienstleistungsvertrag wird gelesen, und Contract Lens füllt die Akte daraus aus",
    figureCaption: "Ein Dienstleistungsvertrag geht hinein, und die Akte kommt ausgefüllt zurück. Das Protokoll zeigt jeden Schritt, während er läuft: Contract Lens liest den Text, erkennt die Vertragsart und füllt die Checkliste für diese Art aus. Sie prüfen jedes Feld, bevor Sie speichern.",
  },
  extract: {
    title: "Analyse",
    fileName: "dienstleistungsvertrag-nordlicht.pdf",
    fileMeta: "PDF",
    stepLabel: "Schritt {done} von {total}",
    lines: [
      "Dokument wird geöffnet",
      "Text wird gelesen",
      "Vertragsart: Dienstleistungsvertrag",
      "Details werden gelesen",
      "6 Felder ausgefüllt",
      "Fertig",
    ],
    recordTitle: "Vertragsakte",
    recognizedLabel: "Erkannt als",
    recognized: "Dienstleistungsvertrag",
    fields: [
      { label: "Titel", value: "Dienstleistungsvertrag, Nordlicht Software GmbH" },
      { label: "Parteien", value: "Habermann Logistik GmbH und Nordlicht Software GmbH" },
      { label: "Beginn", value: "1. Januar 2025" },
      { label: "Ende oder Laufzeit", value: "24 Monate" },
      { label: "Kündigungsfrist", value: "3 Monate zum Laufzeitende" },
      { label: "Haftungsobergrenze", value: "50.000 EUR je Vertragsjahr" },
    ],
    summaryLabel: "Zusammenfassung",
    summary: "Nordlicht Software betreibt und wartet das Lagerverwaltungssystem der Habermann Logistik. Der Vertrag läuft 24 Monate ab dem 1. Januar 2025 und verlängert sich jeweils um zwölf Monate, wenn ihn nicht eine Partei mit drei Monaten Frist kündigt.",
  },
  howItWorks: {
    eyebrow: "Funktionsweise",
    title: "Von der Datei zur Akte in drei Schritten.",
    summary: "Contract Lens liest. Sie prüfen.",
    steps: [
      {
        title: "Datei hochladen",
        body: "PDF oder Word (.docx), bis 10 MB. Contract Lens zieht den Text heraus und erkennt die Vertragsart. Gelesen werden drei Arten: Geheimhaltungsvereinbarungen, Dienstleistungsverträge und Lizenzverträge.",
      },
      {
        title: "Akte prüfen",
        body: "Sie bestätigen die Vertragsart und prüfen dann die ausgefüllten Felder neben der Originalseite. Erst wenn Sie speichern, gelangt etwas in die Akten der Kanzlei.",
      },
      {
        title: "Termine verfolgen",
        body: "Die Liste der auslaufenden Verträge zeigt, was innerhalb von 90 Tagen endet, mit der Kündigungsfrist daneben. Sie setzen einen Alarm auf jedes Datum, auf das es ankommt, und ein Manager beantwortet ihn.",
      },
    ],
    saveRecord: "Akte speichern",
  },
  whatItReads: {
    eyebrow: "Was gelesen wird",
    title: "Die Checkliste hängt von der Vertragsart ab.",
    summary: "Contract Lens erkennt zuerst die Art und liest dann mit der passenden Checkliste.",
    body: "Eine Geheimhaltungsvereinbarung wirft andere Fragen auf als eine Softwarelizenz, deshalb hat jede Vertragsart ihre eigene Liste von Feldern. Sagt der Vertrag zu einem Punkt nichts, soll die Software das Feld leer lassen, statt zu raten.",
    types: contractTypes,
    footnote: "Alle drei Checklisten enthalten außerdem einen Titel und eine Zusammenfassung in zwei Sätzen. Andere Verträge, etwa Mietverträge oder Arbeitsverträge, werden nicht automatisch gelesen.",
  },
  deadlines: {
    eyebrow: "Fristen",
    title: "Ein Alarm bleibt offen, bis ein Manager ihn schließt.",
    summary: "Ein Manager beantwortet ihn, und jeder Schritt wird mit Name und Datum festgehalten.",
    body: "Verträge, die abgelaufen sind oder innerhalb von 90 Tagen enden, stehen in einer Liste, mit der verbleibenden Zeit und der Kündigungsfrist. Sie können die Liste auf abgelaufene Verträge eingrenzen oder auf Verträge, die diese Woche oder innerhalb von 30 Tagen enden. Kommt es auf ein Datum an, setzen Sie einen Alarm darauf. Ein Manager antwortet dann mit einer von drei Möglichkeiten: Vertrag fortführen, Vertrag kündigen oder eine Rückfrage stellen.",
    listLabel: "Beispiel: die Liste der auslaufenden Verträge",
    list: {
      title: "Auslaufende Verträge",
      buckets: [
        { label: "Abgelaufen", count: 0 },
        { label: "Diese Woche", count: 1 },
        { label: "30 Tage", count: 2 },
        { label: "90 Tage", count: 4 },
      ],
      columns: { contract: "Vertrag", partner: "Vertragspartner", notice: "Kündigungsfrist", ends: "Endet" },
      rows: deadlineRows,
    },
    alertLabel: "Beispiel: ein offener Alarm",
    alert: {
      title: "Alarm",
      status: "Offen",
      contract: "Rahmenvertrag IT-Support",
      deadlineLabel: "Termin",
      deadlineDate: "30. Sep. 2026",
      deadlineType: "Kündigungsfrist",
      answerLabel: "Antwort",
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
        body: "Laden Sie Kolleginnen und Kollegen per E-Mail ein und geben Sie jeder Person eine Rolle. Ein Betrachter liest. Ein Mitglied legt Verträge an und bearbeitet die eigenen. Ein Manager bearbeitet alle Verträge und beantwortet Alarme. Ein Admin lädt außerdem Mitglieder ein und entfernt sie.",
      },
      {
        title: "Aufgaben",
        body: "Eine Aufgabe hängt an dem Vertrag, zu dem sie gehört, auf Wunsch mit Fälligkeit. Wer den Vertrag öffnet, sieht seine Aufgaben.",
      },
      {
        title: "Alarmverlauf",
        body: "Jeder Alarm hält fest, wer ihn gesetzt, wer geantwortet und wer ihn geschlossen hat, und wann.",
      },
    ],
  },
  confidentiality: {
    eyebrow: "Vertraulichkeit",
    title: "Was mit der Datei passiert.",
    summary: "Die Datei wird verschlüsselt gespeichert, und nur Ihre Kanzlei kann sie öffnen.",
    items: [
      {
        term: "Speicherung",
        body: "Dateien, Zusammenfassungen und Konditionen werden verschlüsselt, bevor sie in die Datenbank geschrieben werden. Die Verbindung zwischen Ihrem Browser und Contract Lens ist ebenfalls verschlüsselt.",
      },
      {
        term: "Die KI",
        body: "Contract Lens übermittelt den Vertragstext an KI-Modelle externer Anbieter, um die Akte auszufüllen. Gespeichert wird die Datei erst, wenn Sie speichern.",
      },
      {
        term: "Zugriff",
        body: "Nur Mitglieder Ihrer Kanzlei können eine Akte öffnen, und nur im Rahmen ihrer Rolle. Kanzleien sind voneinander getrennt.",
      },
      {
        term: "Löschung",
        body: "Ein Manager kann einen Vertrag löschen, und die Datei wird mit gelöscht. Auf Ihren Wunsch löschen wir Ihre Daten.",
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
    copyright: "Contract Lens. Alle Rechte vorbehalten.",
  },
};
