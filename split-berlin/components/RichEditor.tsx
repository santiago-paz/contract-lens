'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Language } from '@/hooks/useTranslationSync';
import { Globe } from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  isReadOnly?: boolean;
  language: Language;
  availableLanguages: { code: Language; label: string }[];
  onLanguageChange: (lang: Language) => void;
  className?: string;
  label?: string; // Keeping label prop optional if we want a static title override
}

const RichEditor = ({ 
  content, 
  onChange, 
  isReadOnly = false, 
  language, 
  availableLanguages,
  onLanguageChange,
  className,
  label
}: RichEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Escribe aquí...',
      }),
    ],
    content: content,
    editable: !isReadOnly,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync external content changes to editor
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      const isFocused = editor.isFocused;
      if (!isFocused) {
         editor.commands.setContent(content, false);
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden h-full", className)}>
      <div className="bg-gray-50 border-b px-4 py-2 flex justify-between items-center min-h-[50px]">
        
        {/* Language Selector in Header */}
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            value={language} 
            onChange={(e) => onLanguageChange(e.target.value as Language)}
            className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:ring-0 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 transition-colors"
          >
            {availableLanguages.map(l => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-gray-400 font-mono tracking-wider">{language.toUpperCase()}</span>
      </div>
      
      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditor;
