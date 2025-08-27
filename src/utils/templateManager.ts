import { Document, ContentBlock } from '../types';

// Simple UUID generator
const generateId = () => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  category: 'built-in' | 'custom';
  createdAt: Date;
  createdBy?: string;
  blocks: ContentBlock[];
  settings: Document['settings'];
  preview?: string;
}

const STORAGE_KEY = 'docx-custom-templates';

export class TemplateManager {
  
  // Get all custom templates from localStorage
  static getCustomTemplates(): CustomTemplate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const templates = JSON.parse(stored);
      return templates.map((template: CustomTemplate) => ({
        ...template,
        createdAt: new Date(template.createdAt)
      }));
    } catch (error) {
      console.error('Error loading custom templates:', error);
      return [];
    }
  }

  // Save a custom template
  static saveCustomTemplate(template: Omit<CustomTemplate, 'id' | 'createdAt' | 'category'>): CustomTemplate {
    const newTemplate: CustomTemplate = {
      ...template,
      id: generateId(),
      category: 'custom',
      createdAt: new Date(),
    };

    const existingTemplates = this.getCustomTemplates();
    const updatedTemplates = [...existingTemplates, newTemplate];
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
      return newTemplate;
    } catch (error) {
      console.error('Error saving custom template:', error);
      throw new Error('Failed to save template');
    }
  }

  // Delete a custom template
  static deleteCustomTemplate(templateId: string): boolean {
    try {
      const existingTemplates = this.getCustomTemplates();
      const updatedTemplates = existingTemplates.filter(t => t.id !== templateId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTemplates));
      return true;
    } catch (error) {
      console.error('Error deleting custom template:', error);
      return false;
    }
  }

  // Create a document from a custom template
  static createDocumentFromTemplate(template: CustomTemplate, title?: string): Document {
    // Create new IDs for all blocks to avoid conflicts
    const newBlocks = template.blocks.map(block => ({
      ...block,
      id: generateId(),
    }));

    return {
      id: generateId(),
      title: title || `Document from ${template.name}`,
      template: template.name,
      blocks: newBlocks,
      lastModified: new Date(),
      settings: { ...template.settings },
    };
  }

  // Create a template from current document
  static createTemplateFromDocument(
    document: Document,
    templateName: string,
    templateDescription: string,
    createdBy?: string
  ): CustomTemplate {
    // Remove IDs from blocks for template storage
    const templateBlocks = document.blocks.map(block => ({
      ...block,
      id: generateId(), // Generate new ID for template
    }));

    const templateData = {
      name: templateName,
      description: templateDescription,
      blocks: templateBlocks,
      settings: { ...document.settings },
      createdBy,
      preview: this.generatePreview(document),
    };

    return this.saveCustomTemplate(templateData);
  }

  // Generate a text preview of the document
  private static generatePreview(document: Document): string {
    const contentBlocks = document.blocks.filter(block => 
      ['heading', 'paragraph', 'quote'].includes(block.type) && 
      block.content.trim().length > 0
    );
    
    const preview = contentBlocks
      .slice(0, 3) // Take first 3 content blocks
      .map(block => block.content)
      .join(' ')
      .substring(0, 200); // Limit to 200 characters

    return preview + (preview.length === 200 ? '...' : '');
  }

  // Get built-in templates
  static getBuiltInTemplates(): CustomTemplate[] {
    return [
      {
        id: 'bannari-amman-report',
        name: 'Bannari Amman Academic Report',
        description: 'Standard academic report template for Bannari Amman Institute',
        category: 'built-in',
        createdAt: new Date(),
        blocks: [], // This would be populated from the actual template
        settings: {
          pageMargins: 20,
          pageSize: 'A4',
          fontFamily: 'Times New Roman',
          pageOrientation: 'portrait',
          lineSpacing: 1.5,
        },
        preview: 'Academic report template with cover page, abstract, introduction, methodology...',
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
  }

  // Get all templates (built-in + custom)
  static getAllTemplates(): CustomTemplate[] {
    const builtIn = this.getBuiltInTemplates();
    const custom = this.getCustomTemplates();
    return [...builtIn, ...custom];
  }
}
