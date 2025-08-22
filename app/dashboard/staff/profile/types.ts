import { UserRole } from "@/constant/enums";

// Types based on Prisma User schema for Staff Profile
export interface ProfileData {
  // Basic User fields
  id: string;
  name: string | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  role: UserRole;
  department: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  fullName: string | null;
  dateOfBirth: Date | null;
  gender: 'MALE' | 'FEMALE' | null;
  maritalStatus: string | null;
  nationality: string | null;
  profileImage: string | null;

  // Contact Information
  mobile: string | null;
  contactEmail: string | null;

  // Employment Information (read-only, from backend)
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

  // Official Documents
  documentType: 'ID_CARD' | 'PASSPORT' | null;
  documentImage: string | null;

  // Education & Skills (SIMPLIFIED)
  educationSummary: string | null;
  workExperienceSummary: string | null;

  // Language Skills
  englishProficiency: string | null;
  certifications: string | null;
  professionalDevelopment: string | null;

  // Address Information
  addressCity?: string;
  addressCountry?: string;
  latitude: number | null;
  longitude: number | null;

  // Emergency Contact (flattened)
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;

  // Relations (SIMPLIFIED)
  // Removed: languages: Language[]; - no longer needed
  // Removed: education: Education[]; - replaced with educationSummary text field
  // Removed: workExperience: WorkExperience[]; - replaced with workExperienceSummary text field
}

// Removed Language interface – no longer needed

// Removed Education and WorkExperience interfaces - replaced with simple text fields

// Form field types for partial updates
export type ProfileDataUpdate = Partial<ProfileData>;
