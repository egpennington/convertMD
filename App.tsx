import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, LayoutMode } from './types';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { RichTextEditor } from './components/RichTextEditor';
import { convertToMarkdown } from './services/geminiService';

// Declare TurndownService on window for TypeScript
declare global {
  interface Window {
    TurndownService: any;
  }
}

const DEFAULT_MARKDOWN = `# Welcome to ConvertMD

Start typing on the left to see the **live preview** on the right.

- Use the **Auto-Format** button to magically structure your text.
- **Switch Modes** to use the Rich Text visual editor.
- **Import** text or DOCX files to edit them.

\`\`\`javascript
console.log("Happy Writing!");
\`\`\`
`;

const DEFAULT_RICH_TEXT = `<p>Type in <b>Rich Text</b> here.</p><ul><li>We will convert it</li><li>to Markdown automatically.</li></ul>`;

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.MARKDOWN_EDITOR);
  const [layout, setLayout] = useState<LayoutMode>(LayoutMode.SIDE_BY_SIDE);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Content state for Editor Mode (Markdown Input)
  const [markdownContent, setMarkdownContent] = useState<string>(DEFAULT_MARKDOWN);
  
  // Content state for Converter Mode (Rich Text Input)
  const [richTextContent, setRichTextContent] = useState<string>(DEFAULT_RICH_TEXT);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  
  // Real-time Sync for Rich Text to Markdown
  useEffect(() => {
    if (mode === AppMode.TEXT_CONVERTER) {
      if (window.TurndownService) {
        const turndownService = new window.TurndownService({
          headingStyle: 'atx',
          codeBlockStyle: 'fenced'
        });
        const md = turndownService.turndown(richTextContent);
        setGeneratedMarkdown(md);
      } else {
        setGeneratedMarkdown("Loading converter...");
      }
    }
  }, [richTextContent, mode]);

  const setActiveContent = (newContent: string) => {
    if (mode === AppMode.MARKDOWN_EDITOR) {
      setMarkdownContent(newContent);
    } else {
      // In Converter mode, newContent is HTML from RichTextEditor or File Upload
      setRichTextContent(newContent);
    }
  };

  const handleMagicConvert = async () => {
    // Only used for Auto-Format in Markdown Editor mode now
    if (mode !== AppMode.MARKDOWN_EDITOR) return;

    const contentToProcess = markdownContent;
    if (!contentToProcess.trim()) return;
    
    setIsProcessing(true);
    try {
      const formatted = await convertToMarkdown(contentToProcess);
      setMarkdownContent(formatted);
    } catch (error) {
      alert("Failed to auto-format. Please check your API key.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the editor?")) {
      setActiveContent('');
      if (mode === AppMode.TEXT_CONVERTER) {
        setGeneratedMarkdown('');
      }
    }
  };

  const handleCopy = useCallback(() => {
    const textToCopy = mode === AppMode.MARKDOWN_EDITOR 
      ? markdownContent 
      : generatedMarkdown;

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('Copied to clipboard');
    });
  }, [mode, markdownContent, generatedMarkdown]);

  const handleDownload = useCallback(() => {
    const textToDownload = mode === AppMode.MARKDOWN_EDITOR 
      ? markdownContent 
      : generatedMarkdown;

    const blob = new Blob([textToDownload], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [mode, markdownContent, generatedMarkdown]);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-950 text-gray-100">
      <Toolbar 
        layout={layout}
        mode={mode}
        onToggleLayout={setLayout}
        onToggleMode={setMode}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onUpload={setActiveContent}
        onMagicConvert={handleMagicConvert}
        onClear={handleClear}
        isProcessing={isProcessing}
      />

      <main className={`flex flex-1 overflow-hidden ${
        layout === LayoutMode.SIDE_BY_SIDE ? 'flex-row' : 'flex-col'
      }`}>
        {/* Left Pane: Input */}
        <div className={`
          border-gray-800
          ${layout === LayoutMode.SIDE_BY_SIDE 
            ? 'w-1/2 border-r h-full' 
            : 'h-1/2 border-b w-full'
          }
        `}>
          {mode === AppMode.MARKDOWN_EDITOR ? (
            <Editor 
              value={markdownContent} 
              onChange={setMarkdownContent} 
              isProcessing={isProcessing}
              showToolbar={true}
              placeholder="Type Markdown..."
            />
          ) : (
            <RichTextEditor
              initialHtml={richTextContent}
              onChange={setRichTextContent}
              placeholder="Type formatted text here..."
            />
          )}
        </div>

        {/* Right Pane: Output */}
        <div className={`
          ${layout === LayoutMode.SIDE_BY_SIDE 
            ? 'w-1/2 h-full' 
            : 'h-1/2 w-full'
          }
        `}>
          {mode === AppMode.MARKDOWN_EDITOR ? (
            <Preview content={markdownContent} />
          ) : (
            <Editor 
              value={generatedMarkdown} 
              onChange={setGeneratedMarkdown}
              isProcessing={false}
              readOnly={false} // Allows user to tweak the markdown manually if needed
              showToolbar={false} // We don't need the format toolbar here as it's the "output" code
              placeholder="Markdown output will appear here..."
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
