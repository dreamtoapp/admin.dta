"use client";

import { useState } from "react";
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
}

const skillsSchema = z.object({
  generalSkills: z.string().min(1, "Skills are required"),
  generalExperience: z.string().min(1, "Experience description is required"),
  englishProficiency: z.string().min(1, "English proficiency is required"),
  educationLevel: z.string().min(1, "Education level is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
});

type SkillsFormValues = z.infer<typeof skillsSchema>;

export default function SkillsCard({ data, onSave }: SkillsCardProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  const onSubmit = async (values: SkillsFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const skillsData: Partial<MockupProfileData> = {
        generalSkills: values.generalSkills,
        generalExperience: values.generalExperience,
        englishProficiency: values.englishProficiency,
        educationLevel: values.educationLevel,
        fieldOfStudy: values.fieldOfStudy,
      };

      await onSave(skillsData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save skills info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Skills, Experience & Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Skills</label>
              <div className="text-sm font-medium mt-1">
                {generalSkills ? (
                  <div className="bg-secondary/10 p-3 rounded-md">
                    {generalSkills}
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Experience Summary</label>
              <div className="text-sm font-medium mt-1">
                {generalExperience ? (
                  <div className="bg-secondary/10 p-3 rounded-md">
                    {generalExperience}
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">English Proficiency</label>
              <div className="text-sm font-medium mt-1">
                {englishProficiency ? (
                  <div className="bg-secondary/10 p-3 rounded-md">
                    {englishProficiency}
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Education Level</label>
              <div className="text-sm font-medium mt-1">
                {educationLevel ? (
                  <div className="bg-secondary/10 p-3 rounded-md">
                    {educationLevel}
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-secondary/10 rounded-full mt-1">
              <Brain className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Field of Study</label>
              <div className="text-sm font-medium mt-1">
                {fieldOfStudy ? (
                  <div className="bg-secondary/10 p-3 rounded-md">
                    {fieldOfStudy}
                  </div>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>
        </div>

        {onSave && (
          <div className="pt-4 border-t">
            <Button
              onClick={() => setIsEditing(true)}
              className="w-full"
              variant="outline"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Skills, Experience & Education
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
