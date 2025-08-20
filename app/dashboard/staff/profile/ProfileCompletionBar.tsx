"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface ProfileCompletionBarProps {
  data: MockupProfileData;
}

export default function ProfileCompletionBar({ data }: ProfileCompletionBarProps) {
  // Calculate completion based on required fields
  const requiredFields = [
    'fullName', 'dateOfBirth', 'nationality', 'mobilePrimary', 'email',
    'addressStreet', 'addressCity', 'addressCountry',
    'emergencyContactName', 'emergencyContactPhone', 'emergencyContactRelationship'
  ];

  const optionalFields = [
    'gender', 'profileImage', 'homePhone', 'workExtension', 'alternativeEmail',
    'generalSkills', 'generalExperience'
  ];

  const completedRequired = requiredFields.filter(field => {
    const value = data[field as keyof MockupProfileData];
    return value && value !== "" && value !== null;
  }).length;

  const completedOptional = optionalFields.filter(field => {
    const value = data[field as keyof MockupProfileData];
    return value && value !== "" && value !== null;
  }).length;

  // Check if relations have at least one entry
  const hasLanguages = data.languages && data.languages.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasWorkExperience = data.workExperience && data.workExperience.length > 0;

  const totalRequired = requiredFields.length + 3; // +3 for relations
  const totalOptional = optionalFields.length;

  const completedTotal = completedRequired + (hasLanguages ? 1 : 0) + (hasEducation ? 1 : 0) + (hasWorkExperience ? 1 : 0) + completedOptional;

  const completionPercentage = Math.round((completedTotal / (totalRequired + totalOptional)) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Completion</span>
            <span className="text-sm font-medium">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
