import { Document, ContentBlock, AcademicReportData } from '../types';

// Simple UUID generator
const generateId = () => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Helper function to create page break
const createPageBreak = (): ContentBlock => ({
  id: generateId(),
  type: 'pagebreak',
  content: '',
  style: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#000000',
    marginTop: 0,
    marginBottom: 0,
    lineHeight: 1.0,
  }
});

export function createBannariAmmanReportTemplate(data: AcademicReportData): Document {
  const blocks: ContentBlock[] = [];

  // Cover Page
  blocks.push(
    // Institution Logo Space
    {
      id: generateId(),
      type: 'paragraph',
      content: '[COLLEGE LOGO]',
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 40,
        marginBottom: 20,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Institution Name
    {
      id: generateId(),
      type: 'paragraph',
      content: 'BANNARI AMMAN INSTITUTE OF TECHNOLOGY',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 10,
        marginBottom: 5,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Autonomous Status
    {
      id: generateId(),
      type: 'paragraph',
      content: '(Autonomous)',
      style: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 5,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Institution Address
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Sathyamangalam – 638 401, Erode District, Tamil Nadu',
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Department Name
    {
      id: generateId(),
      type: 'paragraph',
      content: `DEPARTMENT OF ${data.students[0].department.toUpperCase()}`,
      style: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Project Title
    {
      id: generateId(),
      type: 'paragraph',
      content: data.projectTitle.toUpperCase(),
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 30,
        marginBottom: 40,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    },
    // Project Report Text
    {
      id: generateId(),
      type: 'paragraph',
      content: `A ${data.projectType} Report submitted to`,
      style: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 30,
        marginBottom: 5,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Bannari Amman Institute of Technology',
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 5,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'in partial fulfillment of the requirements for the award of degree of',
      style: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 5,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Degree Name
    {
      id: generateId(),
      type: 'paragraph',
      content: `BACHELOR OF ENGINEERING IN ${data.students[0].department.toUpperCase()}`,
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 40,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    // Submitted By
    {
      id: generateId(),
      type: 'paragraph',
      content: 'SUBMITTED BY',
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 30,
        marginBottom: 20,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Student Names and Register Numbers
  data.students.forEach(student => {
    blocks.push({
      id: generateId(),
      type: 'paragraph',
      content: `${student.name.toUpperCase()} - ${student.registerNumber}`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 3,
        marginBottom: 3,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    });
  });

  // Supervisor Information
  blocks.push(
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Under the guidance of',
      style: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 30,
        marginBottom: 10,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.supervisor.name.toUpperCase(),
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 3,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.supervisor.designation,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 3,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `Department of ${data.supervisor.department}`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 40,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Industry Guide (if available)
  if (data.industryGuide) {
    blocks.push(
      {
        id: generateId(),
        type: 'paragraph',
        content: 'Industry Guide',
        style: {
          fontSize: 14,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#000000',
          marginTop: 20,
          marginBottom: 10,
          lineHeight: 1.2,
          fontFamily: 'Times New Roman'
        }
      },
      {
        id: generateId(),
        type: 'paragraph',
        content: data.industryGuide.name.toUpperCase(),
        style: {
          fontSize: 14,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#000000',
          marginTop: 0,
          marginBottom: 3,
          lineHeight: 1.2,
          fontFamily: 'Times New Roman'
        }
      },
      {
        id: generateId(),
        type: 'paragraph',
        content: data.industryGuide.designation,
        style: {
          fontSize: 13,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#000000',
          marginTop: 0,
          marginBottom: 3,
          lineHeight: 1.2,
          fontFamily: 'Times New Roman'
        }
      },
      {
        id: generateId(),
        type: 'paragraph',
        content: data.industryGuide.company,
        style: {
          fontSize: 13,
          fontWeight: 'normal',
          textAlign: 'center',
          color: '#000000',
          marginTop: 0,
          marginBottom: 30,
          lineHeight: 1.2,
          fontFamily: 'Times New Roman'
        }
      }
    );
  }

  // Academic Year and Date
  blocks.push(
    {
      id: generateId(),
      type: 'paragraph',
      content: `Academic Year: ${data.academicYear}`,
      style: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 40,
        marginBottom: 10,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.submissionDate,
      style: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#000000',
        marginTop: 0,
        marginBottom: 50,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Page Break
  blocks.push({
    id: generateId(),
    type: 'divider',
    content: '--- PAGE BREAK ---',
    style: {
      fontSize: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#ffffff',
      marginTop: 50,
      marginBottom: 50,
      lineHeight: 1,
      fontFamily: 'Times New Roman'
    }
  });

  // PAGE BREAK - End of Cover Page
  blocks.push(createPageBreak());

  // Bonafide Certificate Page
  blocks.push(
    {
      id: generateId(),
      type: 'heading',
      content: 'BONAFIDE CERTIFICATE',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `This is to certify that the project work entitled "${data.projectTitle}" is a bonafide work carried out by ${data.students.map(s => s.name).join(', ')} (Register Number: ${data.students.map(s => s.registerNumber).join(', ')}) in partial fulfillment of the requirements for the award of Bachelor of Engineering in ${data.students[0].department} during the academic year ${data.academicYear}.`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    // Supervisor Signature
    {
      id: generateId(),
      type: 'paragraph',
      content: `${data.supervisor.name}\n${data.supervisor.designation}\nDepartment of ${data.supervisor.department}\nBannari Amman Institute of Technology`,
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#000000',
        marginTop: 60,
        marginBottom: 20,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    },
    // HOD Signature
    {
      id: generateId(),
      type: 'paragraph',
      content: `${data.hod.name}\nHead of the Department\nDepartment of ${data.hod.department}\nBannari Amman Institute of Technology`,
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'right',
        color: '#000000',
        marginTop: -80,
        marginBottom: 50,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Another Page Break
  blocks.push({
    id: generateId(),
    type: 'divider',
    content: '--- PAGE BREAK ---',
    style: {
      fontSize: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#ffffff',
      marginTop: 50,
      marginBottom: 50,
      lineHeight: 1,
      fontFamily: 'Times New Roman'
    }
  });

  // PAGE BREAK - End of Bonafide Page
  blocks.push(createPageBreak());

  // Declaration
  blocks.push(
    {
      id: generateId(),
      type: 'heading',
      content: 'DECLARATION',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `We hereby declare that the project work entitled "${data.projectTitle}" submitted to Bannari Amman Institute of Technology is a record of an original work done by us under the guidance of ${data.supervisor.name}, ${data.supervisor.designation}, Department of ${data.supervisor.department}, Bannari Amman Institute of Technology and it has not formed the basis for the award of any degree/diploma/fellowship or similar title to any candidate of any university.`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 20,
        marginBottom: 50,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Student signatures
  data.students.forEach((student, index) => {
    blocks.push({
      id: generateId(),
      type: 'paragraph',
      content: `${student.name}\nRegister Number: ${student.registerNumber}\nDepartment of ${student.department}`,
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: index % 2 === 0 ? 'left' : 'right',
        color: '#000000',
        marginTop: index === 0 ? 60 : (index % 2 === 0 ? 20 : -60),
        marginBottom: 20,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    });
  });

  // Date and Place
  blocks.push(
    {
      id: generateId(),
      type: 'paragraph',
      content: `Place: Sathyamangalam\nDate: ${data.submissionDate}`,
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#000000',
        marginTop: 40,
        marginBottom: 50,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Page Break
  blocks.push({
    id: generateId(),
    type: 'divider',
    content: '--- PAGE BREAK ---',
    style: {
      fontSize: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#ffffff',
      marginTop: 50,
      marginBottom: 50,
      lineHeight: 1,
      fontFamily: 'Times New Roman'
    }
  });

  // PAGE BREAK - End of Declaration Page
  blocks.push(createPageBreak());

  // Acknowledgement
  blocks.push(
    {
      id: generateId(),
      type: 'heading',
      content: 'ACKNOWLEDGEMENT',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `We would like to express our sincere gratitude to our project guide ${data.supervisor.name}, ${data.supervisor.designation}, Department of ${data.supervisor.department}, Bannari Amman Institute of Technology for the continuous support, guidance and encouragement throughout the project work.\n\nWe extend our heartfelt thanks to ${data.hod.name}, Head of the Department of ${data.hod.department}, for providing necessary facilities and support.\n\nWe also thank all the faculty members of the Department of ${data.students[0].department} and our friends who have directly or indirectly helped us in the successful completion of this project.\n\nAbove all, we thank the Almighty for giving us the strength and knowledge to complete this project successfully.`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 20,
        marginBottom: 40,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.students.map(s => s.name).join('\n'),
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'right',
        color: '#000000',
        marginTop: 40,
        marginBottom: 50,
        lineHeight: 1.3,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Page Break
  blocks.push({
    id: generateId(),
    type: 'divider',
    content: '--- PAGE BREAK ---',
    style: {
      fontSize: 1,
      fontWeight: 'normal',
      textAlign: 'center',
      color: '#ffffff',
      marginTop: 50,
      marginBottom: 50,
      lineHeight: 1,
      fontFamily: 'Times New Roman'
    }
  });

  // PAGE BREAK - End of Acknowledgement Page  
  blocks.push(createPageBreak());

  // Abstract
  blocks.push(
    {
      id: generateId(),
      type: 'heading',
      content: 'ABSTRACT',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.abstract.background,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 15,
        marginBottom: 12,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.abstract.objectives,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 0,
        marginBottom: 12,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.abstract.methodology,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 0,
        marginBottom: 12,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.abstract.results,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 0,
        marginBottom: 12,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: data.abstract.conclusions,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 0,
        marginBottom: 20,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `Keywords: ${data.abstract.keywords.join(', ')}.`,
      style: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 0,
        marginBottom: 50,
        lineHeight: 1.5,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // PAGE BREAK - End of Abstract Page
  blocks.push(createPageBreak());

  // Table of Contents
  blocks.push(
    {
      id: generateId(),
      type: 'heading',
      content: 'TABLE OF CONTENTS',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: `BONAFIDE CERTIFICATE                                                    i
DECLARATION                                                              ii
ACKNOWLEDGEMENT                                                          iii
ABSTRACT                                                                 iv
TABLE OF CONTENTS                                                        v
LIST OF FIGURES                                                          vi
LIST OF TABLES                                                           vii

CHAPTER 1: INTRODUCTION                                                  1
CHAPTER 2: LITERATURE SURVEY                                            5
CHAPTER 3: OBJECTIVES                                                    10
CHAPTER 4: METHODOLOGY                                                   12
CHAPTER 5: PROPOSED WORK                                                 18
CHAPTER 6: RESULTS AND DISCUSSIONS                                       25
CHAPTER 7: CONCLUSIONS AND FUTURE WORK                                   32

REFERENCES                                                               35
APPENDICES                                                               38`,
      style: {
        fontSize: 13,
        fontWeight: 'normal',
        textAlign: 'left',
        color: '#000000',
        marginTop: 20,
        marginBottom: 50,
        lineHeight: 1.8,
        fontFamily: 'Times New Roman'
      }
    }
  );

  // Chapters
  const chapters = [
    { title: 'CHAPTER 1: INTRODUCTION', content: data.chapters.introduction },
    { title: 'CHAPTER 2: LITERATURE SURVEY', content: data.chapters.literatureSurvey },
    { title: 'CHAPTER 3: OBJECTIVES', content: data.chapters.objectives },
    { title: 'CHAPTER 4: METHODOLOGY', content: data.chapters.methodology },
    { title: 'CHAPTER 5: PROPOSED WORK', content: data.chapters.proposedWork },
    { title: 'CHAPTER 6: RESULTS AND DISCUSSIONS', content: data.chapters.results },
    { title: 'CHAPTER 7: CONCLUSIONS AND FUTURE WORK', content: `${data.chapters.conclusions}\n\n7.2 FUTURE WORK\n\n${data.chapters.futureWork}` }
  ];

  chapters.forEach(chapter => {
    // PAGE BREAK - Before each chapter
    blocks.push(createPageBreak());
    
    blocks.push(
      {
        id: generateId(),
        type: 'heading',
        content: chapter.title,
        style: {
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#000000',
          marginTop: 50,
          marginBottom: 25,
          lineHeight: 1.2,
          fontFamily: 'Times New Roman'
        },
        metadata: { level: 1 }
      },
      {
        id: generateId(),
        type: 'paragraph',
        content: chapter.content,
        style: {
          fontSize: 13,
          fontWeight: 'normal',
          textAlign: 'justify',
          color: '#000000',
          marginTop: 15,
          marginBottom: 15,
          lineHeight: 1.5,
          fontFamily: 'Times New Roman'
        }
      }
    );
  });

  // References
  blocks.push(
    {
      id: generateId(),
      type: 'divider',
      content: '--- PAGE BREAK ---',
      style: {
        fontSize: 1,
        fontWeight: 'normal',
        textAlign: 'center',
        color: '#ffffff',
        marginTop: 50,
        marginBottom: 50,
        lineHeight: 1,
        fontFamily: 'Times New Roman'
      }
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'REFERENCES',
      style: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000000',
        marginTop: 50,
        marginBottom: 30,
        lineHeight: 1.2,
        fontFamily: 'Times New Roman'
      },
      metadata: { level: 1 }
    }
  );

  // Reference entries
  data.references.forEach((ref, index) => {
    const refText = formatReference(ref, index + 1);
    blocks.push({
      id: generateId(),
      type: 'paragraph',
      content: refText,
      style: {
        fontSize: 12,
        fontWeight: 'normal',
        textAlign: 'justify',
        color: '#000000',
        marginTop: 8,
        marginBottom: 8,
        lineHeight: 1.4,
        fontFamily: 'Times New Roman'
      }
    });
  });

  return {
    id: generateId(),
    title: data.projectTitle,
    template: 'bannari-amman-report',
    blocks,
    lastModified: new Date(),
    settings: {
      pageMargins: 72, // 1 inch margins
      pageSize: 'A4',
      fontFamily: 'Times New Roman',
      pageOrientation: 'portrait',
      lineSpacing: 1.5,
      headerText: '',
      footerText: ''
    }
  };
}

function formatReference(ref: any, index: number): string {
  const authors = ref.authors.join(', ');
  let refString = `[${index}] ${authors}, "${ref.title},"`;
  
  if (ref.journal) {
    refString += ` ${ref.journal}`;
    if (ref.volume) refString += `, Vol. ${ref.volume}`;
    if (ref.issue) refString += `, No. ${ref.issue}`;
  } else if (ref.conference) {
    refString += ` in Proceedings of ${ref.conference}`;
  }
  
  if (ref.pages) refString += `, pp. ${ref.pages}`;
  refString += `, ${ref.year}.`;
  
  if (ref.publisher) refString += ` ${ref.publisher}.`;
  if (ref.doi) refString += ` DOI: ${ref.doi}`;
  if (ref.url) refString += ` Available: ${ref.url}`;
  
  return refString;
}

// Sample data for demonstration
export const sampleBannariAmmanData: AcademicReportData = {
  projectTitle: "Development of Smart Document Management System Using Artificial Intelligence and Machine Learning Techniques",
  projectType: "Major Project",
  academicYear: "2024-2025",
  submissionDate: "April 2025",
  students: [
    {
      name: "John Doe",
      registerNumber: "19IT001",
      department: "Information Technology",
      year: "Fourth Year",
      section: "A"
    },
    {
      name: "Jane Smith", 
      registerNumber: "19IT002",
      department: "Information Technology",
      year: "Fourth Year",
      section: "A"
    }
  ],
  supervisor: {
    name: "Dr. Rajesh Kumar",
    designation: "Professor",
    department: "Information Technology"
  },
  hod: {
    name: "Dr. Priya Sharma",
    department: "Information Technology"
  },
  industryGuide: {
    name: "Mr. Arun Patel",
    designation: "Senior Software Engineer",
    company: "TechCorp Solutions Pvt. Ltd."
  },
  abstract: {
    background: "In today's digital era, organizations handle massive amounts of documents that require efficient management and retrieval systems. Traditional document management approaches often lack intelligent features and fail to provide semantic search capabilities, leading to reduced productivity and increased operational costs.",
    objectives: "The primary objective of this project is to develop an intelligent document management system that leverages artificial intelligence and machine learning techniques to provide automated document classification, intelligent search capabilities, content analysis, and real-time collaboration features.",
    methodology: "The system is developed using modern web technologies including React.js for the frontend, Node.js with Express.js for the backend API, and MongoDB for data storage. Machine learning algorithms such as Natural Language Processing (NLP), text classification models using TensorFlow, and document similarity algorithms are implemented to provide intelligent features.",
    results: "The developed system successfully demonstrates automated document classification with 92% accuracy, intelligent search capabilities with contextual understanding, real-time collaboration features, and secure access control. Performance testing shows the system can efficiently handle up to 10,000 documents with response times under 2 seconds.",
    conclusions: "The Smart Document Management System provides significant improvements over traditional document management approaches through AI-powered features. The system enhances organizational productivity, improves document accessibility, and maintains high security and compliance standards. The integration of machine learning algorithms enables intelligent document processing and user-friendly search capabilities.",
    keywords: ["Document Management System", "Artificial Intelligence", "Machine Learning", "Natural Language Processing", "Web Application", "Data Mining", "Information Retrieval", "Smart Systems"]
  },
  chapters: {
    introduction: "Document management is a critical aspect of modern organizational operations. With the exponential growth of digital content, organizations face challenges in efficiently storing, retrieving, and managing vast amounts of documents. Traditional file management systems lack the intelligence required to understand document content and provide meaningful search results.\n\nThe emergence of artificial intelligence and machine learning technologies has opened new possibilities for creating intelligent document management solutions. These technologies can analyze document content, understand context, and provide automated classification and retrieval capabilities.\n\nThis project aims to develop a comprehensive document management system that incorporates AI and ML techniques to address the limitations of traditional systems. The system will provide features such as automated document classification, intelligent search, content analysis, and collaborative editing capabilities.\n\nThe scope of this project includes the design and implementation of a web-based document management system with AI-powered features, development of machine learning models for document classification and content analysis, implementation of secure user authentication and access control, and integration of real-time collaboration features.",
    literatureSurvey: "Extensive research has been conducted in the field of document management systems and artificial intelligence applications. Smith et al. (2023) proposed a machine learning approach for automated document classification using deep neural networks, achieving 89% accuracy on diverse document types.\n\nKumar and Patel (2022) developed a semantic search engine for document retrieval using natural language processing techniques. Their system demonstrated significant improvements in search relevance compared to traditional keyword-based approaches.\n\nRecent studies by Johnson et al. (2024) explored the use of transformer models for document understanding and content analysis. Their research showed promising results in extracting meaningful insights from unstructured documents.\n\nThe literature review reveals a growing trend toward intelligent document management solutions that leverage AI and ML technologies. However, most existing systems focus on specific aspects such as classification or search, lacking comprehensive integration of multiple AI features.\n\nThis project aims to bridge this gap by developing a holistic document management system that integrates various AI and ML techniques to provide a complete solution for organizational document management needs.",
    objectives: "The main objectives of this project are:\n\n1. Primary Objectives:\n   • To design and develop an intelligent document management system with AI-powered features\n   • To implement automated document classification using machine learning algorithms\n   • To create an intelligent search engine with natural language processing capabilities\n   • To develop real-time collaboration features for document editing and sharing\n\n2. Secondary Objectives:\n   • To ensure secure user authentication and role-based access control\n   • To implement document version control and audit trail features\n   • To create an intuitive user interface for enhanced user experience\n   • To optimize system performance for handling large document repositories\n\n3. Technical Objectives:\n   • To achieve document classification accuracy above 90%\n   • To maintain search response times under 2 seconds for repositories up to 10,000 documents\n   • To support multiple document formats including PDF, DOCX, TXT, and images\n   • To implement scalable architecture for future enhancements",
    methodology: "The development methodology follows an agile approach with iterative design and implementation phases. The system architecture is based on a three-tier model consisting of presentation layer, business logic layer, and data access layer.\n\n4.1 System Architecture:\nThe system adopts a microservices architecture with the following components:\n• Frontend Application: React.js with responsive design\n• Backend API: Node.js with Express.js framework\n• Database: MongoDB for document metadata and MySQL for user data\n• ML Service: Python-based service using TensorFlow and scikit-learn\n• File Storage: Amazon S3 for document storage\n\n4.2 Machine Learning Implementation:\nThe ML pipeline consists of:\n• Data Preprocessing: Text extraction and cleaning\n• Feature Engineering: TF-IDF vectorization and word embeddings\n• Model Training: Support Vector Machine and Neural Network classifiers\n• Model Evaluation: Cross-validation and performance metrics\n\n4.3 Development Process:\nThe development follows these phases:\n1. Requirements Analysis and System Design\n2. Database Design and Implementation\n3. Backend API Development\n4. Machine Learning Model Development\n5. Frontend Application Development\n6. Integration and Testing\n7. Deployment and Performance Optimization",
    proposedWork: "The proposed Smart Document Management System incorporates several innovative features that distinguish it from existing solutions:\n\n5.1 Intelligent Document Classification:\nThe system uses a hybrid approach combining rule-based classification and machine learning models. Documents are automatically categorized based on content analysis using trained neural networks and predefined business rules.\n\n5.2 Advanced Search Capabilities:\nThe search engine implements semantic search using natural language processing. Users can search using natural language queries, and the system understands context and intent to provide relevant results.\n\n5.3 Content Analysis and Insights:\nThe system extracts key information from documents including:\n• Named entity recognition for identifying people, organizations, and locations\n• Sentiment analysis for understanding document tone\n• Topic modeling for content categorization\n• Document similarity analysis for finding related content\n\n5.4 Collaborative Features:\nReal-time collaboration capabilities include:\n• Multi-user document editing with conflict resolution\n• Comments and annotations system\n• Version control with change tracking\n• Notification system for document updates\n\n5.5 Security and Access Control:\nRobust security measures include:\n• Role-based access control (RBAC)\n• Document-level permissions\n• Audit trail for all document operations\n• Data encryption at rest and in transit\n\n5.6 User Interface Design:\nThe system features an intuitive web interface with:\n• Dashboard with document statistics and recent activities\n• Advanced search filters and faceted navigation\n• Drag-and-drop document upload\n• Mobile-responsive design for cross-device compatibility",
    results: "The implementation and testing of the Smart Document Management System yielded significant positive results across multiple performance metrics:\n\n6.1 Classification Performance:\n• Overall classification accuracy: 92.5%\n• Precision: 91.8%\n• Recall: 90.2%\n• F1-Score: 91.0%\nThe system successfully classified documents across 12 different categories with consistently high accuracy.\n\n6.2 Search Performance:\n• Average search response time: 1.3 seconds\n• Search relevance score: 89% user satisfaction\n• Query processing capability: 500 concurrent searches\n• Index update time: Real-time for new document additions\n\n6.3 System Performance:\n• Document upload speed: 15 MB/minute average\n• Concurrent user support: Up to 100 simultaneous users\n• Storage capacity tested: 50,000 documents (2TB total size)\n• System uptime: 99.7% during testing period\n\n6.4 User Experience Metrics:\n• User interface usability score: 8.5/10\n• Feature adoption rate: 85% of users utilize advanced search\n• Document retrieval success rate: 94%\n• User training time reduced by 60% compared to legacy systems\n\n6.5 Collaboration Features:\n• Real-time editing latency: <200ms\n• Concurrent editing support: Up to 10 users per document\n• Version control effectiveness: 100% change tracking accuracy\n• Comment and annotation usage: 78% user engagement\n\n6.6 Security Testing Results:\n• Penetration testing: No critical vulnerabilities identified\n• Access control effectiveness: 100% proper permission enforcement\n• Data encryption verification: All data encrypted successfully\n• Audit trail completeness: 100% operation logging",
    conclusions: "The Smart Document Management System project has successfully achieved its primary objectives and demonstrated significant advantages over traditional document management approaches. The integration of artificial intelligence and machine learning technologies has resulted in a comprehensive solution that addresses key challenges in organizational document management.\n\nKey achievements include the development of an intelligent classification system with 92.5% accuracy, implementation of advanced search capabilities with natural language processing, and creation of collaborative features that enhance team productivity. The system's architecture ensures scalability and maintainability while providing robust security measures.\n\nThe project has contributed to the field of intelligent document management by demonstrating the practical application of AI and ML technologies in enterprise solutions. The hybrid approach combining multiple AI techniques has proven effective in creating a user-friendly and efficient system.\n\nThe positive user feedback and performance metrics validate the system's effectiveness in real-world scenarios. Organizations implementing this solution can expect improved document accessibility, reduced search times, and enhanced collaboration capabilities.",
    futureWork: "Several enhancements and extensions can be implemented to further improve the system's capabilities:\n\n7.2.1 Advanced AI Features:\n• Integration of large language models (LLMs) for document summarization\n• Implementation of computer vision for image and handwritten document analysis\n• Development of predictive analytics for document usage patterns\n• Addition of voice-to-text capabilities for audio document processing\n\n7.2.2 Mobile Application Development:\n• Native mobile applications for iOS and Android platforms\n• Offline document access and synchronization capabilities\n• Mobile-specific features such as document scanning using camera\n• Push notifications for document updates and collaboration activities\n\n7.2.3 Integration Capabilities:\n• API development for third-party system integration\n• Enterprise system connectors (SAP, Oracle, Microsoft Office 365)\n• Cloud storage integration (Google Drive, Dropbox, OneDrive)\n• Email system integration for automatic document archiving\n\n7.2.4 Advanced Analytics:\n• Business intelligence dashboard for document usage analytics\n• Compliance reporting and audit trail visualization\n• User behavior analysis for system optimization\n• Predictive modeling for storage and resource planning\n\n7.2.5 Emerging Technologies:\n• Blockchain integration for document authenticity verification\n• Internet of Things (IoT) integration for automated document capture\n• Augmented Reality (AR) features for document visualization\n• Edge computing implementation for improved performance"
  },
  references: [
    {
      authors: ["Smith, J.", "Anderson, K.", "Brown, M."],
      title: "Intelligent Document Classification Using Deep Neural Networks: A Comprehensive Study",
      journal: "IEEE Transactions on Knowledge and Data Engineering",
      volume: "35",
      issue: "4",
      pages: "2145-2158",
      year: 2023,
      publisher: "IEEE",
      doi: "10.1109/TKDE.2023.1234567"
    },
    {
      authors: ["Kumar, R.", "Patel, S."],
      title: "Semantic Search Engine for Enterprise Document Retrieval Using Natural Language Processing",
      conference: "International Conference on Artificial Intelligence and Machine Learning",
      pages: "123-135",
      year: 2022,
      publisher: "ACM"
    },
    {
      authors: ["Johnson, A.", "Williams, E.", "Davis, C."],
      title: "Transformer Models for Document Understanding and Content Analysis",
      journal: "Journal of Artificial Intelligence Research",
      volume: "78",
      pages: "45-72",
      year: 2024,
      doi: "10.1613/jair.1.14567"
    },
    {
      authors: ["Chen, L.", "Zhang, W."],
      title: "Real-time Collaborative Document Editing Systems: Architectures and Implementation Strategies",
      journal: "ACM Computing Surveys",
      volume: "56",
      issue: "2",
      pages: "1-35",
      year: 2023,
      publisher: "ACM",
      doi: "10.1145/3578321"
    },
    {
      authors: ["Martinez, D.", "Thompson, R.", "Lee, S."],
      title: "Security Frameworks for Cloud-based Document Management Systems",
      conference: "International Conference on Cloud Computing and Security",
      pages: "89-102",
      year: 2023,
      publisher: "Springer"
    }
  ]
};
