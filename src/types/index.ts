export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'divider' | 'table' | 'quote';
  content: string;
  style: {
    fontSize: number;
    fontWeight: 'normal' | 'bold' | 'semibold';
    textAlign: 'left' | 'center' | 'right' | 'justify';
    color: string;
    backgroundColor?: string;
    marginTop: number;
    marginBottom: number;
    lineHeight: number;
    fontFamily?: string;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
  };
  metadata?: {
    level?: number; // for headings
    listType?: 'bullet' | 'numbered'; // for lists
    imageUrl?: string; // for images
    imageWidth?: number;
    imageHeight?: number;
    tableRows?: number;
    tableCols?: number;
    tableData?: string[][];
  };
}

export interface Document {
  id: string;
  title: string;
  template: string;
  blocks: ContentBlock[];
  lastModified: Date;
  settings: {
    pageMargins: number;
    pageSize: 'A4' | 'Letter' | 'Legal';
    fontFamily: string;
    pageOrientation: 'portrait' | 'landscape';
    lineSpacing: number;
    headerText?: string;
    footerText?: string;
  };
}

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  blocks: Omit<ContentBlock, 'id'>[];
}

export type ExportFormat = 'docx' | 'pdf' | 'html' | 'markdown' | 'latex' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  includeStyles: boolean;
  pageBreaks: boolean;
  tableOfContents: boolean;
}