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
import { Phone, User, Edit2, Save, X } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface EmergencyContactCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const emergencySchema = z.object({
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Relationship is required"),
});

type EmergencyFormValues = z.infer<typeof emergencySchema>;

export default function EmergencyContactCard({ data, onSave }: EmergencyContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<EmergencyFormValues>({
    resolver: zodResolver(emergencySchema),
    defaultValues: {
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelationship: data.emergencyContactRelationship || "",
    },
  });

  const onSubmit = async (values: EmergencyFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const emergencyData: Partial<MockupProfileData> = {
        emergencyContactName: values.emergencyContactName,
        emergencyContactPhone: values.emergencyContactPhone,
        emergencyContactRelationship: values.emergencyContactRelationship,
      };

      await onSave(emergencyData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save emergency contact info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { emergencyContactName, emergencyContactPhone, emergencyContactRelationship } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            Edit Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name *</FormLabel>
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
                    <FormLabel>Phone Number *</FormLabel>
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
          Emergency Contact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
              <div className="text-sm font-medium">
                {emergencyContactName ? (
                  <Badge variant="default" className="text-xs">
                    {emergencyContactName}
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
              <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
              <div className="text-sm font-medium">
                {emergencyContactPhone ? (
                  <Badge variant="secondary" className="text-xs">
                    {emergencyContactPhone}
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
                {emergencyContactRelationship ? (
                  <Badge variant="outline" className="text-xs">
                    {emergencyContactRelationship}
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
              Edit Emergency Contact
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
