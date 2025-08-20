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
import { Languages, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface LanguagesCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const languagesSchema = z.object({
  englishProficiency: z.string().min(1, "English proficiency is required"),
});

type LanguagesFormValues = z.infer<typeof languagesSchema>;

export default function LanguagesCard({ data, onSave }: LanguagesCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<LanguagesFormValues>({
    resolver: zodResolver(languagesSchema),
    defaultValues: {
      englishProficiency: data.englishProficiency || "80",
    },
  });

  const onSubmit = async (values: LanguagesFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const languagesData: Partial<MockupProfileData> = {
        englishProficiency: values.englishProficiency,
      };

      await onSave(languagesData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save languages info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { englishProficiency } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5 text-primary" />
            Edit Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="englishProficiency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Proficiency (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="80"
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
          <Languages className="h-5 w-5 text-primary" />
          Languages
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Languages className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">English (Extra)</label>
              <div className="text-sm font-medium">
                {englishProficiency ? (
                  <Badge variant="secondary" className="text-xs">
                    {englishProficiency}%
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
              Edit Languages
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
