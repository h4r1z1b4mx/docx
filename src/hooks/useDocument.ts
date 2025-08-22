import { useState, useCallback } from 'react';
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

  const updateDocument = useCallback((updates: Partial<Document>) => {
    setDocument(prev => ({
      ...prev,
      ...updates,
      lastModified: new Date(),
    }));
  }, []);

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

    setDocument(prev => {
      const newBlocks = [...prev.blocks];
      const insertIndex = index !== undefined ? index : newBlocks.length;
      newBlocks.splice(insertIndex, 0, newBlock);
      
      return {
        ...prev,
        blocks: newBlocks,
        lastModified: new Date(),
      };
    });

    setSelectedBlockId(newBlock.id);
    return newBlock.id;
  }, []);

  const updateBlock = useCallback((blockId: string, updates: Partial<ContentBlock>) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      ),
      lastModified: new Date(),
    }));
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setDocument(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      lastModified: new Date(),
    }));
    
    if (selectedBlockId === blockId) {
      setSelectedBlockId(null);
    }
  }, [selectedBlockId]);

  const moveBlock = useCallback((blockId: string, newIndex: number) => {
    setDocument(prev => {
      const blocks = [...prev.blocks];
      const blockIndex = blocks.findIndex(block => block.id === blockId);
      
      if (blockIndex === -1) return prev;
      
      const [movedBlock] = blocks.splice(blockIndex, 1);
      blocks.splice(newIndex, 0, movedBlock);
      
      return {
        ...prev,
        blocks,
        lastModified: new Date(),
      };
    });
  }, []);

  return {
    document,
    selectedBlockId,
    setSelectedBlockId,
    updateDocument,
    addBlock,
    updateBlock,
    deleteBlock,
    moveBlock,
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