import React from 'react';
import { ContentBlock } from './ContentBlock';
import { useDocument } from '../hooks/useDocument';

interface EditorProps {
  document: ReturnType<typeof useDocument>['document'];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string | null) => void;
  onUpdateBlock: (blockId: string, updates: Partial<import('../types').ContentBlock>) => void;
  onDeleteBlock: (blockId: string) => void;
  onAddBlock?: (type: import('../types').ContentBlock['type'], pageIndex?: number) => void;
}

export const Editor: React.FC<EditorProps> = ({
  document,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onDeleteBlock,
  onAddBlock,
}) => {
  const PAGE_HEIGHT = 800; // Define the height limit for each page

  // Function to group blocks into pages
  const paginateBlocks = (blocks: typeof document.blocks) => {
    const pages: typeof document.blocks[] = [];
    let currentPage: typeof document.blocks = [];
    let currentHeight = 0;

    blocks.forEach((block) => {
      const blockHeight = block.height || 100; // Assume a default height if not provided

      if (currentHeight + blockHeight > PAGE_HEIGHT) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }

      currentPage.push(block);
      currentHeight += blockHeight;
    });

    if (currentPage.length > 0) {
      pages.push(currentPage);
    }

    return pages;
  };

  // Function to check if a new block can fit in the current page
  const canAddBlockToPage = (pageIndex: number, blockHeight: number = 100) => {
    const pages = paginateBlocks(document.blocks);
    if (pageIndex >= pages.length) return true; // New page
    
    const currentPage = pages[pageIndex];
    const currentPageHeight = currentPage.reduce((total, block) => total + (block.height || 100), 0);
    
    return currentPageHeight + blockHeight <= PAGE_HEIGHT;
  };

  // Function to handle adding blocks with page boundary validation
  const handleAddBlockToPage = (type: import('../types').ContentBlock['type'], pageIndex: number) => {
    const newBlockHeight = 100; // Default height for new blocks
    
    if (canAddBlockToPage(pageIndex, newBlockHeight)) {
      onAddBlock?.(type, pageIndex);
    } else {
      // Show warning or automatically create new page
      alert('Cannot add more content to this page. The block will be added to the next page.');
      onAddBlock?.(type, pageIndex + 1);
    }
  };

  const pages = paginateBlocks(document.blocks);

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-4xl mx-auto py-8 px-6 space-y-12">
        {pages.length === 0 ? (
          // Empty document - show single empty page
          <div className="bg-white shadow-lg md:shadow-2xl rounded-lg md:rounded-2xl min-h-[600px] md:min-h-[800px] p-6 md:p-12 relative border border-gray-100 mx-4 md:mx-0" style={{ aspectRatio: '8.5/11' }}>
            <div className="text-center text-gray-600 py-16 md:py-20">
              <div className="text-4xl md:text-6xl mb-4">📝</div>
              <h3 className="text-lg md:text-xl font-bold text-black mb-2">Start creating your document</h3>
              <p className="text-sm md:text-base text-gray-500">Add content blocks using the toolbar</p>
            </div>
            {onAddBlock && (
              <div className="absolute bottom-3 md:bottom-6 right-3 md:right-6 left-3 md:left-auto">
                <button
                  onClick={() => handleAddBlockToPage('paragraph', 0)}
                  className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors shadow-lg font-medium w-full md:w-auto"
                >
                  + Add Content
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            {pages.map((page, pageIndex) => (
              <div
                key={pageIndex}
                className="bg-white shadow-lg md:shadow-2xl rounded-lg md:rounded-2xl min-h-[600px] md:min-h-[800px] p-6 md:p-12 relative border border-gray-100 mx-4 md:mx-0"
                style={{ aspectRatio: '8.5/11' }}
              >
                <div className="space-y-1 md:space-y-2">
                  {page.map((block) => (
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
                
                {/* Page info and add button */}
                <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
                  <span className="text-xs text-gray-500 font-medium">
                    Page {pageIndex + 1} of {pages.length}
                    <span className="hidden md:inline">
                      {(() => {
                        const currentPageHeight = page.reduce((total, block) => total + (block.height || 100), 0);
                        const remainingSpace = PAGE_HEIGHT - currentPageHeight;
                        return ` • ${remainingSpace}px remaining`;
                      })()}
                    </span>
                  </span>
                  
                  {onAddBlock && (
                    <button
                      onClick={() => handleAddBlockToPage('paragraph', pageIndex)}
                      className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!canAddBlockToPage(pageIndex)}
                    >
                      + Add Content
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add New Page Button */}
            {onAddBlock && (
              <div className="flex justify-center">
                <button
                  onClick={() => handleAddBlockToPage('paragraph', pages.length)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-lg font-medium flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add New Page</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};