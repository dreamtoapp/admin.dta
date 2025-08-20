import { z } from "zod";

// Personal Information Schema
export const personalInfoSchema = z.object({
  fullName: z.string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  nationality: z.string()
    .min(2, "Nationality must be at least 2 characters")
    .max(50, "Nationality must be less than 50 characters")
    .optional()
    .or(z.literal("")),
  profileImage: z.string().url("Profile image must be a valid URL").optional().or(z.literal(""))
});

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;

// Emergency Contact Schema
export const emergencyContactSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
  relationship: z.string()
    .min(2, "Relationship must be at least 2 characters")
    .max(50, "Relationship must be less than 50 characters"),
  contactType: z.enum(["PRIMARY", "SECONDARY", "EMERGENCY"]),
  priority: z.number()
    .min(1, "Priority must be at least 1")
    .max(5, "Priority must be at most 5"),
  isActive: z.boolean(),
  notes: z.string()
    .max(200, "Notes must be less than 200 characters")
    .optional()
    .or(z.literal(""))
});

export type EmergencyContactData = z.infer<typeof emergencyContactSchema>;

// Contact Information Schema
export const contactInfoSchema = z.object({
  mobilePrimary: z.string()
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must be less than 15 digits")
    .optional()
    .or(z.literal("")),
  homePhone: z.string()
    .min(10, "Home phone must be at least 10 digits")
    .max(15, "Home phone must be less than 15 digits")
    .optional()
    .or(z.literal("")),
  workExtension: z.string()
    .min(3, "Work extension must be at least 3 digits")
    .max(10, "Work extension must be less than 10 digits")
    .optional()
    .or(z.literal("")),
  alternativeEmail: z.string()
    .email("Alternative email must be a valid email address")
    .optional()
    .or(z.literal(""))
});

export type ContactInfoData = z.infer<typeof contactInfoSchema>;

// Address Schema
export const addressSchema = z.object({
  type: z.enum(["CURRENT", "PERMANENT"]),
  street: z.string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address must be less than 200 characters"),
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),
  state: z.string()
    .min(2, "State/Province must be at least 2 characters")
    .max(100, "State/Province must be less than 100 characters"),
  country: z.string()
    .min(2, "Country must be at least 2 characters")
    .max(100, "Country must be less than 100 characters"),
  postalCode: z.string()
    .min(3, "Postal code must be at least 3 characters")
    .max(20, "Postal code must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  isCurrent: z.boolean(),
  isVerified: z.boolean(),
  notes: z.string()
    .max(200, "Notes must be less than 200 characters")
    .optional()
    .or(z.literal(""))
});

export type AddressData = z.infer<typeof addressSchema>;

// Employment Information Schema
export const employmentInfoSchema = z.object({
  hireDate: z.string().optional().or(z.literal("")),
  contractType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]).optional(),
  employmentStatus: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  noticePeriod: z.number()
    .min(0, "Notice period must be at least 0 days")
    .max(365, "Notice period must be at most 365 days")
    .optional(),
  workSchedule: z.enum(["FLEXIBLE", "FIXED"]).optional(),
  workLocation: z.enum(["OFFICE", "REMOTE", "HYBRID"]).optional(),
  directManagerId: z.string().optional().or(z.literal("")),
  jobTitle: z.string()
    .min(2, "Job title must be at least 2 characters")
    .max(100, "Job title must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  jobLevel: z.string()
    .min(1, "Job level must be at least 1 character")
    .max(50, "Job level must be less than 50 characters")
    .optional()
    .or(z.literal(""))
});

export type EmploymentInfoData = z.infer<typeof employmentInfoSchema>;

// Skill Schema
export const skillSchema = z.object({
  name: z.string()
    .min(2, "Skill name must be at least 2 characters")
    .max(100, "Skill name must be less than 100 characters"),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]),
  certified: z.boolean(),
  expiryDate: z.string().optional().or(z.literal(""))
});

export type SkillData = z.infer<typeof skillSchema>;

// Language Schema
export const languageSchema = z.object({
  language: z.string()
    .min(2, "Language must be at least 2 characters")
    .max(50, "Language must be less than 50 characters"),
  proficiency: z.enum(["BASIC", "INTERMEDIATE", "ADVANCED", "FLUENT"]),
  certified: z.boolean()
});

export type LanguageData = z.infer<typeof languageSchema>;

// Education Schema
export const educationSchema = z.object({
  degree: z.string()
    .min(2, "Degree must be at least 2 characters")
    .max(100, "Degree must be less than 100 characters"),
  institution: z.string()
    .min(2, "Institution must be at least 2 characters")
    .max(200, "Institution must be less than 200 characters"),
  field: z.string()
    .min(2, "Field of study must be at least 2 characters")
    .max(100, "Field of study must be less than 100 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  gpa: z.string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val) return true;
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 4;
    }, "GPA must be between 0 and 4")
});

export type EducationData = z.infer<typeof educationSchema>;

// Work Experience Schema
export const workExperienceSchema = z.object({
  company: z.string()
    .min(2, "Company name must be at least 2 characters")
    .max(200, "Company name must be less than 200 characters"),
  position: z.string()
    .min(2, "Position must be at least 2 characters")
    .max(100, "Position must be less than 100 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  description: z.string()
    .max(1000, "Description must be less than 1000 characters")
    .optional()
    .or(z.literal(""))
});

export type WorkExperienceData = z.infer<typeof workExperienceSchema>;

// Profile Update Schema (for main user API)
export const profileUpdateSchema = z.object({
  // Personal Information
  fullName: personalInfoSchema.shape.fullName.optional(),
  dateOfBirth: personalInfoSchema.shape.dateOfBirth.optional(),
  gender: personalInfoSchema.shape.gender.optional(),
  nationality: personalInfoSchema.shape.nationality.optional(),
  profileImage: personalInfoSchema.shape.profileImage.optional(),

  // Contact Information
  mobilePrimary: contactInfoSchema.shape.mobilePrimary.optional(),
  homePhone: contactInfoSchema.shape.homePhone.optional(),
  workExtension: contactInfoSchema.shape.workExtension.optional(),
  alternativeEmail: contactInfoSchema.shape.alternativeEmail.optional(),

  // Employment Information
  hireDate: employmentInfoSchema.shape.hireDate.optional(),
  contractType: employmentInfoSchema.shape.contractType.optional(),
  employmentStatus: employmentInfoSchema.shape.employmentStatus.optional(),
  noticePeriod: employmentInfoSchema.shape.noticePeriod.optional(),
  workSchedule: employmentInfoSchema.shape.workSchedule.optional(),
  workLocation: employmentInfoSchema.shape.workLocation.optional(),
  directManagerId: employmentInfoSchema.shape.directManagerId.optional(),
  jobTitle: employmentInfoSchema.shape.jobTitle.optional(),
  jobLevel: employmentInfoSchema.shape.jobLevel.optional()
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;

// Validation helper functions
export const validatePersonalInfo = (data: unknown) => {
  return personalInfoSchema.safeParse(data);
};

export const validateEmergencyContact = (data: unknown) => {
  return emergencyContactSchema.safeParse(data);
};

export const validateContactInfo = (data: unknown) => {
  return contactInfoSchema.safeParse(data);
};

export const validateAddress = (data: unknown) => {
  return addressSchema.safeParse(data);
};

export const validateEmploymentInfo = (data: unknown) => {
  return employmentInfoSchema.safeParse(data);
};

export const validateSkill = (data: unknown) => {
  return skillSchema.safeParse(data);
};

export const validateLanguage = (data: unknown) => {
  return languageSchema.safeParse(data);
};

export const validateEducation = (data: unknown) => {
  return educationSchema.safeParse(data);
};

export const validateWorkExperience = (data: unknown) => {
  return workExperienceSchema.safeParse(data);
};

export const validateProfileUpdate = (data: unknown) => {
  return profileUpdateSchema.safeParse(data);
};

