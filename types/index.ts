// Types Index - Export all HR Profile types
export * from './hr-profile';
export * from './next-auth';

// Re-export commonly used types
export type {
  UserProfile,
  EmergencyContact,
  Address,
  Skill,
  Language,
  Education,
  WorkExperience,
  UpdateUserProfileRequest,
  CreateEmergencyContactRequest,
  CreateAddressRequest,
  CreateSkillRequest,
  CreateLanguageRequest,
  CreateEducationRequest,
  CreateWorkExperienceRequest,
  UserProfileValidation,
  AdminOnlyFields,
  StaffEditableFields
} from './hr-profile';

export type {
  Gender,
  AddressType,
  ContractType,
  EmploymentStatus,
  WorkSchedule,
  WorkLocation,
  SkillLevel,
  LanguageProficiency
} from './hr-profile';

