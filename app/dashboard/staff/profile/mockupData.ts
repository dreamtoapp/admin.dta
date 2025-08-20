// Mockup data for staff profile development
// This will be replaced with real API data later

export interface MockupProfileData {
  personal: PersonalInfo;
  contact: ContactInfo;
  address: AddressInfo;
  emergency: EmergencyContact;
  skills: SkillsInfo;
  languages: LanguageInfo[];
  education: EducationInfo[];
  workExperience: WorkExperienceInfo[];
  admin: AdminManagedInfo;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  profileImage: string;
  maritalStatus: string;
  bloodType: string;
}

export interface ContactInfo {
  mobilePrimary: string;
  homePhone: string;
  workExtension: string;
  alternativeEmail: string;
}

export interface AddressInfo {
  currentAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  permanentAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  addressType: string;
  verificationStatus: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  alternativePhone: string;
}

export interface SkillsInfo {
  technicalSkills: Array<{
    name: string;
    level: string;
    certification: string;
    expiry: string;
  }>;
  softSkills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    expiry: string;
  }>;
}

export interface LanguageInfo {
  language: string;
  proficiency: string;
  certified: boolean;
  certificationDate?: string;
}

export interface EducationInfo {
  degree: string;
  institution: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: number;
  country: string;
}

export interface WorkExperienceInfo {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  country: string;
}

export interface AdminManagedInfo {
  employeeId: string;
  department: string;
  jobTitle: string;
  hireDate: string;
  contractType: string;
  employmentStatus: string;
  directManager: string;
  basicSalary: string;
  bonus: string;
  workSchedule: string;
  workLocation: string;
}

// Sample mockup data
export const mockupProfileData: MockupProfileData = {
  personal: {
    fullName: "Ahmed Hassan Al-Rashid",
    dateOfBirth: "1990-05-15",
    gender: "MALE",
    nationality: "Saudi Arabian",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    maritalStatus: "Married",
    bloodType: "O+"
  },
  contact: {
    mobilePrimary: "+966-50-123-4567",
    homePhone: "+966-11-234-5678",
    workExtension: "1234",
    alternativeEmail: "ahmed.personal@email.com"
  },
  address: {
    currentAddress: {
      street: "King Fahd Road, Building 45",
      city: "Riyadh",
      state: "Riyadh Province",
      country: "Saudi Arabia",
      postalCode: "12345"
    },
    permanentAddress: {
      street: "Al-Malaz District, Villa 12",
      city: "Riyadh",
      state: "Riyadh Province",
      country: "Saudi Arabia",
      postalCode: "67890"
    },
    addressType: "Current",
    verificationStatus: "Verified"
  },
  emergency: {
    name: "Fatima Hassan Al-Rashid",
    phone: "+966-50-987-6543",
    relationship: "Spouse",
    alternativePhone: "+966-11-345-6789"
  },
  skills: {
    technicalSkills: [
      {
        name: "React.js",
        level: "Advanced",
        certification: "Meta React Certification",
        expiry: "2025-12-31"
      },
      {
        name: "Node.js",
        level: "Intermediate",
        certification: "Node.js Developer Certificate",
        expiry: "2024-06-30"
      },
      {
        name: "MongoDB",
        level: "Advanced",
        certification: "MongoDB Developer",
        expiry: "2025-03-15"
      }
    ],
    softSkills: ["Leadership", "Problem Solving", "Team Collaboration", "Communication"],
    certifications: [
      {
        name: "AWS Solutions Architect",
        issuer: "Amazon Web Services",
        date: "2023-08-15",
        expiry: "2026-08-15"
      },
      {
        name: "Project Management Professional",
        issuer: "PMI",
        date: "2022-11-20",
        expiry: "2025-11-20"
      }
    ]
  },
  languages: [
    {
      language: "Arabic",
      proficiency: "Native",
      certified: true,
      certificationDate: "2010-06-15"
    },
    {
      language: "English",
      proficiency: "Fluent",
      certified: true,
      certificationDate: "2015-03-20"
    },
    {
      language: "French",
      proficiency: "Intermediate",
      certified: false
    }
  ],
  education: [
    {
      degree: "Bachelor of Computer Science",
      institution: "King Saud University",
      field: "Computer Science",
      startDate: "2008-09-01",
      endDate: "2012-06-30",
      gpa: 3.8,
      country: "Saudi Arabia"
    },
    {
      degree: "Master of Software Engineering",
      institution: "University of Manchester",
      field: "Software Engineering",
      startDate: "2013-09-01",
      endDate: "2014-09-30",
      gpa: 3.9,
      country: "United Kingdom"
    }
  ],
  workExperience: [
    {
      company: "Saudi Digital Company",
      position: "Senior Software Developer",
      startDate: "2015-01-15",
      endDate: "2018-06-30",
      description: "Led development of enterprise web applications using React and Node.js",
      country: "Saudi Arabia"
    },
    {
      company: "Tech Solutions Middle East",
      position: "Lead Developer",
      startDate: "2018-07-01",
      endDate: "2022-12-31",
      description: "Managed team of 8 developers, delivered 15+ projects successfully",
      country: "Saudi Arabia"
    }
  ],
  admin: {
    employeeId: "EMP-2023-001",
    department: "Software Development",
    jobTitle: "Senior Software Engineer",
    hireDate: "2023-01-15",
    contractType: "FULL_TIME",
    employmentStatus: "ACTIVE",
    directManager: "Mohammed Al-Zahrani",
    basicSalary: "25,000 SAR",
    bonus: "5,000 SAR",
    workSchedule: "FLEXIBLE",
    workLocation: "HYBRID"
  }
};

// Calculate profile completion percentage
export function calculateProfileCompletion(data: MockupProfileData) {
  const sections = [
    {
      name: "Personal Info",
      required: true,
      fields: Object.keys(data.personal).length,
      completedFields: Object.values(data.personal).filter(v => v && v !== "").length
    },
    {
      name: "Contact Info",
      required: true,
      fields: Object.keys(data.contact).length,
      completedFields: Object.values(data.contact).filter(v => v && v !== "").length
    },
    {
      name: "Address",
      required: true,
      fields: 2, // current + permanent address
      completedFields: (data.address.currentAddress.street ? 1 : 0) + (data.address.permanentAddress.street ? 1 : 0)
    },
    {
      name: "Emergency Contact",
      required: true,
      fields: 3, // name, phone, relationship
      completedFields: [data.emergency.name, data.emergency.phone, data.emergency.relationship].filter(v => v && v !== "").length
    },
    {
      name: "Skills",
      required: false,
      fields: 1, // at least one skill
      completedFields: data.skills.technicalSkills.length > 0 ? 1 : 0
    },
    {
      name: "Languages",
      required: false,
      fields: 1, // at least one language
      completedFields: data.languages.length > 0 ? 1 : 0
    },
    {
      name: "Education",
      required: false,
      fields: 1, // at least one education entry
      completedFields: data.education.length > 0 ? 1 : 0
    },
    {
      name: "Work Experience",
      required: false,
      fields: 1, // at least one work experience
      completedFields: data.workExperience.length > 0 ? 1 : 0
    }
  ];

  const totalFields = sections.reduce((sum, section) => sum + section.fields, 0);
  const completedFields = sections.reduce((sum, section) => sum + section.completedFields, 0);
  const percentage = Math.round((completedFields / totalFields) * 100);

  return {
    percentage,
    sections: sections.map(section => ({
      ...section,
      completed: section.completedFields === section.fields
    })),
    totalFields,
    completedFields
  };
}
