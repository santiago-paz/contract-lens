'use client';

import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
}

const translations = {
  en: {
    nav: {
      signIn: "Sign In",
      getStarted: "Get Started",
      howItWorks: "How it Works",
      features: "Features",
      security: "Security"
    },
    hero: {
      title: "Your contracts aren't just dead paper.",
      titleHighlight: "They are cash flows.",
      titleEnd: "Control them.",
      subtitle: "SplitBerlin transforms static PDFs into a living database. Receive renewal alerts, assign tasks to your team, and audit vendors without manual data entry.",
      cta: "Audit your contracts",
      unstructured: "UNSTRUCTURED DATA",
      raw: "RAW DOCUMENT",
      analysisSteps: ["Structure Analysis", "Partner Validation", "Extracting Metadata"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Master Service Agreement",
        status: "Review",
        valueLabel: "Contract Value",
        dateLabel: "Effective Date",
        value: "$120,000 / year",
        date: "Jan 01, 2024",
        riskTitle: "Auto-Renewal Risk",
        riskText: "Contract auto-renews in 12 days unless cancelled.",
        verified: "Data Verified",
        complete: "Analysis Complete"
      }
    },
    showcase: {
      title: "See SplitBerlin in Action",
      subtitle: "From upload to active management, experience a workflow designed for finance teams.",
      step1: "Step 1",
      step2: "Step 2",
      step3: "Step 3",
      features: [
        {
          title: "Intelligent Ingestion",
          description: "Start by choosing a specialized contract template or simply drag & drop your legacy PDFs. We handle the rest."
        },
        {
          title: "AI Analysis",
          description: "Watch as our engine analyzes the document structure, identifies partners, and extracts critical dates and metadata in seconds."
        },
        {
          title: "Structured Data Editor",
          description: "Review extracted data side-by-side with your document. Edit fields, assign owners, and manage auto-renewals in a unified interface."
        }
      ]
    },
    bento: {
      title: "More Than Files: A Command Center",
      subtitle: "SplitBerlin is a complete suite for managing your contract lifecycle.",
      ingestion: {
        title: "Smart Ingestion",
        description: "It doesn't just read, it understands structure and validates vendors against global databases.",
        processing: "Processing",
        validating: "Validating Metadata..."
      },
      guard: {
        title: "Proactive Guard",
        description: "Your CFO will sleep soundly. Automatic alerts with no configuration.",
        alert1: "Salesforce Renewal",
        alert1Sub: "Expires in 30 days. Action required.",
        alert2: "Approval Needed"
      },
      collab: {
        title: "Real Collaboration",
        description: "Assign tasks directly on the contract and group documents by vendor. No more email threads.",
        list: [
          "Assign specific clauses to legal",
          "Track approval workflows",
          "Vendor-centric document view"
        ],
        partnerCard: "Partner Intelligence",
        taskCard: {
          assigned: "@Sarah assigned to you",
          task: "\"Review Liability Clause\"",
          due: "Due tomorrow"
        }
      }
    },
    security: {
      encryption: {
        title: "AES-256 Encryption",
        desc: "Your data is encrypted at rest and in transit. Enterprise-grade security standard."
      },
      ai: {
        title: "Zero-Retention AI",
        desc: "Our AI models process your data without storing it for training. Your IP remains yours."
      },
      hosting: {
        title: "Sovereign Hosting",
        desc: "Choose where your data lives. Full compliance with EU GDPR and US privacy laws."
      }
    },
    contact: {
      title: "Get in touch",
      subtitle: "Have specific requirements? Our team specializes in complex enterprise setups.",
      name: "Name",
      email: "Work Email",
      message: "Message",
      placeholder: "Tell us about your contract management challenges...",
      send: "Send Message",
      sending: "Sending...",
      sentTitle: "Message Sent!",
      sentDesc: "We'll get back to you within 24 hours.",
      sendAnother: "Send another message"
    },
    footer: {
      ctaTitle: "How much did the last renewal you forgot to cancel cost you?",
      ctaButton: "Stop the losses",
      rights: "All rights reserved.",
      privacy: "Privacy",
      terms: "Terms"
    }
  },
  de: {
    nav: {
      signIn: "Anmelden",
      getStarted: "Loslegen",
      howItWorks: "So funktioniert's",
      features: "Funktionen",
      security: "Sicherheit"
    },
    hero: {
      title: "Verträge sind kein totes Papier.",
      titleHighlight: "Sie sind Cashflow.",
      titleEnd: "Behalten Sie die Kontrolle.",
      subtitle: "SplitBerlin verwandelt statische PDFs in eine lebendige Datenbank. Erhalten Sie Verlängerungswarnungen, weisen Sie Aufgaben zu und prüfen Sie Anbieter ohne manuelle Dateneingabe.",
      cta: "Verträge prüfen",
      unstructured: "UNSTRUKTURIERT",
      raw: "ROHDATEN",
      analysisSteps: ["Strukturanalyse", "Partner-Validierung", "Metadaten-Extraktion"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Rahmenvertrag",
        status: "Prüfung",
        valueLabel: "Vertragswert",
        dateLabel: "Gültigkeitsdatum",
        value: "120.000 $ / Jahr",
        date: "01. Jan 2024",
        riskTitle: "Risiko: Auto-Verlängerung",
        riskText: "Vertrag verlängert sich in 12 Tagen automatisch.",
        verified: "Daten verifiziert",
        complete: "Analyse abgeschlossen"
      }
    },
    showcase: {
      title: "SplitBerlin in Aktion",
      subtitle: "Vom Upload bis zum aktiven Management: Ein Workflow für Finanzteams.",
      step1: "Schritt 1",
      step2: "Schritt 2",
      step3: "Schritt 3",
      features: [
        {
          title: "Intelligente Erfassung",
          description: "Wählen Sie eine Vertragsvorlage oder ziehen Sie alte PDFs einfach per Drag & Drop hinein. Wir erledigen den Rest."
        },
        {
          title: "KI-Analyse",
          description: "Sehen Sie zu, wie unsere Engine die Dokumentenstruktur analysiert, Partner identifiziert und kritische Daten in Sekunden extrahiert."
        },
        {
          title: "Strukturierter Daten-Editor",
          description: "Überprüfen Sie extrahierte Daten Seite an Seite mit Ihrem Dokument. Bearbeiten Sie Felder, weisen Sie Verantwortliche zu und verwalten Sie Verlängerungen."
        }
      ]
    },
    bento: {
      title: "Mehr als Dateien: Ein Kommandozentrum",
      subtitle: "SplitBerlin ist eine Komplettlösung für Ihr Vertragsmanagement.",
      ingestion: {
        title: "Smarte Erfassung",
        description: "Liest nicht nur, sondern versteht die Struktur und validiert Anbieter gegen globale Datenbanken.",
        processing: "Verarbeitung",
        validating: "Validiere Metadaten..."
      },
      guard: {
        title: "Proaktiver Schutz",
        description: "Ihr CFO wird ruhig schlafen. Automatische Warnungen ohne Konfiguration.",
        alert1: "Salesforce Verlängerung",
        alert1Sub: "Läuft in 30 Tagen ab. Handlung erforderlich.",
        alert2: "Freigabe erforderlich"
      },
      collab: {
        title: "Echte Zusammenarbeit",
        description: "Aufgaben direkt am Vertrag zuweisen und Dokumente nach Anbieter gruppieren. Keine E-Mail-Ketten mehr.",
        list: [
          "Klauseln an Rechtsabteilung zuweisen",
          "Genehmigungsworkflows verfolgen",
          "Anbieter-zentrierte Dokumentenansicht"
        ],
        partnerCard: "Partner-Intelligenz",
        taskCard: {
          assigned: "@Sarah zugewiesen",
          task: "\"Haftungsklausel prüfen\"",
          due: "Fällig morgen"
        }
      }
    },
    security: {
      encryption: {
        title: "AES-256 Verschlüsselung",
        desc: "Ihre Daten sind sicher verschlüsselt. Sicherheitsstandard auf Unternehmensniveau."
      },
      ai: {
        title: "Zero-Retention KI",
        desc: "Unsere KI-Modelle verarbeiten Ihre Daten, ohne sie für das Training zu speichern. Ihr geistiges Eigentum bleibt bei Ihnen."
      },
      hosting: {
        title: "Souveränes Hosting",
        desc: "Wählen Sie, wo Ihre Daten liegen. Volle Konformität mit EU-DSGVO und US-Datenschutzgesetzen."
      }
    },
    contact: {
      title: "Kontakt aufnehmen",
      subtitle: "Haben Sie spezielle Anforderungen? Unser Team ist auf komplexe Unternehmens-Setups spezialisiert.",
      name: "Name",
      email: "Geschäftliche E-Mail",
      message: "Nachricht",
      placeholder: "Erzählen Sie uns von Ihren Herausforderungen im Vertragsmanagement...",
      send: "Nachricht senden",
      sending: "Senden...",
      sentTitle: "Nachricht gesendet!",
      sentDesc: "Wir melden uns innerhalb von 24 Stunden bei Ihnen.",
      sendAnother: "Weitere Nachricht senden"
    },
    footer: {
      ctaTitle: "Wie viel hat Sie die letzte vergessene Vertragsverlängerung gekostet?",
      ctaButton: "Verluste stoppen",
      rights: "Alle Rechte vorbehalten.",
      privacy: "Datenschutz",
      terms: "AGB"
    }
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
