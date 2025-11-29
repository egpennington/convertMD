import React, { useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
  Link as LinkIcon
} from 'lucide-react';

interface RichTextEditorProps {
  initialHtml: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  initialHtml, 
  onChange,
  placeholder = "Start typing..." 
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  // Sync initial content once or when externally changed significantly
  // (We skip this if the change came from the editor itself to avoid cursor jumps)
  useEffect(() => {
    if (editorRef.current && !isInternalChange.current && initialHtml !== editorRef.current.innerHTML) {
      if (initialHtml === '' && editorRef.current.innerHTML === '<br>') return;
      editorRef.current.innerHTML = initialHtml;
    }
  }, [initialHtml]);

  const handleInput = () => {
    if (editorRef.current) {
      isInternalChange.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      // Reset flag after a tick
      setTimeout(() => { isInternalChange.current = false; }, 0);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
    }
    handleInput();
  };

  // Helper for toolbar buttons
  const ToolbarButton = ({ icon: Icon, label, command, value }: any) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss
        execCommand(command, value);
      }}
      title={label}
      className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100 focus:outline-none transition-colors"
    >
      <Icon className="h-4 w-4" />
    </button>
  );

  return (
    <div className="flex h-full flex-col">
      {/* Rich Text Toolbar */}
      <div className="flex flex-none items-center gap-1 border-b border-gray-800 bg-gray-900 px-2 py-1 overflow-x-auto no-scrollbar">
        <ToolbarButton icon={Bold} label="Bold" command="bold" />
        <ToolbarButton icon={Italic} label="Italic" command="italic" />
        <ToolbarButton icon={Underline} label="Underline" command="underline" />
        
        <div className="mx-1 h-5 w-px bg-gray-700 flex-none" />
        
        <ToolbarButton icon={Heading1} label="Heading 1" command="formatBlock" value="H1" />
        <ToolbarButton icon={Heading2} label="Heading 2" command="formatBlock" value="H2" />
        
        <div className="mx-1 h-5 w-px bg-gray-700 flex-none" />
        
        <ToolbarButton icon={List} label="Bulleted List" command="insertUnorderedList" />
        <ToolbarButton icon={ListOrdered} label="Numbered List" command="insertOrderedList" />
        <ToolbarButton icon={Quote} label="Quote" command="formatBlock" value="BLOCKQUOTE" />
        <ToolbarButton icon={Code} label="Code Block" command="formatBlock" value="PRE" />
        
        <div className="mx-1 h-5 w-px bg-gray-700 flex-none" />

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = prompt("Enter link URL:");
            if (url) execCommand("createLink", url);
          }}
          title="Link"
          className="rounded p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-100 focus:outline-none transition-colors"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Content Editable Area */}
      <div className="relative flex-1 bg-gray-950">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          className="h-full w-full overflow-y-auto p-4 text-gray-300 focus:outline-none prose prose-invert prose-sm max-w-none"
          style={{ minHeight: '100px' }}
        />
        {/* Placeholder overlay if empty */}
        {!initialHtml && (
          <div className="pointer-events-none absolute top-4 left-4 text-gray-600">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
