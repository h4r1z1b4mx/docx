import React, { useState } from 'react';
import { Document, AcademicReportData } from '../types';
import { createBannariAmmanReportTemplate, sampleBannariAmmanData } from '../templates/bannariAmmanTemplate';

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
  const [formData, setFormData] = useState<AcademicReportData>(sampleBannariAmmanData);

  if (!isOpen) return null;

  const handleUseSampleData = () => {
    const document = createBannariAmmanReportTemplate(sampleBannariAmmanData);
    onSelectTemplate(document);
    onClose();
  };

  const handleCreateCustom = () => {
    setShowCustomForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const document = createBannariAmmanReportTemplate(formData);
    onSelectTemplate(document);
    onClose();
    setShowCustomForm(false);
  };

  const updateStudent = (index: number, field: keyof any, value: string) => {
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
      section: 'A'
    };
    setFormData({ ...formData, students: [...formData.students, newStudent] });
  };

  const removeStudent = (index: number) => {
    if (formData.students.length > 1) {
      const updatedStudents = formData.students.filter((_, i) => i !== index);
      setFormData({ ...formData, students: updatedStudents });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {!showCustomForm ? (
          // Template Selection View
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Select Academic Report Template</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid gap-6">
              <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Bannari Amman Institute of Technology Report
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Complete academic report template with cover page, bonafide certificate, 
                      declaration, acknowledgement, abstract, chapters, and references following 
                      BIT institutional format.
                    </p>
                    <div className="text-sm text-gray-500">
                      <p>Includes: Cover Page • Bonafide Certificate • Declaration • Acknowledgement</p>
                      <p>Abstract • Table of Contents • 7 Chapters • References</p>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                      <span className="text-gray-500 text-xs text-center">Preview<br/>Not Available</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleUseSampleData}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Use Sample Data
                  </button>
                  <button
                    onClick={handleCreateCustom}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Enter Custom Data
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-6 opacity-50">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Research Paper Template
                </h3>
                <p className="text-gray-600 mb-4">
                  IEEE format research paper template (Coming Soon)
                </p>
                <button disabled className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed">
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Custom Form View
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Enter Project Details</h2>
              <button
                onClick={() => setShowCustomForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.projectTitle}
                    onChange={(e) => setFormData({ ...formData, projectTitle: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Type *
                  </label>
                  <select
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Major Project">Major Project</option>
                    <option value="Mini Project">Mini Project</option>
                    <option value="Internship Report">Internship Report</option>
                    <option value="Thesis">Thesis</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                    placeholder="2024-2025"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submission Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.submissionDate}
                    onChange={(e) => setFormData({ ...formData, submissionDate: e.target.value })}
                    placeholder="April 2025"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Students */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">Students *</label>
                  <button
                    type="button"
                    onClick={addStudent}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Student
                  </button>
                </div>
                {formData.students.map((student, index) => (
                  <div key={index} className="border border-gray-200 rounded p-4 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Student Name"
                          value={student.name}
                          onChange={(e) => updateStudent(index, 'name', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Register Number"
                          value={student.registerNumber}
                          onChange={(e) => updateStudent(index, 'registerNumber', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Department"
                          value={student.department}
                          onChange={(e) => updateStudent(index, 'department', e.target.value)}
                          className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.students.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeStudent(index)}
                            className="text-red-600 hover:text-red-800 px-2"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Supervisor & HOD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Supervisor Details</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Supervisor Name"
                      value={formData.supervisor.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        supervisor: { ...formData.supervisor, name: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Designation"
                      value={formData.supervisor.designation}
                      onChange={(e) => setFormData({
                        ...formData,
                        supervisor: { ...formData.supervisor, designation: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Department"
                      value={formData.supervisor.department}
                      onChange={(e) => setFormData({
                        ...formData,
                        supervisor: { ...formData.supervisor, department: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Head of Department</h4>
                  <div className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="HOD Name"
                      value={formData.hod.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        hod: { ...formData.hod, name: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Department"
                      value={formData.hod.department}
                      onChange={(e) => setFormData({
                        ...formData,
                        hod: { ...formData.hod, department: e.target.value }
                      })}
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Abstract Keywords */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Keywords (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.abstract.keywords.join(', ')}
                  onChange={(e) => setFormData({
                    ...formData,
                    abstract: { ...formData.abstract, keywords: e.target.value.split(',').map(k => k.trim()) }
                  })}
                  placeholder="AI, Machine Learning, Document Management"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Create Report Template
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                >
                  Back to Templates
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSelection;
