export const translations = {
  es: {
    common: {
      preview: "Vista Previa",
      export: "Exportar",
      confirmDelete: "¿Estás seguro de eliminar este nodo y sus hijos?",
    },
    header: {
      title: "Split-Berlin",
      subtitle: "Editor de Contratos Estructurados",
    },
    editor: {
      originalLanguage: "Idioma Original (A)",
      translationLanguage: "Traducción (B)",
      addNode: "Añadir",
      deleteNode: "Eliminar nodo",
      addRootSection: "Añadir nueva sección principal:",
      contentPlaceholder: "Contenido",
      translationPlaceholder: "Traducción",
      richEditorPlaceholder: "Escribe aquí...",
      nodeTypes: {
        title: "Título del Contrato",
        intro: "Introducción / Partes",
        clause: "Cláusula Principal",
        subclause: "Subcláusula",
        item: "Inciso",
        subitem: "Sub-inciso",
        final_clause: "Cláusula Final",
      }
    },
    defaults: {
      contractTitle: "CONTRATO DE SERVICIOS",
      contractTitleTranslation: "SERVICE AGREEMENT",
      introLeft: 'Entre Alpha Solutions Ltd. (el "Proveedor") y...',
      introRight: 'Between Alpha Solutions Ltd. (the "Provider") and...',
      clauseLeft: "OBJETO DEL CONTRATO",
      clauseRight: "PURPOSE OF THE AGREEMENT",
    },
    languages: {
      auto: "Detectar idioma (AUTO)",
      detected: "Detectado",
      en: "Inglés",
      es: "Español",
      de: "Alemán",
      fr: "Francés",
      it: "Italiano",
      pt: "Portugués",
    }
  },
  en: {
    common: {
      preview: "Preview",
      export: "Export",
      confirmDelete: "Are you sure you want to delete this node and its children?",
    },
    header: {
      title: "Split-Berlin",
      subtitle: "Structured Contract Editor",
    },
    editor: {
      originalLanguage: "Original Language (A)",
      translationLanguage: "Translation (B)",
      addNode: "Add",
      deleteNode: "Delete node",
      addRootSection: "Add new main section:",
      contentPlaceholder: "Content",
      translationPlaceholder: "Translation",
      richEditorPlaceholder: "Type here...",
      nodeTypes: {
        title: "Contract Title",
        intro: "Introduction / Parties",
        clause: "Main Clause",
        subclause: "Subclause",
        item: "Item",
        subitem: "Sub-item",
        final_clause: "Final Clause",
      }
    },
    defaults: {
      contractTitle: "SERVICE AGREEMENT",
      contractTitleTranslation: "CONTRATO DE SERVICIOS",
      introLeft: 'Between Alpha Solutions Ltd. (the "Provider") and...',
      introRight: 'Entre Alpha Solutions Ltd. (el "Proveedor") y...',
      clauseLeft: "PURPOSE OF THE AGREEMENT",
      clauseRight: "OBJETO DEL CONTRATO",
    },
    languages: {
      auto: "Detect Language (AUTO)",
      detected: "Detected",
      en: "English",
      es: "Spanish",
      de: "German",
      fr: "French",
      it: "Italian",
      pt: "Portuguese",
    }
  }
};

export type Translation = typeof translations.en;

export const getTranslations = (lang: keyof typeof translations = 'en') => {
  return translations[lang];
};
