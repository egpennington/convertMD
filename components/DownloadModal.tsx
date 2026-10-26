import React, { useState, useEffect, useRef } from 'react';
import { Download, X, FileCode, FileText, Globe } from 'lucide-react';
import { Button } from './Button';

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFileName: string;
  onDownload: (fileName: string, format: 'md' | 'txt' | 'html') => void;
  contentLength: number;
  wordCount: number;
}

export const sanitizeFileName = (name: string): string => {
  // Strip characters illegal in filenames across OSes: \ / : * ? " < > |
  const cleaned = name.replace(/[\\/:*?"<>|]/g, '');
  return cleaned.replace(/^\.+/, '').trim();
};

export const DownloadModal: React.FC<DownloadModalProps> = ({
  isOpen,
  onClose,
  initialFileName,
  onDownload,
  contentLength,
  wordCount
}) => {
  const [name, setName] = useState<string>(initialFileName || 'document');
  const [format, setFormat] = useState<'md' | 'txt' | 'html'>('md');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialFileName || 'document');
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, 50);
    }
  }, [isOpen, initialFileName]);

  if (!isOpen) return null;

  const validName = sanitizeFileName(name) || 'document';
  const fullFileName = `${validName}.${format}`;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onDownload(validName, format);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="download-modal-title"
    >
      <div 
        className="w-full max-w-md rounded-xl border border-gray-700 bg-gray-900 p-6 shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h2 id="download-modal-title" className="text-base font-semibold text-white">
                Download Document
              </h2>
              <p className="text-xs text-gray-400">
                Choose a custom name and file format
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="filename-input" className="block text-xs font-medium text-gray-300 mb-1.5">
              File Name
            </label>
            <div className="relative flex items-center">
              <input
                id="filename-input"
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="document"
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3.5 py-2.5 pr-16 text-sm text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                maxLength={100}
              />
              <span className="absolute right-3 font-mono text-xs font-semibold text-blue-400 pointer-events-none bg-gray-900/80 px-1.5 py-0.5 rounded border border-gray-700">
                .{format}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-gray-400">
              Will be saved as: <span className="font-mono text-gray-200 font-medium">{fullFileName}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormat('md')}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all ${
                  format === 'md'
                    ? 'border-blue-500 bg-blue-600/15 text-white shadow-sm ring-1 ring-blue-500'
                    : 'border-gray-700 bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <FileCode className="mb-1 h-4 w-4 text-blue-400" />
                <span>Markdown (.md)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('txt')}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all ${
                  format === 'txt'
                    ? 'border-blue-500 bg-blue-600/15 text-white shadow-sm ring-1 ring-blue-500'
                    : 'border-gray-700 bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <FileText className="mb-1 h-4 w-4 text-emerald-400" />
                <span>Text (.txt)</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat('html')}
                className={`flex flex-col items-center justify-center rounded-lg border p-2.5 text-xs font-medium transition-all ${
                  format === 'html'
                    ? 'border-blue-500 bg-blue-600/15 text-white shadow-sm ring-1 ring-blue-500'
                    : 'border-gray-700 bg-gray-800/60 text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                }`}
              >
                <Globe className="mb-1 h-4 w-4 text-amber-400" />
                <span>HTML (.html)</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-850 px-3 py-2 text-xs text-gray-400 border border-gray-800">
            <span>{wordCount} words</span>
            <span>{contentLength.toLocaleString()} characters</span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-800">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="text-xs flex items-center gap-1.5 px-4 py-2"
            >
              <Download className="h-4 w-4" />
              Download .{format}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};