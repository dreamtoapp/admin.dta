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

  return (
    <Card className="h-fit border border-border bg-card">

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
          <GraduationCap className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-foreground">التعليم والمؤهلات</div>
            <div className="text-sm text-muted-foreground font-normal">الخلفية التعليمية والشهادات الأكاديمية</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">ملخص التعليم والشهادات</label>
          
          <Textarea
            placeholder="أدخل خلفيتك التعليمية والشهادات...

مثال:
• بكالوريوس في إدارة الأعمال - جامعة الملك سعود (2019)
• دبلوم في التسويق الرقمي - معهد التقنية (2020)
• شهادة PMP - PMI (2021)"
            value={educationSummary}
            onChange={(e) => handleChange(e.target.value)}
            className="min-h-[120px] resize-none"
          />
          
          <div className="text-xs text-muted-foreground text-left">
            {educationSummary.length} حرف
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
