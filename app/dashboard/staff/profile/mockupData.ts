// Mockup data for staff profile development
// This matches the actual Prisma User table schema

export interface MockupProfileData {
  // Basic User Info
  id: string;
  name: string | null;
  email: string;
  role: string;
  department: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  fullName: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  maritalStatus: string | null; // SINGLE, MARRIED, DIVORCED, WIDOWED
  nationality: string | null;
  profileImage: string | null;

  // Contact Information
  mobilePrimary: string | null;
  homePhone: string | null;
  workExtension: string | null;
  alternativeEmail: string | null;

  // Employment Information
  hireDate: Date | null;
  contractType: string | null;
  employmentStatus: string | null;
  noticePeriod: number | null;
  workSchedule: string | null;
  workLocation: string | null;
  directManagerId: string | null;
  jobTitle: string | null;
  jobLevel: string | null;
  basicSalary: string | null;
  bonus: string | null;

  // Official Documents
  documentType: string | null; // ID_CARD, PASSPORT
  documentImage: string | null; // URL to document image

  // Education & Skills (Simple text fields)
  educationLevel: string | null;
  fieldOfStudy: string | null;
  generalSkills: string | null; // General skills as text
  generalExperience: string | null; // General experience as text
  englishProficiency: string | null;

  // Address (flattened)
  addressStreet: string | null;
  addressCity: string | null;
  addressCountry: string | null;
  latitude: number | null;
  longitude: number | null;

  // Emergency Contact (flattened)
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;

  // Relations
  languages: LanguageInfo[];
  education: EducationInfo[];
  workExperience: WorkExperienceInfo[];
}

export interface LanguageInfo {
  id: string;
  userId: string;
  language: string;
  proficiency: string;
  certified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EducationInfo {
  id: string;
  userId: string;
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
  userId: string;
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
  id: "staff-001",
  name: "Ahmed Al-Rashid",
  email: "ahmed.alrashid@dreamtoapp.com",
  role: "STAFF",
  department: "Development",
  isActive: true,
  lastLogin: new Date("2024-01-15T10:30:00Z"),
  createdAt: new Date("2023-06-01T09:00:00Z"),
  updatedAt: new Date("2024-01-15T10:30:00Z"),

  // Personal Information
  fullName: "Ahmed Mohammed Al-Rashid",
  dateOfBirth: new Date("1990-05-15"),
  gender: "MALE",
  maritalStatus: "MARRIED",
  nationality: "Saudi Arabian",
  profileImage: "/api/placeholder/150/150",

  // Contact Information
  mobilePrimary: "+966-50-123-4567",
  homePhone: "+966-11-234-5678",
  workExtension: "1234",
  alternativeEmail: "ahmed.rashid@gmail.com",

  // Employment Information
  hireDate: new Date("2023-06-01T09:00:00Z"),
  contractType: "FULL_TIME",
  employmentStatus: "ACTIVE",
  noticePeriod: 30,
  workSchedule: "FLEXIBLE",
  workLocation: "HYBRID",
  directManagerId: "manager-001",
  jobTitle: "Senior Frontend Developer",
  jobLevel: "SENIOR",
  basicSalary: "15,000 SAR",
  bonus: "2,000 SAR",

  // Official Documents
  documentType: "ID_CARD",
  documentImage: "/api/placeholder/400/250",

  // Education & Skills
  educationLevel: "Bachelor's Degree",
  fieldOfStudy: "Computer Science",
  generalSkills: "React, TypeScript, Next.js, Tailwind CSS, Node.js, MongoDB",
  generalExperience: "5+ years in web development, 3+ years in React ecosystem, 2+ years in Node.js backend development",
  englishProficiency: "Advanced",

  // Address
  addressStreet: "King Fahd Road, Al Olaya District",
  addressCity: "Riyadh",
  addressCountry: "SA",
  latitude: 24.7136,
  longitude: 46.6753,

  // Emergency Contact
  emergencyContactName: "Sarah Al-Rashid",
  emergencyContactPhone: "+966-50-987-6543",
  emergencyContactRelationship: "Spouse",

  // Relations
  languages: [
    {
      id: "lang-001",
      userId: "staff-001",
      language: "Arabic",
      proficiency: "NATIVE",
      certified: true,
      createdAt: new Date("2023-06-01T09:00:00Z"),
      updatedAt: new Date("2023-06-01T09:00:00Z"),
    },
    {
      id: "lang-002",
      userId: "staff-001",
      language: "English",
      proficiency: "ADVANCED",
      certified: true,
      createdAt: new Date("2023-06-01T09:00:00Z"),
      updatedAt: new Date("2023-06-01T09:00:00Z"),
    },
  ],
  education: [
    {
      id: "edu-001",
      userId: "staff-001",
      degree: "Bachelor of Science",
      institution: "King Saud University",
      field: "Computer Science",
      startDate: new Date("2010-09-01"),
      endDate: new Date("2014-06-30"),
      gpa: 3.8,
      createdAt: new Date("2023-06-01T09:00:00Z"),
      updatedAt: new Date("2023-06-01T09:00:00Z"),
    },
  ],
  workExperience: [
    {
      id: "exp-001",
      userId: "staff-001",
      company: "Tech Solutions Inc.",
      position: "Frontend Developer",
      startDate: new Date("2014-08-01"),
      endDate: new Date("2018-12-31"),
      description: "Developed responsive web applications using React and modern JavaScript frameworks",
      createdAt: new Date("2023-06-01T09:00:00Z"),
      updatedAt: new Date("2023-06-01T09:00:00Z"),
    },
    {
      id: "exp-002",
      userId: "staff-001",
      company: "Digital Innovations Ltd.",
      position: "Senior Frontend Developer",
      startDate: new Date("2019-01-01"),
      endDate: new Date("2023-05-31"),
      description: "Led frontend development team, mentored junior developers, and implemented best practices",
      createdAt: new Date("2023-06-01T09:00:00Z"),
      updatedAt: new Date("2023-06-01T09:00:00Z"),
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
    'englishProficiency',
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
