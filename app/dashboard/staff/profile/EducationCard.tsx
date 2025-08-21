"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap } from "lucide-react";
import { ProfileData, ProfileDataUpdate } from "./types";

interface EducationCardProps {
  data: ProfileData;
  onChange: (data: ProfileDataUpdate) => void;
}

export default function EducationCard({ data, onChange }: EducationCardProps) {
  const [educationSummary, setEducationSummary] = useState(data.educationSummary || "");

  // Memoized onChange handler to prevent unnecessary re-renders
  const handleChange = useCallback((value: string) => {
    setEducationSummary(value);
    onChange({ educationSummary: value });
  }, [onChange]);

  // Update local state when data changes from parent
  useEffect(() => {
    if (data.educationSummary !== educationSummary) {
      setEducationSummary(data.educationSummary || "");
    }
  }, [data.educationSummary]);

  // Always render in edit mode
  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          Education & Qualifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        {/* Simple textarea for education summary */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Education Summary</label>
          <Textarea
            placeholder="Enter your education background..."
            value={educationSummary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
      </CardContent>
    </Card>
  );
}
