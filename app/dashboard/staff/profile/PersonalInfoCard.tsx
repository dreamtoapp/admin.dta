"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Calendar, Users, Heart, Globe, Phone } from "lucide-react";
import { ProfileData, ProfileDataUpdate } from "./types";

const personalSchema = z.object({
  fullName: z.string().min(1, "الاسم الكامل مطلوب"),
  mobile: z.string().optional(),
  contactEmail: z.string().email("عنوان البريد الإلكتروني غير صحيح").optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE"]).nullable().optional(),
  maritalStatus: z.enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]).nullable().optional(),
  nationality: z.string().optional(),
  // Emergency Contact fields
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  // Education and Work Experience fields
  educationSummary: z.string().optional(),
  workExperienceSummary: z.string().optional(),
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
      // Emergency Contact fields
      emergencyContactName: data.emergencyContactName || "",
      emergencyContactPhone: data.emergencyContactPhone || "",
      emergencyContactRelationship: data.emergencyContactRelationship || "",
      // Education and Work Experience fields
      educationSummary: data.educationSummary || "",
      workExperienceSummary: data.workExperienceSummary || "",
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
        // Emergency Contact fields
        emergencyContactName: v.emergencyContactName,
        emergencyContactPhone: v.emergencyContactPhone,
        emergencyContactRelationship: v.emergencyContactRelationship,
        // Education and Work Experience fields
        educationSummary: v.educationSummary,
        workExperienceSummary: v.workExperienceSummary,
      };
      onChange(personalData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  // Clean Business Personal Info Card
  return (
    <Card className="h-full border border-border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
          <User className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-foreground">المعلومات الشخصية</div>
            <div className="text-sm text-muted-foreground font-normal">البيانات الأساسية للموظف</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6">

            {/* Full Name - Primary Field */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-foreground">الاسم الكامل *</label>
                  <FormControl>
                    <Input
                      placeholder="أدخل الاسم الكامل"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Personal Details Grid */}
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
                        className="h-10"
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
                        <SelectTrigger className="h-10">
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
                        <SelectTrigger className="h-10">
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

            {/* Nationality */}
            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">الجنسية</label>
                  <FormControl>
                    <Input
                      placeholder="مثل: سعودي، مصري، أردني"
                      {...field}
                      className="h-10"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Emergency Contact Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">جهة الاتصال في الطوارئ</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="emergencyContactName"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">الاسم</label>
                      <FormControl>
                        <Input
                          placeholder="اسم جهة الاتصال"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactPhone"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">رقم الهاتف</label>
                      <FormControl>
                        <Input
                          placeholder="رقم هاتف جهة الاتصال"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContactRelationship"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">العلاقة</label>
                      <FormControl>
                        <Input
                          placeholder="مثل: زوج، والد، شقيق"
                          {...field}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Education and Work Experience Section */}
            <div className="space-y-4 pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground">التعليم والخبرة العملية</h4>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="educationSummary"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">التعليم والمؤهلات</label>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل خلفيتك التعليمية والشهادات...

مثال:
• بكالوريوس في إدارة الأعمال - جامعة الملك سعود (2019)
• دبلوم في التسويق الرقمي - معهد التقنية (2020)"
                          {...field}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workExperienceSummary"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">الخبرة العملية</label>
                      <FormControl>
                        <Textarea
                          placeholder="أدخل خبرتك العملية والمناصب السابقة...

مثال:
• مدير تسويق رقمي - شركة التقنية (2020-2023)
• مصمم جرافيك - وكالة الإبداع (2018-2020)"
                          {...field}
                          className="min-h-[100px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
