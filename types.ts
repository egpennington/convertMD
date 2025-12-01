export enum LayoutMode {
  SIDE_BY_SIDE = 'SIDE_BY_SIDE',
  TOP_BOTTOM = 'TOP_BOTTOM'
}

export enum AppMode {
  MARKDOWN_EDITOR = 'MARKDOWN_EDITOR',
  TEXT_CONVERTER = 'TEXT_CONVERTER'
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  isProcessing: boolean;
  readOnly?: boolean;
  showToolbar?: boolean;
  placeholder?: string;
}

export interface PreviewProps {
  content: string;
}

export interface ToolbarProps {
  layout: LayoutMode;
  mode: AppMode;
  onToggleLayout: (mode: LayoutMode) => void;
  onToggleMode: (mode: AppMode) => void;
  onCopy: () => void;
  onDownload: () => void;
  onUpload: (content: string) => void;
  onMagicConvert: () => void;
  onClear: () => void;
  isProcessing: boolean;
  onLoadReadmeTemplate: () => void;
}