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

  return (
    <Card className="h-fit border border-border bg-card">

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
          <Briefcase className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-foreground">الخبرة العملية</div>
            <div className="text-sm text-muted-foreground font-normal">السجل المهني والخبرات العملية السابقة</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">ملخص الخبرة العملية</label>
          
          <Textarea
            placeholder="أدخل خبرتك العملية والمناصب السابقة...

مثال:
• مدير تسويق رقمي - شركة التقنية (2020-2023)
• مصمم جرافيك - وكالة الإبداع (2018-2020)
• متدرب تسويق - شركة النمو (2017-2018)"
            value={workExperienceSummary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          
          <div className="text-xs text-muted-foreground text-left">
            {workExperienceSummary.length} حرف
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
