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
  documentImage: z.string().min(1, "Document image URL is required"),
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
          Official Documents
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
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ID_CARD">ID Card</SelectItem>
                      <SelectItem value="PASSPORT">Passport</SelectItem>
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
                    alt={`${documentType || 'Document'} Image`}
                    recordId={data.id}
                    table="user"
                    tableField="documentImage"
                    className="w-full aspect-square"
                    onUploadComplete={(url) => {
                      onChange({ documentImage: url });
                      form.setValue("documentImage", url);
                    }}
                    folder="documents"
                  />
                </div>
                <div className="text-center mt-2">
                  <p className="text-sm text-muted-foreground">
                    Upload a clear image of your {documentType === 'PASSPORT' ? 'passport' : documentType === 'ID_CARD' ? 'ID card' : 'document'}.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, PDF (max 5MB)
                  </p>
                </div>
              </div>
              <FormMessage />
            </div>

            {/* Global Save/Cancel handled in header */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
