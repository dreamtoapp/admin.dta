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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Globe, Edit2, Save, X, Camera } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface PersonalInfoCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
}

const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["MALE", "FEMALE"]).optional().or(z.literal("")),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).optional().or(z.literal("")),
  nationality: z.string().min(1, "Nationality is required"),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

export default function PersonalInfoCard({ data, onSave }: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: data.fullName || "",
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().split('T')[0] : "",
      gender: data.gender || "",
      maritalStatus: data.maritalStatus || "",
      nationality: data.nationality || "",
    },
  });

  const onSubmit = async (values: PersonalFormValues) => {
    if (!onSave) return;

    setSaving(true);
    try {
      const personalData: Partial<MockupProfileData> = {
        fullName: values.fullName,
        dateOfBirth: values.dateOfBirth ? new Date(values.dateOfBirth) : null,
        gender: values.gender as "MALE" | "FEMALE" | null || null,
        maritalStatus: values.maritalStatus as "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | null || null,
        nationality: values.nationality,
      };

      await onSave(personalData);
      setIsEditing(false);
      form.reset(values);
    } catch (error) {
      console.error("Failed to save personal info:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    form.reset();
  };

  const { fullName, dateOfBirth, gender, maritalStatus, nationality } = data;

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
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

              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality *</FormLabel>
                    <FormControl>
                      <Input placeholder="Saudi Arabian" {...field} />
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
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <div className="text-sm font-medium">
                {fullName ? (
                  <Badge variant="default" className="text-xs">
                    {fullName}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary/10 rounded-full">
              <Calendar className="h-4 w-4 text-secondary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
              <div className="text-sm font-medium">
                {dateOfBirth ? (
                  <Badge variant="secondary" className="text-xs">
                    {dateOfBirth.toLocaleDateString()}
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
              <label className="text-sm font-medium text-muted-foreground">Gender</label>
              <div className="text-sm font-medium">
                {gender ? (
                  <Badge variant="outline" className="text-xs">
                    {gender}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
              <div className="text-sm font-medium">
                {maritalStatus ? (
                  <Badge variant="default" className="text-xs">
                    {maritalStatus}
                  </Badge>
                ) : (
                  "Not provided"
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <Globe className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground">Nationality</label>
              <div className="text-sm font-medium">
                {nationality ? (
                  <Badge variant="destructive" className="text-xs">
                    {nationality}
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
              Edit Personal Info
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
