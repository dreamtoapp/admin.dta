"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddImage from "@/components/AddImage";
import { User, Building2, Calendar, MapPin, Phone, Mail, Brain, Languages, GraduationCap, Briefcase, Edit2, Eye } from "lucide-react";
import { MockupProfileData, mockupProfileData, calculateProfileCompletion } from "./mockupData";
import ProfileCompletionBar from "./ProfileCompletionBar";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import AddressCard from "./AddressCard";
import SkillsCard from "./SkillsCard";
import OfficialDocumentsCard from "./OfficialDocumentsCard";

export default function StaffProfileClient() {
  const { data: session, status } = useSession();
  const [profileData, setProfileData] = useState<MockupProfileData>(mockupProfileData);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalData, setOriginalData] = useState<MockupProfileData | null>(null);

  // Normalize date-like fields from API payloads into Date objects for UI safety
  const normalizeProfile = (raw: any): MockupProfileData => {
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
    if (Array.isArray(normalized.languages)) {
      normalized.languages = normalized.languages.map((l: any) => ({
        ...l,
        createdAt: toDate(l.createdAt) || new Date(),
        updatedAt: toDate(l.updatedAt) || new Date(),
      }));
    }

    return normalized as MockupProfileData;
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (status !== "authenticated" || !session?.user?.id) {
          // Fallback to mock while unauthenticated state resolves
          setProfileData(mockupProfileData);
          return;
        }
        const response = await fetch(`/api/users/${session.user.id}`);
        if (!response.ok) throw new Error("Failed to fetch user profile");
        const data = await response.json();
        setProfileData(normalizeProfile(data));
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // Keep mock data if API fails
        setProfileData(mockupProfileData);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [status, session?.user?.id]);

  const handleSaveProfile = async (updatedData: Partial<MockupProfileData>) => {
    try {
      // Filter to server-supported fields
      const allowedKeys: Array<keyof Partial<MockupProfileData>> = [
        // Personal
        "fullName", "dateOfBirth", "gender", "nationality", "profileImage",
        // Contact
        "mobilePrimary", "homePhone", "workExtension", "alternativeEmail",
        // Address
        "addressStreet", "addressCity", "addressCountry",
        // Emergency
        "emergencyContactName", "emergencyContactPhone", "emergencyContactRelationship",
        // Education & Skills
        "educationLevel", "fieldOfStudy", "generalSkills", "generalExperience",
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
      // Optimistic fallback
      setProfileData(prev => ({ ...prev, ...updatedData }));
      throw error;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Persist current in-memory profile data
      await handleSaveProfile(profileData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save all profile data:", error);
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

  const completionPercentage = calculateProfileCompletion(profileData);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <Card className="shadow-sm border border-border bg-card">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-6">
            {isEditing ? (
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
            ) : (
              <div className="flex items-center gap-2">
                <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-lg">
                  <AvatarImage src={profileData.profileImage || undefined} alt={profileData.fullName || "Profile"} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                    {profileData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                {profileData.profileImage && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.open(profileData.profileImage as string, '_blank')}
                    className="h-8 w-8"
                    aria-label="View profile image"
                    title="View"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
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
              <div className="text-3xl font-bold text-primary mb-3">{completionPercentage}%</div>
              {!isEditing ? (
                <Button
                  onClick={() => {
                    setOriginalData(profileData);
                    setIsEditing(true);
                  }}
                  className="shadow-md hover:shadow-lg transition-shadow"
                  size="lg"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (originalData) setProfileData(originalData);
                      setIsEditing(false);
                      setOriginalData(null);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleSaveAll()}
                    disabled={saving}
                    size="sm"
                    className="shadow-md"
                  >
                    {saving ? "Saving..." : "Save All"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Employment Information Card */}
      <Card className="border-2 border-destructive/20 shadow-sm bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-destructive/20 rounded-lg">
              <Building2 className="h-6 w-6 text-destructive" />
            </div>
            Employment Information
          </CardTitle>
        </CardHeader>
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
      </Card>

      {/* Profile Cards Professional Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Row 1: Personal (2 cols) + Official Documents (1 col) */}
        <div className="col-span-1 lg:col-span-2 space-y-0">
          <PersonalInfoCard data={profileData} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>
        <div className="col-span-1 space-y-0">
          <OfficialDocumentsCard data={profileData} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>

        {/* Row 2: Contact (1 col) + Address (2 cols) */}
        <div className="col-span-1 space-y-0">
          <ContactInfoCard data={profileData} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>
        <div className="col-span-1 lg:col-span-2 space-y-0">
          <AddressCard data={profileData} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>

        {/* Row 3: Skills full width */}
        <div className="col-span-1 lg:col-span-3 space-y-0">
          <SkillsCard data={profileData} onSave={handleSaveProfile} isEditing={isEditing} />
        </div>
      </div>
    </div>
  );
}


