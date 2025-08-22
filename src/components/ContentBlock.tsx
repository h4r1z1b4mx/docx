import React, { useState, useRef, useEffect } from 'react';
import { GripVertical, Edit3, Plus, Trash2 } from 'lucide-react';
import { ContentBlock as ContentBlockType } from '../types';

interface ContentBlockProps {
  block: ContentBlockType;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<ContentBlockType>) => void;
  onDelete: () => void;
}

export const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(block.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditContent(block.content);
  };

  const handleSave = () => {
    onUpdate({ content: editContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditContent(block.content);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  const handleTableCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!block.metadata?.tableData) return;
    
    const newTableData = [...block.metadata.tableData];
    newTableData[rowIndex][colIndex] = value;
    
    onUpdate({
      metadata: {
        ...block.metadata,
        tableData: newTableData
      }
    });
  };

  const addTableRow = () => {
    if (!block.metadata?.tableData) return;
    
    const cols = block.metadata.tableData[0]?.length || 2;
    const newRow = Array(cols).fill('');
    
    onUpdate({
      metadata: {
        ...block.metadata,
        tableData: [...block.metadata.tableData, newRow]
      }
    });
  };

  const addTableColumn = () => {
    if (!block.metadata?.tableData) return;
    
    const newTableData = block.metadata.tableData.map(row => [...row, '']);
    
    onUpdate({
      metadata: {
        ...block.metadata,
        tableData: newTableData
      }
    });
  };

  const removeTableRow = (rowIndex: number) => {
    if (!block.metadata?.tableData || block.metadata.tableData.length <= 1) return;
    
    const newTableData = block.metadata.tableData.filter((_, index) => index !== rowIndex);
    
    onUpdate({
      metadata: {
        ...block.metadata,
        tableData: newTableData
      }
    });
  };

  const removeTableColumn = (colIndex: number) => {
    if (!block.metadata?.tableData || block.metadata.tableData[0]?.length <= 1) return;
    
    const newTableData = block.metadata.tableData.map(row => 
      row.filter((_, index) => index !== colIndex)
    );
    
    onUpdate({
      metadata: {
        ...block.metadata,
        tableData: newTableData
      }
    });
  };

  const renderContent = () => {
    const style = {
      fontSize: `${block.style.fontSize}px`,
      fontWeight: block.style.fontWeight,
      textAlign: block.style.textAlign,
      color: block.style.color,
      backgroundColor: block.style.backgroundColor,
      marginTop: `${block.style.marginTop}px`,
      marginBottom: `${block.style.marginBottom}px`,
      lineHeight: block.style.lineHeight,
      fontStyle: block.style.italic ? 'italic' : 'normal',
      textDecoration: [
        block.style.underline ? 'underline' : '',
        block.style.strikethrough ? 'line-through' : ''
      ].filter(Boolean).join(' ') || 'none',
    } as React.CSSProperties;

    if (isEditing && block.type !== 'table') {
      return (
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none resize-none"
          style={{...style, minHeight: '40px'}}
          rows={block.type === 'list' ? editContent.split('\n').length : 1}
        />
      );
    }

    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.metadata?.level || 1}` as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag style={style} className="outline-none">
            {block.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p style={style} className="outline-none">
            {block.content}
          </p>
        );

      case 'list':
        const ListTag = block.metadata?.listType === 'numbered' ? 'ol' : 'ul';
        return (
          <ListTag style={style} className="outline-none pl-6">
            {block.content.split('\n').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ListTag>
        );

      case 'quote':
        return (
          <blockquote 
            style={{
              ...style,
              borderLeft: '4px solid #e5e7eb',
              paddingLeft: '16px',
              fontStyle: 'italic',
              color: '#6b7280'
            }} 
            className="outline-none"
          >
            {block.content}
          </blockquote>
        );

      case 'table':
        if (!block.metadata?.tableData) {
          // Initialize with 2x2 table
          const initialData = [['Cell 1', 'Cell 2'], ['Cell 3', 'Cell 4']];
          onUpdate({
            metadata: {
              ...block.metadata,
              tableData: initialData,
              tableRows: 2,
              tableCols: 2
            }
          });
          return null;
        }

        return (
          <div style={style} className="outline-none">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {block.metadata.tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="group">
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2 relative group-hover:bg-gray-50">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => handleTableCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full bg-transparent border-none outline-none"
                          style={{ fontSize: 'inherit', color: 'inherit' }}
                        />
                        {colIndex === row.length - 1 && (
                          <button
                            onClick={() => removeTableColumn(colIndex)}
                            className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove column"
                          >
                            <Trash2 className="w-2 h-2 mx-auto" />
                          </button>
                        )}
                      </td>
                    ))}
                    <td className="border-none p-1">
                      <button
                        onClick={() => removeTableRow(rowIndex)}
                        className="w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove row"
                      >
                        <Trash2 className="w-2 h-2 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={addTableRow}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Row</span>
              </button>
              <button
                onClick={addTableColumn}
                className="flex items-center space-x-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                <Plus className="w-3 h-3" />
                <span>Add Column</span>
              </button>
            </div>
          </div>
        );

      case 'image':
        return (
          <div style={style} className="flex items-center justify-center bg-gray-100 rounded-lg p-8 outline-none">
            <div className="text-center text-gray-500">
              <div className="text-lg mb-2">📷</div>
              <div className="text-sm">Image Placeholder</div>
              <div className="text-xs text-gray-400 mt-1">{block.content}</div>
            </div>
          </div>
        );

      case 'divider':
        return (
          <hr 
            style={{
              marginTop: `${block.style.marginTop}px`,
              marginBottom: `${block.style.marginBottom}px`,
            }}
            className="border-t border-gray-300 outline-none"
          />
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`group relative transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary-500 ring-opacity-50 bg-primary-50 bg-opacity-30' 
          : 'hover:bg-gray-50'
      } rounded-lg`}
      onClick={onSelect}
    >
      {/* Drag handle and edit button */}
      <div className={`absolute left-0 top-0 flex items-center space-x-1 transform -translate-x-8 transition-opacity ${
        isSelected || !isEditing ? 'opacity-100' : 'opacity-0'
      }`}>
        <button
          className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
        {block.type !== 'table' && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
            className="p-1 text-gray-400 hover:text-gray-600"
            title="Edit content"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        {renderContent()}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary-500 rounded-lg pointer-events-none" />
      )}
    </div>
  );
};