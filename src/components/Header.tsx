import React from 'react';
import { Save, Download, Settings, Undo, Redo, Layout, FileText } from 'lucide-react';

interface HeaderProps {
  documentTitle: string;
  onTitleChange: (title: string) => void;
  onSave: () => void;
  onExport: () => void;
  onSettings: () => void;
  onTemplates?: () => void;
  onSaveAsTemplate?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  documentTitle,
  onTitleChange,
  onSave,
  onExport,
  onSettings,
  onTemplates,
  onSaveAsTemplate,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-xl font-bold text-black">DocX Editor</span>
        </div>
        
        <div className="h-6 w-px bg-gray-200" />
        
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-lg font-medium text-black bg-transparent border-none outline-none focus:bg-gray-50 rounded px-3 py-2 transition-colors"
          placeholder="Untitled Document"
        />
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors ${
            canUndo 
              ? 'text-gray-700 hover:text-black hover:bg-gray-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Undo"
        >
          <Undo className="w-5 h-5" />
        </button>
        
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors ${
            canRedo 
              ? 'text-gray-700 hover:text-black hover:bg-gray-50' 
              : 'text-gray-400 cursor-not-allowed'
          }`}
          title="Redo"
        >
          <Redo className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-gray-200" />

        <button
          onClick={onSave}
          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
        >
          <Save className="w-4 h-4" />
          <span className="text-sm">Save</span>
        </button>

        {onTemplates && (
          <button
            onClick={onTemplates}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
          >
            <Layout className="w-4 h-4" />
            <span className="text-sm">Templates</span>
          </button>
        )}

        {onSaveAsTemplate && (
          <button
            onClick={onSaveAsTemplate}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors font-medium"
            title="Save current document as template"
          >
            <FileText className="w-4 h-4" />
            <span className="text-sm">Save as Template</span>
          </button>
        )}

        <button
          onClick={onExport}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors shadow-lg font-medium"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm">Export</span>
        </button>

        <button
          onClick={onSettings}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};