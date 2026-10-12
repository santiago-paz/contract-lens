import type { en } from './en';
import type { Capability, ContractTypeCard, DeadlineRow } from './types';

const contractTypes: ContractTypeCard[] = [
  {
    name: "Geheimhaltungsvereinbarung (NDA)",
    tab: "NDA",
    fields: [
      { label: "Parteien", value: "Kerner Holding GmbH und Lindqvist Design AB" },
      { label: "Beginn und Ablauf", value: "1. März 2026 bis 28. Februar 2029" },
      { label: "Dauer der Geheimhaltungspflicht", value: null },
      { label: "Wechselseitig oder einseitig", value: "Wechselseitig" },
      { label: "Gerichtsstand", value: "Berlin" },
      { label: "Hinweise auf Wettbewerbsverbot, Abwerbeverbot und pauschalierten Schadensersatz", value: "Nur Abwerbeverbot" },
    ],
  },
  {
    name: "Dienstleistungsvertrag",
    tab: "Dienstleistungsvertrag",
    fields: [
      { label: "Auftraggeber und Auftragnehmer", value: "Habermann Logistik GmbH und Nordlicht Software GmbH" },
      { label: "Beginn und Ende oder die erste Laufzeit", value: "1. Januar 2025, 24 Monate" },
      { label: "Automatische Verlängerung", value: "Ja, jeweils 12 Monate" },
      { label: "Kündigungsfrist für die ordentliche Kündigung", value: "3 Monate zum Laufzeitende" },
      { label: "Zahlungsbedingungen: Art, Fälligkeit, Währung", value: "Überweisung, 30 Tage, EUR" },
      { label: "Wem die Arbeitsergebnisse gehören", value: null },
      { label: "Haftungsobergrenze", value: "50.000 EUR je Vertragsjahr" },
      { label: "Wer wen freistellt", value: "Beide Seiten" },
    ],
  },
  {
    name: "Lizenzvertrag",
    tab: "Lizenzvertrag",
    fields: [
      { label: "Lizenzgeber und Lizenznehmer", value: "Advotec Systems AG und Rhein Kontor GmbH" },
      { label: "Die lizenzierte Software", value: "Software zur Aktenverwaltung" },
      { label: "Lizenzart: unbefristet, Abonnement, Testlizenz, Open Source", value: "Abonnement" },
      { label: "Nutzungsgrenzen", value: "5 benannte Nutzer" },
      { label: "Exklusiv oder nicht exklusiv", value: "Nicht exklusiv" },
      { label: "Verlängerungsdatum", value: "1. Oktober 2026" },
      { label: "Auditrechte und ihre Ankündigungsfrist", value: null },
      { label: "Gebiet", value: "Deutschland" },
    ],
  },
];

const deadlineRows: DeadlineRow[] = [
  { title: "Wartungsvertrag Aufzug", partner: "Aufzugtechnik Sauer GmbH", notice: "3 Monate", ends: "in 5 Tagen", days: 5, urgency: "week" },
  { title: "Softwarelizenz Aktenverwaltung", partner: "Advotec Systems AG", notice: "30 Tage", ends: "in 19 Tagen", days: 19, urgency: "month" },
  { title: "Büromiete Friedrichstraße", partner: "Immobilien Kessler KG", notice: "6 Monate", ends: "in 47 Tagen", days: 47, urgency: "quarter" },
  { title: "Rahmenvertrag Übersetzungen", partner: "Lingua Nord GmbH", notice: "1 Monat", ends: "in 83 Tagen", days: 83, urgency: "quarter" },
];

const capabilities: Capability[] = [
  { label: "Verträge lesen", from: "viewer" },
  { label: "Verträge, Alarme und Aufgaben anlegen", from: "member" },
  { label: "Eigene Verträge bearbeiten", from: "member" },
  { label: "Jeden Vertrag bearbeiten und löschen", from: "manager" },
  { label: "Alarme beantworten und schließen", from: "manager" },
  { label: "Mitglieder einladen und entfernen", from: "admin" },
  { label: "Die Kanzlei löschen", from: "owner" },
];

export const de: typeof en = {
  meta: {
    title: "Contract Lens | Vertragsmanagement für kleine Kanzleien",
    description:
      "Laden Sie einen Vertrag hoch und erhalten Sie Fakten und Fristen zurück: Parteien, Laufzeit, Kündigungsfrist, Verlängerung, Haftung. Gemacht für kleine Kanzleien in Deutschland.",
  },
  nav: {
    howItWorks: "Funktionsweise",
    whatItReads: "Was gelesen wird",
    yourData: "Ihre Daten",
    faq: "Fragen",
    signIn: "Anmelden",
    requestDemo: "Demo anfragen",
    skipToContent: "Zum Inhalt springen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    languageLabel: "Sprache",
  },
  motion: {
    pause: "Bewegung anhalten",
    resume: "Bewegung fortsetzen",
  },
  hero: {
    titleLine1: "Vertrag hochladen.",
    titleLine2: "Fakten und Fristen zurückbekommen.",
    lead: "Contract Lens ist für kleine Kanzleien gemacht. Die Software liest eine PDF- oder Word-Datei und füllt die Vertragsakte aus. Sie prüfen jedes Feld, bevor Sie speichern.",
    cta: "Demo anfragen",
    secondary: "So funktioniert es",
    figureLabel: "Beispiel: ein Dienstleistungsvertrag wird gelesen, und Contract Lens füllt die Akte daraus aus",
    figureCaption: "Beispiel: ein Dienstleistungsvertrag. Contract Lens erkennt zuerst die Vertragsart und füllt dann die Checkliste für diese Art aus.",
    replay: "Beispiel wiederholen",
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
      "6 Felder ausgefüllt",
      "Fertig",
    ],
    recordTitle: "Vertragsakte",
    recognizedLabel: "Erkannt als",
    recognized: "Dienstleistungsvertrag",
    fields: [
      { label: "Titel", value: "Dienstleistungsvertrag, Nordlicht Software GmbH" },
      { label: "Parteien", value: "Habermann Logistik GmbH und Nordlicht Software GmbH" },
      { label: "Beginn", value: "1. Januar 2025" },
      { label: "Ende oder Laufzeit", value: "24 Monate" },
      { label: "Kündigungsfrist", value: "3 Monate zum Laufzeitende" },
      { label: "Haftungsobergrenze", value: "50.000 EUR je Vertragsjahr" },
    ],
    saveRecord: "Akte speichern",
    summaryLabel: "Zusammenfassung",
    summary: "Nordlicht Software betreibt und wartet das Lagerverwaltungssystem der Habermann Logistik. Der Vertrag läuft 24 Monate ab dem 1. Januar 2025 und verlängert sich jeweils um zwölf Monate, wenn ihn nicht eine Partei mit drei Monaten Frist kündigt.",
  },
  facts: {
    label: "Fragen, die jeder Vertrag aufwirft",
    questions: [
      "Wer sind die Parteien?",
      "Wann endet der Vertrag?",
      "Wie lang ist die Kündigungsfrist?",
      "Verlängert er sich von selbst?",
      "Wie hoch ist die Haftungsobergrenze?",
    ],
    answer: "Contract Lens füllt die Antworten aus. Sie prüfen sie.",
  },
  tour: {
    title: "Die Software liest. Ihre Kanzlei entscheidet.",
    summary: "Nach dem Lesen prüft eine Person die Akte, behält die Termine im Blick und beantwortet die Alarme.",
    stepLabel: "Schritt {n} von {total}",
    sampleNote: "Beispieldaten.",
    steps: [
      {
        title: "Akte prüfen",
        body: "Sie bestätigen die Vertragsart und prüfen dann die ausgefüllten Felder neben der Originaldatei. Jeden Wert können Sie ändern. Erst wenn Sie speichern, gelangt etwas in die Akten der Kanzlei.",
      },
      {
        title: "Termine im Blick behalten",
        body: "Eine Liste zeigt jeden Vertrag, der abgelaufen ist oder innerhalb von 90 Tagen endet, mit der Kündigungsfrist daneben. Filter schränken sie auf abgelaufen, diese Woche, 30 Tage oder 90 Tage ein.",
      },
      {
        title: "Über einen Alarm entscheiden",
        body: "Auf jedes Datum, auf das es ankommt, setzen Sie einen Alarm. Ein Manager antwortet mit einer von drei Möglichkeiten: Vertrag fortführen, Vertrag kündigen oder Rückfrage. Jeder Schritt wird mit Name und Datum festgehalten.",
      },
    ],
    check: {
      figureLabel: "Beispiel: eine Vertragsakte wird geprüft, korrigiert und gespeichert",
      title: "Vertragsakte",
      previewLabel: "Dateivorschau",
      pageLabel: "Seite 1 von 12",
      paymentLabel: "Zahlungsbedingungen",
      paymentEmpty: "Nicht angegeben",
      paymentValue: "30 Tage netto",
      saved: "Gespeichert",
    },
  },
  deadlines: {
    listLabel: "Beispiel: die Liste der auslaufenden Verträge",
    list: {
      title: "Auslaufende Verträge",
      buckets: [
        { label: "Abgelaufen", count: 0 },
        { label: "Diese Woche", count: 1 },
        { label: "30 Tage", count: 2 },
        { label: "90 Tage", count: 4 },
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
    alert: {
      figureLabel: "Beispiel: der Verlauf eines Alarms, vom Setzen bis zum Schließen durch einen Manager",
      title: "Alarm",
      status: "Geschlossen",
      contract: "Rahmenvertrag IT-Support",
      deadlineLabel: "Termin",
      deadlineDate: "30. Sep. 2026",
      deadlineType: "Kündigungsfrist",
      historyLabel: "Verlauf",
      events: [
        { action: "Gesetzt", by: "S. Brandt", date: "1. Sep. 2026" },
        { action: "Beantwortet: Vertrag fortführen", by: "Dr. K. Weber", date: "3. Sep. 2026" },
        { action: "Geschlossen", by: "Dr. K. Weber", date: "4. Sep. 2026" },
      ],
    },
  },
  whatItReads: {
    title: "Die Checkliste hängt von der Vertragsart ab.",
    summary: "Eine Geheimhaltungsvereinbarung wirft andere Fragen auf als eine Softwarelizenz, deshalb hat jede Vertragsart ihre eigene Liste von Feldern. Sagt der Vertrag zu einem Punkt nichts, soll die Software das Feld leer lassen, statt zu raten.",
    tabsLabel: "Vertragsart",
    sampleNote: "Beispieldaten.",
    notSpecified: "Nicht angegeben",
    types: contractTypes,
    other: {
      tab: "Anderer Vertrag",
      fileName: "buero-mietvertrag-friedrichstrasse.pdf",
      lines: ["Dokument wird geöffnet", "Text wird gelesen", "Vertragsart: Sonstige"],
      error: "Die Vertragsart konnte nicht automatisch bestimmt werden.",
      note: "Mietverträge, Arbeitsverträge und andere Arten werden nicht gelesen. Sie füllen die Akte von Hand aus.",
    },
    footnote: "Alle drei Checklisten enthalten außerdem einen Titel und eine Zusammenfassung in zwei Sätzen.",
  },
  yourData: {
    title: "Wohin Ihr Vertrag geht.",
    summary: "Der Text geht an externe KI-Anbieter. Die Datei kommt erst in die Datenbank, wenn Sie speichern.",
    figureLabel: "Beispiel: der Weg einer Datei, von Ihrer Kanzlei bis zur Datenbank",
    stepsLabel: "Der Weg einer Datei in vier Schritten",
    nodes: {
      firm: "Ihre Kanzlei",
      lens: "Contract Lens",
      ai: "KI-Anbieter",
      aiNote: "Außerhalb der Kanzlei",
      db: "Datenbank",
      dbNote: "USA",
    },
    packets: {
      file: "Datei",
      text: "Text",
      fields: "Ausgefüllte Felder",
      locked: "Datei, Zusammenfassung, Konditionen",
    },
    steps: [
      {
        title: "Sie laden die Datei hoch",
        body: "Ihr Browser sendet sie über eine verschlüsselte Verbindung an Contract Lens.",
      },
      {
        title: "Contract Lens liest sie",
        body: "Die Software zieht den Text aus der Datei und schickt ihn an KI-Modelle externer Anbieter. Diese füllen die Akte aus.",
      },
      {
        title: "Sie prüfen die Akte",
        body: "Noch ist nichts gespeichert. Die Akte ist ein Entwurf auf Ihrem Bildschirm.",
      },
      {
        title: "Sie speichern",
        body: "Datei, Zusammenfassung und Konditionen werden verschlüsselt und in die Datenbank in den USA geschrieben.",
      },
    ],
    facts: [
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
  roles: {
    title: "Eine Akte je Vertrag, für die ganze Kanzlei.",
    summary: "Rollen legen fest, wer liest, wer bearbeitet und wer antwortet, und jeder Alarm hält jeden Schritt fest.",
    selectLabel: "Rolle",
    matrixLabel: "Was jede Rolle darf",
    can: "Ja",
    cannot: "Nein",
    names: {
      viewer: "Betrachter",
      member: "Mitglied",
      manager: "Manager",
      admin: "Admin",
      owner: "Inhaber",
    },
    capabilities,
    note: "Eine Aufgabe hängt an dem Vertrag, zu dem sie gehört, auf Wunsch mit Fälligkeit. Wer den Vertrag öffnet, sieht seine Aufgaben.",
  },
  faq: {
    title: "Fragen, klar beantwortet.",
    items: [
      {
        q: "Welche Verträge kann Contract Lens lesen?",
        a: "Geheimhaltungsvereinbarungen, Dienstleistungsverträge und Lizenzverträge, als PDF oder Word (.docx) bis 10 MB. Jeder andere Vertrag beendet die Analyse mit einer Meldung, und Sie füllen die Akte von Hand aus.",
      },
      {
        q: "Ersetzt das unsere eigene Prüfung?",
        a: "Nein. Contract Lens füllt eine Checkliste aus. Sie prüfen jedes Feld neben der Datei und ändern, was nicht stimmt. Erst wenn Sie speichern, wird etwas gespeichert.",
      },
      {
        q: "Was passiert, wenn ein Vertrag zu einem Punkt nichts sagt?",
        a: "Die Software soll das Feld leer lassen, statt zu raten. Das Feld zeigt dann „Nicht angegeben“, und Sie können es selbst ausfüllen.",
      },
      {
        q: "Wohin geht mein Vertrag?",
        a: "Der Text geht an KI-Modelle externer Anbieter, die die Akte ausfüllen. Die Datei wird erst gespeichert, wenn Sie speichern, in einer Datenbank in den USA. Datei, Zusammenfassung und Konditionen werden vor dem Schreiben verschlüsselt.",
      },
      {
        q: "Was dürfen meine Kolleginnen und Kollegen?",
        a: "Jede Person bekommt eine von fünf Rollen, vom Betrachter bis zum Inhaber. Die Tabelle oben zeigt, was jede Rolle darf.",
      },
      {
        q: "Kann ich es an einem eigenen Vertrag ausprobieren?",
        a: "Ja. Fordern Sie eine Demo an. Wir antworten innerhalb eines Werktags, und die Demo läuft an einem Vertrag, den Sie mitbringen.",
      },
    ],
  },
  contact: {
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
    credit: "Gestaltet und entwickelt von Santiago Paz",
  },
};
