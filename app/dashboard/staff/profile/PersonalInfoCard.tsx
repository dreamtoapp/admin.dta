"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProfileData, ProfileDataUpdate } from "./types";

const personalSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  mobile: z.string().optional(),
  contactEmail: z.string().email("Invalid email address").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).nullable().optional(),
  nationality: z.string().optional(),
});

type PersonalFormValues = z.infer<typeof personalSchema>;

interface PersonalInfoCardProps {
  data: ProfileData;
  onChange: (data: ProfileDataUpdate) => void;
}

export default function PersonalInfoCard({ data, onChange }: PersonalInfoCardProps) {
  // Helper function to safely convert date to string
  const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return "";
      return dateObj.toISOString().split('T')[0];
    } catch {
      return "";
    }
  };

  const form = useForm<PersonalFormValues>({
    resolver: zodResolver(personalSchema),
    defaultValues: {
      fullName: data.fullName || "",
      mobile: data.mobile || "",
      contactEmail: data.contactEmail || "",
      dateOfBirth: formatDateForInput(data.dateOfBirth),
      gender: data.gender || null,
      maritalStatus: data.maritalStatus as "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | null || null,
      nationality: data.nationality || "",
    },
  });

  // Auto-save while editing (no per-card buttons)
  useEffect(() => {
    const subscription = form.watch((values) => {
      const parsed = personalSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data;
      const personalData: ProfileDataUpdate = {
        fullName: v.fullName,
        dateOfBirth: v.dateOfBirth ? new Date(v.dateOfBirth) : null,
        gender: v.gender || null,
        maritalStatus: v.maritalStatus || null,
        nationality: v.nationality || null,
        mobile: v.mobile,
        contactEmail: v.contactEmail,
      };
      onChange(personalData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Always render in edit mode as per Task 2.3
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Personal Information</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <FormControl>
                    <Input
                      placeholder="Enter your full name"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Mobile</label>
                    <FormControl>
                      <Input
                        placeholder="Enter mobile number"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contact Email</label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter contact email"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="h-11"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11">
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
                  <FormItem className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select status" />
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
            </div>

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                  <FormControl>
                    <Input
                      placeholder="Enter nationality"
                      {...field}
                      className="h-11"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
