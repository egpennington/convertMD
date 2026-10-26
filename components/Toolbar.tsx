import React, { useRef } from 'react';
import { 
  ArrowDownToLine, 
  Copy, 
  Upload, 
  Wand2, 
  Columns2, 
  Rows2, 
  FileText, 
  Trash2,
  PenLine,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from './Button';
import { AppMode, LayoutMode, ToolbarProps } from '../types';

// Declare mammoth on window for TypeScript
declare global {
  interface Window {
    mammoth: any;
  }
}

export const Toolbar: React.FC<ToolbarProps> = ({
  layout,
  mode,
  onToggleLayout,
  onToggleMode,
  onCopy,
  onDownload,
  onUpload,
  onMagicConvert,
  onClear,
  isProcessing,
  fileName,
  onFileNameChange
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const dotIndex = file.name.lastIndexOf('.');
    const baseName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;

    if (lowerName.endsWith('.docx')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (window.mammoth) {
          // If in Rich Text mode, we want to preserve formatting as HTML
          const conversionPromise = mode === AppMode.TEXT_CONVERTER
            ? window.mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
            : window.mammoth.extractRawText({ arrayBuffer: arrayBuffer });

          conversionPromise
            .then((result: any) => {
              onUpload(result.value, baseName);
            })
            .catch((err: any) => {
              console.error("Docx parsing error", err);
              alert("Could not parse DOCX file. Please try a text file.");
            });
        } else {
          alert("Document parser is not loaded yet. Please try again in a moment.");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Default text handling
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text === 'string') {
          onUpload(text, baseName);
        }
      };
      reader.readAsText(file);
    }
    
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <header className="flex flex-col gap-4 border-b border-gray-800 bg-gray-900 p-4 sm:flex-row sm:items-center sm:justify-between">
      
      {/* Top Row / Left Side: Title, Document Name, and Mode Switcher */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white hidden md:block">ConvertMD</h1>
        </div>

        {/* Editable Document Name */}
        <div 
          className="flex items-center gap-1.5 rounded-lg bg-gray-800/90 border border-gray-700/80 px-2.5 py-1 text-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all"
          title="Document filename - click to rename"
        >
          <input
            type="text"
            value={fileName}
            onChange={(e) => onFileNameChange(e.target.value)}
            placeholder="document"
            aria-label="Document name"
            className="w-24 sm:w-32 md:w-40 bg-transparent text-gray-200 placeholder-gray-500 font-medium focus:outline-none text-xs sm:text-sm"
          />
          <span className="text-[11px] font-mono text-gray-400 select-none font-semibold">.md</span>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center rounded-lg bg-gray-800 p-1">
          <button
            onClick={() => onToggleMode(AppMode.MARKDOWN_EDITOR)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === AppMode.MARKDOWN_EDITOR 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <PenLine className="h-3.5 w-3.5" />
            Write Markdown
          </button>
          <button
            onClick={() => onToggleMode(AppMode.TEXT_CONVERTER)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
              mode === AppMode.TEXT_CONVERTER 
                ? 'bg-gray-700 text-white shadow-sm' 
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <ArrowRightLeft className="h-3.5 w-3.5" />
            Rich Text to MD
          </button>
        </div>
      </div>

      {/* Bottom Row / Right Side: Tools */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
        
        {/* Layout Toggles */}
        <div className="flex items-center gap-1 border-r border-gray-700 pr-2 mr-2">
          <Button 
            variant="ghost" 
            onClick={() => onToggleLayout(LayoutMode.SIDE_BY_SIDE)}
            title="Side by Side View"
            className={layout === LayoutMode.SIDE_BY_SIDE ? 'bg-gray-800 text-blue-400' : ''}
          >
            <Columns2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onToggleLayout(LayoutMode.TOP_BOTTOM)}
            title="Top and Bottom View"
            className={layout === LayoutMode.TOP_BOTTOM ? 'bg-gray-800 text-blue-400' : ''}
          >
            <Rows2 className="h-4 w-4" />
          </Button>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".txt,.md,.csv,.json,.js,.ts,.tsx,.html,.css,.docx"
          onChange={handleFileChange}
        />

        <Button variant="secondary" onClick={triggerFileUpload} title="Upload Text or DOCX">
          <Upload className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <Button variant="ghost" onClick={onClear} title="Clear Editor" className="text-red-400 hover:text-red-300 hover:bg-gray-800">
          <Trash2 className="h-4 w-4" />
        </Button>

        {/* Only show 'Auto-Format' in Markdown Editor mode. In Converter mode, it's real-time. */}
        {mode === AppMode.MARKDOWN_EDITOR && (
          <Button 
            variant="primary" 
            onClick={onMagicConvert} 
            loading={isProcessing}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none min-w-[140px]"
          >
            <Wand2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Auto-Format</span>
            <span className="sm:hidden">Format</span>
          </Button>
        )}

        <div className="flex items-center gap-1.5 border-l border-gray-700 pl-2 ml-2">
          <Button variant="ghost" onClick={onCopy} title="Copy Output to Clipboard">
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="secondary" 
            onClick={onDownload} 
            title={`Download as ${fileName.trim() || 'document'}.md`}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-blue-500/30 bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 hover:text-white"
          >
            <ArrowDownToLine className="h-4 w-4 text-blue-400" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
