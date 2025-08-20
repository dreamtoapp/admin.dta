// Mockup data for staff profile development
// This matches the actual Prisma User table schema

export interface MockupProfileData {
  // Basic User Info (from User model)
  id: string;
  name: string | null;
  email: string;
  role: 'ADMIN' | 'STAFF' | 'CLIENT';
  department: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information (from User model)
  fullName: string | null;
  dateOfBirth: Date | null;
  gender: 'MALE' | 'FEMALE' | null;
  maritalStatus: 'SINGLE' | 'MARRIED' | 'DIVORCED' | 'WIDOWED' | null;
  nationality: string | null;
  profileImage: string | null;

  // Contact Information (from User model)
  mobilePrimary: string | null;
  homePhone: string | null;
  workExtension: string | null;
  alternativeEmail: string | null;

  // Employment Information (from User model)
  hireDate: Date | null;
  contractType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | null;
  employmentStatus: 'ACTIVE' | 'INACTIVE' | null;
  noticePeriod: number | null;
  workSchedule: 'FLEXIBLE' | 'FIXED' | null;
  workLocation: 'OFFICE' | 'REMOTE' | 'HYBRID' | null;
  directManagerId: string | null;
  jobTitle: string | null;
  jobLevel: string | null;
  basicSalary: string | null;
  bonus: string | null;

  // Official Documents (from User model)
  documentType: 'ID_CARD' | 'PASSPORT' | null;
  documentImage: string | null;

  // Education & Skills (from User model)
  educationLevel: string | null;
  fieldOfStudy: string | null;
  generalSkills: string | null;
  generalExperience: string | null;

  // Language Proficiency (simplified)
  englishProficiency: string | null;

  // Address (flattened in User model)
  addressStreet: string | null;
  addressCity: string | null;
  addressCountry: string | null;

  // Emergency Contact (flattened in User model)
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;

  // Relations (from related models)
  education: EducationInfo[];
  workExperience: WorkExperienceInfo[];

  // Manager info
  directManager: {
    id: string;
    fullName: string | null;
    email: string;
    jobTitle: string | null;
  } | null;

  // Subordinates
  subordinates: Array<{
    id: string;
    fullName: string | null;
    email: string;
    jobTitle: string | null;
  }>;
}

export interface EducationInfo {
  id: string;
  degree: string;
  institution: string;
  field: string;
  startDate: Date;
  endDate: Date | null;
  gpa: number | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperienceInfo {
  id: string;
  company: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Sample mockup data matching Prisma schema
export const mockupProfileData: MockupProfileData = {
  // Basic User Info
  id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john.doe@dreamtoapp.com",
  role: "STAFF",
  department: "Development",
  isActive: true,
  lastLogin: new Date("2024-01-15T10:30:00Z"),
  createdAt: new Date("2023-06-01T00:00:00Z"),
  updatedAt: new Date("2024-01-15T10:30:00Z"),

  // Personal Information
  fullName: "John Michael Doe",
  dateOfBirth: new Date("1990-05-15"),
  gender: "MALE",
  maritalStatus: "SINGLE",
  nationality: "Saudi Arabian",
  profileImage: "/api/placeholder/150/150",

  // Contact Information
  mobilePrimary: "+966-50-123-4567",
  homePhone: "+966-11-234-5678",
  workExtension: "1234",
  alternativeEmail: "john.doe.personal@gmail.com",

  // Employment Information
  hireDate: new Date("2023-06-01"),
  contractType: "FULL_TIME",
  employmentStatus: "ACTIVE",
  noticePeriod: 30,
  workSchedule: "FLEXIBLE",
  workLocation: "HYBRID",
  directManagerId: "507f1f77bcf86cd799439012",
  jobTitle: "Senior Full Stack Developer",
  jobLevel: "Mid-Level",
  basicSalary: "15,000 SAR",
  bonus: "2,000 SAR",

  // Official Documents
  documentType: "ID_CARD",
  documentImage: "/api/placeholder/400/250",

  // Education & Skills
  educationLevel: "Bachelor's Degree",
  fieldOfStudy: "Computer Science",
  generalSkills: "React, Node.js, MongoDB, Express.js, TypeScript",
  generalExperience: "5+ years in web development, 3+ years in React ecosystem, 2+ years in Node.js backend development",

  // Language Proficiency
  englishProficiency: "85",

  // Address
  addressStreet: "King Fahd Road, Al Olaya District",
  addressCity: "Riyadh",
  addressCountry: "Saudi Arabia",

  // Emergency Contact
  emergencyContactName: "Sarah Doe",
  emergencyContactPhone: "+966-50-987-6543",
  emergencyContactRelationship: "Spouse",

  // Education
  education: [
    {
      id: "507f1f77bcf86cd799439031",
      degree: "Bachelor of Science",
      institution: "King Saud University",
      field: "Computer Science",
      startDate: new Date("2008-09-01"),
      endDate: new Date("2012-06-01"),
      gpa: 3.8,
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
    },
    {
      id: "507f1f77bcf86cd799439032",
      degree: "Master of Science",
      institution: "King Fahd University of Petroleum and Minerals",
      field: "Software Engineering",
      startDate: new Date("2012-09-01"),
      endDate: new Date("2014-06-01"),
      gpa: 3.9,
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
    },
  ],

  // Work Experience
  workExperience: [
    {
      id: "507f1f77bcf86cd799439041",
      company: "Tech Solutions Ltd.",
      position: "Junior Developer",
      startDate: new Date("2014-07-01"),
      endDate: new Date("2017-06-01"),
      description: "Developed web applications using JavaScript and PHP. Worked on frontend and backend development.",
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
    },
    {
      id: "507f1f77bcf86cd799439042",
      company: "Digital Innovations Co.",
      position: "Full Stack Developer",
      startDate: new Date("2017-07-01"),
      endDate: new Date("2023-05-01"),
      description: "Led development of multiple web applications using React, Node.js, and MongoDB. Mentored junior developers.",
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-01"),
    },
  ],

  // Manager info
  directManager: {
    id: "507f1f77bcf86cd799439012",
    fullName: "Ahmed Al-Rashid",
    email: "ahmed.alrashid@dreamtoapp.com",
    jobTitle: "Development Manager",
  },

  // Subordinates
  subordinates: [
    {
      id: "507f1f77bcf86cd799439013",
      fullName: "Fatima Al-Zahra",
      email: "fatima.alzahra@dreamtoapp.com",
      jobTitle: "Junior Developer",
    },
    {
      id: "507f1f77bcf86cd799439014",
      fullName: "Omar Al-Hassan",
      email: "omar.alhassan@dreamtoapp.com",
      jobTitle: "Frontend Developer",
    },
  ],
};

// Calculate profile completion percentage based on actual Prisma fields
export function calculateProfileCompletion(data: MockupProfileData): number {
  const requiredFields = [
    'fullName',
    'dateOfBirth',
    'gender',
    'nationality',
    'mobilePrimary',
    'hireDate',
    'jobTitle',
    'basicSalary',
    'addressStreet',
    'addressCity',
    'addressCountry',
    'emergencyContactName',
    'emergencyContactPhone',
    'emergencyContactRelationship',
  ];

  const optionalFields = [
    'profileImage',
    'homePhone',
    'workExtension',
    'alternativeEmail',
    'contractType',
    'employmentStatus',
    'workSchedule',
    'workLocation',
    'jobLevel',
    'bonus',
    'documentType',
    'documentImage',
    'educationLevel',
    'fieldOfStudy',
    'generalSkills',
    'generalExperience',
  ];

  let completedRequired = 0;
  let completedOptional = 0;

  // Check required fields
  requiredFields.forEach(field => {
    const value = data[field as keyof MockupProfileData];
    if (value !== null && value !== undefined && value !== '') {
      completedRequired++;
    }
  });

  // Check optional fields
  optionalFields.forEach(field => {
    const value = data[field as keyof MockupProfileData];
    if (value !== null && value !== undefined && value !== '') {
      completedOptional++;
    }
  });

  // Check relations
  const hasEducation = data.education.length > 0;
  const hasWorkExperience = data.workExperience.length > 0;

  const totalRequired = requiredFields.length + 2; // +2 for relations
  const totalOptional = optionalFields.length;

  const completedTotal = completedRequired + (hasEducation ? 1 : 0) + (hasWorkExperience ? 1 : 0) + completedOptional;

  return Math.round((completedTotal / (totalRequired + totalOptional)) * 100);
}
