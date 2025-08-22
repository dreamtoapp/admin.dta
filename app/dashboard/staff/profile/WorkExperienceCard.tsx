"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";
import { ProfileData, ProfileDataUpdate } from "./types";

interface WorkExperienceCardProps {
  data: ProfileData;
  onChange: (data: ProfileDataUpdate) => void;
}

export default function WorkExperienceCard({ data, onChange }: WorkExperienceCardProps) {
  const [workExperienceSummary, setWorkExperienceSummary] = useState(data.workExperienceSummary || "");

  // Memoized onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback((value: string) => {
    setWorkExperienceSummary(value);
    onChange({ workExperienceSummary: value });
  }, [onChange]);

  // Update local state when data changes from parent
  useEffect(() => {
    if (data.workExperienceSummary !== workExperienceSummary) {
      setWorkExperienceSummary(data.workExperienceSummary || "");
    }
  }, [data.workExperienceSummary]);

  // Always render in edit mode
  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          الخبرة العملية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {/* Simple textarea for work experience summary */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">ملخص الخبرة العملية</label>
          <Textarea
            placeholder="أدخل خبرتك العملية..."
            value={workExperienceSummary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
