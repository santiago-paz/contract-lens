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
    bauhaus: {
      header: {
        title1: "Not just another",
        title2: "management tool.",
        title3: "We are your",
        title4: "unfair advantage.",
        subtitle: "Fast and powerful where others are merely safe and stable."
      },
      deadlines: {
        title: "Deadlines",
        subtitle: "Time doesn't forgive. We do.",
        description: "Preventive visualization of critical deadlines. Alerting you before risk materializes, not after.",
        visual: {
          autoRenewal: "AUTOMATIC RENEWAL",
          exitClause: "EXIT CLAUSE",
          annualReview: "ANNUAL REVIEW",
          days: "Days"
        }
      },
      translation: {
        title: "Simultaneous Translation",
        subtitle: "Borderless contracts, barrier-free laws",
        description: "Not Google Translate. Deep legal context translation preserving format and validity in real-time.",
        visual: {
            original: "Original (DE)",
            translated: "Translated (EN)"
        }
      },
      aiDraft: {
        title: "AI Draft Creation",
        subtitle: "Legal Architecture, not just text",
        description: "Outperforming generic models using structured templates and RAG with real jurisprudence for bulletproof contracts.",
        visual: {
          status: "ONLINE",
          components: "COMPONENTS",
          jurisdiction: "Jurisdiction",
          liability: "Liability",
          term: "Term",
          payment: "Payment",
          generating: "Generating clause structure based on EU Law...",
          clauseTitle: "Limitation of Liability",
          codeText: "7.1 The aggregate liability of either party shall not exceed the total fees paid..."
        }
      },
      anatomy: {
        title: "Anatomical Structure",
        subtitle: "Contract Anatomy",
        description: "Surgical breakdown of every clause and obligation. Understand the bone structure of your agreements instantly.",
        visual: {
          parties: "Parties",
          obligations: "Obligations",
          termination: "Termination"
        }
      }
    },
    hero: {
      title: "Infrastructure is destiny.",
      titleLine1: "RESOURCE",
      titleLine2: "MASTERY",
      titleHighlight: "Control the outcome.",
      titleEnd: "Execute.",
      subtitle: "DEPLOY OPERATIONAL SUPREMACY. We engineer order from chaos. Auto-ingest contracts, audit vendor performance, and enforce capital efficiency. The operating system for your corporate assets.",
      cta: "INITIATE SYSTEM",
      unstructured: "RAW DATA",
      raw: "BINARY INPUT",
      analysisSteps: ["DATA STRUCTURING", "FORENSIC EXTRACTION", "RISK AUDIT"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Master Service Agreement",
        status: "AUDITING",
        valueLabel: "Contract Value",
        dateLabel: "Effective Date",
        value: "$120,000 / year",
        date: "Jan 01, 2024",
        riskTitle: "CRITICAL ALERT",
        riskText: "UNAUTHORIZED RENEWAL DETECTED. IMMEDIATE ACTION REQUIRED.",
        verified: "Verified",
        complete: "Audit Complete"
      }
    },
    showcase: {
      title: "Precision Engineered Workflow",
      subtitle: "From raw ingestion to active command. Experience high-velocity asset management.",
      step1: "Phase 1",
      step2: "Phase 2",
      step3: "Phase 3",
      features: [
        {
          title: "Forensic Ingestion",
          description: "Drag & drop legacy PDFs. Our engine structures the unstructured, validating vendors against global registries."
        },
        {
          title: "Algorithmic Analysis",
          description: "Deep-learning models deconstruct document architecture, identifying liabilities and critical dates in milliseconds."
        },
        {
          title: "Structured Command",
          description: "Data-driven interface. Edit fields, assign owners, and enforce renewal policies in a unified console."
        }
      ]
    },
    bento: {
      title: "The Enterprise Asset OS",
      subtitle: "Centralize. Audit. Deploy. Optimize. A unified infrastructure for licenses, subscriptions, files, and capital.",
      ingestion: {
        title: "Forensic Ingestion",
        description: "Parses unstructured binaries. Validates entities. Enforces data integrity.",
        processing: "Processing",
        validating: "Validating Integrity...",
        results: {
          title: "Audit Complete",
          summaryLabel: "Executive Summary",
          summaryText: "Standard enterprise license agreement. 99.9% SLA confirmed. Risk level: Low.",
          vendorLabel: "Entity",
          vendor: "Slack Technologies, LLC",
          valueLabel: "Cost Basis",
          value: "€14,500 / year"
        }
      },
      guard: {
        title: "Automated Audit",
        description: "Continuous cost anomaly detection. Zero configuration required.",
        alert1: "Renewal Alert",
        alert1Sub: "T-minus 30 days. Authorization needed.",
        alert2: "Compliance Check",
        alert2Sub: "DPA review pending",
        alert3: "Budget Variance",
        alert3Sub: "Marketing Q1 > 105%",
        alert4: "Vendor Detection",
        alert4Sub: "Linear Orbit Inc. identified"
      },
      collab: {
        title: "Workflow Orchestration",
        description: "Direct resource deployment. Granular permissioning. Unified asset view.",
        list: [
          "Enforce legal review protocols",
          "Track approval chains",
          "Vendor-centric asset view"
        ],
        partnerCard: "Entity Intelligence",
        taskCard: {
          assigned: "@Sarah assigned",
          task: "\"Audit Liability\"",
          due: "Due: T-24h"
        },
        taskCard2: {
          assigned: "@Mike assigned",
          task: "\"Approve Spend\"",
          due: "Due: Today"
        }
      }
    },
    security: {
      encryption: {
        title: "Military-Grade Encryption",
        desc: "AES-256 at rest and in transit. Zero-compromise data protection."
      },
      ai: {
        title: "Zero-Retention Architecture",
        desc: "Ephemeral processing. Your IP never leaves your control."
      },
      hosting: {
        title: "Sovereign Infrastructure",
        desc: "Strict data residency. GDPR/CCPA compliant backbone."
      }
    },
    teams: {
      title: "Precision Infrastructure",
      titleHighlight: "Engineered for scale.",
      subtitle: "High-performance tools for the modern enterprise. Transform static agreements into a queryable asset database.",
      cta: "Deploy Architecture",
      legal: {
        title: "Algorithmic Audit",
        desc: "Detect unauthorized spend patterns and contract deviations with 99.9% accuracy."
      },
      procurement: {
        title: "Data Structuring",
        desc: "Convert PDF binaries into queryable, SQL-ready datasets for instant analysis."
      },
      hr: {
        title: "Capital Recovery",
        desc: "Identify and reclaim 12% avg. budget leakage from zombie subscriptions."
      },
      finance: {
        title: "Security Architecture",
        desc: "AES-256 encryption at rest. Granular access control. Zero-trust architecture."
      },
      grc: {
        title: "Compliance Enforcement",
        desc: "Automated DPA verification and regulatory adherence checks. Audit-ready logs."
      },
      ops: {
        title: "Operational Velocity",
        desc: "Reduce contract turnaround time by 40% via automated workflows and API integration."
      }
    },
    contact: {
      title: "Initiate Deployment",
      subtitle: "Enterprise-grade requirements? Our engineering team is ready.",
      name: "Officer Name",
      email: "Work Email",
      message: "Directives",
      placeholder: "Outline your operational requirements...",
      send: "Transmit",
      sending: "Transmitting...",
      sentTitle: "Transmission Received",
      sentDesc: "We will respond within 24 operational hours.",
      sendAnother: "Send new directive"
    },
    footer: {
      ctaTitle: "Operational failure is a choice.",
      ctaButton: "Secure Your Infrastructure",
      rights: "All rights reserved.",
      privacy: "Privacy Protocol",
      terms: "Terms of Service"
    },
    cookieConsent: {
      text: "SYSTEM NOTICE: This interface utilizes cookies to maintain session integrity and optimize performance.",
      accept: "ACKNOWLEDGE",
      decline: "DECLINE"
    }
  },
  de: {
    nav: {
      signIn: "Anmelden",
      getStarted: "Starten",
      howItWorks: "Funktionsweise",
      features: "Funktionen",
      teams: "Teams",
      security: "Sicherheit"
    },
    bauhaus: {
      header: {
        title1: "Nicht nur ein weiteres",
        title2: "Verwaltungstool.",
        title3: "Wir sind Ihr",
        title4: "unfairer Vorteil.",
        subtitle: "Schnell und leistungsstark, wo andere nur sicher und stabil sind."
      },
      deadlines: {
        title: "Fristen",
        subtitle: "Die Zeit verzeiht nicht. Wir schon.",
        description: "Präventive Visualisierung kritischer Fristen. Warnung bevor das Risiko eintritt, nicht danach.",
        visual: {
          autoRenewal: "AUTOMATISCHE VERLÄNGERUNG",
          exitClause: "AUSSTIEGSKLAUSEL",
          annualReview: "JÄHRLICHE PRÜFUNG",
          days: "Tage"
        }
      },
      translation: {
        title: "Simultanübersetzung",
        subtitle: "Grenzenlose Verträge, Gesetze ohne Barrieren",
        description: "Kein Google Translate. Übersetzung mit tiefem juristischen Kontext unter Wahrung von Format und Gültigkeit in Echtzeit.",
        visual: {
            original: "Original (DE)",
            translated: "Übersetzt (EN)"
        }
      },
      aiDraft: {
        title: "KI-Entwurfserstellung",
        subtitle: "Rechtsarchitektur, nicht nur Text",
        description: "Übertrifft generische Modelle durch strukturierte Vorlagen und RAG mit echter Rechtsprechung für kugelsichere Verträge.",
        visual: {
          status: "ONLINE",
          components: "KOMPONENTEN",
          jurisdiction: "Gerichtsstand",
          liability: "Haftung",
          term: "Laufzeit",
          payment: "Zahlung",
          generating: "Generiere Klauselstruktur nach EU-Recht...",
          clauseTitle: "Haftungsbeschränkung",
          codeText: "7.1 Die Gesamthaftung einer Partei darf die insgesamt gezahlten Gebühren nicht überschreiten..."
        }
      },
      anatomy: {
        title: "Anatomische Struktur",
        subtitle: "Vertragsanatomie",
        description: "Chirurgische Aufschlüsselung jeder Klausel und Verpflichtung. Verstehen Sie die Knochenstruktur Ihrer Verträge sofort.",
        visual: {
          parties: "Parteien",
          obligations: "Pflichten",
          termination: "Kündigung"
        }
      }
    },
    hero: {
      title: "Infrastruktur ist Schicksal.",
      titleLine1: "RESSOURCEN",
      titleLine2: "DOMINANZ",
      titleHighlight: "Kontrollieren Sie das Ergebnis.",
      titleEnd: "Ausführen.",
      subtitle: "OPERATIVE ÜBERLEGENHEIT EINFÜHREN. Wir schaffen Ordnung aus dem Chaos. Verträge automatisch erfassen, Anbieterleistung prüfen und Kapitaleffizienz erzwingen. Das Betriebssystem für Ihre Unternehmenswerte.",
      cta: "SYSTEM STARTEN",
      unstructured: "ROHDATEN",
      raw: "BINÄRER INPUT",
      analysisSteps: ["DATENSTRUKTURIERUNG", "FORENSISCHE EXTRAKTION", "RISIKOPRÜFUNG"],
      card: {
        vendor: "Amazon Web Services, Inc.",
        type: "Rahmenvertrag",
        status: "AUDIT LÄUFT",
        valueLabel: "Vertragswert",
        dateLabel: "Gültigkeitsdatum",
        value: "120.000 $ / Jahr",
        date: "01. Jan 2024",
        riskTitle: "KRITISCHE WARNUNG",
        riskText: "UNGEWOLLTE VERLÄNGERUNG ERKANNT. SOFORT HANDELN.",
        verified: "Verifiziert",
        complete: "Audit abgeschlossen"
      }
    },
    showcase: {
      title: "Präzisionsgefertigter Workflow",
      subtitle: "Von der Rohdatenerfassung bis zum aktiven Kommando. Erleben Sie Asset-Management mit hoher Geschwindigkeit.",
      step1: "Phase 1",
      step2: "Phase 2",
      step3: "Phase 3",
      features: [
        {
          title: "Forensische Erfassung",
          description: "Ziehen Sie alte PDFs per Drag & Drop. Unsere Engine strukturiert das Unstrukturierte und validiert Anbieter gegen globale Register."
        },
        {
          title: "Algorithmische Analyse",
          description: "Deep-Learning-Modelle dekonstruieren die Dokumentenarchitektur und identifizieren Verbindlichkeiten und kritische Daten in Millisekunden."
        },
        {
          title: "Strukturiertes Kommando",
          description: "Datengesteuerte Schnittstelle. Felder bearbeiten, Verantwortliche zuweisen und Verlängerungsrichtlinien in einer einheitlichen Konsole durchsetzen."
        }
      ]
    },
    bento: {
      title: "Das Enterprise Asset OS",
      subtitle: "Zentralisieren. Auditieren. Bereitstellen. Optimieren. Eine einheitliche Infrastruktur für Lizenzen, Abonnements, Dateien und Kapital.",
      ingestion: {
        title: "Forensische Erfassung",
        description: "Parst unstrukturierte Binärdaten. Validiert Entitäten. Erzwingt Datenintegrität.",
        processing: "Verarbeitung",
        validating: "Integrität prüfen...",
        results: {
          title: "Audit abgeschlossen",
          summaryLabel: "Executive Summary",
          summaryText: "Standard-Unternehmenslizenzvertrag. 99,9% SLA bestätigt. Risikostufe: Niedrig.",
          vendorLabel: "Entität",
          vendor: "Slack Technologies, LLC",
          valueLabel: "Kostenbasis",
          value: "14.500 € / Jahr"
        }
      },
      guard: {
        title: "Automatisches Audit",
        description: "Kontinuierliche Kostenanomalieerkennung. Keine Konfiguration erforderlich.",
        alert1: "Verlängerungswarnung",
        alert1Sub: "T-minus 30 Tage. Autorisierung erforderlich.",
        alert2: "Compliance-Prüfung",
        alert2Sub: "AVV-Prüfung ausstehend",
        alert3: "Budgetabweichung",
        alert3Sub: "Marketing Q1 > 105%",
        alert4: "Anbietererkennung",
        alert4Sub: "Linear Orbit Inc. identifiziert"
      },
      collab: {
        title: "Workflow-Orchestrierung",
        description: "Direkte Ressourcenbereitstellung. Granulare Berechtigungen. Einheitliche Asset-Ansicht.",
        list: [
          "Rechtsprüfungsprotokolle durchsetzen",
          "Genehmigungsketten verfolgen",
          "Anbieterzentrierte Asset-Ansicht"
        ],
        partnerCard: "Partner-Intelligenz",
        taskCard: {
          assigned: "@Sarah zugewiesen",
          task: "\"Haftung prüfen\"",
          due: "Fällig: T-24h"
        },
        taskCard2: {
          assigned: "@Mike zugewiesen",
          task: "\"Ausgaben genehmigen\"",
          due: "Fällig: Heute"
        }
      }
    },
    security: {
      encryption: {
        title: "Militärstandard-Verschlüsselung",
        desc: "AES-256 in Ruhe und Übertragung. Kompromissloser Datenschutz."
      },
      ai: {
        title: "Zero-Retention-Architektur",
        desc: "Ephemere Verarbeitung. Ihr geistiges Eigentum verlässt nie Ihre Kontrolle."
      },
      hosting: {
        title: "Sovereign Infrastruktur",
        desc: "Strenge Datenresidenz. DSGVO-konformer Backbone."
      }
    },
    teams: {
      title: "Präzisionsinfrastruktur",
      titleHighlight: "Für Skalierung entwickelt.",
      subtitle: "Hochleistungstools für das moderne Unternehmen. Verwandeln Sie statische Vereinbarungen in eine abfragbare Asset-Datenbank.",
      cta: "Architektur bereitstellen",
      legal: {
        title: "Algorithmisches Audit",
        desc: "Erkennen Sie unautorisierte Ausgabenmuster und Vertragsabweichungen mit 99,9% Genauigkeit."
      },
      procurement: {
        title: "Datenstrukturierung",
        desc: "Konvertieren Sie PDF-Binärdaten in abfragbare, SQL-fähige Datensätze für sofortige Analysen."
      },
      hr: {
        title: "Kapitalrückgewinnung",
        desc: "Identifizieren und fordern Sie durchschnittlich 12% Budgetverluste aus Zombie-Abonnements zurück."
      },
      finance: {
        title: "Sicherheitsarchitektur",
        desc: "AES-256-Verschlüsselung. Granulare Zugriffskontrolle. Zero-Trust-Architektur."
      },
      grc: {
        title: "Compliance-Durchsetzung",
        desc: "Automatisierte AVV-Verifizierung und regulatorische Konformitätsprüfungen."
      },
      ops: {
        title: "Operative Geschwindigkeit",
        desc: "Reduzieren Sie die Vertragsdurchlaufzeit um 40% durch automatisierte Workflows und API-Integration."
      }
    },
    contact: {
      title: "Bereitstellung initiieren",
      subtitle: "Anforderungen auf Unternehmensebene? Unser Engineering-Team ist bereit.",
      name: "Name des Verantwortlichen",
      email: "Geschäftliche E-Mail",
      message: "Anweisungen",
      placeholder: "Skizzieren Sie Ihre operativen Anforderungen...",
      send: "Übermitteln",
      sending: "Übertrage...",
      sentTitle: "Übertragung empfangen",
      sentDesc: "Wir werden innerhalb von 24 operativen Stunden antworten.",
      sendAnother: "Neue Anweisung senden"
    },
    footer: {
      ctaTitle: "Operatives Versagen ist eine Wahl.",
      ctaButton: "Infrastruktur sichern",
      rights: "Alle Rechte vorbehalten.",
      privacy: "Datenschutzprotokoll",
      terms: "Nutzungsbedingungen"
    },
    cookieConsent: {
      text: "SYSTEMHINWEIS: Diese Schnittstelle verwendet Cookies zur Aufrechterhaltung der Sitzungsintegrität und Leistungsoptimierung.",
      accept: "BESTÄTIGEN",
      decline: "ABLEHNEN"
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
