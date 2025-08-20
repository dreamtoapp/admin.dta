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
import { GraduationCap, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface EducationCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const educationSchema = z.object({
  educationLevel: z.string().min(1, "Education level is required"),
});

type EducationFormValues = z.infer<typeof educationSchema>;

export default function EducationCard({ data, onSave }: EducationCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      educationLevel: data.educationLevel || "",
    },
  });

  const onSubmit = async (values: EducationFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const educationData: Partial<MockupProfileData> = {
        educationLevel: values.educationLevel,
      };

      await onSave(educationData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save education info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { educationLevel } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Edit Education
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="educationLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Education Level *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Bachelor's Degree, Master's, PhD" {...field} />
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
          <GraduationCap className="h-5 w-5 text-primary" />
          Education
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <GraduationCap className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Education Level</label>
              <div className="text-sm font-medium">
                {educationLevel ? (
                  <Badge variant="default" className="text-xs">
                    {educationLevel}
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
              Edit Education
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
