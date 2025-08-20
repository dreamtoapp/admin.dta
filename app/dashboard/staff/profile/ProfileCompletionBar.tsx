"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileSection {
  name: string;
  completed: boolean;
  required: boolean;
  fields: number;
  completedFields: number;
}

interface ProfileCompletionBarProps {
  completion: {
    percentage: number;
    sections: ProfileSection[];
    totalFields: number;
    completedFields: number;
  };
}

export default function ProfileCompletionBar({ completion }: ProfileCompletionBarProps) {
  const { percentage, sections, totalFields, completedFields } = completion;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Profile Completion</span>
          <Badge variant={percentage === 100 ? "default" : "secondary"}>
            {percentage}% Complete
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{completedFields} of {totalFields} fields completed</span>
            <span>{percentage}%</span>
          </div>
          <Progress value={percentage} className="h-3" />
        </div>

        {/* Section Status */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sections.map((section) => (
            <div
              key={section.name}
              className={`p-3 rounded-lg border text-center ${section.completed
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
            >
              <div className="text-sm font-medium">{section.name}</div>
              <div className="text-xs text-muted-foreground">
                {section.completedFields}/{section.fields} fields
              </div>
              {section.required && !section.completed && (
                <Badge variant="destructive" className="mt-1 text-xs">
                  Required
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
