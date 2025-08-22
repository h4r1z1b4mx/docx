import React, { useState } from 'react';
import { X, Download, FileText, Code, Globe, Hash, File, CheckCircle } from 'lucide-react';
import { Document, ExportFormat, ExportOptions } from '../types';
import { DocumentExporter } from '../utils/exportUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  document,
}) => {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('docx');
  const [exportOptions, setExportOptions] = useState<Omit<ExportOptions, 'format'>>({
    includeStyles: true,
    pageBreaks: false,
    tableOfContents: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const exporter = new DocumentExporter(document, {
        format: exportFormat,
        ...exportOptions,
      });
      
      await exporter.export();
      setExportSuccess(true);
      
      setTimeout(() => {
        setExportSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatOptions = [
    {
      value: 'docx' as ExportFormat,
      label: 'Microsoft Word',
      description: 'DOCX format for Word and compatible editors',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      value: 'pdf' as ExportFormat,
      label: 'PDF Document',
      description: 'Portable Document Format for universal viewing',
      icon: FileText,
      color: 'text-red-600',
    },
    {
      value: 'html' as ExportFormat,
      label: 'HTML Web Page',
      description: 'Web-ready HTML with embedded styles',
      icon: Globe,
      color: 'text-orange-600',
    },
    {
      value: 'markdown' as ExportFormat,
      label: 'Markdown',
      description: 'Plain text format with markup syntax',
      icon: Hash,
      color: 'text-gray-600',
    },
    {
      value: 'latex' as ExportFormat,
      label: 'LaTeX Source',
      description: 'LaTeX source code for academic publishing',
      icon: Code,
      color: 'text-green-600',
    },
    {
      value: 'txt' as ExportFormat,
      label: 'Plain Text',
      description: 'Simple text file without formatting',
      icon: File,
      color: 'text-gray-500',
    },
  ];

  const selectedFormat = formatOptions.find(f => f.value === exportFormat);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Export Document</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isExporting}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose export format:
              </label>
              <div className="grid grid-cols-2 gap-3">
                {formatOptions.map((format) => {
                  const Icon = format.icon;
                  return (
                    <label
                      key={format.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${
                        exportFormat === format.value
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="format"
                        value={format.value}
                        checked={exportFormat === format.value}
                        onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                        className="sr-only"
                      />
                      <Icon className={`w-5 h-5 ${format.color} mr-3 mt-0.5 flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm">{format.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{format.description}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Export Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export options:
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={exportOptions.includeStyles}
                    onChange={(e) => setExportOptions(prev => ({
                      ...prev,
                      includeStyles: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Include formatting and styles</span>
                </label>

                {(exportFormat === 'docx' || exportFormat === 'pdf') && (
                  <>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.pageBreaks}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          pageBreaks: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Insert page breaks between sections</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={exportOptions.tableOfContents}
                        onChange={(e) => setExportOptions(prev => ({
                          ...prev,
                          tableOfContents: e.target.checked
                        }))}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Generate table of contents</span>
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Preview Info */}
            {selectedFormat && (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <selectedFormat.icon className={`w-4 h-4 ${selectedFormat.color}`} />
                  <span className="text-sm font-medium text-gray-900">
                    Exporting as {selectedFormat.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{selectedFormat.description}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Exporting...</span>
              </>
            ) : exportSuccess ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Exported!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};