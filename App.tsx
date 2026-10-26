
import React, { useState, useCallback, useEffect } from 'react';
import { AppMode, LayoutMode } from './types';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { RichTextEditor } from './components/RichTextEditor';
import { formatMarkdown } from './services/formatService';
import { DownloadModal, sanitizeFileName } from './components/DownloadModal';
import { CheckCircle2 } from 'lucide-react';

// Declare TurndownService on window for TypeScript
declare global {
  interface Window {
    TurndownService: any;
  }
}

const DEFAULT_MARKDOWN = `# Welcome to ConvertMD

Start typing on the left to see the **live preview** on the right.

- Use the **Auto-Format** button to clean up your markdown syntax locally.
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
  
  // Document file name (user-customizable)
  const [fileName, setFileName] = useState<string>('document');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Content state for Editor Mode (Markdown Input)
  const [markdownContent, setMarkdownContent] = useState<string>(DEFAULT_MARKDOWN);
  
  // Content state for Converter Mode (Rich Text Input)
  const [richTextContent, setRichTextContent] = useState<string>(DEFAULT_RICH_TEXT);
  const [generatedMarkdown, setGeneratedMarkdown] = useState<string>('');
  
  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((prev) => (prev === message ? null : prev));
    }, 2800);
  }, []);

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

  const setActiveContent = (newContent: string, uploadedFileName?: string) => {
    if (uploadedFileName) {
      const cleaned = sanitizeFileName(uploadedFileName);
      if (cleaned) {
        setFileName(cleaned);
        showToast(`Imported ${cleaned}`);
      }
    }
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
      const formatted = await formatMarkdown(contentToProcess);
      setMarkdownContent(formatted);
      showToast("Auto-formatted markdown!");
    } catch (error) {
      console.error("Formatting error", error);
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
      showToast('Copied to clipboard!');
    }).catch(() => {
      showToast('Failed to copy');
    });
  }, [mode, markdownContent, generatedMarkdown, showToast]);

  const handleOpenDownloadModal = useCallback(() => {
    setIsDownloadModalOpen(true);
  }, []);

  const handleConfirmDownload = useCallback((chosenName: string, format: 'md' | 'txt' | 'html') => {
    const cleanName = sanitizeFileName(chosenName) || 'document';
    setFileName(cleanName);

    const rawMarkdown = mode === AppMode.MARKDOWN_EDITOR 
      ? markdownContent 
      : generatedMarkdown;

    let contentToSave = rawMarkdown;
    let mimeType = 'text/markdown;charset=utf-8';

    if (format === 'txt') {
      contentToSave = rawMarkdown;
      mimeType = 'text/plain;charset=utf-8';
    } else if (format === 'html') {
      const htmlBody = mode === AppMode.TEXT_CONVERTER 
        ? richTextContent 
        : (document.querySelector('.markdown-body')?.innerHTML || `<pre>${rawMarkdown}</pre>`);

      contentToSave = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cleanName}</title>
  <style>
    body { font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1f2937; }
    h1, h2, h3, h4 { color: #111827; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 0.9em; }
    pre { background: #1f2937; color: #f9fafb; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; color: inherit; padding: 0; }
    blockquote { border-left: 4px solid #3b82f6; margin: 0; padding-left: 16px; color: #4b5563; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
    th { background: #f9fafb; }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;
      mimeType = 'text/html;charset=utf-8';
    }

    const blob = new Blob([contentToSave], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${cleanName}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Downloaded ${cleanName}.${format}`);
  }, [mode, markdownContent, generatedMarkdown, richTextContent, showToast]);

  const activeContent = mode === AppMode.MARKDOWN_EDITOR ? markdownContent : generatedMarkdown;
  const wordCount = activeContent.trim() ? activeContent.trim().split(/\s+/).length : 0;
  const contentLength = activeContent.length;

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-gray-950 text-gray-100 relative">
      <Toolbar 
        layout={layout}
        mode={mode}
        onToggleLayout={setLayout}
        onToggleMode={setMode}
        onCopy={handleCopy}
        onDownload={handleOpenDownloadModal}
        onUpload={setActiveContent}
        onMagicConvert={handleMagicConvert}
        onClear={handleClear}
        isProcessing={isProcessing}
        fileName={fileName}
        onFileNameChange={setFileName}
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

      {/* Download Modal with Custom Filename */}
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        initialFileName={fileName}
        onDownload={handleConfirmDownload}
        contentLength={contentLength}
        wordCount={wordCount}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-xs sm:text-sm font-medium text-white shadow-xl">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;