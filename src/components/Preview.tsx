import React, { useState, useRef, useEffect } from 'react';
import { Eye, Code, FileText, Download, Copy, Check } from 'lucide-react';
import { Document } from '../types';

interface PreviewProps {
  document: Document;
}

type PreviewMode = 'visual' | 'html' | 'latex';

export const Preview: React.FC<PreviewProps> = ({ document }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('visual');
  const [copied, setCopied] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateHtmlPreview = () => {
    let html = `<div style="
      font-family: ${document.settings.fontFamily}, sans-serif;
      line-height: ${document.settings.lineSpacing};
      padding: ${document.settings.pageMargins}pt;
      max-width: 100%;
      background: white;
      color: #333;
    ">`;

    if (document.title) {
      html += `<h1 style="text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #1f2937;">${document.title}</h1>`;
    }

    document.blocks.forEach(block => {
      const blockHtml = blockToHtml(block);
      if (blockHtml) {
        html += blockHtml;
      }
    });

    html += '</div>';
    return html;
  };

  const blockToHtml = (block: any): string => {
    const style = `style="
      font-size: ${block.style.fontSize}px;
      font-weight: ${block.style.fontWeight};
      text-align: ${block.style.textAlign};
      color: ${block.style.color};
      margin-top: ${block.style.marginTop}px;
      margin-bottom: ${block.style.marginBottom}px;
      line-height: ${block.style.lineHeight};
      ${block.style.backgroundColor ? `background-color: ${block.style.backgroundColor};` : ''}
      ${block.style.italic ? 'font-style: italic;' : ''}
      ${block.style.underline ? 'text-decoration: underline;' : ''}
      ${block.style.strikethrough ? 'text-decoration: line-through;' : ''}
    "`;

    switch (block.type) {
      case 'heading':
        const level = Math.min(block.metadata?.level || 1, 6);
        return `<h${level} ${style}>${block.content}</h${level}>`;

      case 'paragraph':
        return `<p ${style}>${block.content}</p>`;

      case 'list':
        const listTag = block.metadata?.listType === 'numbered' ? 'ol' : 'ul';
        const items = block.content.split('\n').map((item: string) => `<li>${item}</li>`).join('');
        return `<${listTag} ${style} style="padding-left: 20px;">${items}</${listTag}>`;

      case 'quote':
        return `<blockquote ${style} style="border-left: 4px solid #e5e7eb; padding-left: 16px; font-style: italic; margin: 16px 0; color: #6b7280;">${block.content}</blockquote>`;

      case 'table':
        if (block.metadata?.tableData) {
          const rows = block.metadata.tableData.map((rowData: string[]) => 
            `<tr>${rowData.map(cell => `<td style="border: 1px solid #e5e7eb; padding: 8px;">${cell}</td>`).join('')}</tr>`
          ).join('');
          return `<table ${style} style="border-collapse: collapse; width: 100%; margin: 16px 0;"><tbody>${rows}</tbody></table>`;
        }
        return '';

      case 'divider':
        return `<hr ${style} style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">`;

      case 'image':
        return `<div ${style} style="text-align: center; padding: 20px; background: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; margin: 16px 0;">
          <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
          <div style="color: #6b7280; font-size: 14px;">Image Placeholder</div>
          <div style="color: #9ca3af; font-size: 12px; margin-top: 4px;">${block.content}</div>
        </div>`;

      default:
        return '';
    }
  };

  const generateLatexCode = () => {
    let latex = `\\documentclass{article}
\\usepackage[margin=${document.settings.pageMargins}pt]{geometry}
\\usepackage{graphicx}
\\usepackage{enumitem}
\\usepackage{array}
\\usepackage{longtable}
\\usepackage{xcolor}

\\title{${document.title}}
\\author{}
\\date{}

\\begin{document}
\\maketitle

`;

    document.blocks.forEach((block) => {
      switch (block.type) {
        case 'heading':
          const level = block.metadata?.level || 1;
          const sectionCommand = level === 1 ? 'section' : level === 2 ? 'subsection' : 'subsubsection';
          latex += `\\${sectionCommand}{${block.content}}\n\n`;
          break;
          
        case 'paragraph':
          latex += `${block.content}\n\n`;
          break;
          
        case 'list':
          const listType = block.metadata?.listType === 'numbered' ? 'enumerate' : 'itemize';
          latex += `\\begin{${listType}}\n`;
          block.content.split('\n').forEach((item: string) => {
            latex += `  \\item ${item}\n`;
          });
          latex += `\\end{${listType}}\n\n`;
          break;

        case 'quote':
          latex += `\\begin{quote}\n${block.content}\n\\end{quote}\n\n`;
          break;

        case 'table':
          if (block.metadata?.tableData) {
            const cols = block.metadata.tableData[0]?.length || 1;
            latex += `\\begin{tabular}{|${'c|'.repeat(cols)}}\n\\hline\n`;
            block.metadata.tableData.forEach((row: string[]) => {
              latex += `${row.join(' & ')} \\\\\n\\hline\n`;
            });
            latex += `\\end{tabular}\n\n`;
          }
          break;
          
        case 'divider':
          latex += `\\hrule\n\n`;
          break;
          
        case 'image':
          latex += `\\begin{figure}[h]\n  \\centering\n  % Insert image here\n  \\caption{${block.content}}\n\\end{figure}\n\n`;
          break;
      }
    });

    latex += '\\end{document}';
    return latex;
  };

  const handleCopy = async () => {
    const content = previewMode === 'latex' ? generateLatexCode() : generateHtmlPreview();
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const getPreviewContent = () => {
    switch (previewMode) {
      case 'visual':
        return (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: generateHtmlPreview() }}
          />
        );
      case 'html':
        return (
          <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-lg border font-mono leading-relaxed whitespace-pre-wrap overflow-auto">
            {generateHtmlPreview()}
          </pre>
        );
      case 'latex':
        return (
          <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded-lg border font-mono leading-relaxed whitespace-pre-wrap overflow-auto">
            {generateLatexCode()}
          </pre>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title="Copy content"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
        
        <div className="flex space-x-1">
          <button
            onClick={() => setPreviewMode('visual')}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
              previewMode === 'visual'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Visual</span>
          </button>
          
          <button
            onClick={() => setPreviewMode('html')}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
              previewMode === 'html'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>HTML</span>
          </button>
          
          <button
            onClick={() => setPreviewMode('latex')}
            className={`flex items-center space-x-1 px-2 py-1 text-xs rounded transition-colors ${
              previewMode === 'latex'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>LaTeX</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto" ref={previewRef}>
        {getPreviewContent()}
      </div>
    </div>
  );
};