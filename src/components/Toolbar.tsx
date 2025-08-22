import React from 'react';
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Image,
  Minus,
  Plus,
  Trash2,
  Quote,
  Table,
  Strikethrough,
  Palette
} from 'lucide-react';
import { ContentBlock } from '../types';

interface ToolbarProps {
  selectedBlock: ContentBlock | null;
  onUpdateBlock: (updates: Partial<ContentBlock>) => void;
  onAddBlock: (type: ContentBlock['type']) => void;
  onDeleteBlock: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedBlock,
  onUpdateBlock,
  onAddBlock,
  onDeleteBlock,
}) => {
  const updateStyle = (styleUpdate: Partial<ContentBlock['style']>) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      style: { ...selectedBlock.style, ...styleUpdate }
    });
  };

  const toggleStyleProperty = (property: keyof ContentBlock['style']) => {
    if (!selectedBlock) return;
    onUpdateBlock({
      style: { 
        ...selectedBlock.style, 
        [property]: !selectedBlock.style[property] 
      }
    });
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Add Content Section */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Add Content</h3>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onAddBlock('heading')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <Type className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Heading</span>
          </button>
          
          <button
            onClick={() => onAddBlock('paragraph')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <AlignLeft className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Text</span>
          </button>
          
          <button
            onClick={() => onAddBlock('list')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <List className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">List</span>
          </button>
          
          <button
            onClick={() => onAddBlock('quote')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <Quote className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Quote</span>
          </button>
          
          <button
            onClick={() => onAddBlock('table')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <Table className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Table</span>
          </button>
          
          <button
            onClick={() => onAddBlock('image')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group"
          >
            <Image className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Image</span>
          </button>
          
          <button
            onClick={() => onAddBlock('divider')}
            className="flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors group col-span-3"
          >
            <Minus className="w-5 h-5 text-gray-600 group-hover:text-primary-600 mb-1" />
            <span className="text-xs text-gray-600 group-hover:text-primary-600">Divider</span>
          </button>
        </div>
      </div>

      {/* Format Section */}
      {selectedBlock && (
        <div className="flex-1 overflow-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Format</h3>
              <button
                onClick={onDeleteBlock}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                title="Delete block"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Format Buttons */}
            <div className="flex space-x-1 mb-4">
              <button
                onClick={() => toggleStyleProperty('italic')}
                className={`p-2 rounded transition-colors ${
                  selectedBlock.style.italic
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => toggleStyleProperty('underline')}
                className={`p-2 rounded transition-colors ${
                  selectedBlock.style.underline
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Underline"
              >
                <Underline className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => toggleStyleProperty('strikethrough')}
                className={`p-2 rounded transition-colors ${
                  selectedBlock.style.strikethrough
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-4 h-4" />
              </button>
            </div>

            {/* Font Size */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Font Size</label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateStyle({ fontSize: Math.max(8, selectedBlock.style.fontSize - 2) })}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-mono w-8 text-center">{selectedBlock.style.fontSize}</span>
                <button
                  onClick={() => updateStyle({ fontSize: Math.min(72, selectedBlock.style.fontSize + 2) })}
                  className="p-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Font Weight */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Font Weight</label>
              <div className="flex space-x-1">
                {['normal', 'semibold', 'bold'].map((weight) => (
                  <button
                    key={weight}
                    onClick={() => updateStyle({ fontWeight: weight as ContentBlock['style']['fontWeight'] })}
                    className={`px-3 py-1 text-xs rounded transition-colors ${
                      selectedBlock.style.fontWeight === weight
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Alignment</label>
              <div className="flex space-x-1">
                {[
                  { value: 'left', icon: AlignLeft },
                  { value: 'center', icon: AlignCenter },
                  { value: 'right', icon: AlignRight },
                  { value: 'justify', icon: AlignJustify },
                ].map(({ value, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => updateStyle({ textAlign: value as ContentBlock['style']['textAlign'] })}
                    className={`p-2 rounded transition-colors ${
                      selectedBlock.style.textAlign === value
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Text Color</label>
              <div className="flex flex-wrap gap-2">
                {['#1f2937', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateStyle({ color })}
                    className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                      selectedBlock.style.color === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Background Color */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-2">Background Color</label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStyle({ backgroundColor: undefined })}
                  className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 bg-white ${
                    !selectedBlock.style.backgroundColor ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  title="No background"
                >
                  <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-500 opacity-20 rounded" 
                       style={{ background: 'linear-gradient(45deg, transparent 40%, red 40%, red 60%, transparent 60%)' }} />
                </button>
                {['#f3f4f6', '#fef3c7', '#dbeafe', '#d1fae5', '#fce7f3', '#e0e7ff'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateStyle({ backgroundColor: color })}
                    className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                      selectedBlock.style.backgroundColor === color ? 'border-gray-400' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Margin Top</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="4"
                  value={selectedBlock.style.marginTop}
                  onChange={(e) => updateStyle({ marginTop: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{selectedBlock.style.marginTop}px</span>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Margin Bottom</label>
                <input
                  type="range"
                  min="0"
                  max="48"
                  step="4"
                  value={selectedBlock.style.marginBottom}
                  onChange={(e) => updateStyle({ marginBottom: parseInt(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{selectedBlock.style.marginBottom}px</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">Line Height</label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={selectedBlock.style.lineHeight}
                  onChange={(e) => updateStyle({ lineHeight: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <span className="text-xs text-gray-500">{selectedBlock.style.lineHeight}</span>
              </div>
            </div>

            {/* Block-specific options */}
            {selectedBlock.type === 'heading' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">Heading Level</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <button
                      key={level}
                      onClick={() => onUpdateBlock({ 
                        metadata: { ...selectedBlock.metadata, level } 
                      })}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        (selectedBlock.metadata?.level || 1) === level
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      H{level}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedBlock.type === 'list' && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-2">List Type</label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => onUpdateBlock({ 
                      metadata: { ...selectedBlock.metadata, listType: 'bullet' } 
                    })}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
                      (selectedBlock.metadata?.listType || 'bullet') === 'bullet'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <List className="w-3 h-3" />
                    <span>Bullet</span>
                  </button>
                  <button
                    onClick={() => onUpdateBlock({ 
                      metadata: { ...selectedBlock.metadata, listType: 'numbered' } 
                    })}
                    className={`flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${
                      selectedBlock.metadata?.listType === 'numbered'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ListOrdered className="w-3 h-3" />
                    <span>Numbered</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};