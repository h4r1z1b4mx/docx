import React from 'react';
import { ContentBlock } from './ContentBlock';
import { useDocument } from '../hooks/useDocument';

interface EditorProps {
  document: ReturnType<typeof useDocument>['document'];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<import('../types').ContentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  document,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
}) => {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Paper-like container */}
        <div className="bg-white shadow-lg rounded-lg min-h-[800px] p-12" style={{ aspectRatio: '8.5/11' }}>
          {document.blocks.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-medium mb-2">Start creating your document</h3>
              <p className="text-gray-400">Add content blocks using the toolbar on the left</p>
            </div>
          ) : (
            <div className="space-y-2">
              {document.blocks.map((block) => (
                <ContentBlock
                  key={block.id}
                  block={block}
                  isSelected={selectedBlockId === block.id}
                  onSelect={() => onSelectBlock(block.id)}
                  onUpdate={(updates) => onUpdateBlock(block.id, updates)}
                  onDelete={() => onDeleteBlock(block.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};