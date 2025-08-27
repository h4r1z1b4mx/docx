import React from 'react';
import { Save, Download, Settings, Undo, Redo, Layout, FileText, Eye, Menu, X } from 'lucide-react';

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
  onTogglePreview?: () => void;
  onToggleMobileMenu?: () => void;
  showPreview?: boolean;
  mobileMenuOpen?: boolean;
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
  onTogglePreview,
  onToggleMobileMenu,
  showPreview = false,
  mobileMenuOpen = false,
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shadow-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-2 md:space-x-4 flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
          <span className="text-lg md:text-xl font-bold text-black hidden sm:block">DocX Editor</span>
          <span className="text-lg font-bold text-black sm:hidden">DocX</span>
        </div>
        
        <div className="h-6 w-px bg-gray-200 hidden sm:block" />
        
        <input
          type="text"
          value={documentTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-sm md:text-lg font-medium text-black bg-transparent border-none outline-none focus:bg-gray-50 rounded px-2 md:px-3 py-1 md:py-2 transition-colors flex-1 min-w-0 max-w-xs md:max-w-none"
          placeholder="Untitled"
        />
      </div>

      {/* Right Section - Mobile */}
      <div className="md:hidden flex items-center space-x-1">
        {/* Undo/Redo for mobile */}
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
          <Undo className="w-4 h-4" />
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
          <Redo className="w-4 h-4" />
        </button>

        <button
          onClick={onSave}
          className="p-2 text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>

        <button
          onClick={onExport}
          className="p-2 bg-black text-white hover:bg-gray-800 rounded-lg transition-colors shadow-sm"
          title="Export"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Right Section - Desktop */}
      <div className="hidden md:flex items-center space-x-2">
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