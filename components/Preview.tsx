import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { PreviewProps } from '../types';

export const Preview: React.FC<PreviewProps> = ({ content }) => {
  return (
    <div className="flex h-full flex-col bg-gray-900">
      <div className="border-b border-gray-800 bg-gray-900/50 px-4 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
        <span>Markdown Preview</span>
      </div>
      <div className="h-full w-full overflow-y-auto p-8">
        <div className="markdown-body mx-auto max-w-none">
          {content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-600">
              <p className="text-lg">Preview will appear here</p>
              <p className="text-sm">Start typing or import a file</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};