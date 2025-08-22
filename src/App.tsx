import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { Editor } from './components/Editor';
import { Preview } from './components/Preview';
import { ExportModal } from './components/ExportModal';
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
    moveBlock,
  } = useDocument();

  const [showExportModal, setShowExportModal] = useState(false);

  const selectedBlock = document.blocks.find(block => block.id === selectedBlockId) || null;

  const handleSave = () => {
    // In a real app, this would save to a backend or local storage
    localStorage.setItem(`document-${document.id}`, JSON.stringify(document));
    
    // Show a brief success message
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-accent-600 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.textContent = 'Document saved successfully!';
    document.body.appendChild(notification);
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
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
      <div className="h-screen flex flex-col bg-gray-50">
        <Header
          documentTitle={document.title}
          onTitleChange={(title) => updateDocument({ title })}
          onSave={handleSave}
          onExport={() => setShowExportModal(true)}
          onSettings={() => {}}
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
          />
          
          <Preview document={document} />
        </div>

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          document={document}
        />
      </div>
    </DndProvider>
  );
}

export default App;