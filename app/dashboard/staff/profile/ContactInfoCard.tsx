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
import { Phone, Mail, Building2, Edit2, Save, X, User } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface ContactInfoCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const contactSchema = z.object({
  mobilePrimary: z.string().min(1, "Primary mobile is required"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoCard({ data, onSave }: ContactInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      mobilePrimary: data.mobilePrimary || "",
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelationship: data.emergencyContactRelationship || "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      // Convert form values to match the data structure
      const contactData: Partial<MockupProfileData> = {
        mobilePrimary: values.mobilePrimary,
        emergencyContactName: values.emergencyContactName || "",
        emergencyContactPhone: values.emergencyContactPhone || "",
        emergencyContactRelationship: values.emergencyContactRelationship || "",
      };

      await onSave(contactData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save contact info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { mobilePrimary } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Edit Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="mobilePrimary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Mobile *</FormLabel>
                    <FormControl>
                      <Input placeholder="+966-50-123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Emergency Contact</h4>

                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Sarah Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emergency Contact Phone *</FormLabel>
                      <FormControl>
                        <Input placeholder="+966-50-987-6543" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <FormControl>
                        <Input placeholder="Spouse, Parent, Sibling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
          <Phone className="h-5 w-5 text-primary" />
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Primary Mobile</label>
              <div className="text-sm font-medium">
                {mobilePrimary ? (
                  <Badge variant="default" className="text-xs">
                    {mobilePrimary}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Emergency Contact</h4>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact Name</label>
                  <div className="text-sm font-medium">
                    {data.emergencyContactName ? (
                      <Badge variant="default" className="text-xs">
                        {data.emergencyContactName}
                      </Badge>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Emergency Contact Phone</label>
                  <div className="text-sm font-medium">
                    {data.emergencyContactPhone ? (
                      <Badge variant="secondary" className="text-xs">
                        {data.emergencyContactPhone}
                      </Badge>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-full">
                  <User className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground">Relationship</label>
                  <div className="text-sm font-medium">
                    {data.emergencyContactRelationship ? (
                      <Badge variant="outline" className="text-xs">
                        {data.emergencyContactRelationship}
                      </Badge>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                </div>
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
              Edit Contact Info
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
