"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { User, ChevronDown } from "lucide-react";
import { MockupProfileData } from "./mockupData";
import PersonalInfoCard from "./PersonalInfoCard";
import OfficialDocumentsCard from "./OfficialDocumentsCard";

interface PersonalDataCollapsibleProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

export default function PersonalDataCollapsible({ data, onSave, isEditing }: PersonalDataCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Personal Data and Official Documents
              </div>
              <div className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Personal Information - spans 2 columns */}
              <div className="lg:col-span-2">
                <PersonalInfoCard data={data} onSave={onSave} isEditing={isEditing} />
              </div>

              {/* Official Documents - spans 1 column */}
              <div className="lg:col-span-1">
                <OfficialDocumentsCard data={data} onSave={onSave} isEditing={isEditing} />
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
