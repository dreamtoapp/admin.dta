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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Globe, Edit2, Save, X, Camera } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface PersonalInfoCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().optional().or(z.literal("")),
  maritalStatus: z.string().optional().or(z.literal("")),
  mobilePrimary: z.string().min(1, "Primary mobile is required"),
  email: z.string().min(1, "Primary email is required").email("Invalid email format"),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalInfoCard({ data, onSave, isEditing }: PersonalInfoCardProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: data.fullName || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().split('T')[0] : "",
      gender: data.gender || "",
      maritalStatus: data.maritalStatus || "",
      mobilePrimary: data.mobilePrimary || "",
      email: data.email || "",
    },
  });

  // Auto-save while editing (no per-card buttons)
  useEffect(() => {
    if (!isEditing || !onSave) return;
    const subscription = form.watch((values) => {
      const parsed = personalSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data;
      const personalData: Partial<MockupProfileData> = {
        fullName: v.fullName,
        dateOfBirth: v.dateOfBirth ? new Date(v.dateOfBirth) : null,
        gender: v.gender || null,
        maritalStatus: v.maritalStatus || null,
        mobilePrimary: v.mobilePrimary,
        email: v.email,
      };
      onSave(personalData);
    });
    return () => subscription.unsubscribe();
  }, [isEditing, onSave, form]);

  const handleCancel = () => {
    form.reset();
  };

  const { fullName, dateOfBirth, gender, maritalStatus, mobilePrimary, email } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem className="md:col-span-3">
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="John Michael Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mobilePrimary"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
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
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-1">
                    <FormLabel>Primary Email *</FormLabel>
                    <FormControl>
                      <Input placeholder="email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maritalStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marital Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select marital status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MARRIED">Married</SelectItem>
                        <SelectItem value="DIVORCED">Divorced</SelectItem>
                        <SelectItem value="WIDOWED">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
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
    <Card className="h-full shadow-sm hover:shadow-md transition-all duration-300 border border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="p-2 bg-primary/10 rounded-lg">
            <User className="h-5 w-5 text-primary" />
          </div>
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pb-4 flex-1">
        <div className="space-y-4 h-full">
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-1">Full Name</label>
              <div className="text-sm font-semibold">
                {fullName ? (
                  <Badge variant="default" className="text-xs px-3 py-1">
                    {fullName}
                  </Badge>
                ) : (
                  <span className="text-muted-foreground italic">Not provided</span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-4 w-4 text-primary" />
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

            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-1">Primary Email</label>
                <div className="text-sm font-semibold">
                  {email ? (
                    <Badge variant="default" className="text-xs px-3 py-1">
                      {email}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-secondary/20 transition-colors">
              <div className="p-2 bg-secondary/10 rounded-full">
                <Calendar className="h-4 w-4 text-secondary" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-1">Date of Birth</label>
                <div className="text-sm font-semibold">
                  {dateOfBirth ? (
                    <Badge variant="secondary" className="text-xs px-3 py-1">
                      {dateOfBirth.toLocaleDateString()}
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
                <label className="text-sm font-medium text-muted-foreground mb-1">Gender</label>
                <div className="text-sm font-semibold">
                  {gender ? (
                    <Badge variant="outline" className="text-xs px-3 py-1">
                      {gender}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/20 transition-colors">
              <div className="p-2 bg-primary/10 rounded-full">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-muted-foreground mb-1">Marital Status</label>
                <div className="text-sm font-semibold">
                  {maritalStatus ? (
                    <Badge variant="default" className="text-xs px-3 py-1">
                      {maritalStatus}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground italic">Not provided</span>
                  )}
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
