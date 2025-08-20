"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Building2, Calendar, MapPin, Phone, Mail, Brain, Languages, GraduationCap, Briefcase } from "lucide-react";
import { MockupProfileData, mockupProfileData, calculateProfileCompletion } from "./mockupData";
import ProfileCompletionBar from "./ProfileCompletionBar";
import PersonalInfoCard from "./PersonalInfoCard";
import ContactInfoCard from "./ContactInfoCard";
import AddressCard from "./AddressCard";
import SkillsCard from "./SkillsCard";

export default function StaffProfileClient() {
  const [profileData, setProfileData] = useState<MockupProfileData>(mockupProfileData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProfileData = async () => {
      try {
        // In real implementation, this would be an API call
        // const response = await fetch(`/api/users/${userId}`);
        // const data = await response.json();
        // setProfileData(data);

        // For now, use mockup data
        setProfileData(mockupProfileData);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleSaveProfile = async (updatedData: Partial<MockupProfileData>) => {
    try {
      // In real implementation, this would be an API call
      // await fetch(`/api/users/${userId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedData)
      // });

      // For now, just update local state
      setProfileData(prev => ({ ...prev, ...updatedData }));
      console.log("Profile updated:", updatedData);
    } catch (error) {
      console.error("Failed to update profile:", error);
      throw error;
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
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profileData.profileImage || undefined} alt={profileData.fullName || "Profile"} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {profileData.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold">{profileData.fullName || "Staff Member"}</h1>
                <Badge variant="outline">{profileData.role}</Badge>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  <span>{profileData.department || "No department"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Hired: {profileData.hireDate ? profileData.hireDate.toLocaleDateString() : "Not set"}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Profile Completion</div>
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Completion Bar */}
      <ProfileCompletionBar data={profileData} />

      {/* Employment Information Card */}
      <Card className="border-2 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Employment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                <div className="text-sm font-medium">{profileData.jobTitle || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Job Level</label>
                <div className="text-sm font-medium">{profileData.jobLevel || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contract Type</label>
                <div className="text-sm font-medium">{profileData.contractType || "Not specified"}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Basic Salary</label>
                <div className="text-sm font-medium">{profileData.basicSalary || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Bonus</label>
                <div className="text-sm font-medium">{profileData.bonus || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Work Schedule</label>
                <div className="text-sm font-medium">{profileData.workSchedule || "Not specified"}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Work Location</label>
                <div className="text-sm font-medium">{profileData.workLocation || "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notice Period</label>
                <div className="text-sm font-medium">{profileData.noticePeriod ? `${profileData.noticePeriod} days` : "Not specified"}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Employment Status</label>
                <div className="text-sm font-medium">{profileData.employmentStatus || "Not specified"}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Cards Masonry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-min">
        {/* Personal Information */}
        <div className="md:col-span-1">
          <PersonalInfoCard data={profileData} onSave={handleSaveProfile} />
        </div>

        {/* Contact Information */}
        <div className="md:col-span-1">
          <ContactInfoCard data={profileData} onSave={handleSaveProfile} />
        </div>

        {/* Address Information */}
        <div className="md:col-span-1">
          <AddressCard data={profileData} onSave={handleSaveProfile} />
        </div>

        {/* Skills & Experience */}
        <div className="md:col-span-1">
          <SkillsCard data={profileData} onSave={handleSaveProfile} />
        </div>
      </div>
    </div>
  );
}


