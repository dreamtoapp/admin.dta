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
import { Phone, Mail, Building2, Edit2, Save, X, User } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface ContactInfoCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const contactSchema = z.object({
  mobilePrimary: z.string().min(1, "Primary mobile is required"),
  emergencyContactName: z.string().min(1, "Emergency contact name is required"),
  emergencyContactPhone: z.string().min(1, "Emergency contact phone is required"),
  emergencyContactRelationship: z.string().min(1, "Emergency contact relationship is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoCard({ data, onSave, isEditing }: ContactInfoCardProps) {
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

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !onSave) return;
    const subscription = form.watch((values) => {
      const parsed = contactSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data;
      const contactData: Partial<MockupProfileData> = {
        mobilePrimary: v.mobilePrimary,
        emergencyContactName: v.emergencyContactName || "",
        emergencyContactPhone: v.emergencyContactPhone || "",
        emergencyContactRelationship: v.emergencyContactRelationship || "",
      };
      onSave(contactData);
    });
    return () => subscription.unsubscribe();
  }, [isEditing, onSave, form]);

  const handleCancel = () => {
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
            <form className="space-y-4">
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
            <Phone className="h-5 w-5 text-primary" />
          </div>
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4">
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-1">Primary Mobile</label>
              <div className="text-sm font-semibold">
                {mobilePrimary ? (
                  <Badge variant="default" className="text-xs px-3 py-1">
                    {mobilePrimary}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-border">
            <h4 className="text-sm font-medium mb-3 text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              Emergency Contact
            </h4>

            <div className="space-y-3">
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
                <div className="p-2 bg-primary/10 rounded-full">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1">Emergency Contact Name</label>
                  <div className="text-sm font-semibold">
                    {data.emergencyContactName ? (
                      <Badge variant="default" className="text-xs px-3 py-1">
                        {data.emergencyContactName}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
                <div className="p-2 bg-secondary/10 rounded-full">
                  <Phone className="h-4 w-4 text-secondary" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1">Emergency Contact Phone</label>
                  <div className="text-sm font-semibold">
                    {data.emergencyContactPhone ? (
                      <Badge variant="secondary" className="text-xs px-3 py-1">
                        {data.emergencyContactPhone}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-accent/20 transition-colors">
                <div className="p-2 bg-accent/10 rounded-full">
                  <User className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-muted-foreground mb-1">Relationship</label>
                  <div className="text-sm font-semibold">
                    {data.emergencyContactRelationship ? (
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        {data.emergencyContactRelationship}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </div>
                </div>
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
