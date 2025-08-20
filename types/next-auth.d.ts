import NextAuth, { DefaultSession } from "next-auth";
import { Gender, ContractType, EmploymentStatus, WorkSchedule, WorkLocation } from "./hr-profile";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    department?: string;
    // HR Profile fields
    fullName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    nationality?: string;
    profileImage?: string;
    mobilePrimary?: string;
    homePhone?: string;
    workExtension?: string;
    alternativeEmail?: string;
    hireDate?: Date;
    contractType?: ContractType;
    employmentStatus?: EmploymentStatus;
    noticePeriod?: number;
    workSchedule?: WorkSchedule;
    workLocation?: WorkLocation;
    directManagerId?: string;
    jobTitle?: string;
    jobLevel?: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      department?: string;
      // HR Profile fields
      fullName?: string;
      dateOfBirth?: Date;
      gender?: Gender;
      nationality?: string;
      profileImage?: string;
      mobilePrimary?: string;
      homePhone?: string;
      workExtension?: string;
      alternativeEmail?: string;
      hireDate?: Date;
      contractType?: ContractType;
      employmentStatus?: EmploymentStatus;
      noticePeriod?: number;
      workSchedule?: WorkSchedule;
      workLocation?: WorkLocation;
      directManagerId?: string;
      jobTitle?: string;
      jobLevel?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    department?: string;
    // HR Profile fields
    fullName?: string;
    dateOfBirth?: Date;
    gender?: Gender;
    nationality?: string;
    profileImage?: string;
    mobilePrimary?: string;
    homePhone?: string;
    workExtension?: string;
    alternativeEmail?: string;
    hireDate?: Date;
    contractType?: ContractType;
    employmentStatus?: EmploymentStatus;
    noticePeriod?: number;
    workSchedule?: WorkSchedule;
    workLocation?: WorkLocation;
    directManagerId?: string;
    jobTitle?: string;
    jobLevel?: string;
  }
}
