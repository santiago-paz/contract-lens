'use client';

import { Language } from '@/hooks/useTranslationSync';
import { cn } from '@/lib/utils';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Globe, Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote } from 'lucide-react';
import { useEffect } from 'react';

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
        editor.commands.setContent(content, { emitUpdate: false });
      }
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("flex flex-col border rounded-lg shadow-sm bg-white overflow-hidden h-full", className)}>
      <div className="bg-gray-50 border-b flex flex-col">
        <div className="px-4 py-2 flex justify-between items-center border-b border-gray-100">
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

        {/* Formatting Toolbar */}
        <div className="px-2 py-1.5 flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bold') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('italic') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('strike') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('heading', { level: 1 }) ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('heading', { level: 2 }) ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-gray-300 mx-1" />

          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('bulletList') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('orderedList') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "p-1.5 rounded hover:bg-gray-200 transition-colors",
              editor.isActive('blockquote') ? "bg-gray-200 text-black" : "text-gray-600"
            )}
            title="Blockquote"
          >
            <Quote className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto cursor-text" onClick={() => editor.chain().focus().run()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default RichEditor;
