import React, { useState, useRef } from 'react';
import { Eye, Code, FileText, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { Document } from '../types';

interface PreviewProps {
  document: Document;
}

type PreviewMode = 'visual' | 'html' | 'latex';

export const Preview: React.FC<PreviewProps> = ({ document }) => {
  const [previewMode, setPreviewMode] = useState<PreviewMode>('visual');
  const [copied, setCopied] = useState(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const generateHtmlPreview = () => {
    let html = `<div style="
      font-family: 'Times New Roman', serif;
      line-height: 1.6;
      padding: 40px;
      max-width: 210mm;
      min-height: 297mm;
      margin: 0 auto;
      background: white;
      color: #000;
      box-shadow: 0 0 10px rgba(0,0,0,0.1);
      page-break-inside: avoid;
    ">`;

    if (document.title) {
      html += `<h1 style="text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 30px; color: #000; font-family: 'Times New Roman', serif;">${document.title}</h1>`;
    }

    document.blocks.forEach((block, index) => {
      const blockHtml = blockToHtml(block);
      if (blockHtml) {
        // Add page break hints for major sections
        if (block.type === 'heading' && block.metadata?.level === 1 && index > 0) {
          html += '<div style="page-break-before: auto; margin-top: 40px;"></div>';
        }
        html += blockHtml;
      }
    });

    html += '</div>';
    return html;
  };

  const blockToHtml = (block: any): string => {
    // Use Times New Roman and proper academic formatting
    const baseStyle = `
      font-family: 'Times New Roman', serif;
      color: #000;
      margin-top: ${block.style.marginTop || 12}px;
      margin-bottom: ${block.style.marginBottom || 12}px;
      line-height: 1.6;
    `;

    switch (block.type) {
      case 'heading':
        const level = Math.min(block.metadata?.level || 1, 6);
        const fontSize = level === 1 ? '16px' : level === 2 ? '14px' : '13px';
        const marginTop = level === 1 ? '30px' : '20px';
        const marginBottom = level === 1 ? '20px' : '15px';
        const headingAlign = level === 1 ? 'center' : 'left';
        const fontWeight = 'bold';
        
        return `<h${level} style="${baseStyle} font-size: ${fontSize}; font-weight: ${fontWeight}; text-align: ${headingAlign}; margin-top: ${marginTop}; margin-bottom: ${marginBottom}; page-break-after: avoid;">${block.content}</h${level}>`;

      case 'paragraph':
        const paragraphAlign = block.style.textAlign === 'center' ? 'center' : 'justify';
        return `<p style="${baseStyle} font-size: ${block.style.fontSize || 12}px; text-align: ${paragraphAlign}; text-indent: ${paragraphAlign === 'justify' ? '0.5in' : '0'};">${block.content}</p>`;

      case 'list':
        const listTag = block.metadata?.listType === 'numbered' ? 'ol' : 'ul';
        const items = block.content.split('\n').map((item: string) => 
          `<li style="margin-bottom: 6px; text-align: justify;">${item}</li>`
        ).join('');
        return `<${listTag} style="${baseStyle} padding-left: 0.5in; margin-left: 0;">${items}</${listTag}>`;

      case 'quote':
        return `<blockquote style="${baseStyle} border-left: none; padding-left: 0.5in; padding-right: 0.5in; font-style: italic; text-align: justify; margin: 20px 0;">${block.content}</blockquote>`;

      case 'table':
        if (block.metadata?.tableData) {
          const rows = block.metadata.tableData.map((rowData: string[]) => 
            `<tr>${rowData.map(cell => `<td style="border: 1px solid #000; padding: 8px; text-align: center; font-size: 12px;">${cell}</td>`).join('')}</tr>`
          ).join('');
          return `<table style="${baseStyle} border-collapse: collapse; width: 100%; margin: 20px 0; border: 1px solid #000;"><tbody>${rows}</tbody></table>`;
        }
        return '';

      case 'divider':
        return `<hr style="${baseStyle} border: none; border-top: 1px solid #000; margin: 30px 0; width: 100%;">`;

      case 'pagebreak':
        return `<div style="page-break-before: always; height: 0; margin: 0; padding: 0;"></div>`;

      case 'image':
        return `<div style="${baseStyle} text-align: center; padding: 20px; margin: 20px 0; page-break-inside: avoid;">
          <div style="border: 1px solid #ccc; padding: 20px; background: #f9f9f9;">
            <div style="font-size: 48px; margin-bottom: 8px;">📷</div>
            <div style="color: #666; font-size: 12px; font-style: italic;">Figure: ${block.content}</div>
          </div>
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
    <>
      {/* Full Page Modal */}
      {isFullPage && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="flex-shrink-0 p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Full Page Preview - {document.title}</h3>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <button
                    onClick={() => setPreviewMode('visual')}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                      previewMode === 'visual'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Visual</span>
                  </button>
                  
                  <button
                    onClick={() => setPreviewMode('html')}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                      previewMode === 'html'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>HTML</span>
                  </button>
                  
                  <button
                    onClick={() => setPreviewMode('latex')}
                    className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                      previewMode === 'latex'
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>LaTeX</span>
                  </button>
                </div>
                <button
                  onClick={() => setIsFullPage(false)}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                >
                  <Minimize2 className="w-4 h-4" />
                  <span>Exit Fullscreen</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto bg-gray-100 p-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg">
              {previewMode === 'visual' ? (
                <div 
                  className="prose prose-sm max-w-none min-h-screen"
                  style={{ 
                    fontFamily: 'Times New Roman, serif',
                    lineHeight: '1.6',
                    fontSize: '12px'
                  }}
                  dangerouslySetInnerHTML={{ __html: generateHtmlPreview() }}
                />
              ) : previewMode === 'html' ? (
                <pre className="text-xs text-gray-700 bg-gray-50 p-6 rounded-lg border font-mono leading-relaxed whitespace-pre-wrap overflow-auto min-h-screen">
                  {generateHtmlPreview()}
                </pre>
              ) : (
                <pre className="text-xs text-gray-700 bg-gray-50 p-6 rounded-lg border font-mono leading-relaxed whitespace-pre-wrap overflow-auto min-h-screen">
                  {generateLatexCode()}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Regular Sidebar Preview */}
      <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Live Preview</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsFullPage(!isFullPage)}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title={isFullPage ? "Exit fullscreen" : "View fullscreen"}
              >
                {isFullPage ? (
                  <>
                    <Minimize2 className="w-3 h-3" />
                    <span>Exit</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="w-3 h-3" />
                    <span>Full</span>
                  </>
                )}
              </button>
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
    </>
  );
};