import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Document, ContentBlock } from '../types';

const defaultDocument: Document = {
  id: '',
  title: 'Untitled Document',
  template: 'blank',
  blocks: [],
  lastModified: new Date(),
  settings: {
    pageMargins: 72,
    pageSize: 'A4',
    fontFamily: 'Inter',
    pageOrientation: 'portrait',
    lineSpacing: 1.5,
  },
};

export const useDocument = () => {
  const [document, setDocument] = useState<Document>({
    ...defaultDocument,
    id: uuidv4(),
  });

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  
  // Undo/Redo functionality
  const [history, setHistory] = useState<Document[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedoAction = useRef(false);

  // Initialize history with the initial document
  useEffect(() => {
    if (history.length === 0) {
      const initialDoc = {
        ...document,
      };
      setHistory([initialDoc]);
      setHistoryIndex(0);
    }
  }, [document, history.length]);

  const saveToHistory = useCallback((newDocument: Document) => {
    if (isUndoRedoAction.current) {
      return;
    }
    
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1);
      // Add the new state
      const updatedHistory = [...newHistory, { ...newDocument }];
      // Limit history to 50 items to prevent memory issues
      return updatedHistory.slice(-50);
    });
    
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true;
      const previousState = history[historyIndex - 1];
      setDocument({ ...previousState });
      setHistoryIndex(prev => prev - 1);
      // Reset the flag after the next render
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 0);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true;
      const nextState = history[historyIndex + 1];
      setDocument({ ...nextState });
      setHistoryIndex(prev => prev + 1);
      // Reset the flag after the next render
      setTimeout(() => {
        isUndoRedoAction.current = false;
      }, 0);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const updateDocument = useCallback((updates: Partial<Document>) => {
    const newDocument = {
      ...document,
      ...updates,
      lastModified: new Date(),
    };
    setDocument(newDocument);
    saveToHistory(newDocument);
  }, [document, saveToHistory]);

  const addBlock = useCallback((type: ContentBlock['type'], index?: number) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type,
      content: getDefaultContent(type),
      style: {
        fontSize: getDefaultFontSize(type),
        fontWeight: getDefaultFontWeight(type),
        textAlign: 'left',
        color: '#1f2937',
        marginTop: 16,
        marginBottom: 16,
        lineHeight: 1.5,
      },
      metadata: getDefaultMetadata(type),
    };

    const newDocument = {
      ...document,
      blocks: (() => {
        const newBlocks = [...document.blocks];
        const insertIndex = index !== undefined ? index : newBlocks.length;
        newBlocks.splice(insertIndex, 0, newBlock);
        return newBlocks;
      })(),
      lastModified: new Date(),
    };

    setDocument(newDocument);
    saveToHistory(newDocument);
    setSelectedBlockId(newBlock.id);
    return newBlock.id;
  }, [document, saveToHistory]);

  const updateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    const newDocument = {
      ...document,
      blocks: document.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
      lastModified: new Date(),
    };
    setDocument(newDocument);
    saveToHistory(newDocument);
  }, [document, saveToHistory]);

  const deleteBlock = useCallback((blockId: string) => {
    const newDocument = {
      ...document,
      blocks: document.blocks.filter(block => block.id !== blockId),
      lastModified: new Date(),
    };
    setDocument(newDocument);
    saveToHistory(newDocument);
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [document, selectedBlockId, saveToHistory]);

  const moveBlock = useCallback((blockId: string, newIndex: number) => {
    const blocks = [...document.blocks];
    const blockIndex = blocks.findIndex(block => block.id === blockId);
    
    if (blockIndex === -1) return;
    
    const [movedBlock] = blocks.splice(blockIndex, 1);
    blocks.splice(newIndex, 0, movedBlock);
    
    const newDocument = {
      ...document,
      blocks,
      lastModified: new Date(),
    };
    setDocument(newDocument);
    saveToHistory(newDocument);
  }, [document, saveToHistory]);

  return {
    document,
    selectedBlockId,
    setSelectedBlockId,
    updateDocument,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
    undo,
    redo,
    canUndo,
    canRedo,
  };
};

function getDefaultContent(type: ContentBlock['type']): string {
  switch (type) {
    case 'heading':
      return 'New Heading';
    case 'paragraph':
      return 'Start typing your content here...';
    case 'list':
      return 'First item\nSecond item\nThird item';
    case 'quote':
      return 'This is a quote block. Add your inspirational text here.';
    case 'table':
      return 'Table';
    case 'image':
      return 'Image placeholder';
    case 'divider':
      return '';
    default:
      return '';
  }
}

function getDefaultFontSize(type: ContentBlock['type']): number {
  switch (type) {
    case 'heading':
      return 24;
    case 'paragraph':
      return 16;
    case 'list':
      return 16;
    case 'quote':
      return 18;
    case 'table':
      return 14;
    default:
      return 16;
  }
}

function getDefaultFontWeight(type: ContentBlock['type']): ContentBlock['style']['fontWeight'] {
  switch (type) {
    case 'heading':
      return 'bold';
    case 'quote':
      return 'semibold';
    default:
      return 'normal';
  }
}

function getDefaultMetadata(type: ContentBlock['type']): ContentBlock['metadata'] {
  switch (type) {
    case 'heading':
      return { level: 1 };
    case 'list':
      return { listType: 'bullet' };
    case 'table':
      return { 
        tableRows: 2, 
        tableCols: 2,
        tableData: [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']]
      };
    case 'image':
      return { imageUrl: '', imageWidth: 300, imageHeight: 200 };
    default:
      return undefined;
  }
}