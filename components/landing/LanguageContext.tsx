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
      teams: "Teams",
      security: "Security"
    },
    hero: {
      title: "Your contracts aren't just dead paper.",
      titleLine1: "ELIMINATE",
      titleLine2: "HIDDEN WASTE",
      titleHighlight: "They are cash flows.",
      titleEnd: "Control them.",
      subtitle: "TOTAL SYSTEM VISIBILITY. We auto-classify every contract, organize by vendor, and extract every expiration date. Stop managing folders and start commanding your legal data.",
      cta: "START AUDIT",
      unstructured: "UNSTRUCTURED DATA",
      raw: "RAW DOCUMENT",
      analysisSteps: ["AUTO-CLASSIFICATION", "DEEP EXTRACTION", "RENEWAL GUARD"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Master Service Agreement",
        status: "AUDITING",
        valueLabel: "Contract Value",
        dateLabel: "Effective Date",
        value: "$120,000 / year",
        date: "Jan 01, 2024",
        riskTitle: "CRITICAL THREAT",
        riskText: "UNAUTHORIZED AUTO-RENEWAL DETECTED. CANCEL IMMEDIATELY.",
        verified: "Data Verified",
        complete: "Analysis Complete"
      }
    },
    showcase: {
      title: "See Split Berlin in Action",
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
      title: "More Than Storage: A Contract Command Center",
      subtitle: "Split Berlin is a complete suite for managing your contract lifecycle.",
      ingestion: {
        title: "Smart Ingestion",
        description: "It doesn't just read, it understands structure and validates vendors against global databases.",
        processing: "Processing",
        validating: "Validating Metadata...",
        results: {
          title: "Analysis Complete",
          summaryLabel: "Summary",
          summaryText: "Standard enterprise license agreement for workspace provision. Includes SLA of 99.9%.",
          vendorLabel: "Contract Partner",
          vendor: "Slack Technologies, LLC",
          valueLabel: "Value",
          value: "€14,500 / year"
        }
      },
      guard: {
        title: "Proactive Guard",
        description: "Your CFO will sleep soundly. Automatic alerts with no configuration.",
        alert1: "Salesforce Renewal",
        alert1Sub: "Expires in 30 days. Action required.",
        alert2: "Approval Needed",
        alert2Sub: "New DPA for review",
        alert3: "Budget Warning",
        alert3Sub: "Marketing Q1 at 105%",
        alert4: "New Vendor",
        alert4Sub: "Linear Orbit Inc. added"
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
        },
        taskCard2: {
          assigned: "@Mike assigned to you",
          task: "\"Approve Renewal\"",
          due: "Due today"
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
    teams: {
      title: "Chaos into clarity.",
      titleHighlight: "One platform, endless utility.",
      subtitle: "Stop chasing contracts. Start driving strategy. We turn your static agreements into actionable data for every stakeholder in your organization.",
      cta: "Talk to our experts",
      legal: {
        title: "Legal Teams",
        desc: "Accelerate reviews and maintain airtight compliance with automated version control and audit trails."
      },
      procurement: {
        title: "Procurement",
        desc: "Maximize leverage. Track renewals, monitor performance, and consolidate vendor spend automatically."
      },
      hr: {
        title: "HR",
        desc: "Protect people data. Securely manage employment agreements with strict access controls and compliance tracking."
      },
      finance: {
        title: "Finance",
        desc: "No more surprises. Visualize committed spend and cash flow impact directly from your contract data."
      },
      grc: {
        title: "GRC Teams",
        desc: "Stay compliant effortlessly. Automated risk monitoring and obligation tracking for every vendor."
      },
      ops: {
        title: "Operations",
        desc: "Scale without friction. Integrate contract milestones directly into your daily project workflows."
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
      teams: "Teams",
      security: "Sicherheit"
    },
    hero: {
      title: "Verträge sind kein totes Papier.",
      titleLine1: "VERSTECKTE KOSTEN",
      titleLine2: "ELIMINIEREN",
      titleHighlight: "Sie sind Cashflow.",
      titleEnd: "Behalten Sie die Kontrolle.",
      subtitle: "TOTALE SYSTEMÜBERSICHT. Wir klassifizieren jeden Vertrag, organisieren nach Anbieter und extrahieren jedes Ablaufdatum. Hören Sie auf, Ordner zu verwalten – übernehmen Sie das Kommando.",
      cta: "AUDIT STARTEN",
      unstructured: "UNSTRUKTURIERT",
      raw: "ROHDATEN",
      analysisSteps: ["AUTO-KLASSIFIZIERUNG", "TIEFEN-EXTRAKTION", "LAUFZEIT-SCHUTZ"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Rahmenvertrag",
        status: "AUDIT LÄUFT",
        valueLabel: "Vertragswert",
        dateLabel: "Gültigkeitsdatum",
        value: "120.000 $ / Jahr",
        date: "01. Jan 2024",
        riskTitle: "KRITISCHE WARNUNG",
        riskText: "UNGEWOLLTE VERLÄNGERUNG ERKANNT. SOFORT KÜNDIGEN.",
        verified: "Daten verifiziert",
        complete: "Analyse abgeschlossen"
      }
    },
    showcase: {
      title: "Split Berlin in Aktion: Vom Upload bis zum aktiven Management",
      subtitle: "Ein Workflow für Finanzteams.",
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
      title: "Mehr als Speicher: Ein Vertrags-Kommandozentrum",
      subtitle: "Split Berlin ist eine Komplettlösung für Ihr Vertragsmanagement.",
      ingestion: {
        title: "Smarte Erfassung",
        description: "Liest nicht nur, sondern versteht die Struktur und validiert Anbieter gegen globale Datenbanken.",
        processing: "Verarbeitung",
        validating: "Validiere Metadaten...",
        results: {
          title: "Analyse abgeschlossen",
          summaryLabel: "Zusammenfassung",
          summaryText: "Standard-Unternehmenslizenzvertrag für Workspace-Bereitstellung. Enthält SLA von 99,9%.",
          vendorLabel: "Vertragspartner",
          vendor: "Slack Technologies, LLC",
          valueLabel: "Wert",
          value: "14.500 € / Jahr"
        }
      },
      guard: {
        title: "Proaktiver Schutz",
        description: "Ihr CFO wird ruhig schlafen. Automatische Warnungen ohne Konfiguration.",
        alert1: "Salesforce Verlängerung",
        alert1Sub: "Läuft in 30 Tagen ab. Handlung erforderlich.",
        alert2: "Freigabe erforderlich",
        alert2Sub: "Neuer AVV zur Prüfung",
        alert3: "Budget Warnung",
        alert3Sub: "Marketing Q1 bei 105%",
        alert4: "Neuer Anbieter",
        alert4Sub: "Linear Orbit Inc. hinzugefügt"
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
        },
        taskCard2: {
          assigned: "@Mike zugewiesen",
          task: "\"Verlängerung freigeben\"",
          due: "Fällig heute"
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
    teams: {
      title: "Vom Chaos zur Klarheit.",
      titleHighlight: "Eine Plattform, unendlicher Nutzen.",
      subtitle: "Hören Sie auf, Verträge zu jagen. Beginnen Sie, Strategien voranzutreiben. Wir verwandeln Ihre statischen Vereinbarungen in umsetzbare Daten für jeden Stakeholder in Ihrer Organisation.",
      cta: "Sprechen Sie mit unseren Experten",
      legal: {
        title: "Rechtsabteilungen",
        desc: "Beschleunigen Sie Überprüfungen und gewährleisten Sie lückenlose Compliance mit automatisierter Versionskontrolle und Audit-Trails."
      },
      procurement: {
        title: "Einkauf",
        desc: "Maximieren Sie Ihren Hebel. Verfolgen Sie Verlängerungen, überwachen Sie die Leistung und konsolidieren Sie Lieferantenausgaben automatisch."
      },
      hr: {
        title: "Personalwesen",
        desc: "Schützen Sie Personaldaten. Verwalten Sie Arbeitsverträge sicher mit strengen Zugriffskontrollen und Compliance-Tracking."
      },
      finance: {
        title: "Finanzen",
        desc: "Keine Überraschungen mehr. Visualisieren Sie gebundene Ausgaben und Cashflow-Auswirkungen direkt aus Ihren Vertragsdaten."
      },
      grc: {
        title: "GRC-Teams",
        desc: "Mühelos konform bleiben. Automatische Risikoüberwachung und Verpflichtungsverfolgung für jeden Lieferanten."
      },
      ops: {
        title: "Operations",
        desc: "Skalieren Sie ohne Reibung. Integrieren Sie Vertragsmeilensteine direkt in Ihre täglichen Projektworkflows."
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
  const [language, setLanguage] = useState<Language>('de');

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
