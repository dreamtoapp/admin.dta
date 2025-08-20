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
import { Briefcase, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface WorkExperienceCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const workExperienceSchema = z.object({
  generalExperience: z.string().min(1, "Work experience is required"),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

export default function WorkExperienceCard({ data, onSave }: WorkExperienceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      generalExperience: data.generalExperience || "",
    },
  });

  const onSubmit = async (values: WorkExperienceFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const workExperienceData: Partial<MockupProfileData> = {
        generalExperience: values.generalExperience,
      };

      await onSave(workExperienceData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save work experience info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { generalExperience } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Edit Work Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="generalExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5+ years in web development, React, Node.js" {...field} />
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
          <Briefcase className="h-5 w-5 text-primary" />
          Work Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Briefcase className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Work Experience</label>
              <div className="text-sm font-medium">
                {generalExperience ? (
                  <Badge variant="default" className="text-xs">
                    {generalExperience}
                  </Badge>
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
              Edit Work Experience
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
