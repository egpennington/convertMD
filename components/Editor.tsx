import React, { useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image as ImageIcon 
} from 'lucide-react';
import { EditorProps } from '../types';

interface ToolbarButton {
  icon: React.ElementType;
  label: string;
  action: () => void;
  divider?: boolean;
}

export const Editor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  isProcessing, 
  readOnly = false,
  showToolbar = true,
  placeholder = "Type here..."
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to insert wrapping characters (e.g., **text**)
  const insertFormat = (prefix: string, suffix: string = '') => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    const newText = before + prefix + selected + suffix + after;
    onChange(newText);

    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + selected.length + suffix.length;
      // If no text was selected, place cursor inside the tags
      if (start === end) {
         textarea.setSelectionRange(start + prefix.length, start + prefix.length);
      } else {
         textarea.setSelectionRange(start + prefix.length, end + prefix.length);
      }
    }, 0);
  };

  // Helper to insert block characters at the start of the line (e.g., # text)
  const insertBlock = (prefix: string) => {
    if (readOnly) return;
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const before = value.substring(0, start);
    
    // Find the start of the current line
    const lastNewLine = before.lastIndexOf('\n');
    const lineStart = lastNewLine === -1 ? 0 : lastNewLine + 1;
    
    const lineBefore = value.substring(0, lineStart);
    const lineRest = value.substring(lineStart);
    
    const newText = lineBefore + prefix + lineRest;
    onChange(newText);
    
    setTimeout(() => {
      textarea.focus();
      // Move cursor to keep position relative to text
      const newPos = start + prefix.length;
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const toolbarItems: (ToolbarButton | { divider: true })[] = [
    { icon: Bold, label: 'Bold', action: () => insertFormat('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertFormat('_', '_') },
    { icon: Underline, label: 'Underline', action: () => insertFormat('<u>', '</u>') },
    { divider: true },
    { icon: Heading1, label: 'Heading 1', action: () => insertBlock('# ') },
    { icon: Heading2, label: 'Heading 2', action: () => insertBlock('## ') },
    { icon: Heading3, label: 'Heading 3', action: () => insertBlock('### ') },
    { divider: true },
    { icon: List, label: 'Bulleted List', action: () => insertBlock('- ') },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertBlock('1. ') },
    { icon: Quote, label: 'Blockquote', action: () => insertBlock('> ') },
    { divider: true },
    { icon: Code, label: 'Code Block', action: () => insertFormat('```\n', '\n```') },
    { icon: LinkIcon, label: 'Link', action: () => insertFormat('[', '](url)') },
    { icon: ImageIcon, label: 'Image', action: () => insertFormat('![alt text](', ')') },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Editor Toolbar */}
      {showToolbar && !readOnly && (
        <div className="flex flex-none items-center justify-between border-b border-gray-800 bg-gray-900 px-2 py-1">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {toolbarItems.map((item, index) => {
              if ('divider' in item) {
                return <div key={index} className="mx-1 h-5 w-px bg-gray-700 flex-none" />;
              }
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.action}
                  title={item.label}
                  className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-1 focus:ring-gray-700 flex-none transition-colors"
                  disabled={isProcessing}
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
          </div>
          <div className="hidden shrink-0 text-xs font-medium text-gray-600 sm:block ml-4">
            {value.length} chars
          </div>
        </div>
      )}

      {/* ReadOnly Header (Optional aesthetic) */}
      {readOnly && (
        <div className="flex flex-none items-center justify-between border-b border-gray-800 bg-gray-900 px-4 py-2">
           <span className="text-xs font-medium uppercase tracking-wider text-gray-500">Markdown Output</span>
           <span className="text-xs font-medium text-gray-600">{value.length} chars</span>
        </div>
      )}

      <textarea
        ref={textareaRef}
        className={`h-full w-full resize-none bg-gray-950 p-4 font-mono text-sm text-gray-300 focus:outline-none disabled:opacity-50 ${readOnly ? 'cursor-text' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={isProcessing && !readOnly}
        readOnly={readOnly}
        spellCheck={false}
      />
    </div>
  );
};