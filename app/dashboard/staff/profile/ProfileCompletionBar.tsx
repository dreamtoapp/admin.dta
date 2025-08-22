"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import { ProfileData } from "./types";

interface ProfileCompletionBarProps {
  data: ProfileData;
}

export default function ProfileCompletionBar({ data }: ProfileCompletionBarProps) {
  // Calculate completion based on required fields (simplified approach)
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

  const completionPercentage = Math.round((completedTotal / (totalRequired + totalOptional)) * 100);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Target className="h-4 w-4" />
          Profile Completion
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
