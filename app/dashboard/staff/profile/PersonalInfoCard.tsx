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
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  mobile: z.string().optional(),
  contactEmail: z.string().email("عنوان البريد الإلكتروني غير صحيح").optional(),
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
        <CardTitle className="text-lg font-semibold text-foreground">المعلومات الشخصية</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الاسم الكامل</label>
                  <FormControl>
                    <Input
                      placeholder="أدخل اسمك الكامل"
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
                    <label className="text-sm font-medium text-muted-foreground">رقم الجوال</label>
                    <FormControl>
                      <Input
                        placeholder="أدخل رقم الجوال"
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
                    <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني للتواصل</label>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="أدخل البريد الإلكتروني للتواصل"
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
                    <label className="text-sm font-medium text-muted-foreground">تاريخ الميلاد</label>
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
                    <label className="text-sm font-medium text-muted-foreground">الجنس</label>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">ذكر</SelectItem>
                        <SelectItem value="FEMALE">أنثى</SelectItem>
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
                    <label className="text-sm font-medium text-muted-foreground">الحالة الاجتماعية</label>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="اختر الحالة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SINGLE">أعزب</SelectItem>
                        <SelectItem value="MARRIED">متزوج</SelectItem>
                        <SelectItem value="DIVORCED">مطلق</SelectItem>
                        <SelectItem value="WIDOWED">أرمل</SelectItem>
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
                  <label className="text-sm font-medium text-muted-foreground">الجنسية</label>
                  <FormControl>
                    <Input
                      placeholder="أدخل الجنسية"
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
