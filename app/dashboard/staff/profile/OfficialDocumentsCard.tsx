"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Edit2, Save, X, Eye } from "lucide-react";
import { ProfileData, ProfileDataUpdate } from "./types";
import AddImage from "@/components/AddImage";

interface OfficialDocumentsCardProps {
  data: ProfileData;
  onChange: (data: ProfileDataUpdate) => void;
}

const officialDocumentsSchema = z.object({
  documentType: z.enum(["ID_CARD", "PASSPORT"]).nullable().optional(),
  documentImage: z.string().min(1, "رابط صورة المستند مطلوب"),
});

type OfficialDocumentsFormValues = z.infer<typeof officialDocumentsSchema>;

export default function OfficialDocumentsCard({ data, onChange }: OfficialDocumentsCardProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<OfficialDocumentsFormValues>({
    resolver: zodResolver(officialDocumentsSchema),
    defaultValues: {
      documentType: data.documentType || null,
      documentImage: data.documentImage || "",
    },
  });

  // Auto-save while editing
  useEffect(() => {
    const subscription = form.watch((values) => {
      const parsed = officialDocumentsSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data as OfficialDocumentsFormValues;
      const officialDocumentsData: ProfileDataUpdate = {
        documentType: v.documentType || null,
        documentImage: v.documentImage,
      };
      onChange(officialDocumentsData);
    });
    return () => subscription.unsubscribe();
  }, [form, onChange]);

  const { documentType, documentImage } = data;

  // Always render in edit mode as per Task 2.3
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          المستندات الرسمية
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form className="space-y-6">
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="اختر نوع المستند" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ID_CARD">بطاقة الهوية</SelectItem>
                      <SelectItem value="PASSPORT">جواز السفر</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Image Upload using AddImage component */}
            <div className="space-y-3">
              <div className="w-full">
                <div className="w-full aspect-square ring-2 ring-border rounded-lg overflow-hidden">
                  <AddImage
                    url={documentImage || undefined}
                    alt={`صورة ${documentType === 'ID_CARD' ? 'بطاقة الهوية' : documentType === 'PASSPORT' ? 'جواز السفر' : 'المستند'}`}
                    recordId={data.id}
                    table="user"
                    tableField="documentImage"
                    className="w-full aspect-square"
                    onUploadComplete={(url) => {
                      onChange({ documentImage: url });
                    }}
                    folder={"documents"}
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  {documentImage ? "تم رفع صورة المستند" : "لم يتم رفع صورة المستند بعد"}
                </p>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
