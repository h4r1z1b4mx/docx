import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ExportModal } from './components/ExportModal';
import TemplateSelection from './components/TemplateSelection';
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
  const [showHomepage, setShowHomepage] = useState(true);

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
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          
          <div className="flex-1 flex overflow-hidden">
            <Toolbar
              selectedBlock={selectedBlock}
              onUpdateBlock={handleUpdateSelectedBlock}
              onAddBlock={addBlock}
              onDeleteBlock={handleDeleteSelectedBlock}
            />
            
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

          <ExportModal
            isOpen={showExportModal}
            onClose={() => setShowExportModal(false)}
            document={document}
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