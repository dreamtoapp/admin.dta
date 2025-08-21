"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AddImage from "@/components/AddImage";
import { User, Building2, Calendar, Phone, Mail } from "lucide-react";
import { ProfileData } from "./types";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import EducationCard from "./EducationCard";
import WorkExperienceCard from "./WorkExperienceCard";
import OfficialDocumentsCard from "./OfficialDocumentsCard";
import { UserRole } from "@/constant/enums";
import Swal from 'sweetalert2';

export default function StaffProfileClient() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData>({
    // Initialize with empty structure based on Prisma User schema
    id: session?.user?.id || "",
    name: null,
    email: "",
    emailVerified: null,
    image: null,
    role: UserRole.STAFF,
    department: null,
    isActive: true,
    lastLogin: null,
    createdAt: new Date(),
    updatedAt: new Date(),

    // Personal Information
    fullName: null,
    dateOfBirth: null,
    gender: null,
    maritalStatus: null,
    nationality: null,
    profileImage: null,

    // Contact Information
    mobile: null,
    contactEmail: null,

    // Employment Information (read-only, from backend)
    hireDate: null,
    contractType: null,
    employmentStatus: null,
    noticePeriod: null,
    workSchedule: null,
    workLocation: null,
    directManagerId: null,
    jobTitle: null,
    jobLevel: null,
    basicSalary: null,
    bonus: null,

    // Official Documents
    documentType: null,
    documentImage: null,

    // Education & Skills (SIMPLIFIED)
    educationSummary: null,
    workExperienceSummary: null,

    // Language Skills
    englishProficiency: null,
    certifications: null,
    professionalDevelopment: null,

    // Address (flattened)
    addressStreet: null,
    addressCity: null,
    addressCountry: null,
    latitude: null,
    longitude: null,

    // Emergency Contact (flattened)
    emergencyContactName: null,
    emergencyContactPhone: null,
    emergencyContactRelationship: null,
  });
  const [loading, setLoading] = useState(true);
  const [isEmploymentOpen, setIsEmploymentOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Calculate profile completion percentage
  const calculateProfileCompletion = (data: ProfileData): number => {
    const requiredFields = [
      'fullName', 'mobile', 'contactEmail',
      'addressStreet', 'addressCity', 'addressCountry',
      'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship'
    ];

    const optionalFields = [
      'dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'profileImage',
      'documentType', 'documentImage', 'educationSummary', 'workExperienceSummary',
      'englishProficiency', 'certifications', 'professionalDevelopment'
    ];

    const completedRequired = requiredFields.filter(field => {
      const value = data[field as keyof ProfileData];
      return value && value !== "" && value !== null;
    }).length;

    const completedOptional = optionalFields.filter(field => {
      const value = data[field as keyof ProfileData];
      return value && value !== "" && value !== null;
    }).length;

    // Check if summary fields have content
    const hasEducation = data.educationSummary && data.educationSummary.trim().length > 0;
    const hasWorkExperience = data.workExperienceSummary && data.workExperienceSummary.trim().length > 0;

    const totalRequired = requiredFields.length + 2; // +2 for education and work experience summaries
    const totalOptional = optionalFields.length;

    const completedTotal = completedRequired + (hasEducation ? 1 : 0) + (hasWorkExperience ? 1 : 0) + completedOptional;

    return Math.round((completedTotal / (totalRequired + totalOptional)) * 100);
  };

  // Normalize date-like fields from API payloads into Date objects for UI safety
  const normalizeProfile = (raw: any): ProfileData => {
    const toDate = (v: any) => (v ? new Date(v) : null);
    const normalized: any = { ...raw };
    normalized.createdAt = toDate(normalized.createdAt);
    normalized.updatedAt = toDate(normalized.updatedAt);
    normalized.lastLogin = toDate(normalized.lastLogin);
    normalized.dateOfBirth = toDate(normalized.dateOfBirth);
    normalized.hireDate = toDate(normalized.hireDate);

    if (Array.isArray(normalized.education)) {
      normalized.education = normalized.education.map((e: any) => ({
        ...e,
        startDate: toDate(e.startDate) || new Date(),
        endDate: e.endDate ? new Date(e.endDate) : null,
        createdAt: toDate(e.createdAt) || new Date(),
        updatedAt: toDate(e.updatedAt) || new Date(),
      }));
    }
    if (Array.isArray(normalized.workExperience)) {
      normalized.workExperience = normalized.workExperience.map((w: any) => ({
        ...w,
        startDate: toDate(w.startDate) || new Date(),
        endDate: w.endDate ? new Date(w.endDate) : null,
        createdAt: toDate(w.createdAt) || new Date(),
        updatedAt: toDate(w.updatedAt) || new Date(),
      }));
    }

    return normalized as ProfileData;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (status !== "authenticated" || !session?.user?.id) {
          // Fallback to empty structure while unauthenticated state resolves
          setProfileData({
            id: session?.user?.id || "",
            name: null,
            email: "",
            emailVerified: null,
            image: null,
            role: UserRole.STAFF,
            department: null,
            isActive: true,
            lastLogin: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            fullName: null,
            dateOfBirth: null,
            gender: null,
            maritalStatus: null,
            nationality: null,
            profileImage: null,
            mobile: null,
            contactEmail: null,
            hireDate: null,
            contractType: null,
            employmentStatus: null,
            noticePeriod: null,
            workSchedule: null,
            workLocation: null,
            directManagerId: null,
            jobTitle: null,
            jobLevel: null,
            basicSalary: null,
            bonus: null,
            documentType: null,
            documentImage: null,
            educationSummary: null,
            workExperienceSummary: null,
            englishProficiency: null,
            certifications: null,
            professionalDevelopment: null,
            addressStreet: null,
            addressCity: null,
            addressCountry: null,
            latitude: null,
            longitude: null,
            emergencyContactName: null,
            emergencyContactPhone: null,
            emergencyContactRelationship: null,
          });
          return;
        }
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        console.log("API response data:", data);
        console.log("Normalized profile data:", normalizeProfile(data));
        setProfileData(normalizeProfile(data));
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setError("Failed to load profile data. Please refresh the page.");
        // Keep empty structure if API fails
        console.log("Using empty profile structure");
        setProfileData({
          id: session?.user?.id || "",
          name: null,
          email: "",
          emailVerified: null,
          image: null,
          role: UserRole.STAFF,
          department: null,
          isActive: true,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          fullName: null,
          dateOfBirth: null,
          gender: null,
          maritalStatus: null,
          nationality: null,
          profileImage: null,
          mobile: null,
          contactEmail: null,
          hireDate: null,
          contractType: null,
          employmentStatus: null,
          noticePeriod: null,
          workSchedule: null,
          workLocation: null,
          directManagerId: null,
          jobTitle: null,
          jobLevel: null,
          basicSalary: null,
          bonus: null,
          documentType: null,
          documentImage: null,
          educationSummary: null,
          workExperienceSummary: null,
          englishProficiency: null,
          certifications: null,
          professionalDevelopment: null,
          addressStreet: null,
          addressCity: null,
          addressCountry: null,
          latitude: null,
          longitude: null,
          emergencyContactName: null,
          emergencyContactPhone: null,
          emergencyContactRelationship: null,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [status, session?.user?.id]);

  const handleSaveProfile = async (updatedData: Partial<ProfileData>) => {
    try {
      // Filter to server-supported fields
      const allowedKeys: Array<keyof Partial<ProfileData>> = [
        // Personal
        "fullName", "dateOfBirth", "gender", "maritalStatus", "nationality", "profileImage",
        // Contact
        "mobile", "contactEmail",
        // Address
        "addressStreet", "addressCity", "addressCountry", "latitude", "longitude",
        // Emergency
        "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship",
        // Education & Skills
        "educationSummary", "workExperienceSummary",
        // Official Docs
        "documentType", "documentImage",
        // Admin fields (will be ignored server-side if not admin)
        "hireDate", "contractType", "employmentStatus", "noticePeriod", "workSchedule", "workLocation", "directManagerId", "jobTitle", "jobLevel", "basicSalary", "bonus",
        // Basic
        "name", "email"
      ];

      const payload: Record<string, unknown> = {};
      for (const key of allowedKeys) {
        if (updatedData[key] !== undefined) {
          if (key === "dateOfBirth" || key === "hireDate") {
            payload[key] = updatedData[key] ? new Date(updatedData[key] as any).toISOString() : null;
          } else {
            payload[key] = updatedData[key] as any;
          }
        }
      }

      // If no session or id, just update local state
      if (!session?.user?.id) {
        setProfileData(prev => ({ ...prev, ...updatedData }));
        return;
      }

      const res = await fetch(`/api/users/${session.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const json = await res.json();
      const updated = json.user ?? json;
      setProfileData(prev => normalizeProfile({ ...prev, ...updated }));
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to save profile changes. Please try again.");
      // Optimistic fallback
      setProfileData(prev => ({ ...prev, ...updatedData }));
      throw error;
    }
  };

  const handleProfileChange = (updatedData: Partial<ProfileData>) => {
    setProfileData(prev => ({ ...prev, ...updatedData }));
    // Clear any previous errors when user makes changes
    setError(null);
  };

  const handleSaveAll = async () => {
    try {
      // Persist current in-memory profile data
      await handleSaveProfile(profileData);
    } catch (error) {
      console.error("Failed to save all profile data:", error);
    }
  };

  const handleGlobalSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Send all fields that have been set (including empty/null values)
      const fieldsToUpdate: any = {};

      // Personal Information
      if (profileData.fullName !== undefined) fieldsToUpdate.fullName = profileData.fullName;
      if (profileData.dateOfBirth !== undefined) fieldsToUpdate.dateOfBirth = profileData.dateOfBirth;
      if (profileData.gender !== undefined) fieldsToUpdate.gender = profileData.gender;
      if (profileData.maritalStatus !== undefined) fieldsToUpdate.maritalStatus = profileData.maritalStatus;
      if (profileData.nationality !== undefined) fieldsToUpdate.nationality = profileData.nationality;
      if (profileData.profileImage !== undefined) fieldsToUpdate.profileImage = profileData.profileImage;

      // Contact Information
      if (profileData.mobile !== undefined) fieldsToUpdate.mobile = profileData.mobile;
      if (profileData.contactEmail !== undefined) fieldsToUpdate.contactEmail = profileData.contactEmail;

      // Address Information
      if (profileData.addressStreet !== undefined) fieldsToUpdate.addressStreet = profileData.addressStreet;
      if (profileData.addressCity !== undefined) fieldsToUpdate.addressCity = profileData.addressCity;
      if (profileData.addressCountry !== undefined) fieldsToUpdate.addressCountry = profileData.addressCountry;
      if (profileData.latitude !== undefined) fieldsToUpdate.latitude = profileData.latitude;
      if (profileData.longitude !== undefined) fieldsToUpdate.longitude = profileData.longitude;

      // Emergency Contact
      if (profileData.emergencyContactName !== undefined) fieldsToUpdate.emergencyContactName = profileData.emergencyContactName;
      if (profileData.emergencyContactPhone !== undefined) fieldsToUpdate.emergencyContactPhone = profileData.emergencyContactPhone;
      if (profileData.emergencyContactRelationship !== undefined) fieldsToUpdate.emergencyContactRelationship = profileData.emergencyContactRelationship;

      // Education & Skills
      if (profileData.educationSummary !== undefined) fieldsToUpdate.educationSummary = profileData.educationSummary;
      if (profileData.workExperienceSummary !== undefined) fieldsToUpdate.workExperienceSummary = profileData.workExperienceSummary;
      if (profileData.englishProficiency !== undefined) fieldsToUpdate.englishProficiency = profileData.englishProficiency;
      if (profileData.certifications !== undefined) fieldsToUpdate.certifications = profileData.certifications;
      if (profileData.professionalDevelopment !== undefined) fieldsToUpdate.professionalDevelopment = profileData.professionalDevelopment;

      // Official Documents
      if (profileData.documentType !== undefined) fieldsToUpdate.documentType = profileData.documentType;
      if (profileData.documentImage !== undefined) fieldsToUpdate.documentImage = profileData.documentImage;

      console.log("Current profileData:", profileData);
      console.log("Fields to update:", fieldsToUpdate);
      console.log("User ID being used:", profileData.id);
      console.log("Session user ID:", session?.user?.id);

      // Use session user ID if profileData.id is empty
      const userId = profileData.id || session?.user?.id;
      if (!userId) {
        throw new Error("No user ID available for update");
      }

      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldsToUpdate),
      });

      console.log("API Response status:", response.status);
      console.log("API Response headers:", response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error response:", errorText);
        throw new Error(`Failed to save profile: ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log("Global save successful!", result);

      // Refresh data from backend to ensure consistency
      if (session?.user?.id) {
        console.log("Refreshing data from backend...");
        const refreshResponse = await fetch(`/api/users/${session.user.id}`);
        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json();
          console.log("Refreshed data:", refreshedData);
          setProfileData(normalizeProfile(refreshedData));
        } else {
          console.error("Failed to refresh data:", refreshResponse.status);
        }
      }

      // Show success message with SweetAlert2
      setSuccess("Profile updated successfully!");
      setError(null);

      await Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: 'Your profile has been successfully updated.',
        confirmButtonColor: '#0d3ad7',
        confirmButtonText: 'Great!'
      });

    } catch (error) {
      console.error("Failed to save all profile data globally:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save profile. Please try again.";
      setError(errorMessage);
      setSuccess(null);

      // Show error message with SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'Try Again'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Error and Success Messages */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-medium">{success}</p>
        </div>
      )}

      {/* Profile Header */}
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-6">
            {/* Removed isEditing logic as per Task 1.3 */}
            <div className="flex flex-col items-start">
              <div className="h-24 w-24 ring-4 ring-primary/10 shadow-lg rounded-full overflow-hidden">
                <AddImage
                  url={profileData.profileImage || undefined}
                  alt={profileData.fullName || "Profile"}
                  recordId={profileData.id}
                  table="user"
                  tableField="profileImage"
                  className="h-24 w-24"
                  onUploadComplete={(url) => {
                    setProfileData(prev => ({ ...prev, profileImage: url }));
                  }}
                  folder={"profiles"}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground max-w-[16rem]">
                Please choose a clear, professional photo. This image appears on the Team page.
              </p>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold tracking-tight">{profileData.fullName || "Staff Member"}</h1>
                <Badge variant="outline" className="text-sm px-3 py-1">{profileData.role}</Badge>
              </div>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm">{profileData.department || "No department"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Hired: {profileData.hireDate ? profileData.hireDate.toLocaleDateString() : "Not set"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground mb-1">Profile Completion</div>
              <div className="text-3xl font-bold text-primary mb-3">{calculateProfileCompletion(profileData)}%</div>
              {/* Global Save Button as per Task 3.1 */}
              <Button
                onClick={handleGlobalSave}
                disabled={saving}
                className="shadow-md hover:shadow-lg transition-shadow px-8 py-3"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Employment Information Card */}
      <Card className="border-2 border-destructive/20 shadow-sm bg-card">
        <Collapsible open={isEmploymentOpen} onOpenChange={setIsEmploymentOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger asChild>
              <CardTitle className="flex items-center gap-3 text-xl cursor-pointer hover:opacity-80 transition-opacity">
                <div className="p-2 bg-destructive/20 rounded-lg">
                  <Building2 className="h-6 w-6 text-destructive" />
                </div>
                Employment Information
                <div className="ml-auto">
                  <div className={`w-5 h-5 transition-transform duration-200 ${isEmploymentOpen ? 'rotate-180' : ''}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5"
                    >
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </div>
                </div>
              </CardTitle>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Job Title</label>
                    <div className="text-sm font-semibold">{profileData.jobTitle || "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Job Level</label>
                    <div className="text-sm font-semibold">{profileData.jobLevel || "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Contract Type</label>
                    <div className="text-sm font-semibold">{profileData.contractType || "Not specified"}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Basic Salary</label>
                    <div className="text-sm font-semibold">{profileData.basicSalary || "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Bonus</label>
                    <div className="text-sm font-semibold">{profileData.bonus || "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Work Schedule</label>
                    <div className="text-sm font-semibold">{profileData.workSchedule || "Not specified"}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Work Location</label>
                    <div className="text-sm font-semibold">{profileData.workLocation || "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Notice Period</label>
                    <div className="text-sm font-semibold">{profileData.noticePeriod ? `${profileData.noticePeriod} days` : "Not specified"}</div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border border-border">
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">Employment Status</label>
                    <div className="text-sm font-semibold">{profileData.employmentStatus || "Not specified"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Profile Cards Professional Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Personal Information (2 cols) + Official Documents (1 col) */}
        <div className="col-span-1 lg:col-span-2 space-y-0 h-full">
          <PersonalInfoCard data={profileData} onChange={handleProfileChange} />
        </div>
        <div className="col-span-1 space-y-0 h-full">
          <OfficialDocumentsCard data={profileData} onChange={handleProfileChange} />
        </div>

        {/* Row 2: Contact & Address (full width) */}
        <div className="col-span-1 lg:col-span-3 space-y-0">
          <ContactInfoCard data={profileData} onChange={handleProfileChange} />
        </div>

        {/* Row 3: Education & Experience */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EducationCard data={profileData} onChange={handleProfileChange} />
            <WorkExperienceCard data={profileData} onChange={handleProfileChange} />
          </div>
        </div>
      </div>
    </div>
  );
}


