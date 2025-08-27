import { Document as DocxDocument, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, ContentBlock, ExportOptions } from '../types';

export class DocumentExporter {
  private document: Document;
  private options: ExportOptions;

  constructor(document: Document, options: ExportOptions) {
    this.document = document;
    this.options = options;
  }

  async export(): Promise<void> {
    switch (this.options.format) {
      case 'docx':
        await this.exportToDocx();
        break;
      case 'pdf':
        await this.exportToPdf();
        break;
      case 'html':
        this.exportToHtml();
        break;
      case 'markdown':
        this.exportToMarkdown();
        break;
      case 'latex':
        this.exportToLatex();
        break;
      case 'txt':
        this.exportToText();
        break;
      default:
        throw new Error(`Unsupported export format: ${this.options.format}`);
    }
  }

  private async exportToDocx(): Promise<void> {
    const children: (Paragraph | Table)[] = [];

    // Add title
    if (this.document.title) {
      children.push(
        new Paragraph({
          text: this.document.title,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        })
      );
    }

    // Process blocks
    for (const block of this.document.blocks) {
      const docxElement = this.blockToDocx(block);
      if (docxElement) {
        if (Array.isArray(docxElement)) {
          children.push(...docxElement);
        } else {
          children.push(docxElement);
        }
      }
    }

    const doc = new DocxDocument({
      sections: [{
        properties: {
          page: {
            margin: {
              top: this.document.settings.pageMargins * 20,
              right: this.document.settings.pageMargins * 20,
              bottom: this.document.settings.pageMargins * 20,
              left: this.document.settings.pageMargins * 20,
            },
          },
        },
        children,
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([new Uint8Array(buffer)], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, `${this.document.title.replace(/\s+/g, '_')}.docx`);
  }

  private blockToDocx(block: ContentBlock): Paragraph | Table | Paragraph[] | null {
    const alignment = this.getDocxAlignment(block.style.textAlign);
    
    switch (block.type) {
      case 'heading':
        const level = Math.min(block.metadata?.level || 1, 6) as 1 | 2 | 3 | 4 | 5 | 6;
        const headingLevels = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
          4: HeadingLevel.HEADING_4,
          5: HeadingLevel.HEADING_5,
          6: HeadingLevel.HEADING_6,
        };
        
        return new Paragraph({
          text: block.content,
          heading: headingLevels[level],
          alignment,
        });

      case 'paragraph':
        return new Paragraph({
          children: [
            new TextRun({
              text: block.content,
              bold: block.style.fontWeight === 'bold' || block.style.fontWeight === 'semibold',
              italics: block.style.italic,
              underline: block.style.underline ? {} : undefined,
              strike: block.style.strikethrough,
              size: block.style.fontSize * 2, // Convert to half-points
              color: block.style.color.replace('#', ''),
            }),
          ],
          alignment,
        });

      case 'list':
        return block.content.split('\n').map((item) => 
          new Paragraph({
            text: item,
            bullet: {
              level: 0,
            },
            alignment,
          })
        );

      case 'quote':
        return new Paragraph({
          children: [
            new TextRun({
              text: `"${block.content}"`,
              italics: true,
              size: block.style.fontSize * 2,
              color: block.style.color.replace('#', ''),
            }),
          ],
          alignment: AlignmentType.CENTER,
        });

      case 'table':
        if (block.metadata?.tableData) {
          const rows = block.metadata.tableData.map(rowData =>
            new TableRow({
              children: rowData.map(cellData =>
                new TableCell({
                  children: [new Paragraph({ text: cellData })],
                  width: { size: 100 / rowData.length, type: WidthType.PERCENTAGE },
                })
              ),
            })
          );

          return new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          });
        }
        return null;

      case 'divider':
        return new Paragraph({
          text: '_______________________________________________',
          alignment: AlignmentType.CENTER,
        });

      case 'pagebreak':
        return new Paragraph({
          text: '',
          pageBreakBefore: true,
        });

      default:
        return null;
    }
  }

  private getDocxAlignment(textAlign: string) {
    switch (textAlign) {
      case 'center': return AlignmentType.CENTER;
      case 'right': return AlignmentType.RIGHT;
      case 'justify': return AlignmentType.JUSTIFIED;
      default: return AlignmentType.LEFT;
    }
  }

  private async exportToPdf(): Promise<void> {
    const a4Width = 595.28; // A4 width in points (210mm)
    const a4Height = 841.89; // A4 height in points (297mm)
    
    const pdf = new jsPDF({
      orientation: this.document.settings.pageOrientation,
      unit: 'pt',
      format: 'a4',
    });

    // Group blocks into pages based on height
    const PAGE_HEIGHT = a4Height - (this.document.settings.pageMargins * 2);
    const pages = this.paginateBlocksForExport(this.document.blocks, PAGE_HEIGHT);

    // Create a temporary div for each page
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const page = pages[pageIndex];
      
      const tempDiv = document.createElement('div');
      tempDiv.style.width = `${a4Width - (this.document.settings.pageMargins * 2)}pt`;
      tempDiv.style.padding = `${this.document.settings.pageMargins}pt`;
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.fontFamily = this.document.settings.fontFamily;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.6';

      // Add title only to the first page
      if (pageIndex === 0 && this.document.title) {
        const titleEl = document.createElement('h1');
        titleEl.textContent = this.document.title;
        titleEl.style.textAlign = 'center';
        titleEl.style.marginBottom = '20px';
        titleEl.style.fontSize = '20px';
        titleEl.style.fontWeight = 'bold';
        tempDiv.appendChild(titleEl);
      }

      // Add blocks for this page
      page.forEach(block => {
        const blockEl = this.blockToHtml(block);
        if (blockEl) {
          tempDiv.appendChild(blockEl);
        }
      });

      document.body.appendChild(tempDiv);

      try {
        // Use html2canvas to capture the content
        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: 'white',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = a4Width - (this.document.settings.pageMargins * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (pageIndex > 0) {
          pdf.addPage();
        }

        pdf.addImage(imgData, 'PNG', this.document.settings.pageMargins, this.document.settings.pageMargins, imgWidth, imgHeight);

      } finally {
        document.body.removeChild(tempDiv);
      }
    }

    pdf.save(`${this.document.title || 'document'}.pdf`);
  }

  private paginateBlocksForExport(blocks: ContentBlock[], pageHeight: number): ContentBlock[][] {
    const pages: ContentBlock[][] = [];
    let currentPage: ContentBlock[] = [];
    let currentHeight = 0;
    const titleHeight = this.document.title ? 60 : 0; // Approximate title height

    blocks.forEach((block) => {
      const blockHeight = this.estimateBlockHeight(block);

      if (currentHeight + blockHeight + titleHeight > pageHeight && currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(block);
      currentHeight += blockHeight;
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  }

  private estimateBlockHeight(block: ContentBlock): number {
    // Return the actual height if available, otherwise estimate
    if (block.height) {
      return block.height;
    }

    // Estimate based on block type and content
    const baseHeight = 20; // Base line height
    const fontSize = block.style.fontSize || 12;
    const lineHeight = block.style.lineHeight || 1.6;
    
    switch (block.type) {
      case 'heading':
        const level = block.metadata?.level || 1;
        return baseHeight * (level === 1 ? 2.5 : level === 2 ? 2 : 1.5);
      case 'paragraph':
        const lines = Math.ceil(block.content.length / 80); // Rough estimate
        return lines * fontSize * lineHeight;
      case 'list':
        const items = block.content.split('\n').length;
        return items * fontSize * lineHeight;
      case 'table':
        const rows = block.metadata?.tableData?.length || 1;
        return rows * 30; // Approximate row height
      default:
        return baseHeight;
    }
  }

  private exportToHtml(): void {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.document.title}</title>
    <style>
        body {
            font-family: ${this.document.settings.fontFamily}, sans-serif;
            line-height: ${this.document.settings.lineSpacing};
            margin: ${this.document.settings.pageMargins}pt;
            color: #333;
        }
        .document-title {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <h1 class="document-title">${this.document.title}</h1>
`;

    this.document.blocks.forEach(block => {
      const blockHtml = this.blockToHtmlString(block);
      if (blockHtml) {
        html += blockHtml + '\n';
      }
    });

    html += '</body></html>';

    const blob = new Blob([html], { type: 'text/html' });
    saveAs(blob, `${this.document.title.replace(/\s+/g, '_')}.html`);
  }

  private exportToMarkdown(): void {
    let markdown = `# ${this.document.title}\n\n`;

    this.document.blocks.forEach(block => {
      const blockMarkdown = this.blockToMarkdown(block);
      if (blockMarkdown) {
        markdown += blockMarkdown + '\n\n';
      }
    });

    const blob = new Blob([markdown], { type: 'text/markdown' });
    saveAs(blob, `${this.document.title.replace(/\s+/g, '_')}.md`);
  }

  private exportToLatex(): void {
    let latex = `\\documentclass{article}
\\usepackage[margin=${this.document.settings.pageMargins}pt]{geometry}
\\usepackage{graphicx}
\\usepackage{enumitem}
\\usepackage{array}
\\usepackage{longtable}

\\title{${this.document.title}}
\\author{}
\\date{}

\\begin{document}
\\maketitle

`;

    this.document.blocks.forEach(block => {
      const blockLatex = this.blockToLatex(block);
      if (blockLatex) {
        latex += blockLatex + '\n\n';
      }
    });

    latex += '\\end{document}';

    const blob = new Blob([latex], { type: 'text/plain' });
    saveAs(blob, `${this.document.title.replace(/\s+/g, '_')}.tex`);
  }

  private exportToText(): void {
    let text = `${this.document.title}\n${'='.repeat(this.document.title.length)}\n\n`;

    this.document.blocks.forEach(block => {
      const blockText = this.blockToText(block);
      if (blockText) {
        text += blockText + '\n\n';
      }
    });

    const blob = new Blob([text], { type: 'text/plain' });
    saveAs(blob, `${this.document.title.replace(/\s+/g, '_')}.txt`);
  }

  private blockToHtml(block: ContentBlock): HTMLElement | null {
    const style = `
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
    `;

    switch (block.type) {
      case 'heading':
        const level = Math.min(block.metadata?.level || 1, 6);
        const heading = document.createElement(`h${level}`);
        heading.textContent = block.content;
        heading.style.cssText = style;
        return heading;

      case 'paragraph':
        const p = document.createElement('p');
        p.textContent = block.content;
        p.style.cssText = style;
        return p;

      case 'list':
        const listTag = block.metadata?.listType === 'numbered' ? 'ol' : 'ul';
        const list = document.createElement(listTag);
        list.style.cssText = style;
        block.content.split('\n').forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          list.appendChild(li);
        });
        return list;

      case 'quote':
        const blockquote = document.createElement('blockquote');
        blockquote.textContent = block.content;
        blockquote.style.cssText = style + 'border-left: 4px solid #ccc; padding-left: 16px; font-style: italic;';
        return blockquote;

      case 'table':
        if (block.metadata?.tableData) {
          const table = document.createElement('table');
          table.style.cssText = style + 'border-collapse: collapse; width: 100%;';
          
          block.metadata.tableData.forEach(rowData => {
            const tr = document.createElement('tr');
            rowData.forEach(cellData => {
              const td = document.createElement('td');
              td.textContent = cellData;
              td.style.cssText = 'border: 1px solid #ccc; padding: 8px;';
              tr.appendChild(td);
            });
            table.appendChild(tr);
          });
          return table;
        }
        return null;

      case 'divider':
        const hr = document.createElement('hr');
        hr.style.cssText = style;
        return hr;

      case 'pagebreak':
        const pageBreak = document.createElement('div');
        pageBreak.style.cssText = 'page-break-before: always; height: 0; margin: 0; padding: 0;';
        return pageBreak;

      default:
        return null;
    }
  }

  private blockToHtmlString(block: ContentBlock): string | null {
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
        const items = block.content.split('\n').map(item => `<li>${item}</li>`).join('');
        return `<${listTag} ${style}>${items}</${listTag}>`;

      case 'quote':
        return `<blockquote ${style} style="border-left: 4px solid #ccc; padding-left: 16px; font-style: italic;">${block.content}</blockquote>`;

      case 'divider':
        return `<hr ${style}>`;

      case 'pagebreak':
        return `<div style="page-break-before: always; height: 0; margin: 0; padding: 0;"></div>`;

      default:
        return null;
    }
  }

  private blockToMarkdown(block: ContentBlock): string | null {
    switch (block.type) {
      case 'heading':
        const level = block.metadata?.level || 1;
        return `${'#'.repeat(level)} ${block.content}`;

      case 'paragraph':
        return block.content;

      case 'list':
        const prefix = block.metadata?.listType === 'numbered' ? '1.' : '-';
        return block.content.split('\n').map(item => `${prefix} ${item}`).join('\n');

      case 'quote':
        return `> ${block.content}`;

      case 'divider':
        return '---';

      case 'pagebreak':
        return '\n\n--- PAGE BREAK ---\n\n';

      default:
        return null;
    }
  }

  private blockToLatex(block: ContentBlock): string | null {
    switch (block.type) {
      case 'heading':
        const level = block.metadata?.level || 1;
        const command = level === 1 ? 'section' : level === 2 ? 'subsection' : 'subsubsection';
        return `\\${command}{${block.content}}`;

      case 'paragraph':
        return block.content;

      case 'list':
        const listType = block.metadata?.listType === 'numbered' ? 'enumerate' : 'itemize';
        const items = block.content.split('\n').map(item => `  \\item ${item}`).join('\n');
        return `\\begin{${listType}}\n${items}\n\\end{${listType}}`;

      case 'quote':
        return `\\begin{quote}\n${block.content}\n\\end{quote}`;

      case 'divider':
        return '\\hrule';

      case 'pagebreak':
        return '\\newpage';

      default:
        return null;
    }
  }

  private blockToText(block: ContentBlock): string | null {
    switch (block.type) {
      case 'heading':
        const level = block.metadata?.level || 1;
        const underline = '='.repeat(block.content.length);
        return level === 1 ? `${block.content}\n${underline}` : `${block.content}\n${'-'.repeat(block.content.length)}`;

      case 'paragraph':
        return block.content;

      case 'list':
        return block.content.split('\n').map((item, index) => 
          block.metadata?.listType === 'numbered' ? `${index + 1}. ${item}` : `• ${item}`
        ).join('\n');

      case 'quote':
        return `"${block.content}"`;

      case 'divider':
        return '---';

      case 'pagebreak':
        return '\n\n=== NEW PAGE ===\n\n';

      default:
        return null;
    }
  }
}