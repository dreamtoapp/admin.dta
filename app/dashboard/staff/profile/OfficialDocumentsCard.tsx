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
import { FileText, Edit2, Save, X, Eye } from "lucide-react";
import { MockupProfileData } from "./mockupData";

interface OfficialDocumentsCardProps {
  data: MockupProfileData;
  onSave?: (data: Partial<MockupProfileData>) => void;
  isEditing: boolean;
}

const officialDocumentsSchema = z.object({
  documentType: z.string().optional().or(z.literal("")),
  documentImage: z.string().min(1, "Document image URL is required"),
});

type OfficialDocumentsFormValues = z.infer<typeof officialDocumentsSchema>;

export default function OfficialDocumentsCard({ data, onSave, isEditing }: OfficialDocumentsCardProps) {
  const [saving, setSaving] = useState(false);

  const form = useForm<OfficialDocumentsFormValues>({
    resolver: zodResolver(officialDocumentsSchema),
    defaultValues: {
      documentType: (data.documentType as string) || "",
      documentImage: data.documentImage || "",
    },
  });

  // Auto-save while editing
  useEffect(() => {
    if (!isEditing || !onSave) return;
    const subscription = form.watch((values) => {
      const parsed = officialDocumentsSchema.safeParse(values);
      if (!parsed.success) return;
      const v = parsed.data as OfficialDocumentsFormValues;
      const officialDocumentsData: Partial<MockupProfileData> = {
        documentType: v.documentType || null,
        documentImage: v.documentImage,
      };
      onSave(officialDocumentsData);
    });
    return () => subscription.unsubscribe();
  }, [isEditing, onSave, form]);

  const handleCancel = () => {
    form.reset();
  };

  const { documentType, documentImage } = data;

  if (isEditing) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Edit Official Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="documentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
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

              <FormField
                control={form.control}
                name="documentImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Image URL *</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com/document.jpg" {...field} />
                    </FormControl>
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
            <FileText className="h-5 w-5 text-primary" />
          </div>
          Official Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          {documentImage ? (
            <div className="relative w-full h-full max-h-80 flex items-center justify-center">
              <img
                src={documentImage}
                alt="Document"
                className="max-w-full max-h-full object-contain rounded-lg border border-border shadow-sm"
              />
              {documentType && (
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="text-xs px-3 py-1.5 font-medium shadow-md">
                    {documentType === "ID_CARD" ? "ID Card" : "Passport"}
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center space-y-3 p-8">
              <div className="p-4 bg-muted/30 rounded-full">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <span className="text-muted-foreground italic text-sm">No document uploaded</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
