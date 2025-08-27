import React, { useState } from 'react';
import { Document } from '../types';
import { TemplateManager } from '../utils/templateManager';
import { Save, X, FileText } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document;
  onTemplateSaved?: () => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  document,
  onTemplateSaved,
}) => {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    if (!templateDescription.trim()) {
      setError('Template description is required');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      TemplateManager.createTemplateFromDocument(
        document,
        templateName.trim(),
        templateDescription.trim(),
        createdBy.trim() || undefined
      );

      // Reset form
      setTemplateName('');
      setTemplateDescription('');
      setCreatedBy('');
      
      onTemplateSaved?.();
      onClose();
    } catch (err) {
      setError('Failed to save template. Please try again.');
      console.error('Error saving template:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setTemplateName('');
    setTemplateDescription('');
    setCreatedBy('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Save as Template</h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter template name"
                maxLength={50}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {templateName.length}/50
              </div>
            </div>

            <div>
              <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="templateDescription"
                value={templateDescription}
                onChange={(e) => setTemplateDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Describe this template and when to use it"
                rows={3}
                maxLength={200}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {templateDescription.length}/200
              </div>
            </div>

            <div>
              <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700 mb-1">
                Created By (Optional)
              </label>
              <input
                type="text"
                id="createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your name or organization"
                maxLength={30}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {createdBy.length}/30
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !templateName.trim() || !templateDescription.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Template'}</span>
              </button>
            </div>
          </form>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This template will be saved locally and will be available for all future documents. 
              It includes the current document structure, formatting, and settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTemplateModal;
