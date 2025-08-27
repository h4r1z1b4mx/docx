import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ExportModal } from './components/ExportModal';
import TemplateSelection from './components/TemplateSelection';
import SaveTemplateModal from './components/SaveTemplateModal';
import { Homepage } from './components/Homepage';
import { useDocument } from './hooks/useDocument';

function App() {
  const {
    document,
    selectedBlockId,
    setSelectedBlockId,
    updateDocument,
    addBlock,
    updateBlock,
    deleteBlock,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useDocument();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showHomepage, setShowHomepage] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedBlock = document.blocks.find(block => block.id === selectedBlockId) || null;

  const handleSave = () => {
    // In a real app, this would save to a backend or local storage
    localStorage.setItem(`document-${document.id}`, JSON.stringify(document));
    
    // Show a brief success message
    const notification = window.document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.textContent = 'Document saved successfully!';
    window.document.body.appendChild(notification);
    
    setTimeout(() => {
      window.document.body.removeChild(notification);
    }, 3000);
  };

  const handleTemplateSelect = (templateDocument: import('./types').Document) => {
    updateDocument({
      title: templateDocument.title,
      blocks: templateDocument.blocks
    });
    setShowHomepage(false); // Switch to editor view
  };

  const handleStartProject = () => {
    setShowHomepage(false); // Navigate to the editor page
  };

  const handleUpdateSelectedBlock = (updates: Partial<import('./types').ContentBlock>) => {
    if (selectedBlockId) {
      updateBlock(selectedBlockId, updates);
    }
  };

  const handleDeleteSelectedBlock = () => {
    if (selectedBlockId) {
      deleteBlock(selectedBlockId);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {showHomepage ? (
        <Homepage onStartProject={handleStartProject} />
      ) : (
        <div className="h-screen flex flex-col bg-white">
          <Header
            documentTitle="Visual Document Editor"
            onTitleChange={(title) => updateDocument({ title })}
            onSave={handleSave}
            onExport={() => setShowExportModal(true)}
            onSettings={() => {}}
            onTemplates={() => setShowTemplateSelection(true)}
            onSaveAsTemplate={() => setShowSaveTemplateModal(true)}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
            onTogglePreview={() => setShowPreview(!showPreview)}
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
            showPreview={showPreview}
            mobileMenuOpen={mobileMenuOpen}
          />
          
          {/* Mobile Navigation Bar */}
          <div className="md:hidden bg-gray-50 border-b border-gray-200 px-4 py-2">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  showPreview 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {/* Mobile: Collapsible Toolbar */}
            <div className={`md:block ${mobileMenuOpen ? 'block' : 'hidden'} md:static absolute top-0 left-0 w-full md:w-auto bg-white z-40 md:z-auto border-r border-gray-200`}>
              <Toolbar
                selectedBlock={selectedBlock}
                onUpdateBlock={handleUpdateSelectedBlock}
                onAddBlock={addBlock}
                onDeleteBlock={handleDeleteSelectedBlock}
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Mobile: Show either Editor or Preview */}
              <div className="md:hidden w-full">
                {showPreview ? (
                  <Preview document={document} />
                ) : (
                  <Editor
                    document={document}
                    selectedBlockId={selectedBlockId}
                    onSelectBlock={setSelectedBlockId}
                    onUpdateBlock={updateBlock}
                    onDeleteBlock={deleteBlock}
                    onAddBlock={addBlock}
                  />
                )}
              </div>
              
              {/* Desktop: Show both Editor and Preview */}
              <div className="hidden md:flex w-full">
                <Editor
                  document={document}
                  selectedBlockId={selectedBlockId}
                  onSelectBlock={setSelectedBlockId}
                  onUpdateBlock={updateBlock}
                  onDeleteBlock={deleteBlock}
                  onAddBlock={addBlock}
                />
                <Preview document={document} />
              </div>
            </div>
          </div>

          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            document={document}
          />

          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            document={document}
            onTemplateSaved={() => {
              // Show success notification
              const notification = window.document.createElement('div');
              notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
              notification.textContent = 'Template saved successfully!';
              window.document.body.appendChild(notification);
              
              setTimeout(() => {
                if (window.document.body.contains(notification)) {
                  window.document.body.removeChild(notification);
                }
              }, 3000);
            }}
          />

          <SaveTemplateModal
            isOpen={showSaveTemplateModal}
            onClose={() => setShowSaveTemplateModal(false)}
            document={document}
            onTemplateSaved={() => {
              // Show success notification
              const notification = window.document.createElement('div');
              notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
              notification.textContent = 'Template saved successfully!';
              window.document.body.appendChild(notification);
              
              setTimeout(() => {
                if (window.document.body.contains(notification)) {
                  window.document.body.removeChild(notification);
                }
              }, 3000);
            }}
          />
        </div>
      )}

      <TemplateSelection
        isOpen={showTemplateSelection}
        onClose={() => setShowTemplateSelection(false)}
        onSelectTemplate={handleTemplateSelect}
      />
    </DndProvider>
  );
}

export default App;