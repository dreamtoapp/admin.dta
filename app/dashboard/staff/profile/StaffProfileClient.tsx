"use client";

import { useState } from "react";
import ProfileCompletionBar from "./ProfileCompletionBar";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import AddressCard from "./AddressCard";
import EmergencyContactCard from "./EmergencyContactCard";
import SkillsCard from "./SkillsCard";
import LanguagesCard from "./LanguagesCard";
import EducationCard from "./EducationCard";
import WorkExperienceCard from "./WorkExperienceCard";
import AdminManagedCard from "./AdminManagedCard";
import { mockupProfileData, calculateProfileCompletion, MockupProfileData } from "./mockupData";

interface StaffProfileClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    department?: string;
  };
}

export default function StaffProfileClient({ user }: StaffProfileClientProps) {
  // Use mockup data for now - will be replaced with real API data later
  const [profileData, setProfileData] = useState<MockupProfileData>(mockupProfileData);

  // Calculate profile completion
  const completion = calculateProfileCompletion(profileData);

  // Mock save functions - will be replaced with real API calls later
  const savePersonal = (data: any) => {
    console.log("Saving personal info:", data);
    setProfileData(prev => ({ ...prev, personal: data }));
    // TODO: Replace with real API call
  };

  const saveContact = (data: any) => {
    console.log("Saving contact info:", data);
    setProfileData(prev => ({ ...prev, contact: data }));
    // TODO: Replace with real API call
  };

  const saveAddress = (data: any) => {
    console.log("Saving address info:", data);
    setProfileData(prev => ({ ...prev, address: data }));
    // TODO: Replace with real API call
  };

  const saveEmergency = (data: any) => {
    console.log("Saving emergency contact:", data);
    setProfileData(prev => ({ ...prev, emergency: data }));
    // TODO: Replace with real API call
  };

  const saveSkills = (data: any) => {
    console.log("Saving skills:", data);
    setProfileData(prev => ({ ...prev, skills: data }));
    // TODO: Replace with real API call
  };

  const saveLanguages = (data: any) => {
    console.log("Saving languages:", data);
    setProfileData(prev => ({ ...prev, languages: data }));
    // TODO: Replace with real API call
  };

  const saveEducation = (data: any) => {
    console.log("Saving education:", data);
    setProfileData(prev => ({ ...prev, education: data }));
    // TODO: Replace with real API call
  };

  const saveWork = (data: any) => {
    console.log("Saving work experience:", data);
    setProfileData(prev => ({ ...prev, workExperience: data }));
    // TODO: Replace with real API call
  };

  return (
    <div className="space-y-6">
      {/* Profile Completion Bar */}
      <ProfileCompletionBar completion={completion} />

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <PersonalInfoCard
          data={profileData.personal}
          onSave={savePersonal}
        />

        {/* Contact Information */}
        <ContactInfoCard
          data={profileData.contact}
          onSave={saveContact}
        />

        {/* Address Information */}
        <AddressCard
          data={profileData.address}
          onSave={saveAddress}
        />

        {/* Emergency Contact */}
        <EmergencyContactCard
          data={profileData.emergency}
          onSave={saveEmergency}
        />

        {/* Skills & Certifications */}
        <SkillsCard
          data={profileData.skills}
          onSave={saveSkills}
        />

        {/* Languages */}
        <LanguagesCard
          data={profileData.languages}
          onSave={saveLanguages}
        />

        {/* Education History */}
        <EducationCard
          data={profileData.education}
          onSave={saveEducation}
        />

        {/* Work Experience */}
        <WorkExperienceCard
          data={profileData.workExperience}
          onSave={saveWork}
        />
      </div>

      {/* Admin Managed Information - Full Width */}
      <AdminManagedCard
        data={profileData.admin}
        readOnly={true}
      />

      {/* Development Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="text-green-800 text-sm">
          <p className="font-medium mb-1">✅ Phase 1 Complete - All Profile Cards Created!</p>
          <p>All 8 profile sections are now displayed with mockup data. Next: Add forms and validation (Phase 2).</p>
        </div>
      </div>
    </div>
  );
}


