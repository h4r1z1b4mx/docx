import React from 'react';
import { Save, Download, Settings, FileText, Undo, Redo, Layout } from 'lucide-react';

interface HeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onExport: () => void;
  onSettings: () => void;
  onTemplates?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  documentTitle,
  onTitleChange,
  onSave,
  onExport,
  onSettings,
  onTemplates,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-primary-600" />
          <span className="text-xl font-semibold text-gray-900">Visual Editor</span>
        </div>
        
        <div className="h-6 w-px bg-gray-300" />
        
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-medium text-gray-900 bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 py-1 transition-colors"
          placeholder="Untitled Document"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => {}}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        
        <button
          onClick={() => {}}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-gray-300" />

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm font-medium">Save</span>
        </button>

        {onTemplates && (
          <button
            onClick={onTemplates}
            className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm font-medium">Templates</span>
          </button>
        )}

        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-3 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Export</span>
        </button>

        <button
          onClick={onSettings}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};