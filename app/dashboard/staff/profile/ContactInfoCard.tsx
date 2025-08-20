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
import { Phone, Mail, Building2, Edit2, Save, X } from "lucide-react";
import { ContactInfo } from "./mockupData";

interface ContactInfoCardProps {
  data: ContactInfo;
  onSave?: (data: ContactInfo) => void;
}

const contactSchema = z.object({
  mobilePrimary: z.string().min(1, "Primary mobile is required"),
  homePhone: z.string().optional().or(z.literal("")),
  workExtension: z.string().optional().or(z.literal("")),
  alternativeEmail: z.string().email("Must be a valid email").optional().or(z.literal("")),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactInfoCard({ data, onSave }: ContactInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      mobilePrimary: data.mobilePrimary || "",
      homePhone: data.homePhone || "",
      workExtension: data.workExtension || "",
      alternativeEmail: data.alternativeEmail || "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      await onSave(values);
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

  const { mobilePrimary, homePhone, workExtension, alternativeEmail } = data;

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

              <FormField
                control={form.control}
                name="homePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+966-11-234-5678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workExtension"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Extension</FormLabel>
                    <FormControl>
                      <Input placeholder="1234" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="alternativeEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alternative Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="name@example.com" {...field} />
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

          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Building2 className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Home Phone</label>
              <div className="text-sm font-medium">
                {homePhone ? (
                  <Badge variant="secondary" className="text-xs">
                    {homePhone}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-full">
              <Building2 className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Work Extension</label>
              <div className="text-sm font-medium">
                {workExtension ? (
                  <Badge variant="outline" className="text-xs">
                    {workExtension}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <Mail className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Alternative Email</label>
              <div className="text-sm font-medium">
                {alternativeEmail ? (
                  <Badge variant="destructive" className="text-xs">
                    {alternativeEmail}
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
              Edit Contact Info
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
