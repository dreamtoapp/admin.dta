"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Brain, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface SkillsCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const skillsSchema = z.object({
  generalSkills: z.string().min(1, "Skills are required"),
  generalExperience: z.string().min(1, "Experience description is required"),
  englishProficiency: z.string().min(1, "English proficiency is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

export default function SkillsCard({ data, onSave, isEditing }: SkillsCardProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<SkillsFormValues>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      generalSkills: data.generalSkills || "",
      generalExperience: data.generalExperience || "",
      englishProficiency: data.englishProficiency || "",
      educationLevel: data.educationLevel || "",
      fieldOfStudy: data.fieldOfStudy || "",
    },
  });

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !onSave) return;
    const subscription = form.watch((values) => {
      const parsed = skillsSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data;
      const skillsData: Partial<MockupProfileData> = {
        generalSkills: v.generalSkills,
        generalExperience: v.generalExperience,
        englishProficiency: v.englishProficiency,
        educationLevel: v.educationLevel,
        fieldOfStudy: v.fieldOfStudy,
      };
      onSave(skillsData);
    });
    return () => subscription.unsubscribe();
  }, [isEditing, onSave, form]);

  const handleCancel = () => {
    form.reset();
  };

  const { generalSkills, generalExperience, englishProficiency, educationLevel, fieldOfStudy } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Edit Skills, Experience & Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="generalSkills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="HTML, CSS, JavaScript, React, Node.js, Express, MongoDB"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="generalExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Summary *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="5+ years in web development, 3+ years in React ecosystem, 2+ years in Node.js backend development"
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="englishProficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Proficiency *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Beginner, Intermediate, Advanced, Native"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Bachelor's, Master's, Ph.D."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fieldOfStudy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field of Study *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Computer Science, Software Engineering, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Global Save/Cancel handled in header */}
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          Skills, Experience & Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2">Skills</label>
              <div className="text-sm font-semibold">
                {generalSkills ? (
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    {generalSkills}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2">Experience Summary</label>
              <div className="text-sm font-semibold">
                {generalExperience ? (
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    {generalExperience}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2">English Proficiency</label>
              <div className="text-sm font-semibold">
                {englishProficiency ? (
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    {englishProficiency}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2">Education Level</label>
              <div className="text-sm font-semibold">
                {educationLevel ? (
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    {educationLevel}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2">Field of Study</label>
              <div className="text-sm font-semibold">
                {fieldOfStudy ? (
                  <div className="bg-muted/50 p-3 rounded-md border border-border">
                    {fieldOfStudy}
                  </div>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {onSave && (
          <div className="pt-3 border-t border-border">
          </div>
        )}
      </CardContent>
    </Card>
  );
}
