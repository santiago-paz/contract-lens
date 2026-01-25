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
    }
  }
};

export type Translation = typeof translations.es;

export const getTranslations = (lang: keyof typeof translations = 'es') => {
  return translations[lang];
};
