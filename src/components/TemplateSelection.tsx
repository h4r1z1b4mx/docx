import React, { useState, useEffect } from 'react';
import { Document, AcademicReportData } from '../types';
import { createBannariAmmanReportTemplate, sampleBannariAmmanData } from '../templates/bannariAmmanTemplate';
import { TemplateManager, CustomTemplate } from '../utils/templateManager';
import { FileText, Plus, Trash2, User, Calendar, X, ChevronRight } from 'lucide-react';

interface TemplateSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (document: Document) => void;
}

const TemplateSelection: React.FC<TemplateSelectionProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'built-in' | 'custom'>('all');
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [formData, setFormData] = useState<AcademicReportData>(sampleBannariAmmanData);

  useEffect(() => {
    if (isOpen) {
      loadCustomTemplates();
    }
  }, [isOpen]);

  const loadCustomTemplates = () => {
    const templates = TemplateManager.getCustomTemplates();
    setCustomTemplates(templates);
  };

  if (!isOpen) return null;

  const handleCreateBlankDocument = () => {
    const blankDocument: Document = {
      id: 'doc-' + Date.now(),
      title: 'Untitled Document',
      template: 'Blank Document',
      blocks: [],
      lastModified: new Date(),
      settings: {
        pageMargins: 20,
        pageSize: 'A4',
        fontFamily: 'Arial',
        pageOrientation: 'portrait',
        lineSpacing: 1.2,
      },
    };
    onSelectTemplate(blankDocument);
    onClose();
  };

  const handleUseSampleData = () => {
    const document = createBannariAmmanReportTemplate(sampleBannariAmmanData);
    onSelectTemplate(document);
    onClose();
  };

  const handleCreateCustom = () => {
    setShowCustomForm(true);
  };

  const handleSelectCustomTemplate = (template: CustomTemplate) => {
    const document = TemplateManager.createDocumentFromTemplate(template);
    onSelectTemplate(document);
    onClose();
  };

  const handleDeleteCustomTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      TemplateManager.deleteCustomTemplate(templateId);
      loadCustomTemplates();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const document = createBannariAmmanReportTemplate(formData);
    onSelectTemplate(document);
    onClose();
    setShowCustomForm(false);
  };

  const updateStudent = (index: number, field: keyof AcademicReportData['students'][0], value: string) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    setFormData({ ...formData, students: updatedStudents });
  };

  const addStudent = () => {
    const newStudent = {
      name: '',
      registerNumber: '',
      department: formData.students[0].department,
      year: 'Fourth Year',
      section: 'A',
    };
    setFormData({ ...formData, students: [...formData.students, newStudent] });
  };

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      const updatedStudents = formData.students.filter((_, i) => i !== index);
      setFormData({ ...formData, students: updatedStudents });
    }
  };

  const builtInTemplates: CustomTemplate[] = [
    {
      id: 'bannari-amman-report',
      name: 'Academic Report',
      description: 'Professional academic report template with structured sections',
      category: 'built-in',
      createdAt: new Date(),
      blocks: [],
      settings: {
        pageMargins: 20,
        pageSize: 'A4',
        fontFamily: 'Times New Roman',
        pageOrientation: 'portrait',
        lineSpacing: 1.5,
      },
      preview: 'Complete academic report with cover page, abstract, introduction, methodology, results, and conclusion sections.',
    },
    {
      id: 'blank-document',
      name: 'Blank Document',
      description: 'Start with a clean, empty document',
      category: 'built-in',
      createdAt: new Date(),
      blocks: [],
      settings: {
        pageMargins: 20,
        pageSize: 'A4',
        fontFamily: 'Arial',
        pageOrientation: 'portrait',
        lineSpacing: 1.2,
      },
      preview: 'Empty document ready for your content',
    },
  ];

  const filteredTemplates = () => {
    const allTemplates = [...builtInTemplates, ...customTemplates];
    if (selectedTab === 'built-in') return builtInTemplates;
    if (selectedTab === 'custom') return customTemplates;
    return allTemplates;
  };

  if (showCustomForm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Create Academic Report</h2>
              <button
                onClick={() => setShowCustomForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Project Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Project Title</label>
                    <input
                      type="text"
                      value={formData.projectTitle}
                      onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Project Type</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value as 'Major Project' | 'Mini Project' | 'Internship Report' | 'Thesis' })}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="Mini Project">Mini Project</option>
                      <option value="Major Project">Major Project</option>
                      <option value="Internship Report">Internship Report</option>
                      <option value="Thesis">Thesis</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Academic Year</label>
                    <input
                      type="text"
                      value={formData.academicYear}
                      onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
              </div>

              {/* Student Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Student Information</h3>
                  <button
                    type="button"
                    onClick={addStudent}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Student</span>
                  </button>
                </div>
                {formData.students.map((student, index) => (
                  <div key={index} className="mb-4 p-3 border rounded-md bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Student {index + 1}</h4>
                      {formData.students.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStudent(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                          type="text"
                          value={student.name}
                          onChange={(e) => updateStudent(index, 'name', e.target.value)}
                          className="w-full p-2 border rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Register Number</label>
                        <input
                          type="text"
                          value={student.registerNumber}
                          onChange={(e) => updateStudent(index, 'registerNumber', e.target.value)}
                          className="w-full p-2 border rounded-md text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Department</label>
                        <input
                          type="text"
                          value={student.department}
                          onChange={(e) => updateStudent(index, 'department', e.target.value)}
                          className="w-full p-2 border rounded-md text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Report
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Choose a Template</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Template Tabs */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setSelectedTab('all')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'all'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Templates ({builtInTemplates.length + customTemplates.length})
            </button>
            <button
              onClick={() => setSelectedTab('built-in')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'built-in'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Built-in ({builtInTemplates.length})
            </button>
            <button
              onClick={() => setSelectedTab('custom')}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedTab === 'custom'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Custom ({customTemplates.length})
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates().map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  if (template.id === 'blank-document') {
                    handleCreateBlankDocument();
                  } else if (template.id === 'bannari-amman-report') {
                    handleUseSampleData();
                  } else {
                    handleSelectCustomTemplate(template);
                  }
                }}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileText className="w-8 h-8 text-blue-600 flex-shrink-0" />
                  {template.category === 'custom' && (
                    <button
                      onClick={(e) => handleDeleteCustomTemplate(template.id, e)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 p-1 transition-opacity"
                      title="Delete template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600">
                  {template.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {template.description}
                </p>
                
                {template.preview && (
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                    {template.preview}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-2">
                    {template.category === 'custom' && (
                      <>
                        {template.createdBy && (
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{template.createdBy}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{template.createdAt.toLocaleDateString()}</span>
                        </div>
                      </>
                    )}
                    {template.category === 'built-in' && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Built-in
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates().length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {selectedTab === 'custom' ? 'No Custom Templates' : 'No Templates Found'}
              </h3>
              <p className="text-gray-500 mb-4">
                {selectedTab === 'custom' 
                  ? 'You haven\'t created any custom templates yet. Create a document and save it as a template to get started.'
                  : 'No templates available in this category.'
                }
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex space-x-3">
              <button
                onClick={handleCreateBlankDocument}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Start Blank</span>
              </button>
              <button
                onClick={handleCreateCustom}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center space-x-2"
              >
                <FileText className="w-4 h-4" />
                <span>Custom Academic Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;
