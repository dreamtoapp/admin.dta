"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, ChevronDown } from "lucide-react";
import { MockupProfileData } from "./mockupData";
import ContactInfoCard from "./ContactInfoCard";

interface ContactDataCollapsibleProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

export default function ContactDataCollapsible({ data, onSave, isEditing }: ContactDataCollapsibleProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
            <CardTitle className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                Contact & Address Information
              </div>
              <div className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pb-4">
            <ContactInfoCard data={data} onSave={onSave} isEditing={isEditing} />
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
