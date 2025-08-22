"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import AddImage from "@/components/AddImage";
import { User, Building2, Calendar, Phone, Mail, Users, FileText, UserCheck, DollarSign, Gift } from "lucide-react";
import { ProfileData } from "./types";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";

import OfficialDocumentsCard from "./OfficialDocumentsCard";
import { UserRole } from "@/constant/enums";
import Swal from 'sweetalert2';

export default function StaffProfileClient() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<ProfileData>({
    // Basic User fields
    id: "",
    name: null,
    email: "",
    emailVerified: null,
    image: null,
    role: "STAFF" as UserRole,
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
    workSchedule: null,
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
    addressCity: undefined,
    addressCountry: undefined,
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
      'addressCity', 'addressCountry',
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
            ...profileData,
            id: session?.user?.id || "",
            name: session?.user?.name || null,
            email: session?.user?.email || "",
            emailVerified: null,
            image: null,
            role: UserRole.STAFF,
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
            workSchedule: null,
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
            addressCity: undefined,
            addressCountry: undefined,
            latitude: null,
            longitude: null,
            emergencyContactName: null,
            emergencyContactPhone: null,
            emergencyContactRelationship: null,
          });
          return;
        }
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) throw new Error("فشل في تحميل بيانات الملف الشخصي");
        const data = await response.json();
        console.log("API response data:", data);
        console.log("Normalized profile data:", normalizeProfile(data));
        setProfileData(normalizeProfile(data));
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setError("فشل في تحميل بيانات الملف الشخصي. يرجى تحديث الصفحة.");
        // Keep empty structure if API fails
        console.log("Using empty profile structure");
        setProfileData({
          ...profileData,
          id: session?.user?.id || "",
          name: session?.user?.name || null,
          email: session?.user?.email || "",
          emailVerified: null,
          image: null,
          role: UserRole.STAFF,
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
          workSchedule: null,
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
          addressCity: undefined,
          addressCountry: undefined,
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
        // Address
        "addressCity", "addressCountry", "latitude", "longitude",
        // Emergency
        "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship",
        // Education & Skills
        "educationSummary", "workExperienceSummary",
        // Official Docs
        "documentType", "documentImage",
        // Admin fields (will be ignored server-side if not admin)
        "hireDate", "contractType", "workSchedule", "directManagerId", "jobTitle", "jobLevel", "basicSalary", "bonus",
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

      if (!res.ok) throw new Error("فشل في تحديث الملف الشخصي");
      const json = await res.json();
      const updated = json.user ?? json;
      setProfileData(prev => normalizeProfile({ ...prev, ...updated }));
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("فشل في حفظ تغييرات الملف الشخصي. يرجى المحاولة مرة أخرى.");
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

      // Address Information
      if (profileData.addressCity !== undefined) fieldsToUpdate.addressCity = profileData.addressCity;
      if (profileData.addressCountry !== undefined) fieldsToUpdate.addressCountry = profileData.addressCountry;

      // Coordinate handling - only update if user is admin or coordinates don't exist
      const hasExistingCoordinates = profileData.latitude && profileData.longitude;
      const isAdmin = session?.user?.role === 'ADMIN';

      if (profileData.latitude !== undefined) {
        // Only include latitude if user is admin or coordinates don't exist
        if (isAdmin || !hasExistingCoordinates) {
          fieldsToUpdate.latitude = profileData.latitude;
        } else {
          console.log("Skipping latitude update - coordinates are locked for non-admin user");
        }
      }

      if (profileData.longitude !== undefined) {
        // Only include longitude if user is admin or coordinates don't exist
        if (isAdmin || !hasExistingCoordinates) {
          fieldsToUpdate.longitude = profileData.longitude;
        } else {
          console.log("Skipping longitude update - coordinates are locked for non-admin user");
        }
      }

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
        throw new Error(`فشل في حفظ الملف الشخصي: ${response.statusText} - ${errorText}`);
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
      setSuccess("تم تحديث الملف الشخصي بنجاح!");
      setError(null);

      await Swal.fire({
        icon: 'success',
        title: 'تم التحديث!',
        text: 'تم تحديث ملفك الشخصي بنجاح.',
        confirmButtonColor: '#0d3ad7',
        confirmButtonText: 'ممتاز!'
      });

    } catch (error) {
      console.error("Failed to save all profile data globally:", error);
      const errorMessage = error instanceof Error ? error.message : "فشل في حفظ الملف الشخصي. يرجى المحاولة مرة أخرى.";
      setError(errorMessage);
      setSuccess(null);

      // Show error message with SweetAlert2
      await Swal.fire({
        icon: 'error',
        title: 'فشل التحديث',
        text: errorMessage,
        confirmButtonColor: '#dc2626',
        confirmButtonText: 'حاول مرة أخرى'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* Simple Business Loading State */}
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-6">

              {/* Simple Spinner */}
              <div className="w-8 h-8 border-2 border-muted border-t-primary rounded-full animate-spin mx-auto"></div>

              {/* Simple Loading Text */}
              <div>
                <h2 className="text-lg font-medium text-foreground">جاري تحميل البيانات</h2>
                <p className="text-sm text-muted-foreground">يرجى الانتظار...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Clean Business Page Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Simple Business Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            الملف الشخصي
          </h1>
          <p className="text-sm text-muted-foreground">
            إدارة البيانات الشخصية للموظف
          </p>
        </div>

        {/* Clean Error and Success Messages */}
        <div className="space-y-3 mb-6">
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-5 h-5 text-red-600">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-800">خطأ</h4>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-5 h-5 text-green-600">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-800">نجح</h4>
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Container */}
        <div className="space-y-6">{/* Main content will continue here */}

          {/* Clean Business Profile Header */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Card 1: Profile Image & Name - Clean Design */}
            <Card className="border border-border bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4 space-x-reverse">

                  {/* Simple Profile Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border bg-muted">
                    <AddImage
                      url={profileData.profileImage || undefined}
                      alt={profileData.fullName || "الملف الشخصي"}
                      recordId={profileData.id}
                      table="user"
                      tableField="profileImage"
                      className="w-16 h-16 object-cover"
                      onUploadComplete={(url) => {
                        setProfileData(prev => ({ ...prev, profileImage: url }));
                      }}
                      folder="profiles"
                    />

                    {/* Simple Upload Indicator */}
                    {!profileData.profileImage && (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Simple Name & Info */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground">
                      {profileData.fullName || "اسم الموظف"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      موظف نشط
                    </p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Card 2: Progress & Actions - Clean Design */}
            <Card className="border border-border bg-card">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">

                  {/* Simple Progress Display */}
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className="w-12 h-12 rounded-lg border-2 border-primary bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {calculateProfileCompletion(profileData)}%
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground">اكتمال الملف</h3>
                      <p className="text-xs text-muted-foreground">البيانات المطلوبة</p>
                    </div>
                  </div>

                  {/* Simple Save Button */}
                  <Button
                    onClick={handleGlobalSave}
                    disabled={saving}
                    className="px-4 py-2"
                    size="sm"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        حفظ...
                      </>
                    ) : (
                      "حفظ التغييرات"
                    )}
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Clean Employment Information Card */}
          <Card className="border border-border bg-card">
            <Collapsible open={isEmploymentOpen} onOpenChange={setIsEmploymentOpen}>
              <CardHeader className="pb-4">
                <CollapsibleTrigger asChild>
                  <CardTitle className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <Building2 className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-base font-semibold text-foreground">معلومات التوظيف</div>
                        <div className="text-sm text-muted-foreground font-normal">بيانات الوظيفة والعمل</div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 transition-transform duration-200 ${isEmploymentOpen ? 'rotate-180' : ''}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </div>
                  </CardTitle>
                </CollapsibleTrigger>
              </CardHeader>

              <CollapsibleContent>
                <CardContent className="space-y-6 pt-0">

                  {/* Contact Information - Clean Display */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">معلومات التواصل</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">رقم الجوال</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.mobile || "غير محدد"}
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">البريد الإلكتروني</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.contactEmail || "غير محدد"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Employment Details - Clean Layout */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium text-foreground border-b border-border pb-2">تفاصيل الوظيفة</h4>

                    {/* Primary Employment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="w-4 h-4 text-primary" />
                          <label className="text-xs font-medium text-primary">تاريخ التعيين</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.hireDate ? new Date(profileData.hireDate).toLocaleDateString('ar-SA') : "غير محدد"}
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">المسمى الوظيفي</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.jobTitle || "غير محدد"}
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <UserCheck className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">المدير المباشر</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.directManagerId || "غير محدد"}
                        </div>
                      </div>
                    </div>

                    {/* Additional Employment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">نوع العقد</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.contractType || "غير محدد"}
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">جدول العمل</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.workSchedule || "غير محدد"}
                        </div>
                      </div>

                      <div className="p-3 bg-muted/50 rounded-lg border border-border">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <label className="text-xs font-medium text-muted-foreground">الراتب الأساسي</label>
                        </div>
                        <div className="text-sm font-medium text-foreground mt-1">
                          {profileData.basicSalary ? `${profileData.basicSalary} ريال` : "غير محدد"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>

          {/* Clean Profile Forms Grid */}
          <div className="space-y-6">

            {/* Profile Forms - Business Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information - Takes 2 columns */}
              <div className="lg:col-span-2">
                <PersonalInfoCard data={profileData} onChange={handleProfileChange} />
              </div>

              {/* Official Documents - Takes 1 column */}
              <div className="lg:col-span-1">
                <OfficialDocumentsCard data={profileData} onChange={handleProfileChange} />
              </div>
            </div>

            {/* Contact & Address Information */}
            <ContactInfoCard data={profileData} onChange={handleProfileChange} />


          </div>
        </div>
      </div>
    </div>
  );
}


