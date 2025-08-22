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
import { FileText, Edit2, Save, X, Eye, Upload, Check, Shield } from "lucide-react";
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

  return (
    <Card className="h-full border border-border bg-card">

      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 space-x-reverse text-base">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <div className="font-semibold text-foreground">المستندات الرسمية</div>
            <div className="text-sm text-muted-foreground font-normal">الوثائق الشخصية والهوية الرسمية</div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form className="space-y-6">

            {/* Document Type Selection */}
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <label className="text-sm font-medium text-foreground">نوع المستند</label>
                  <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                    <FormControl>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="اختر نوع المستند الرسمي" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ID_CARD">بطاقة الهوية الوطنية</SelectItem>
                      <SelectItem value="PASSPORT">جواز السفر</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Upload Section */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">صورة المستند</label>

              <div className="w-full aspect-[4/3] border border-border rounded-lg overflow-hidden bg-muted/50">
                <AddImage
                  url={documentImage || undefined}
                  alt={`صورة ${documentType === 'ID_CARD' ? 'بطاقة الهوية' : documentType === 'PASSPORT' ? 'جواز السفر' : 'المستند'}`}
                  recordId={data.id}
                  table="user"
                  tableField="documentImage"
                  className="w-full h-full object-cover"
                  onUploadComplete={(url) => {
                    onChange({ documentImage: url });
                  }}
                  folder={"documents"}
                />
              </div>

              {/* Status */}
              <div className="text-center">
                {documentImage ? (
                  <div className="inline-flex items-center space-x-2 space-x-reverse text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    <span>تم رفع المستند بنجاح</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center space-x-2 space-x-reverse text-muted-foreground text-sm">
                    <Upload className="w-4 h-4" />
                    <span>لم يتم رفع المستند بعد</span>
                  </div>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-start space-x-3 space-x-reverse">
                <Shield className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-foreground mb-2">أمان البيانات:</h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• جميع المستندات محفوظة بشكل آمن ومشفر</li>
                    <li>• لن يتم مشاركة بياناتك مع أطراف خارجية</li>
                    <li>• يمكن للإدارة فقط الوصول للمستندات الرسمية</li>
                    <li>• تأكد من وضوح الصورة وقابليتها للقراءة</li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
