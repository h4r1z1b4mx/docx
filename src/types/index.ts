export interface ContentBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'divider' | 'table' | 'quote' | 'pagebreak';
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

// Academic Report Types
export interface StudentInfo {
  name: string;
  registerNumber: string;
  department: string;
  year?: string;
  section?: string;
}

export interface SupervisorInfo {
  name: string;
  designation: string;
  department: string;
}

export interface HodInfo {
  name: string;
  department: string;
}

export interface IndustryGuideInfo {
  name: string;
  designation: string;
  company: string;
}

export interface Reference {
  authors: string[];
  title: string;
  journal?: string;
  conference?: string;
  year: number;
  pages?: string;
  publisher?: string;
  volume?: string;
  issue?: string;
  doi?: string;
  url?: string;
}

export interface AcademicReportData {
  projectTitle: string;
  projectType: 'Major Project' | 'Mini Project' | 'Internship Report' | 'Thesis';
  academicYear: string;
  submissionDate: string;
  students: StudentInfo[];
  supervisor: SupervisorInfo;
  hod: HodInfo;
  industryGuide?: IndustryGuideInfo;
  abstract: {
    background: string;
    objectives: string;
    methodology: string;
    results: string;
    conclusions: string;
    keywords: string[];
  };
  chapters: {
    introduction: string;
    literatureSurvey: string;
    objectives: string;
    methodology: string;
    proposedWork: string;
    results: string;
    conclusions: string;
    futureWork: string;
  };
  references: Reference[];
}