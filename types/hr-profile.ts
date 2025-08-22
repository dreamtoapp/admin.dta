// HR Profile TypeScript Interfaces
// Based on Prisma schema for comprehensive type safety

// Enums
export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE"
}

export enum AddressType {
  CURRENT = "CURRENT",
  PERMANENT = "PERMANENT"
}

export enum ContractType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT"
}

export enum EmploymentStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE"
}

export enum WorkSchedule {
  FLEXIBLE = "FLEXIBLE",
  FIXED = "FIXED"
}

export enum WorkLocation {
  OFFICE = "OFFICE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID"
}

export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED"
}

export enum LanguageProficiency {
  BASIC = "BASIC",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  FLUENT = "FLUENT"
}

// Supporting Model Interfaces
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  relationship: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  street: string;
  city: string;
  country: string;
  isCurrent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  id: string;
  userId: string;
  name: string;
  level: SkillLevel;
  certified: boolean;
  expiryDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Language {
  id: string;
  userId: string;
  language: string;
  proficiency: LanguageProficiency;
  certified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Education {
  id: string;
  userId: string;
  degree: string;
  institution: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkExperience {
  id: string;
  userId: string;
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Enhanced User Interface
export interface UserProfile {
  // Existing fields
  id: string;
  name?: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  role: string;
  department?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Personal Information
  fullName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  profileImage?: string;
  maritalStatus?: string;

  // Contact Information
  mobilePrimary?: string;
  homePhone?: string;
  workExtension?: string;
  alternativeEmail?: string;

  // Employment Information
  hireDate?: Date;
  contractType?: ContractType;
  employmentStatus?: EmploymentStatus;
  noticePeriod?: number;
  workSchedule?: WorkSchedule;
  workLocation?: WorkLocation;
  directManagerId?: string;
  jobTitle?: string;
  jobLevel?: string;

  // Relations
  emergencyContacts?: EmergencyContact[];
  addresses?: Address[];
  skills?: Skill[];
  languages?: Language[];
  education?: Education[];
  workExperience?: WorkExperience[];

  // Direct Manager Relations
  directManager?: UserProfile;
  subordinates?: UserProfile[];
}

// API Request/Response Types
export interface UpdateUserProfileRequest {
  // Basic Information (always editable)
  name?: string;
  email?: string;

  // Personal Information
  fullName?: string;
  dateOfBirth?: string; // ISO date string
  gender?: Gender;
  maritalStatus?: string;
  nationality?: string;
  profileImage?: string;

  // Contact Information
  mobile?: string;
  contactEmail?: string;

  // Address Information
  addressCity?: string;
  addressCountry?: string;
  latitude?: number;
  longitude?: number;

  // Emergency Contact Information (flattened)
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;

  // Education & Skills (SIMPLIFIED)
  educationSummary?: string;
  workExperienceSummary?: string;
  englishProficiency?: string;
  certifications?: string;
  professionalDevelopment?: string;

  // Official Documents
  documentType?: string;
  documentImage?: string;

  // Employment Information (Admin only)
  hireDate?: string; // ISO date string
  contractType?: ContractType;
  employmentStatus?: EmploymentStatus;
  noticePeriod?: number;
  workSchedule?: WorkSchedule;
  workLocation?: WorkLocation;
  directManagerId?: string;
  jobTitle?: string;
  jobLevel?: string;
  basicSalary?: string;
  bonus?: string;
}

export interface CreateEmergencyContactRequest {
  name: string;
  phone: string;
  relationship: string;
}

export interface CreateAddressRequest {
  type: AddressType;
  street: string;
  city: string;
  country: string;
  isCurrent?: boolean;
}

export interface CreateSkillRequest {
  name: string;
  level: SkillLevel;
  certified?: boolean;
  expiryDate?: string; // ISO date string
}

export interface CreateLanguageRequest {
  language: string;
  proficiency: LanguageProficiency;
  certified?: boolean;
}

export interface CreateEducationRequest {
  degree: string;
  institution: string;
  field: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  gpa?: number;
}

export interface CreateWorkExperienceRequest {
  company: string;
  position: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
}

// Validation Schemas (for Zod)
export interface UserProfileValidation {
  fullName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  mobilePrimary?: string;
  homePhone?: string;
  workExtension?: string;
  alternativeEmail?: string;
}

// Permission-based types
export interface AdminOnlyFields {
  role: string;
  department?: string;
  employmentStatus?: EmploymentStatus;
  hireDate?: Date;
  contractType?: ContractType;
  noticePeriod?: number;
  workSchedule?: WorkSchedule;
  workLocation?: WorkLocation;
  directManagerId?: string;
  jobTitle?: string;
  jobLevel?: string;
}

export interface StaffEditableFields {
  fullName?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  nationality?: string;
  profileImage?: string;
  mobilePrimary?: string;
  homePhone?: string;
  workExtension?: string;
  alternativeEmail?: string;
}
