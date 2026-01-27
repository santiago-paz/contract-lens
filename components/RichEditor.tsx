'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered 
} from 'lucide-react';
import { useEffect } from 'react';

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  editable?: boolean;
}

const RichEditor = ({ 
  content, 
  onChange, 
  placeholder, 
  className,
  editable = true
}: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: placeholder || 'Type something...',
      }),
    ],
    content: content,
    editable: editable,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[100px] px-3 py-2',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false
  });

  // Update content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      // Only update if content is different to avoid cursor jumps
      // This is a naive check, for production might need better diffing
      // or only update on blur / distinct actions if two-way binding is heavy
      if (editor.getText() === '' && content === '') return;
       
      // If the content is drastically different, set it.
      // Ideally we rely on initial content and internal state for simple forms
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden bg-white ${className}`}>
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('strike') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <Strikethrough className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('underline') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1"></div>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 hover:bg-gray-200 rounded ${editor.isActive('orderedList') ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
          type="button"
          disabled={!editable}
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichEditor;
